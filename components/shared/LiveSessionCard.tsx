import type { Route } from "next";
import type { EventData, EventKind } from "@/lib/content/schemas";
import { ButtonLink } from "./Button";
import { cardClass } from "./Card";
import { IconTile } from "./icons";
import { LocalTime } from "./LocalTime";
import { Placeholder, PlaceholderBadge } from "./Placeholder";
import { PlayChip } from "./PlayChip";

export const eventKindLabel: Record<EventKind, string> = {
  live: "Live",
  training: "Training",
  meeting: "Meeting",
};

/** Event date and time, or a marked placeholder when none is supplied. */
export function EventWhen({ event }: { event: EventData }) {
  if (!event.startsAtUtc || !event.timeZone) {
    return <Placeholder>[DATE, TIME AND MINISTRY TIME ZONE TO BE SUPPLIED]</Placeholder>;
  }
  return <LocalTime iso={event.startsAtUtc} timeZone={event.timeZone} />;
}

export function EventDuration({ event }: { event: EventData }) {
  if (event.durationMinutes === null) {
    return <Placeholder>[DURATION TO BE SUPPLIED]</Placeholder>;
  }
  return <>{event.durationMinutes} minutes</>;
}

/** A session in a list. The whole card links to the session page. */
export function EventCard({ event }: { event: EventData }) {
  return (
    <li className={`${cardClass} relative flex flex-col gap-5 sm:flex-row sm:items-center`}>
      <IconTile name={event.kind === "live" ? "live" : "calendar"} size="lg" />
      <div className="flex-1">
        <p className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">{eventKindLabel[event.kind]}</span>
          {event.placeholder ? <PlaceholderBadge label="Sample" /> : null}
        </p>
        <h3 className="mt-2 text-2xl leading-snug">{event.title}</h3>
        <p className="mt-2 text-ink">
          <EventWhen event={event} />
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          <EventDuration event={event} />
        </p>
      </div>
      {event.status === "scheduled" ? null : <PlayChip className="absolute right-4 top-4" />}
      <ButtonLink href={`/events/${event.slug}` as Route} variant="tertiary" size="sm" className="self-start sm:self-center">
        See the details<span className="sr-only">: {event.title}</span>
      </ButtonLink>
    </li>
  );
}
