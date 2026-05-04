import { sortByICCOrder } from "./constants/bosses";

export type WeeklyBossKillEncounter = {
  boss: {
    name: string;
    slug: string;
    raid: string;
  };
};

export type WeeklyBossKillSummary = {
  name: string;
  slug: string;
  raid: string;
  kills: number;
};

export function buildWeeklyBossKills(
  kills: readonly WeeklyBossKillEncounter[],
): WeeklyBossKillSummary[] {
  const bossKills = kills.reduce<Record<string, WeeklyBossKillSummary>>((acc, encounter) => {
    const key = encounter.boss.slug;

    if (!acc[key]) {
      acc[key] = {
        name: encounter.boss.name,
        slug: encounter.boss.slug,
        raid: encounter.boss.raid,
        kills: 0,
      };
    }

    acc[key].kills++;
    return acc;
  }, {});

  return sortByICCOrder(Object.values(bossKills), boss => boss.name);
}
