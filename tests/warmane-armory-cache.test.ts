import assert from "node:assert/strict";
import { resolveArmoryGearResult } from "../lib/warmane-armory";
import type { ArmoryCharacterGear, ArmoryGearResult } from "../lib/warmane-armory";

const cachedGear: ArmoryCharacterGear = {
  characterName: "Aalaska",
  realm: "Lordaeron",
  sourceUrl: "https://armory.warmane.com/character/Aalaska/Lordaeron/summary",
  fetchedAt: "2026-04-30T12:00:00.000Z",
  items: [{ slot: "Head", name: "Cached Hat" }],
};

const liveFailure: ArmoryGearResult = {
  ok: false,
  sourceUrl: cachedGear.sourceUrl,
  message: "Gear data is temporarily unavailable from Warmane Armory.",
};

assert.deepEqual(
  resolveArmoryGearResult({ cachedGear, liveResult: liveFailure }),
  { ok: true, gear: cachedGear, stale: true },
);

const liveGear: ArmoryCharacterGear = {
  ...cachedGear,
  fetchedAt: "2026-04-30T13:00:00.000Z",
  items: [{ slot: "Head", name: "Fresh Hat" }],
};

assert.deepEqual(
  resolveArmoryGearResult({ cachedGear, liveResult: { ok: true, gear: liveGear } }),
  { ok: true, gear: liveGear },
);

console.log("warmane-armory-cache tests passed");
