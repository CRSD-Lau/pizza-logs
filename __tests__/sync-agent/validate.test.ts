import { describe, it, expect } from "vitest";
import {
  isHtmlChallengePage,
  isWarmaneErrorJson,
  isValidGearPayload,
  isValidRosterPayload,
} from "../../sync-agent/validate";

describe("isHtmlChallengePage", () => {
  it("detects uppercase DOCTYPE", () => {
    expect(isHtmlChallengePage("<!DOCTYPE html><html>...")).toBe(true);
  });
  it("detects lowercase doctype", () => {
    expect(isHtmlChallengePage("<!doctype html>...")).toBe(true);
  });
  it("detects html tag", () => {
    expect(isHtmlChallengePage("<html lang='en'>")).toBe(true);
  });
  it("passes valid JSON string", () => {
    expect(isHtmlChallengePage('{"name":"Lausudo"}')).toBe(false);
  });
  it("handles leading whitespace before DOCTYPE", () => {
    expect(isHtmlChallengePage("\n\n<!DOCTYPE html>")).toBe(true);
  });
});

describe("isWarmaneErrorJson", () => {
  it("detects error field", () => {
    expect(isWarmaneErrorJson({ error: "Character not found." })).toBe(true);
  });
  it("passes response with no error field", () => {
    expect(isWarmaneErrorJson({ name: "Lausudo", equipment: [] })).toBe(false);
  });
  it("returns false for null", () => {
    expect(isWarmaneErrorJson(null)).toBe(false);
  });
  it("returns false for non-object", () => {
    expect(isWarmaneErrorJson("string")).toBe(false);
  });
});

describe("isValidGearPayload", () => {
  it("passes payload with name and non-empty equipment", () => {
    expect(
      isValidGearPayload({ name: "Lausudo", equipment: [{ name: "Shadowmourne" }] })
    ).toBe(true);
  });
  it("rejects empty equipment array", () => {
    expect(isValidGearPayload({ name: "Lausudo", equipment: [] })).toBe(false);
  });
  it("rejects missing name", () => {
    expect(isValidGearPayload({ equipment: [{ name: "Sword" }] })).toBe(false);
  });
  it("rejects non-object", () => {
    expect(isValidGearPayload(null)).toBe(false);
  });
});

describe("isValidRosterPayload", () => {
  it("accepts guildMembers key", () => {
    expect(isValidRosterPayload({ guildMembers: [{ name: "Lausudo" }] })).toBe(true);
  });
  it("accepts roster key", () => {
    expect(isValidRosterPayload({ roster: [{ name: "Lausudo" }] })).toBe(true);
  });
  it("accepts members key", () => {
    expect(isValidRosterPayload({ members: [{ name: "Lausudo" }] })).toBe(true);
  });
  it("rejects empty array", () => {
    expect(isValidRosterPayload({ guildMembers: [] })).toBe(false);
  });
  it("rejects non-object", () => {
    expect(isValidRosterPayload("not an object")).toBe(false);
  });
});
