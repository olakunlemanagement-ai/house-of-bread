import type { EventData } from "./schemas.ts";

export type DatedEvent = EventData & { startsAtUtc: string };

const isDated = (event: EventData): event is DatedEvent => event.startsAtUtc !== null;

/**
 * Scheduled events that have a real start time, soonest first. Status, not
 * the clock, decides what is upcoming, because pages are built statically.
 */
export function upcomingEvents(events: EventData[]): DatedEvent[] {
  return events
    .filter(isDated)
    .filter((event) => event.status !== "replay")
    .sort((a, b) => Date.parse(a.startsAtUtc) - Date.parse(b.startsAtUtc));
}
