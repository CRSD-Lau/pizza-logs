import assert from "node:assert/strict";
import { buildWeeklyBossKills } from "../lib/weekly-stats";

const bossKills = buildWeeklyBossKills([
  { boss: { name: "Blood-Queen Lana'thel", slug: "blood-queen-lanathel", raid: "Icecrown Citadel" } },
  { boss: { name: "Blood Prince Council", slug: "blood-prince-council", raid: "Icecrown Citadel" } },
  { boss: { name: "Rotface", slug: "rotface", raid: "Icecrown Citadel" } },
  { boss: { name: "Festergut", slug: "festergut", raid: "Icecrown Citadel" } },
  { boss: { name: "The Lich King", slug: "the-lich-king", raid: "Icecrown Citadel" } },
  { boss: { name: "Sindragosa", slug: "sindragosa", raid: "Icecrown Citadel" } },
  { boss: { name: "Valithria Dreamwalker", slug: "valithria-dreamwalker", raid: "Icecrown Citadel" } },
  { boss: { name: "Professor Putricide", slug: "professor-putricide", raid: "Icecrown Citadel" } },
  { boss: { name: "Deathbringer Saurfang", slug: "deathbringer-saurfang", raid: "Icecrown Citadel" } },
  { boss: { name: "Gunship Battle", slug: "gunship-battle", raid: "Icecrown Citadel" } },
  { boss: { name: "Lord Marrowgar", slug: "lord-marrowgar", raid: "Icecrown Citadel" } },
  { boss: { name: "Blood-Queen Lana'thel", slug: "blood-queen-lanathel", raid: "Icecrown Citadel" } },
  { boss: { name: "Blood Prince Council", slug: "blood-prince-council", raid: "Icecrown Citadel" } },
  { boss: { name: "Rotface", slug: "rotface", raid: "Icecrown Citadel" } },
  { boss: { name: "Festergut", slug: "festergut", raid: "Icecrown Citadel" } },
]);

assert.deepEqual(
  bossKills.map((boss) => boss.name),
  [
    "Lord Marrowgar",
    "Gunship Battle",
    "Deathbringer Saurfang",
    "Festergut",
    "Rotface",
    "Professor Putricide",
    "Blood Prince Council",
    "Blood-Queen Lana'thel",
    "Valithria Dreamwalker",
    "Sindragosa",
    "The Lich King",
  ],
);
assert.equal(bossKills.find((boss) => boss.name === "Blood-Queen Lana'thel")?.kills, 2);
assert.equal(bossKills.find((boss) => boss.name === "Lord Marrowgar")?.kills, 1);

console.log("weekly-stats tests passed");
