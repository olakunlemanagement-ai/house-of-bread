import { upcomingEvents, type PlaceholderEvent } from "./placeholder-data";

export const ANNOUNCE_WINDOW_MS = 24 * 60 * 60 * 1000;
/** Assumed length of a session whose duration is not supplied. */
const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

export type Announcement = {
  kind: "live" | "soon";
  event: PlaceholderEvent;
};

/**
 * What the announcement bar should say at `now`, or null for nothing.
 * - An event marked live wins.
 * - A scheduled event already under way counts as live, because static pages
 *   cannot wait for someone to change its status.
 * - Otherwise the soonest event starting within 24 hours.
 */
export function announcementFor(events: PlaceholderEvent[], now: number): Announcement | null {
  const live = events.find((event) => event.status === "live");
  if (live) return { kind: "live", event: live };

  for (const event of upcomingEvents(events)) {
    const start = Date.parse(event.startsAtUtc);
    const end =
      start + (event.durationMinutes ? event.durationMinutes * 60 * 1000 : DEFAULT_DURATION_MS);
    if (start <= now && now < end) return { kind: "live", event };
    if (now < start && start - now <= ANNOUNCE_WINDOW_MS) return { kind: "soon", event };
  }
  return null;
}

/** Events that could ever trigger the bar. Empty means the bar never renders. */
export function announcementCandidates(events: PlaceholderEvent[]): PlaceholderEvent[] {
  return events.filter(
    (event) => event.status === "live" || (event.status === "scheduled" && event.startsAtUtc !== null),
  );
}
