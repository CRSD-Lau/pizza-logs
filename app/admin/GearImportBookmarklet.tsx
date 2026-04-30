const PIZZA_LOGS_ORIGIN = "https://pizza-logs-production.up.railway.app";

function buildBookmarklet(): string {
  const script = function pizzaLogsGearImport() {
    const pizzaLogsOrigin = "__PIZZA_LOGS_ORIGIN__";
    const pathMatch = location.pathname.match(/\/character\/([^/]+)\/([^/]+)\/summary/i);
    const characterName = pathMatch ? decodeURIComponent(pathMatch[1]) : prompt("Character name?");
    const realm = pathMatch ? decodeURIComponent(pathMatch[2]) : prompt("Realm?", "Lordaeron");

    if (!characterName || !realm) {
      alert("Pizza Logs: missing character name or realm.");
      return;
    }

    const seen = new Set();
    const items = Array.from(document.querySelectorAll("a[href*='/item/'], a[href*='item='], a[href*='wowhead.com/item']"))
      .map((anchor) => {
        const link = anchor as HTMLAnchorElement;
        const name = (link.textContent || link.getAttribute("title") || link.getAttribute("data-original-title") || "").replace(/\s+/g, " ").trim();
        const href = link.href;
        const image = link.querySelector("img") as HTMLImageElement | null;
        const iconUrl = image?.src || undefined;
        const key = href || name;
        if (!name || seen.has(key)) return null;
        seen.add(key);

        const qualityClass = Array.from(link.classList).find((className) => /q[0-9]|quality/i.test(className));
        return { name, itemUrl: href, iconUrl, quality: qualityClass };
      })
      .filter(Boolean);

    if (items.length === 0) {
      alert("Pizza Logs: no visible gear item links found on this Warmane page.");
      return;
    }

    const storageKey = "pizzaLogsAdminSecret";
    const storedSecret = localStorage.getItem(storageKey) || "";
    const secret = prompt("Pizza Logs admin secret?", storedSecret);
    if (secret === null) return;
    localStorage.setItem(storageKey, secret);

    fetch(`${pizzaLogsOrigin}/api/admin/armory-gear/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        characterName,
        realm,
        sourceUrl: location.href,
        items,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || `HTTP ${response.status}`);
        alert(`Pizza Logs: imported ${data.itemCount} gear items for ${data.characterName}.`);
      })
      .catch((error) => {
        alert(`Pizza Logs import failed: ${error.message}`);
      });
  };

  return `javascript:(${script.toString().replace("__PIZZA_LOGS_ORIGIN__", PIZZA_LOGS_ORIGIN)})()`;
}

export function GearImportBookmarklet() {
  const href = buildBookmarklet();

  return (
    <div className="rounded border border-gold-dim bg-bg-card p-4 space-y-3">
      <div>
        <h3 className="heading-cinzel text-sm text-gold tracking-wide">Browser Gear Import</h3>
        <p className="text-sm text-text-secondary mt-1">
          Drag this bookmarklet to your bookmarks bar, open a Warmane character summary page, then click it to send visible gear into Pizza Logs.
        </p>
      </div>
      <a
        href={href}
        className="inline-flex rounded border border-gold-mid px-4 py-2 text-sm text-gold hover:border-gold hover:text-gold-light transition-colors"
      >
        Pizza Logs Gear Import
      </a>
    </div>
  );
}
