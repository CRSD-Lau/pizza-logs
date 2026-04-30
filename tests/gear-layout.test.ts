import assert from "node:assert/strict";
import { getPlayerGearGroups } from "../lib/gear-layout";

const groups = getPlayerGearGroups([
  { slot: "Head", name: "Head" },
  { slot: "Wrist", name: "Wrist" },
  { slot: "Finger 1", name: "Ring" },
  { slot: "Trinket 1", name: "Trinket" },
  { slot: "Main Hand", name: "Staff" },
  { slot: "Ranged", name: "Wand" },
]);

assert.deepEqual(groups.left.map((item) => item.slot), ["Head", "Wrist"]);
assert.deepEqual(groups.right.map((item) => item.slot), ["Finger 1", "Trinket 1"]);
assert.deepEqual(groups.weapons.map((item) => item.slot), ["Main Hand", "Ranged"]);

console.log("gear-layout tests passed");
