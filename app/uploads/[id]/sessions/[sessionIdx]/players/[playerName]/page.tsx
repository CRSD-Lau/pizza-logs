import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SessionLineChart } from "@/components/charts/SessionLineChart";
import type { ChartPoint, PlayerLine } from "@/components/charts/SessionLineChart";
import { formatDps, formatDuration, cn } from "@/lib/utils";
import { getClassColor } from "@/lib/constants/classes";

interface Props {
  params: Promise<{ id: string; sessionIdx: string; playerName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { playerName, sessionIdx } = await params;
  const name = decodeURIComponent(playerName);
  return { title: `${name} — Session ${Number(sessionIdx) + 1}` };
}

export default async function SessionPlayerPage({ params }: Props) {
  const { id, sessionIdx, playerName } = await params;
  const sessionIndex = parseInt(sessionIdx, 10);
  const name = decodeURIComponent(playerName);

  if (isNaN(sessionIndex)) notFound();

  const upload = await db.upload.findUnique({
    where:  { id },
    select: { id: true, filename: true, realm: { select: { name: true } }, guild: { select: { name: true } } },
  });
  if (!upload) notFound();

  // All encounters in this session with full participant data
  const encounters = await db.encounter.findMany({
    where:   { uploadId: id, sessionIndex },
    orderBy: { startedAt: "asc" },
    include: {
      boss: { select: { name: true, slug: true, raid: true } },
      participants: {
        include: { player: { select: { id: true, name: true, class: true } } },
      },
    },
  });

  if (encounters.length === 0) notFound();

  // Verify player was in this session
  const firstParticipation = encounters
    .flatMap(e => e.participants)
    .find(p => p.player.name === name);
  if (!firstParticipation) notFound();

  const playerClass = firstParticipation.player.class ?? null;
  const classColor  = getClassColor(playerClass ?? name);

  // Per-encounter stats for this player (only pulls they joined)
  const myStats = encounters
    .map(enc => {
      const p = enc.participants.find(p => p.player.name === name);
      if (!p) return null;
      return {
        encounterId:   enc.id,
        bossName:      enc.boss.name,
        bossSlug:      enc.boss.slug,
        outcome:       enc.outcome,
        difficulty:    enc.difficulty,
        duration:      enc.durationSeconds,
        dps:           p.dps,
        hps:           p.hps,
        totalDamage:   p.totalDamage,
        totalHealing:  p.totalHealing,
        deaths:        p.deaths,
        critPct:       p.critPct,
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  if (myStats.length === 0) notFound();

  // Session-level summary
  const kills       = myStats.filter(e => e.outcome === "KILL");
  const bestDps     = Math.max(0, ...myStats.map(e => e.dps));
  const bestHps     = Math.max(0, ...myStats.map(e => e.hps));
  const totalDeaths = myStats.reduce((a, e) => a + e.deaths, 0);

  // Determine primary metric (healer if HPS significantly exceeds DPS)
  const isHealer = bestHps > bestDps * 0.7 && bestHps > 200;
  const metric: "DPS" | "HPS" = isHealer ? "HPS" : "DPS";

  const avgKillMetric = kills.length > 0
    ? kills.reduce((a, e) => a + (metric === "DPS" ? e.dps : e.hps), 0) / kills.length
    : 0;
  const bestMetric = metric === "DPS" ? bestDps : bestHps;

  // Same-class players in this session for comparison
  const classmateNames = new Set<string>();
  for (const enc of encounters) {
    for (const p of enc.participants) {
      if (p.player.name !== name && p.player.class === playerClass && playerClass !== null) {
        classmateNames.add(p.player.name);
      }
    }
  }

  // Build line chart data — all encounters (including ones player missed = null)
  const allPlayers = [name, ...Array.from(classmateNames)];

  const chartData: ChartPoint[] = encounters.map(enc => {
    const point: ChartPoint = { bossName: enc.boss.name };
    for (const pName of allPlayers) {
      const p = enc.participants.find(p => p.player.name === pName);
      point[pName] = p ? (metric === "DPS" ? p.dps : p.hps) : null;
    }
    return point;
  });

  // Gold for subject, class color (dimmed via opacity in component) for classmates
  const chartPlayers: PlayerLine[] = allPlayers.map(pName => ({
    name:      pName,
    isSubject: pName === name,
    color:     pName === name ? "#c8a84b" : classColor,
  }));

  // Session count (for breadcrumb context)
  const sessionCount = await db.encounter.groupBy({
    by:    ["sessionIndex"],
    where: { uploadId: id },
  }).then(r => r.length);

  const sessionLabel = sessionCount === 1
    ? "Raid Session"
    : `Session ${sessionIndex + 1} of ${sessionCount}`;

  const sessionDate = new Date(encounters[0].startedAt).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="pt-10 space-y-8">

      {/* Breadcrumb */}
      <div className="text-xs text-text-dim flex items-center gap-1 flex-wrap">
        <Link href="/raids" className="hover:text-gold">Raids</Link>
        <span>›</span>
        <Link href={`/uploads/${id}/sessions/${sessionIndex}`} className="hover:text-gold">
          {sessionLabel}
        </Link>
        <span>›</span>
        <span className="text-text-secondary">{name}</span>
      </div>

      {/* Player header */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-sm flex items-center justify-center text-lg font-bold"
          style={{ background: `${classColor}22`, color: classColor, border: `1px solid ${classColor}44` }}
        >
          {name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="heading-cinzel text-2xl font-bold" style={{ color: classColor }}>
            {name}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-sm">
            {playerClass && <span className="text-text-secondary">{playerClass}</span>}
            <span className="text-text-dim">·</span>
            <span className="text-text-dim">{sessionDate}</span>
          </div>
        </div>
      </div>

      {/* Session stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Pulls"            value={myStats.length} />
        <StatCard label="Kills"            value={kills.length} highlight />
        <StatCard label={`Best ${metric}`} value={formatDps(bestMetric)} sub="single pull" />
        <StatCard label={`Avg ${metric}`}  value={formatDps(avgKillMetric)} sub="on kills" />
      </div>

      {/* DPS/HPS Line Chart */}
      {chartData.length > 1 && (
        <section>
          <SectionHeader
            title={`${metric} by Encounter`}
            sub={
              classmateNames.size > 0
                ? `Comparing ${name} vs ${[...classmateNames].join(", ")} (${playerClass})`
                : `${name} — ${metric} across this session`
            }
          />
          <div className="bg-bg-panel border border-gold-dim rounded p-4">
            <SessionLineChart
              data={chartData}
              players={chartPlayers}
              metric={metric}
            />
          </div>
        </section>
      )}

      {/* Per-encounter table */}
      <section>
        <SectionHeader
          title="Encounter Breakdown"
          sub={`${myStats.length} pull${myStats.length !== 1 ? "s" : ""} this session`}
        />
        <div className="bg-bg-panel border border-gold-dim rounded divide-y divide-gold-dim overflow-hidden">
          {myStats.map(e => (
            <Link
              key={e.encounterId}
              href={`/encounters/${e.encounterId}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-bg-hover transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-[11px] font-bold px-1.5 py-0.5 rounded",
                  e.outcome === "KILL"
                    ? "text-success bg-success/10"
                    : e.outcome === "WIPE"
                      ? "text-danger bg-danger/10"
                      : "text-text-dim bg-bg-hover"
                )}>
                  {e.outcome}
                </span>
                <span className="text-sm font-semibold text-text-primary group-hover:text-gold transition-colors">
                  {e.bossName}
                </span>
                <span className={cn("diff-badge", e.difficulty.endsWith("H") ? "heroic" : "normal")}>
                  {e.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-5 text-xs tabular-nums text-text-secondary">
                {e.dps > 0 && (
                  <span>
                    {formatDps(e.dps)}
                    <span className="text-text-dim ml-0.5">dps</span>
                  </span>
                )}
                {e.hps > 100 && (
                  <span>
                    {formatDps(e.hps)}
                    <span className="text-text-dim ml-0.5">hps</span>
                  </span>
                )}
                {e.critPct > 0 && (
                  <span>
                    {e.critPct.toFixed(1)}%
                    <span className="text-text-dim ml-0.5">crit</span>
                  </span>
                )}
                {e.deaths > 0 && (
                  <span className="text-danger">☠{e.deaths}</span>
                )}
                <span className="text-text-dim">{formatDuration(e.duration)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {totalDeaths > 0 && (
        <p className="text-xs text-text-dim">
          Total deaths this session: <span className="text-danger font-bold">☠{totalDeaths}</span>
        </p>
      )}

      {/* Link to all-time profile */}
      <div className="pt-2 border-t border-gold-dim">
        <Link
          href={`/players/${encodeURIComponent(name)}`}
          className="text-xs text-gold hover:text-gold-light transition-colors"
        >
          View {name}&apos;s all-time profile →
        </Link>
      </div>
    </div>
  );
}
