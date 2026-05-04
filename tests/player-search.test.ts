import assert from "node:assert/strict";
import {
  buildPlayerProfilePath,
  getPlayerSearchKeyboardAction,
  sanitizePlayerSearchQuery,
  searchPlayers,
  type PlayerSearchDb,
} from "../lib/player-search";

const playerRows = [
  { id: "p1", name: "Lichkingspet", class: "Death Knight", realm: { name: "Lordaeron" } },
  { id: "p2", name: "Lich", class: "Mage", realm: { name: "Lordaeron" } },
  { id: "p3", name: "Alicha", class: "Paladin", realm: { name: "Lordaeron" } },
  { id: "p4", name: "Maxximusboom", class: "Druid", realm: { name: "Lordaeron" } },
];

const rosterRows = [
  {
    id: "r1",
    characterName: "Lich",
    normalizedCharacterName: "lich",
    realm: "Lordaeron",
    guildName: "PizzaWarriors",
    className: "Mage",
    raceName: "Human",
    level: 80,
  },
  {
    id: "r2",
    characterName: "Lichkingspet",
    normalizedCharacterName: "lichkingspet",
    realm: "Lordaeron",
    guildName: "PizzaWarriors",
    className: "Death Knight",
    raceName: "Human",
    level: 80,
  },
  {
    id: "r3",
    characterName: "Alicha",
    normalizedCharacterName: "alicha",
    realm: "Lordaeron",
    guildName: "PizzaWarriors",
    className: "Paladin",
    raceName: "Draenei",
    level: 80,
  },
];

const calls: string[] = [];

function stringFilterMatches(value: string, filter: unknown): boolean {
  if (!filter || typeof filter !== "object") return true;
  const record = filter as { contains?: string; equals?: string };
  const lower = value.toLowerCase();
  if (typeof record.equals === "string") return lower === record.equals.toLowerCase();
  if (typeof record.contains === "string") return lower.includes(record.contains.toLowerCase());
  return true;
}

function takeRows<T>(rows: T[], take: unknown): T[] {
  return typeof take === "number" ? rows.slice(0, take) : rows;
}

const db: PlayerSearchDb = {
  player: {
    findMany: async (args) => {
      calls.push("players");
      return takeRows(
        playerRows.filter((row) => stringFilterMatches(row.name, args.where?.name)),
        args.take,
      );
    },
  },
  guildRosterMember: {
    findMany: async (args) => {
      calls.push("roster");
      return takeRows(
        rosterRows.filter((row) => stringFilterMatches(row.normalizedCharacterName, args.where?.normalizedCharacterName)),
        args.take,
      );
    },
  },
};

async function main() {
  assert.equal(sanitizePlayerSearchQuery("  Lich   King  "), "Lich King");
  assert.equal(sanitizePlayerSearchQuery(""), "");
  assert.equal(buildPlayerProfilePath("Lich Kingspet"), "/players/Lich%20Kingspet");

  const results = await searchPlayers(db, "lich", { limit: 10 });

  assert.equal(results[0].name, "Lich");
  assert.equal(results[0].source, "logs+roster");
  assert.equal(results[0].className, "Mage");
  assert.equal(results[0].raceName, "Human");
  assert.equal(results[0].level, 80);
  assert.equal(results[0].guildName, "PizzaWarriors");
  assert.equal(results[0].realmName, "Lordaeron");
  assert.equal(results[0].profilePath, "/players/Lich");
  assert.deepEqual(
    results.map((result) => result.name),
    ["Lich", "Lichkingspet", "Alicha"],
  );

  const noResults = await searchPlayers(db, "zzzz", { limit: 10 });
  assert.deepEqual(noResults, []);

  calls.length = 0;
  assert.deepEqual(await searchPlayers(db, "   ", { limit: 10 }), []);
  assert.deepEqual(calls, []);

  assert.deepEqual(
    getPlayerSearchKeyboardAction({ key: "Enter", resultCount: 3, activeIndex: -1 }),
    { type: "navigate", activeIndex: -1, navigateIndex: 0 },
  );
  assert.deepEqual(
    getPlayerSearchKeyboardAction({ key: "Escape", resultCount: 3, activeIndex: 1 }),
    { type: "close", activeIndex: 1 },
  );
  assert.deepEqual(
    getPlayerSearchKeyboardAction({ key: "ArrowDown", resultCount: 3, activeIndex: -1 }),
    { type: "highlight", activeIndex: 0 },
  );
}

main()
  .then(() => console.log("player-search tests passed"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
