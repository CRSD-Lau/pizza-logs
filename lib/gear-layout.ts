import type { ArmoryGearItem } from "./warmane-armory";

const LEFT_SLOTS = new Set(["Head", "Neck", "Shoulder", "Back", "Chest", "Shirt", "Tabard", "Wrist"]);
const RIGHT_SLOTS = new Set(["Hands", "Waist", "Legs", "Feet", "Finger 1", "Finger 2", "Trinket 1", "Trinket 2"]);
const WEAPON_SLOTS = new Set(["Main Hand", "Off Hand", "Ranged", "Ranged/Relic"]);

const SLOT_ORDER = new Map([
  "Head",
  "Neck",
  "Shoulder",
  "Back",
  "Chest",
  "Shirt",
  "Tabard",
  "Wrist",
  "Hands",
  "Waist",
  "Legs",
  "Feet",
  "Finger 1",
  "Finger 2",
  "Trinket 1",
  "Trinket 2",
  "Main Hand",
  "Off Hand",
  "Ranged",
  "Ranged/Relic",
].map((slot, index) => [slot, index]));

function bySlotOrder(a: ArmoryGearItem, b: ArmoryGearItem): number {
  return (SLOT_ORDER.get(a.slot) ?? 99) - (SLOT_ORDER.get(b.slot) ?? 99);
}

export function getPlayerGearGroups(items: ArmoryGearItem[]): {
  left: ArmoryGearItem[];
  right: ArmoryGearItem[];
  weapons: ArmoryGearItem[];
} {
  const sorted = [...items].sort(bySlotOrder);

  return {
    left: sorted.filter((item) => LEFT_SLOTS.has(item.slot)),
    right: sorted.filter((item) => RIGHT_SLOTS.has(item.slot)),
    weapons: sorted.filter((item) => WEAPON_SLOTS.has(item.slot)),
  };
}
