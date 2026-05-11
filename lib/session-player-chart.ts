export type SessionPlayerMetric = "DPS" | "HPS";

export type SessionPlayerChartEncounter = {
  outcome: string;
  boss: { name: string };
  participants: Array<{
    dps: number;
    hps: number;
    player: { name: string };
  }>;
};

export type SessionPlayerChartPoint = {
  bossName: string;
  [playerName: string]: number | string | null;
};

export function buildSessionPlayerMetricChart({
  encounters,
  playerNames,
  metric,
}: {
  encounters: SessionPlayerChartEncounter[];
  playerNames: string[];
  metric: SessionPlayerMetric;
}): SessionPlayerChartPoint[] {
  return encounters
    .filter((encounter) => encounter.outcome === "KILL")
    .map((encounter) => {
      const point: SessionPlayerChartPoint = { bossName: encounter.boss.name };
      for (const playerName of playerNames) {
        const participant = encounter.participants.find((part) => part.player.name === playerName);
        point[playerName] = participant ? (metric === "DPS" ? participant.dps : participant.hps) : null;
      }
      return point;
    });
}
