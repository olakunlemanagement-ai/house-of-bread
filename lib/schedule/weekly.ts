// The weekly live session, worked out from one rule. Framework free: no
// React or Next imports, so the app could share it later.
//
// Every time comes from Intl and an IANA zone. No offset is written in code,
// so clock changes (the UK on 25 October 2026, the US on 1 November 2026)
// are handled by the zone data, not by hand.

export const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export type WeeklyRule = {
  weekday: Weekday;
  /** Wall clock start in the rule's zone, "HH:MM", 24 hour. */
  time: string;
  /** IANA zone the time is set in, such as "Africa/Lagos". */
  timeZone: string;
  /** Null until the ministry confirms it (docs/PLACEHOLDERS.md). */
  durationMinutes: number | null;
};

/**
 * While the duration is a placeholder, a session still counts as "next" for
 * this long after it starts, so the page does not jump a week ahead mid
 * session.
 */
export const PLACEHOLDER_GRACE_MINUTES = 60;

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

type WallTime = { year: number; month: number; day: number; hour: number; minute: number; weekday: number };

const wallFormatters = new Map<string, Intl.DateTimeFormat>();

/** The wall clock in a zone at an instant. weekday: 0 is Monday. */
function wallTime(instant: number, timeZone: string): WallTime {
  let format = wallFormatters.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      weekday: "long",
      hourCycle: "h23",
    });
    wallFormatters.set(timeZone, format);
  }
  const parts: Record<string, string> = {};
  for (const part of format.formatToParts(new Date(instant))) parts[part.type] = part.value;
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    weekday: WEEKDAYS.indexOf((parts.weekday ?? "").toLowerCase() as Weekday),
  };
}

/** How far the zone's wall clock is ahead of UTC at an instant, in ms. */
function zoneOffset(instant: number, timeZone: string): number {
  const wall = wallTime(instant, timeZone);
  const asUtc = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute);
  return asUtc - Math.floor(instant / MINUTE) * MINUTE;
}

/** The instant a wall clock time happens in a zone. */
function fromWallTime(year: number, month: number, day: number, hour: number, minute: number, timeZone: string): number {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const first = guess - zoneOffset(guess, timeZone);
  // Check again at the result, in case a clock change sits between the two.
  return guess - zoneOffset(first, timeZone);
}

function parseTime(time: string): { hour: number; minute: number } {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!match) throw new Error(`Weekly rule time must be HH:MM, got "${time}"`);
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

/** Minutes a session counts as current after it starts. */
export function sessionLengthMinutes(rule: WeeklyRule): number {
  return rule.durationMinutes ?? PLACEHOLDER_GRACE_MINUTES;
}

/**
 * The next session at or after `now`: the first occurrence that has not
 * yet ended (start plus duration, or the placeholder grace).
 */
export function nextOccurrence(rule: WeeklyRule, now: Date): Date {
  const { hour, minute } = parseTime(rule.time);
  const target = WEEKDAYS.indexOf(rule.weekday);
  const length = sessionLengthMinutes(rule) * MINUTE;
  const today = wallTime(now.getTime(), rule.timeZone);
  const ahead = (target - today.weekday + 7) % 7;

  // Step a calendar day at a time on a UTC date, so month ends roll over.
  for (const extra of [0, 7]) {
    const date = new Date(Date.UTC(today.year, today.month - 1, today.day) + (ahead + extra) * DAY);
    const start = fromWallTime(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), hour, minute, rule.timeZone);
    if (start + length > now.getTime()) return new Date(start);
  }
  // Unreachable: a week later always ends after now.
  throw new Error("No weekly occurrence found");
}

export type Region = { name: string; timeZone: string };

export type RegionTime = Region & {
  /** "Monday" */
  weekday: string;
  /** "8:00 pm" */
  time: string;
};

const weekdayFormat = (timeZone: string) => new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone });
const timeFormat = (timeZone?: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone });

/** One instant as the weekday and time in a zone. */
export function timeIn(instant: Date, timeZone: string): { weekday: string; time: string } {
  return { weekday: weekdayFormat(timeZone).format(instant), time: timeFormat(timeZone).format(instant) };
}

/** One instant as the local weekday and time in each region. */
export function timesByRegion<R extends Region>(instant: Date, regions: readonly R[]): (R & RegionTime)[] {
  return regions.map((region) => ({ ...region, ...timeIn(instant, region.timeZone) }));
}
