import Link from "next/link";
import type { Route } from "next";
import type { EventKind, PlaceholderEvent } from "@/lib/content/placeholder-data";
import { cardClass, interactiveCardClass } from "./Card";
import { IconTile } from "./icons";
import { LocalTime } from "./LocalTime";
import { Placeholder, PlaceholderBadge } from "./Placeholder";

export const eventKindLabel: Record<EventKind, string> = {
  live: "Live",
  training: "Training",
  meeting: "Meeting",
};

/** Event date and time, or a marked placeholder when none is supplied. */
export function EventWhen({ event }: { event: PlaceholderEvent }) {
  if (!event.startsAtUtc || !event.timeZone) {
    return <Placeholder>[DATE, TIME AND MINISTRY TIME ZONE TO BE SUPPLIED]</Placeholder>;
  }
  return <LocalTime iso={event.startsAtUtc} timeZone={event.timeZone} />;
}

export function EventDuration({ event }: { event: PlaceholderEvent }) {
  if (event.durationMinutes === null) {
    return <Placeholder>[DURATION TO BE SUPPLIED]</Placeholder>;
  }
  return <>{event.durationMinutes} minutes</>;
}

export function LiveSessionCard({ event }: { event: PlaceholderEvent }) {
  return (
    <li className={`${cardClass} ${interactiveCardClass} flex flex-col gap-4 sm:flex-row sm:items-center`}>
      <IconTile name={event.kind === "live" ? "live" : "calendar"} />
      <div className="flex-1">
        <p className="flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink-muted">
          {eventKindLabel[event.kind]}
          {event.sample ? <PlaceholderBadge label="Sample" /> : null}
        </p>
        <h3 className="mt-1 text-xl font-bold">{event.title}</h3>
        <p className="mt-2 text-ink">
          <EventWhen event={event} />
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          <EventDuration event={event} />
        </p>
      </div>
      <Link
        href={`/events/${event.slug}` as Route}
        className="font-semibold text-green underline underline-offset-4 after:absolute after:inset-0 after:rounded-2xl after:content-['']"
      >
        Details<span className="sr-only">: {event.title}</span>
      </Link>
    </li>
  );
}
