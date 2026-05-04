import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getWeekBounds } from "@/lib/utils";
import { buildWeeklyBossKills } from "@/lib/weekly-stats";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const realmId = searchParams.get("realmId") ?? undefined;

  const { start, end } = getWeekBounds();

  const [encounters, uploads] = await Promise.all([
    db.encounter.findMany({
      where: {
        startedAt: { gte: start, lt: end },
        ...(realmId ? { upload: { realmId } } : {}),
      },
      include: {
        boss: { select: { name: true, slug: true, raid: true } },
        participants: {
          orderBy: { dps: "desc" },
          take: 1,
          include: { player: { select: { name: true, class: true } } },
        },
      },
      orderBy: { startedAt: "desc" },
    }),
    db.upload.count({
      where: {
        createdAt: { gte: start, lt: end },
        ...(realmId ? { realmId } : {}),
      },
    }),
  ]);

  const kills = encounters.filter(e => e.outcome === "KILL");
  const wipes = encounters.filter(e => e.outcome === "WIPE");

  // Top DPS this week
  const allParticipants = await db.participant.findMany({
    where: {
      encounter: {
        startedAt: { gte: start, lt: end },
        ...(realmId ? { upload: { realmId } } : {}),
      },
      dps: { gt: 0 },
    },
    orderBy: { dps: "desc" },
    take: 10,
    include: {
      player: { select: { name: true, class: true } },
      encounter: {
        select: {
          difficulty: true,
          boss: { select: { name: true, slug: true } },
        },
      },
    },
  });

  const topHps = await db.participant.findMany({
    where: {
      encounter: {
        startedAt: { gte: start, lt: end },
        ...(realmId ? { upload: { realmId } } : {}),
      },
      hps: { gt: 100 },
    },
    orderBy: { hps: "desc" },
    take: 10,
    include: {
      player: { select: { name: true, class: true } },
      encounter: {
        select: {
          difficulty: true,
          boss: { select: { name: true, slug: true } },
        },
      },
    },
  });

  const bossKills = buildWeeklyBossKills(kills);

  return NextResponse.json({
    weekStart:    start.toISOString(),
    weekEnd:      end.toISOString(),
    totalKills:   kills.length,
    totalWipes:   wipes.length,
    totalUploads: uploads,
    topDps:       allParticipants.map(p => ({
      playerName: p.player.name,
      class:      p.player.class,
      bossName:   p.encounter.boss.name,
      bossSlug:   p.encounter.boss.slug,
      difficulty: p.encounter.difficulty,
      dps:        p.dps,
    })),
    topHps: topHps.map(p => ({
      playerName: p.player.name,
      class:      p.player.class,
      bossName:   p.encounter.boss.name,
      bossSlug:   p.encounter.boss.slug,
      difficulty: p.encounter.difficulty,
      hps:        p.hps,
    })),
    bossKills,
  });
}
