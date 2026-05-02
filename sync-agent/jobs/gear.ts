import { fetchCharacterGear } from "../warmane/character";
import { log } from "../logger";
import type { SyncConfig } from "../config";

export type GearJobResult = {
  synced: number;
  failed: number;
  skipped: number;
  error?: string;
};

type QueueEntry = { characterName: string; realm: string };

async function getGearQueue(config: SyncConfig): Promise<QueueEntry[]> {
  try {
    const res = await fetch(`${config.origin}/api/admin/armory-gear/missing`);
    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, unknown>;
    if (!data.ok || !Array.isArray(data.players)) return [];
    return data.players as QueueEntry[];
  } catch {
    return [];
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function runGearJob(
  config: SyncConfig
): Promise<GearJobResult> {
  log.info("GEAR job: fetching queue from Railway…");

  const queue = await getGearQueue(config);
  log.info(`GEAR job: ${queue.length} characters in queue`);

  if (queue.length === 0) return { synced: 0, failed: 0, skipped: 0 };

  if (config.dryRun) {
    log.info("DRY_RUN: skipping all imports");
    return { synced: 0, failed: 0, skipped: queue.length };
  }

  let synced = 0;
  let failed = 0;

  for (const entry of queue) {
    log.info(
      `GEAR job: fetching ${entry.characterName} (${entry.realm})…`
    );

    const gear = await fetchCharacterGear(entry.characterName, entry.realm, {
      enrich: true,
    });
    await sleep(config.requestDelayMs);

    if (!gear) {
      log.warn(`GEAR job: no gear returned for ${entry.characterName}`);
      failed++;
      continue;
    }

    const res = await fetch(
      `${config.origin}/api/admin/armory-gear/import`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: config.adminSecret,
          characterName: gear.characterName,
          realm: gear.realm,
          sourceUrl: gear.sourceUrl,
          items: gear.items,
        }),
      }
    );

    const data = (await res.json()) as Record<string, unknown>;
    if (data.ok) {
      log.info(
        `GEAR job: imported ${gear.characterName} (${gear.items.length} items)`
      );
      synced++;
    } else {
      log.warn(
        `GEAR job: import rejected for ${gear.characterName}: ${data.error}`
      );
      failed++;
    }
  }

  log.info(`GEAR job complete — ${synced} synced, ${failed} failed`);
  return { synced, failed, skipped: 0 };
}
