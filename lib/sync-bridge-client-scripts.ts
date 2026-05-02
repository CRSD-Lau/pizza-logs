import { PIZZA_LOGS_ORIGIN } from "./armory-gear-client-scripts";

const SYNC_BRIDGE_USERSCRIPT_PATH = "/api/admin/sync/userscript.user.js";
export const SYNC_BRIDGE_USERSCRIPT_URL = `${PIZZA_LOGS_ORIGIN}${SYNC_BRIDGE_USERSCRIPT_PATH}`;

export function buildSyncBridgeUserscript(): string {
  const header = [
    "// ==UserScript==",
    "// @name         Pizza Logs Sync Bridge",
    "// @namespace    https://pizza-logs-production.up.railway.app",
    "// @version      1.0.0",
    "// @description  Background sync bridge — polls Pizza Logs for sync jobs, fetches Warmane/Wowhead data in-browser.",
    "// @match        *://*/*",
    "// @exclude      *://armory.warmane.com/*",
    "// @noframes",
    "// @grant        GM_xmlhttpRequest",
    "// @run-at       document-idle",
    `// @downloadURL  ${PIZZA_LOGS_ORIGIN}/api/admin/sync/userscript.user.js`,
    `// @updateURL    ${PIZZA_LOGS_ORIGIN}/api/admin/sync/userscript.user.js`,
    "// ==/UserScript==",
    "",
  ].join("\n");

  const body = `(function () {
  'use strict';

  const ORIGIN = '${PIZZA_LOGS_ORIGIN}';
  const SECRET_KEY = 'pizzaLogsAdminSecret';
  const AGENT_ID = 'browser-' + (navigator.userAgent.includes('Windows') ? 'win' : 'other');
  const POLL_INTERVAL_MS = 30_000;
  const WARMANE_GUILD_URL = 'https://armory.warmane.com/api/guild/Pizza+Warriors/Lordaeron/summary';
  const WARMANE_REALM = 'Lordaeron';
  const GUILD_NAME = 'Pizza Warriors';

  // ── Helpers ────────────────────────────────────────────────────────────────

  function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // GM_xmlhttpRequest wrapped as a Promise — used for all cross-origin fetches
  // to Warmane and Wowhead so the browser's real cookies (incl. cf_clearance)
  // are sent, bypassing Cloudflare.
  function gmGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { Accept: 'application/json,text/plain,*/*' },
        timeout: 20_000,
        onload:    r => resolve(r.responseText),
        onerror:   () => reject(new Error('GM_xmlhttpRequest network error: ' + url)),
        ontimeout: () => reject(new Error('GM_xmlhttpRequest timeout: ' + url)),
      });
    });
  }

  // Railway fetch helpers (regular fetch — no Cloudflare issues, Railway is our own server)
  function railwayGet(path, secret) {
    return fetch(ORIGIN + path, {
      headers: { 'x-admin-secret': secret, 'x-agent-id': AGENT_ID },
    }).then(r => r.json());
  }

  function railwayPost(path, body, secret) {
    return fetch(ORIGIN + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': secret,
      },
      body: JSON.stringify(body),
    }).then(r => r.json());
  }

  // ── Wowhead enrichment (copied from gear userscript) ───────────────────────

  const SLOT_MAP = {
    1:'INVTYPE_HEAD', 2:'INVTYPE_NECK', 3:'INVTYPE_SHOULDER', 4:'INVTYPE_BODY',
    5:'INVTYPE_CHEST', 6:'INVTYPE_WAIST', 7:'INVTYPE_LEGS', 8:'INVTYPE_FEET',
    9:'INVTYPE_WRIST', 10:'INVTYPE_HAND', 11:'INVTYPE_FINGER', 12:'INVTYPE_TRINKET',
    13:'INVTYPE_WEAPON', 14:'INVTYPE_SHIELD', 15:'INVTYPE_RANGED', 16:'INVTYPE_CLOAK',
    17:'INVTYPE_2HWEAPON', 20:'INVTYPE_ROBE', 21:'INVTYPE_WEAPONMAINHAND',
    22:'INVTYPE_WEAPONOFFHAND', 23:'INVTYPE_HOLDABLE', 25:'INVTYPE_THROWN',
    26:'INVTYPE_RANGEDRIGHT', 28:'INVTYPE_RELIC',
  };

  async function enrichItemsWithWowhead(equipment) {
    const out = [];
    for (const item of equipment) {
      if (!item || !item.id) { out.push(item); continue; }
      try {
        const text = await gmGet('https://www.wowhead.com/wotlk/tooltip/item/' + item.id);
        const json = JSON.parse(text);
        const jsonequip = (json.jsonequip && typeof json.jsonequip === 'object') ? json.jsonequip : {};
        const slotbak = typeof jsonequip.slotbak === 'number' ? jsonequip.slotbak : undefined;
        const ilMatch = typeof json.tooltip === 'string'
          ? json.tooltip.match(/Item Level\\s*(?:<!--[^-]*-->)?\\s*(\\d+)/i)
          : null;
        out.push({
          ...item,
          itemLevel: ilMatch ? Number(ilMatch[1]) : item.itemLevel,
          equipLoc:  slotbak !== undefined ? SLOT_MAP[slotbak] : item.equipLoc,
          iconUrl:   json.icon ? 'https://wow.zamimg.com/images/wow/icons/large/' + json.icon + '.jpg' : item.iconUrl,
        });
      } catch {
        out.push(item);
      }
      await wait(300);
    }
    return out;
  }

  // ── Warmane fetchers ───────────────────────────────────────────────────────

  async function fetchRosterFromWarmane() {
    const text = await gmGet(WARMANE_GUILD_URL);
    let data;
    try { data = JSON.parse(text); } catch { return null; }
    if (!data || data.error || !Array.isArray(data.roster) || data.roster.length === 0) return null;
    const now = new Date().toISOString();
    return data.roster
      .filter(m => m && typeof m.name === 'string' && m.name.trim())
      .map(m => ({
        characterName: m.name.trim(),
        normalizedCharacterName: m.name.trim().toLowerCase(),
        guildName: GUILD_NAME,
        realm: WARMANE_REALM,
        className:  typeof m.class    === 'string' ? m.class    : undefined,
        raceName:   typeof m.race     === 'string' ? m.race     : undefined,
        level:      typeof m.level    === 'number' ? m.level    : undefined,
        rankName:   typeof m.rankName === 'string' ? m.rankName : undefined,
        rankOrder:  typeof m.rankOrder=== 'number' ? m.rankOrder: undefined,
        armoryUrl:  'https://armory.warmane.com/character/' + encodeURIComponent(m.name.trim()) + '/' + WARMANE_REALM + '/summary',
        lastSyncedAt: now,
      }));
  }

  async function fetchCharacterFromWarmane(characterName, realm) {
    const url = 'https://armory.warmane.com/api/character/' + encodeURIComponent(characterName) + '/' + encodeURIComponent(realm) + '/summary';
    const text = await gmGet(url);
    let data;
    try { data = JSON.parse(text); } catch { return null; }
    if (!data || data.error || typeof data.name !== 'string' || !Array.isArray(data.equipment)) return null;
    return data;
  }

  // ── Job handlers ───────────────────────────────────────────────────────────

  async function runRosterJob(secret) {
    setStatus('Fetching roster from Warmane…');
    const members = await fetchRosterFromWarmane();
    if (!members || members.length === 0) {
      return { ok: false, error: 'Warmane returned empty or blocked roster' };
    }
    setStatus('Importing ' + members.length + ' members…');
    const res = await fetch(ORIGIN + '/api/admin/guild-roster/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, guildName: GUILD_NAME, realm: WARMANE_REALM, members }),
    }).then(r => r.json()).catch(e => ({ ok: false, error: e.message }));
    return res.ok
      ? { ok: true, membersImported: res.count }
      : { ok: false, error: res.error || 'Import failed' };
  }

  async function runGearJob(secret) {
    setStatus('Fetching gear queue…');
    let queue;
    try {
      const qRes = await fetch(ORIGIN + '/api/admin/armory-gear/missing').then(r => r.json());
      queue = qRes.ok && Array.isArray(qRes.players) ? qRes.players : [];
    } catch {
      return { ok: false, error: 'Failed to fetch gear queue' };
    }

    if (queue.length === 0) return { ok: true, synced: 0, failed: 0, skipped: 0 };

    let synced = 0, failed = 0;
    for (const player of queue) {
      setStatus('Syncing ' + player.characterName + ' (' + (synced + failed + 1) + '/' + queue.length + ')…');
      try {
        const warmaneData = await fetchCharacterFromWarmane(player.characterName, player.realm);
        if (!warmaneData) { failed++; continue; }
        if (Array.isArray(warmaneData.equipment) && warmaneData.equipment.length > 0) {
          warmaneData.equipment = await enrichItemsWithWowhead(warmaneData.equipment);
        }
        const res = await fetch(ORIGIN + '/api/admin/armory-gear/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret,
            ...warmaneData,
            characterName: warmaneData.name || player.characterName,
            realm: warmaneData.realm || player.realm,
            sourceUrl: 'https://armory.warmane.com/character/' + encodeURIComponent(player.characterName) + '/' + encodeURIComponent(player.realm) + '/summary',
          }),
        }).then(r => r.json());
        if (res.ok) synced++; else failed++;
      } catch {
        failed++;
      }
      await wait(2000);
    }
    return { ok: true, synced, failed, skipped: 0 };
  }

  // ── Job queue polling ──────────────────────────────────────────────────────

  let isRunning = false;

  async function claimAndRunJob(secret) {
    if (isRunning) return;
    let job;
    try {
      const res = await fetch(ORIGIN + '/api/admin/sync/pending', {
        headers: { 'x-admin-secret': secret, 'x-agent-id': AGENT_ID },
      }).then(r => r.json());
      job = res.ok ? res.job : null;
    } catch { return; }

    if (!job) return;

    isRunning = true;
    setStatus((job.type === 'ROSTER' ? 'Roster' : 'Gear') + ' sync running…');

    let result, error;
    try {
      const out = job.type === 'ROSTER' ? await runRosterJob(secret) : await runGearJob(secret);
      result = out;
      error = out.ok ? undefined : out.error;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }

    try {
      await fetch(ORIGIN + '/api/admin/sync/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ jobId: job.id, success: !error, result, error }),
      });
    } catch {}

    isRunning = false;
    setStatus(error ? 'Last sync failed: ' + error.slice(0, 60) : 'Last sync: ' + new Date().toLocaleTimeString());
  }

  // ── Minimal status badge ───────────────────────────────────────────────────

  let statusEl = null;

  function setStatus(msg) {
    if (statusEl) statusEl.title = msg;
  }

  function buildBadge(secret) {
    if (statusEl) return;
    const el = document.createElement('div');
    el.title = 'Bridge ready';
    el.style.cssText = [
      'position:fixed', 'bottom:8px', 'right:8px', 'z-index:2147483647',
      'width:10px', 'height:10px', 'border-radius:50%',
      'background:#c9a227', 'opacity:0.6', 'cursor:default',
      'pointer-events:none',
    ].join(';');
    document.body.appendChild(el);
    statusEl = el;
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  function init() {
    const secret = localStorage.getItem(SECRET_KEY);
    if (!secret) return; // no secret stored — existing gear userscript will prompt on Warmane pages

    buildBadge(secret);
    claimAndRunJob(secret);
    setInterval(() => claimAndRunJob(secret), POLL_INTERVAL_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
`;

  return header + body;
}
