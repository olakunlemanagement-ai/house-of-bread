import { describe, expect, it } from "vitest";
import { nextOccurrence, PLACEHOLDER_GRACE_MINUTES, timeIn, timesByRegion, type WeeklyRule } from "./weekly";

// The ministry's rule: every Monday, 8:00 pm in Lagos (19:00 UTC all year,
// since Nigeria keeps no summer time).
const rule: WeeklyRule = { weekday: "monday", time: "20:00", timeZone: "Africa/Lagos", durationMinutes: null };

const regions = [
  { name: "Nigeria", timeZone: "Africa/Lagos" },
  { name: "Ghana", timeZone: "Africa/Accra" },
  { name: "United Kingdom", timeZone: "Europe/London" },
  { name: "South Africa", timeZone: "Africa/Johannesburg" },
  { name: "Kenya", timeZone: "Africa/Nairobi" },
  { name: "United States (Eastern)", timeZone: "America/New_York" },
] as const;

const at = (iso: string) => new Date(iso);
const times = (instant: Date) => Object.fromEntries(timesByRegion(instant, regions).map((r) => [r.name, r.time]));

describe("nextOccurrence", () => {
  it("finds this Monday when asked earlier the same day", () => {
    expect(nextOccurrence(rule, at("2026-10-19T08:00:00Z")).toISOString()).toBe("2026-10-19T19:00:00.000Z");
  });

  it("finds Monday from the week before", () => {
    expect(nextOccurrence(rule, at("2026-10-14T12:00:00Z")).toISOString()).toBe("2026-10-19T19:00:00.000Z");
  });

  it("finds Monday from late Sunday night in Lagos", () => {
    // 23:30 Sunday in Lagos is 22:30 UTC.
    expect(nextOccurrence(rule, at("2026-10-18T22:30:00Z")).toISOString()).toBe("2026-10-19T19:00:00.000Z");
  });

  it("keeps a session as next while it runs, then moves a week on", () => {
    const start = at("2026-10-19T19:00:00Z");
    const minute = 60_000;
    expect(nextOccurrence(rule, new Date(start.getTime() - minute))).toEqual(start);
    expect(nextOccurrence(rule, new Date(start.getTime() + minute))).toEqual(start);
    const end = start.getTime() + PLACEHOLDER_GRACE_MINUTES * minute;
    expect(nextOccurrence(rule, new Date(end - minute))).toEqual(start);
    expect(nextOccurrence(rule, new Date(end)).toISOString()).toBe("2026-10-26T19:00:00.000Z");
  });

  it("uses the confirmed duration once there is one", () => {
    const twoHours = { ...rule, durationMinutes: 120 };
    expect(nextOccurrence(twoHours, at("2026-10-19T20:30:00Z")).toISOString()).toBe("2026-10-19T19:00:00.000Z");
    expect(nextOccurrence(twoHours, at("2026-10-19T21:00:00Z")).toISOString()).toBe("2026-10-26T19:00:00.000Z");
  });

  it("is unmoved by the UK change on 25 October 2026", () => {
    // Just before and just after 01:00 UTC, when London goes back an hour.
    expect(nextOccurrence(rule, at("2026-10-25T00:59:00Z")).toISOString()).toBe("2026-10-26T19:00:00.000Z");
    expect(nextOccurrence(rule, at("2026-10-25T01:01:00Z")).toISOString()).toBe("2026-10-26T19:00:00.000Z");
  });

  it("is unmoved by the US change on 1 November 2026", () => {
    // 2:00 am Eastern daylight time is 06:00 UTC.
    expect(nextOccurrence(rule, at("2026-11-01T05:59:00Z")).toISOString()).toBe("2026-11-02T19:00:00.000Z");
    expect(nextOccurrence(rule, at("2026-11-01T06:01:00Z")).toISOString()).toBe("2026-11-02T19:00:00.000Z");
  });

  it("rolls over a month end", () => {
    expect(nextOccurrence(rule, at("2026-11-28T12:00:00Z")).toISOString()).toBe("2026-11-30T19:00:00.000Z");
    expect(nextOccurrence(rule, at("2026-11-30T21:00:00Z")).toISOString()).toBe("2026-12-07T19:00:00.000Z");
  });

  it("follows a rule set in a zone with summer time", () => {
    const london: WeeklyRule = { weekday: "monday", time: "20:00", timeZone: "Europe/London", durationMinutes: 60 };
    expect(nextOccurrence(london, at("2026-10-20T00:00:00Z")).toISOString()).toBe("2026-10-26T20:00:00.000Z");
    expect(nextOccurrence(london, at("2026-10-14T00:00:00Z")).toISOString()).toBe("2026-10-19T19:00:00.000Z");
  });

  it("rejects a malformed time", () => {
    expect(() => nextOccurrence({ ...rule, time: "8pm" }, at("2026-10-19T00:00:00Z"))).toThrow(/HH:MM/);
  });
});

describe("session times by region", () => {
  it("Monday 19 October: before both clock changes", () => {
    expect(times(at("2026-10-19T19:00:00Z"))).toEqual({
      Nigeria: "8:00 pm",
      Ghana: "7:00 pm",
      "United Kingdom": "8:00 pm",
      "South Africa": "9:00 pm",
      Kenya: "10:00 pm",
      "United States (Eastern)": "3:00 pm",
    });
  });

  it("Monday 26 October: after the UK change, before the US change", () => {
    const t = times(nextOccurrence(rule, at("2026-10-20T00:00:00Z")));
    expect(t["United Kingdom"]).toBe("7:00 pm");
    expect(t["United States (Eastern)"]).toBe("3:00 pm");
    expect(t.Nigeria).toBe("8:00 pm");
  });

  it("Monday 2 November: after both changes", () => {
    const t = times(nextOccurrence(rule, at("2026-10-27T00:00:00Z")));
    expect(t["United Kingdom"]).toBe("7:00 pm");
    expect(t["United States (Eastern)"]).toBe("2:00 pm");
    expect(t.Nigeria).toBe("8:00 pm");
    expect(t.Kenya).toBe("10:00 pm");
  });

  it("names the local weekday", () => {
    expect(timeIn(at("2026-10-19T19:00:00Z"), "Pacific/Auckland")).toEqual({ weekday: "Tuesday", time: "8:00 am" });
  });
});
