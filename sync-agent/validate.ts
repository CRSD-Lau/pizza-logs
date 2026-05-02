export function isHtmlChallengePage(text: string): boolean {
  const t = text.trimStart();
  return (
    t.startsWith("<!DOCTYPE") ||
    t.startsWith("<!doctype") ||
    t.startsWith("<html")
  );
}

export function isWarmaneErrorJson(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.error === "string" && obj.error.length > 0;
}

export function isValidGearPayload(
  data: unknown
): data is { name: string; equipment: unknown[] } {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.name === "string" &&
    obj.name.length > 0 &&
    Array.isArray(obj.equipment) &&
    obj.equipment.length > 0
  );
}

export function isValidRosterPayload(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  const members = obj.guildMembers ?? obj.roster ?? obj.members;
  return Array.isArray(members) && members.length > 0;
}
