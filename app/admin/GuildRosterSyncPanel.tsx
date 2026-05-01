import Link from "next/link";

export function GuildRosterSyncPanel({
  rosterCount,
  latestSync,
  action,
}: {
  rosterCount: number;
  latestSync: Date | null;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-bg-panel border border-gold-dim rounded p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-card border border-gold-dim rounded px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-dim">Roster Members</p>
          <p className="mt-1 text-2xl font-bold text-text-primary tabular-nums">{rosterCount.toLocaleString()}</p>
        </div>
        <div className="bg-bg-card border border-gold-dim rounded px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-dim">Last Sync</p>
          <p className="mt-1 text-sm font-semibold text-text-secondary">
            {latestSync ? latestSync.toLocaleString() : "Never"}
          </p>
        </div>
      </div>

      <p className="text-sm text-text-secondary max-w-3xl">
        The sync runs server-side: Pizza Logs asks Warmane for the PizzaWarriors roster JSON first, falls back to the guild summary page if needed, normalizes each member, and upserts the rows into <span className="font-mono text-text-primary">guild_roster_members</span>. The public roster page reads only from our database, so it still loads even when Warmane is down or blocking requests.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        {action}
        <Link href="/guild-roster" className="text-sm text-gold hover:text-gold-light">
          View public roster &rarr;
        </Link>
      </div>
    </div>
  );
}
