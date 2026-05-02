import { fetchGuildRoster } from "../warmane/roster";
import { log } from "../logger";
import { fetchWithTimeout } from "../fetch-util";
import type { SyncConfig } from "../config";

export type RosterJobResult = {
  membersImported: number;
  error?: string;
};

export async function runRosterJob(
  config: SyncConfig
): Promise<RosterJobResult> {
  log.info("ROSTER job: fetching guild roster from Warmane…");

  const members = await fetchGuildRoster();
  if (!members) {
    const error =
      "Failed to fetch roster — Warmane returned HTML challenge or empty response";
    log.warn("ROSTER job:", error);
    return { membersImported: 0, error };
  }

  log.info(`ROSTER job: ${members.length} members fetched`);

  if (config.dryRun) {
    log.info("DRY_RUN: skipping import POST");
    return { membersImported: 0 };
  }

  const res = await fetchWithTimeout(
    `${config.origin}/api/admin/guild-roster/import`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: config.adminSecret,
        guildName: "Pizza Warriors",
        realm: "Lordaeron",
        members,
      }),
    }
  );

  if (!res.ok) {
    const error = `Import failed: HTTP ${res.status}`;
    log.error("ROSTER job:", error);
    return { membersImported: 0, error };
  }
  const data = (await res.json()) as Record<string, unknown>;
  if (!data.ok) {
    const error =
      typeof data.error === "string" ? data.error : "Import rejected";
    log.error("ROSTER job: import failed:", error);
    return { membersImported: 0, error };
  }

  const count =
    typeof data.count === "number" ? data.count : members.length;
  log.info(`ROSTER job: imported ${count} members`);
  return { membersImported: count };
}
