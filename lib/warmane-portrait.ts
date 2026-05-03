const DEFAULT_REALM = "Lordaeron";

const CLASS_ICON_SLUGS: Record<string, string> = {
  "deathknight": "classicon_deathknight",
  "death knight": "classicon_deathknight",
  druid: "classicon_druid",
  hunter: "classicon_hunter",
  mage: "classicon_mage",
  paladin: "classicon_paladin",
  priest: "classicon_priest",
  rogue: "classicon_rogue",
  shaman: "classicon_shaman",
  warlock: "classicon_warlock",
  warrior: "classicon_warrior",
};

const PORTRAIT_HINT_PATTERN = /(avatar|character|model|portrait|profile|render|thumbnail)/i;
const NON_PORTRAIT_URL_PATTERN = /(?:\/icons\/|\/item(?:[/?=]|$)|cavernoftime|achievement_|ability_|classicon_|inv_|spell_|trade_)/i;
const ALLOWED_IMAGE_HOST_PATTERN = /(?:^|\.)warmane\.com$|(?:^|\.)zamimg\.com$|(?:^|\.)wowhead\.com$/i;

type Candidate = {
  url: string;
  hint: string;
  priority: number;
};

export function buildWarmaneCharacterProfileUrl(characterName: string, realm: string = DEFAULT_REALM): string {
  return `https://armory.warmane.com/character/${encodeURIComponent(characterName)}/${encodeURIComponent(realm || DEFAULT_REALM)}/summary`;
}

export function getClassIconUrl(className: string | null | undefined): string | null {
  const key = className?.trim().toLowerCase();
  if (!key) return null;

  const slug = CLASS_ICON_SLUGS[key.replace(/\s+/g, " ")] ?? CLASS_ICON_SLUGS[key.replace(/\s+/g, "")];
  return slug ? `https://wow.zamimg.com/images/wow/icons/large/${slug}.jpg` : null;
}

export function extractWarmanePortraitUrl(html: string, baseUrl: string): string | null {
  const candidates: Candidate[] = [];

  for (const tag of html.matchAll(/<meta\b[^>]*>/gi)) {
    const raw = tag[0];
    const name = getAttribute(raw, "property") ?? getAttribute(raw, "name") ?? getAttribute(raw, "itemprop") ?? "";
    if (!/^(og:image|twitter:image|image)$/i.test(name)) continue;
    const url = normalizePortraitUrl(getAttribute(raw, "content"), baseUrl);
    if (url) candidates.push({ url, hint: raw, priority: 30 });
  }

  for (const tag of html.matchAll(/<img\b[^>]*>/gi)) {
    const raw = tag[0];
    const hint = [
      getAttribute(raw, "class"),
      getAttribute(raw, "id"),
      getAttribute(raw, "alt"),
      getAttribute(raw, "title"),
      getAttribute(raw, "src"),
      getAttribute(raw, "data-src"),
      getAttribute(raw, "data-original"),
    ].filter(Boolean).join(" ");

    if (!PORTRAIT_HINT_PATTERN.test(hint)) continue;

    const url = normalizePortraitUrl(
      getAttribute(raw, "src") ?? getAttribute(raw, "data-src") ?? getAttribute(raw, "data-original"),
      baseUrl,
    );
    if (url) candidates.push({ url, hint, priority: 10 });
  }

  for (const tag of html.matchAll(/<[^>]+\bstyle=["'][^"']*background(?:-image)?\s*:[^"']*url\(([^)]+)\)[^"']*["'][^>]*>/gi)) {
    const raw = tag[0];
    const hint = [
      getAttribute(raw, "class"),
      getAttribute(raw, "id"),
      raw,
    ].filter(Boolean).join(" ");

    if (!PORTRAIT_HINT_PATTERN.test(hint)) continue;

    const url = normalizePortraitUrl(cleanCssUrl(tag[1]), baseUrl);
    if (url) candidates.push({ url, hint, priority: 20 });
  }

  for (const match of html.matchAll(/["'](?:avatar|character|model|portrait|profile|render)(?:Url|Image|Src)?["']\s*:\s*["']([^"']+)["']/gi)) {
    const url = normalizePortraitUrl(match[1], baseUrl);
    if (url) candidates.push({ url, hint: match[0], priority: 40 });
  }

  candidates.sort((a, b) => a.priority - b.priority);
  return candidates[0]?.url ?? null;
}

function getAttribute(tag: string, name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(new RegExp(`${escaped}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? decodeHtmlAttribute(match[1]) : null;
}

function cleanCssUrl(value: string): string {
  return decodeHtmlAttribute(value.trim().replace(/^["']|["']$/g, ""));
}

function normalizePortraitUrl(value: string | null | undefined, baseUrl: string): string | null {
  if (!value) return null;

  const cleaned = decodeHtmlAttribute(value).trim();
  if (!cleaned || cleaned.startsWith("data:")) return null;

  try {
    const parsed = new URL(cleaned.startsWith("//") ? `https:${cleaned}` : cleaned, baseUrl);
    if (!/^https?:$/.test(parsed.protocol)) return null;
    if (!ALLOWED_IMAGE_HOST_PATTERN.test(parsed.hostname)) return null;
    if (NON_PORTRAIT_URL_PATTERN.test(parsed.pathname)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function decodeHtmlAttribute(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
