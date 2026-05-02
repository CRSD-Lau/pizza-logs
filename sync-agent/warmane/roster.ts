import { isHtmlChallengePage, isWarmaneErrorJson } from "../validate";
import { fetchWithTimeout } from "../fetch-util";

const GUILD = "Pizza+Warriors";
const REALM = "Lordaeron";

export type RosterMember = {
  characterName: string;
  normalizedCharacterName: string;
  guildName: string;
  realm: string;
  className?: string;
  raceName?: string;
  level?: number;
  rankName?: string;
  rankOrder?: number;
  armoryUrl: string;
  lastSyncedAt: string;
};

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function normalizeRosterJson(data: unknown): RosterMember[] | null {
  if (!data || typeof data !== "object") return null;
  const raw = (data as Record<string, unknown>).roster;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const now = new Date().toISOString();
  const members = raw
    .map((entry): RosterMember | null => {
      if (!entry || typeof entry !== "object") return null;
      const r = entry as Record<string, unknown>;
      const name = typeof r.name === "string" ? r.name.trim() : null;
      if (!name) return null;
      return {
        characterName: name,
        normalizedCharacterName: normalizeName(name),
        guildName: "Pizza Warriors",
        realm: REALM,
        className: typeof r.class === "string" ? r.class : undefined,
        raceName: typeof r.race === "string" ? r.race : undefined,
        level: typeof r.level === "number" ? r.level : undefined,
        rankName:
          typeof r.rankName === "string" ? r.rankName : undefined,
        rankOrder:
          typeof r.rankOrder === "number" ? r.rankOrder : undefined,
        armoryUrl: `https://armory.warmane.com/character/${encodeURIComponent(name)}/${REALM}/summary`,
        lastSyncedAt: now,
      };
    })
    .filter((m): m is RosterMember => m !== null);

  return members.length > 0 ? members : null;
}

export async function fetchGuildRoster(): Promise<RosterMember[] | null> {
  const url = `https://armory.warmane.com/api/guild/${GUILD}/${REALM}/summary`;
  let data: unknown;
  try {
    const res = await fetchWithTimeout(url, {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
    });
    const text = await res.text();
    if (isHtmlChallengePage(text)) return null;
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (isWarmaneErrorJson(data)) return null;
  return normalizeRosterJson(data);
}
