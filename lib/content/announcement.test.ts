import { describe, expect, it } from "vitest";
import { announcementCandidates, announcementFor } from "./announcement";
import type { PlaceholderEvent } from "./placeholder-data";

const HOUR = 60 * 60 * 1000;
const now = Date.parse("2026-10-16T12:00:00Z");

const event = (overrides: Partial<PlaceholderEvent>): PlaceholderEvent => ({
  slug: "test",
  title: "Test session",
  kind: "live",
  startsAtUtc: null,
  timeZone: "Europe/London",
  durationMinutes: 60,
  youtubeUrl: null,
  status: "scheduled",
  sample: true,
  ...overrides,
});

const at = (offsetMs: number) => new Date(now + offsetMs).toISOString();

describe("announcementFor", () => {
  it("shows nothing when no event has a date", () => {
    expect(announcementFor([event({})], now)).toBeNull();
  });

  it("shows an event marked live, whatever its date", () => {
    const live = event({ slug: "live", status: "live" });
    expect(announcementFor([live], now)).toEqual({ kind: "live", event: live });
  });

  it("shows a session starting within 24 hours as coming up", () => {
    const soon = event({ startsAtUtc: at(3 * HOUR) });
    expect(announcementFor([soon], now)).toEqual({ kind: "soon", event: soon });
  });

  it("hides a session more than 24 hours away", () => {
    expect(announcementFor([event({ startsAtUtc: at(25 * HOUR) })], now)).toBeNull();
  });

  it("treats a session under way as live", () => {
    const running = event({ startsAtUtc: at(-30 * 60 * 1000), durationMinutes: 60 });
    expect(announcementFor([running], now)?.kind).toBe("live");
  });

  it("hides a session that has finished", () => {
    expect(announcementFor([event({ startsAtUtc: at(-2 * HOUR), durationMinutes: 60 })], now)).toBeNull();
  });

  it("ignores replays", () => {
    expect(announcementFor([event({ startsAtUtc: at(HOUR), status: "replay" })], now)).toBeNull();
  });

  it("picks the soonest session", () => {
    const later = event({ slug: "later", startsAtUtc: at(10 * HOUR) });
    const sooner = event({ slug: "sooner", startsAtUtc: at(2 * HOUR) });
    expect(announcementFor([later, sooner], now)?.event.slug).toBe("sooner");
  });
});

describe("announcementCandidates", () => {
  it("drops undated, replay and unscheduled events", () => {
    const dated = event({ slug: "dated", startsAtUtc: at(HOUR) });
    const live = event({ slug: "live", status: "live" });
    const candidates = announcementCandidates([
      event({ slug: "undated" }),
      event({ slug: "replay", startsAtUtc: at(-HOUR), status: "replay" }),
      dated,
      live,
    ]);
    expect(candidates.map((entry) => entry.slug)).toEqual(["dated", "live"]);
  });
});
