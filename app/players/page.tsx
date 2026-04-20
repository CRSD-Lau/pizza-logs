import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";
import { WOW_CLASSES } from "@/lib/constants/classes";
import { getClassColor } from "@/lib/constants/classes";
import { formatDps } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Players" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ class?: string }>;
}

export default async function PlayersPage({ searchParams }: Props) {
  const { class: classFilter } = await searchParams;

  const players = await db.player.findMany({
    where:   classFilter ? { class: classFilter } : undefined,
    orderBy: { name: "asc" },
    include: {
      realm:  { select: { name: true } },
      _count: { select: { participants: true } },
      milestones: {
        where:   { supersededAt: null },
        orderBy: { value: "desc" },
        take:    3,
        select:  { value: true, metric: true, rank: true, difficulty: true },
      },
    },
  });

  // Derive quick stats per player
  const enriched = players.map(p => {
    const dpsMilestone = p.milestones.find(m => m.metric === "DPS");
    const hpsMilestone = p.milestones.find(m => m.metric === "HPS");
    return {
      ...p,
      bestDps: dpsMilestone?.value ?? null,
      bestHps: hpsMilestone?.value ?? null,
      topRank: p.milestones.length > 0 ? Math.min(...p.milestones.map(m => m.rank)) : null,
    };
  });

  // Sort: milestones holders first, then by encounter count
  enriched.sort((a, b) => {
    if (a.topRank !== null && b.topRank === null) return -1;
    if (a.topRank === null && b.topRank !== null) return 1;
    if (a.topRank !== null && b.topRank !== null) return a.topRank - b.topRank;
    return b._count.participants - a._count.participants;
  });

  const totalCount = await db.player.count();

  return (
    <div className="pt-10 space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-cinzel text-2xl font-bold text-gold-light text-glow-gold">Players</h1>
        <p className="text-text-secondary text-sm mt-1">
          {classFilter
            ? `${players.length} ${classFilter}${players.length !== 1 ? "s" : ""} · ${totalCount} total`
            : `${totalCount} players across all raids`}
        </p>
      </div>

      {/* Class filter */}
      <div className="flex flex-wrap gap-1.5">
        <Link
          href="/players"
          className={cn(
            "px-3 py-1 rounded-sm text-xs font-semibold uppercase tracking-wide border transition-colors",
            !classFilter
              ? "border-gold bg-gold/10 text-gold-light"
              : "border-gold-dim text-text-dim hover:border-gold/40 hover:text-text-secondary"
          )}
        >
          All
        </Link>
        {WOW_CLASSES.map(cls => {
          const color = getClassColor(cls);
          const active = classFilter === cls;
          return (
            <Link
              key={cls}
              href={`/players?class=${encodeURIComponent(cls)}`}
              className={cn(
                "px-3 py-1 rounded-sm text-xs font-semibold uppercase tracking-wide border transition-colors",
                active ? "opacity-100" : "opacity-60 hover:opacity-90"
              )}
              style={{
                color,
                borderColor: active ? color : `${color}44`,
                background:  active ? `${color}18` : "transparent",
              }}
            >
              {cls}
            </Link>
          );
        })}
      </div>

      {/* Player grid */}
      {enriched.length === 0 ? (
        <EmptyState
          title="No players found"
          description={classFilter ? `No ${classFilter}s recorded yet.` : "Upload a combat log to get started."}
          action={<Link href="/" className="text-gold hover:text-gold-light text-sm">Upload a log →</Link>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {enriched.map(p => {
            const color = getClassColor(p.class ?? p.name);
            return (
              <Link
                key={p.id}
                href={`/players/${encodeURIComponent(p.name)}`}
                className="bg-bg-panel border border-gold-dim rounded px-4 py-3 hover:border-gold/50 transition-colors group flex items-center gap-3"
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
                >
                  {p.name.substring(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-semibold truncate group-hover:text-gold-light transition-colors"
                      style={{ color }}
                    >
                      {p.name}
                    </span>
                    {p.topRank === 1 && (
                      <span className="text-[10px] text-gold font-bold shrink-0">👑 #1</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-dim">
                    {p.class && <span>{p.class}</span>}
                    {p.realm && <span>· {p.realm.name}</span>}
                    <span>· {p._count.participants} pulls</span>
                  </div>
                  {/* Best DPS/HPS */}
                  {(p.bestDps !== null || p.bestHps !== null) && (
                    <div className="flex items-center gap-3 mt-1 text-[11px] tabular-nums">
                      {p.bestDps !== null && (
                        <span className="text-text-secondary">
                          <span className="text-text-dim">Best </span>
                          <span className="font-semibold text-text-primary">{formatDps(p.bestDps)}</span>
                          <span className="text-text-dim"> dps</span>
                        </span>
                      )}
                      {p.bestHps !== null && p.bestHps > 200 && (
                        <span className="text-text-secondary">
                          <span className="text-text-dim">Best </span>
                          <span className="font-semibold text-text-primary">{formatDps(p.bestHps)}</span>
                          <span className="text-text-dim"> hps</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
