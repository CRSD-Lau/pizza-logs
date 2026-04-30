import { unstable_cache } from "next/cache";

export type ArmoryGearItem = {
  slot: string;
  name: string;
  quality?: string;
  itemLevel?: number;
  iconUrl?: string;
  itemUrl?: string;
  enchant?: string;
  gems?: string[];
};

export type ArmoryCharacterGear = {
  characterName: string;
  realm: string;
  sourceUrl: string;
  fetchedAt: string;
  items: ArmoryGearItem[];
};

export type ArmoryGearResult =
  | { ok: true; gear: ArmoryCharacterGear }
  | { ok: false; sourceUrl: string; message: string };

type WarmaneEquipmentItem = {
  name?: unknown;
  item?: unknown;
  quality?: unknown;
  itemLevel?: unknown;
  itemlevel?: unknown;
  icon?: unknown;
  iconUrl?: unknown;
  enchant?: unknown;
  gems?: unknown;
};

type WarmaneCharacterSummary = {
  name?: unknown;
  realm?: unknown;
  equipment?: unknown;
  error?: unknown;
};

const DEFAULT_REALM = "Lordaeron";
const CACHE_SECONDS = 60 * 60 * 12;
const FETCH_TIMEOUT_MS = 8_000;
const USER_AGENT = "PizzaLogsBot/0.1 (+https://pizza-logs-production.up.railway.app)";

const EQUIPMENT_SLOTS = [
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
] as const;

function sanitizeCharacterName(name: string): string | null {
  const normalized = name.trim();
  if (!/^[A-Za-z]{2,12}$/.test(normalized)) return null;
  return normalized;
}

function sanitizeRealm(realm: string): string {
  return /^[A-Za-z]{2,24}$/.test(realm) ? realm : DEFAULT_REALM;
}

function getSourceUrl(characterName: string, realm: string): string {
  return `https://armory.warmane.com/character/${encodeURIComponent(characterName)}/${encodeURIComponent(realm)}/summary`;
}

function getApiUrl(characterName: string, realm: string): string {
  return `https://armory.warmane.com/api/character/${encodeURIComponent(characterName)}/${encodeURIComponent(realm)}/summary`;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const strings = value.map(asString).filter((gem): gem is string => Boolean(gem));
  return strings.length > 0 ? strings : undefined;
}

function normalizeEquipment(items: unknown): ArmoryGearItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((raw, index): ArmoryGearItem | null => {
      const item = raw as WarmaneEquipmentItem;
      const name = asString(item.name);
      if (!name) return null;

      const itemId = asString(item.item);
      const directIcon = asString(item.iconUrl) ?? asString(item.icon);
      const iconUrl = directIcon?.startsWith("http") ? directIcon : undefined;

      return {
        slot: EQUIPMENT_SLOTS[index] ?? `Slot ${index + 1}`,
        name,
        quality: asString(item.quality),
        itemLevel: asNumber(item.itemLevel) ?? asNumber(item.itemlevel),
        iconUrl,
        itemUrl: itemId ? `https://armory.warmane.com/item/${encodeURIComponent(itemId)}` : undefined,
        enchant: asString(item.enchant),
        gems: asStringArray(item.gems),
      };
    })
    .filter((item): item is ArmoryGearItem => Boolean(item));
}

async function fetchWarmaneGearUncached(
  characterName: string,
  realm: string = DEFAULT_REALM
): Promise<ArmoryCharacterGear> {
  const sanitizedName = sanitizeCharacterName(characterName);
  const sanitizedRealm = sanitizeRealm(realm);

  if (!sanitizedName) {
    throw new Error("Invalid Warmane character name");
  }

  const sourceUrl = getSourceUrl(sanitizedName, sanitizedRealm);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(getApiUrl(sanitizedName, sanitizedRealm), {
      headers: {
        Accept: "application/json,text/plain,*/*",
        "User-Agent": USER_AGENT,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Warmane Armory returned ${response.status}`);
    }

    const data = (await response.json()) as WarmaneCharacterSummary;
    if (data.error) {
      throw new Error("Warmane Armory returned an error response");
    }

    const items = normalizeEquipment(data.equipment);

    return {
      characterName: asString(data.name) ?? sanitizedName,
      realm: asString(data.realm) ?? sanitizedRealm,
      sourceUrl,
      fetchedAt: new Date().toISOString(),
      items,
    };
  } finally {
    clearTimeout(timeout);
  }
}

const getCachedWarmaneCharacterGear = unstable_cache(
  fetchWarmaneGearUncached,
  ["warmane-character-gear"],
  { revalidate: CACHE_SECONDS }
);

export async function getWarmaneCharacterGear(
  characterName: string,
  realm: string = DEFAULT_REALM
): Promise<ArmoryGearResult> {
  const sanitizedName = sanitizeCharacterName(characterName);
  const sanitizedRealm = sanitizeRealm(realm);
  const sourceUrl = getSourceUrl(sanitizedName ?? characterName, sanitizedRealm);

  if (!sanitizedName) {
    return {
      ok: false,
      sourceUrl,
      message: "No gear data available from Warmane Armory.",
    };
  }

  try {
    const gear = await getCachedWarmaneCharacterGear(sanitizedName, sanitizedRealm);
    return { ok: true, gear };
  } catch (error) {
    console.error("Warmane Armory fetch error", {
      characterName: sanitizedName,
      realm: sanitizedRealm,
      error,
    });

    return {
      ok: false,
      sourceUrl,
      message: "Gear data is temporarily unavailable from Warmane Armory.",
    };
  }
}
