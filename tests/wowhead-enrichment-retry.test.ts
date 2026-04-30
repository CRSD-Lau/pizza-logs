import assert from "node:assert/strict";
import { enrichGearWithWowhead, fetchWowheadItemData } from "../lib/wowhead-items";

function itemPage(id: string, name: string, level = 264): string {
  return `
<script>
g_items[${id}].tooltip_enus = "<table><tr><td><b>${name}<\\/b><br>Item Level ${level}<br>Binds when picked up<\\/td><\\/tr><\\/table>";
$.extend(g_items[${id}], {"id":${id},"level":${level},"name":"${name}","quality":4,"slot":1,"jsonequip":{"slotbak":1}});
WH.Gatherer.addData(3, 8, {"${id}":{"name_enus":"${name}","quality":4,"icon":"inv_helmet_154","jsonequip":{"slotbak":1}}});
</script>`;
}

async function run() {
  const originalFetch = global.fetch;

  try {
    let attempts = 0;
    global.fetch = (async () => {
      attempts++;
      if (attempts === 1) {
        return { ok: false, status: 503, text: async () => "" } as Response;
      }

      return { ok: true, status: 200, text: async () => itemPage("50326", "Lightsworn Helmet", 251) } as Response;
    }) as typeof fetch;

    const retried = await fetchWowheadItemData("50326", "Lightsworn Helmet");
    assert.equal(attempts, 2);
    assert.equal(retried?.name, "Lightsworn Helmet");
    assert.equal(retried?.itemLevel, 251);

    let active = 0;
    let maxActive = 0;
    global.fetch = (async (input: RequestInfo | URL) => {
      const id = String(input).match(/item=(\d+)/)?.[1] ?? "0";
      active++;
      maxActive = Math.max(maxActive, active);

      await new Promise(resolve => setTimeout(resolve, 10));
      active--;

      return {
        ok: true,
        status: 200,
        text: async () => itemPage(id, `Item ${id}`),
      } as Response;
    }) as typeof fetch;

    const enriched = await enrichGearWithWowhead(
      Array.from({ length: 8 }, (_, index) => ({
        slot: `Slot ${index + 1}`,
        name: `Item ${50000 + index}`,
        itemId: String(50000 + index),
      }))
    );

    assert.equal(enriched.every(item => Boolean(item.iconUrl && item.itemLevel && item.equipLoc)), true);
    assert.equal(maxActive <= 3, true);
  } finally {
    global.fetch = originalFetch;
  }
}

run().then(() => {
  console.log("wowhead-enrichment-retry tests passed");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
