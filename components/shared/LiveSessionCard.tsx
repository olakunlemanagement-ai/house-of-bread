import Link from "next/link";
import type { Route } from "next";
import type { EventKind, PlaceholderEvent } from "@/lib/content/placeholder-data";
import { Button, ButtonLink } from "./Button";
import { cardClass, interactiveCardClass } from "./Card";
import { Icon, IconTile } from "./icons";
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

/**
 * The featured next session: title, local time with the ministry's zone,
 * duration, and its three actions. Watch on YouTube and Add to calendar stay
 * disabled, with a note, until a link and a date exist.
 */
/** Gold "Live now" badge. Gold appears only for live states. Ink on gold 9.02:1. */
export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 font-sans text-sm font-bold text-ink">
      <span aria-hidden="true" className="size-2 rounded-full bg-ink" />
      Live now
    </span>
  );
}

export function LiveSessionCard({ event, idPrefix }: { event: PlaceholderEvent; idPrefix: string }) {
  const youtubeNote = `${idPrefix}-youtube-note`;
  const calendarNote = `${idPrefix}-calendar-note`;
  const live = event.status === "live";
  return (
    <article className="overflow-hidden rounded-card border border-border bg-surface shadow-raised">
      <div className="grid lg:grid-cols-12">
        <div
          className={`flex flex-col justify-between gap-8 p-6 sm:p-8 lg:col-span-4 ${
            live ? "bg-surface-gold" : "bg-surface-mint"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <IconTile name={event.kind === "live" ? "live" : "calendar"} />
            {live ? <LiveBadge /> : <p className="eyebrow">{eventKindLabel[event.kind]}</p>}
          </div>
          <p className="flex items-start gap-2 text-ink">
            <Icon name="clock" className="mt-1 size-5 shrink-0 text-emerald" />
            <span>
              <EventWhen event={event} />
            </span>
          </p>
        </div>
        <div className="p-6 sm:p-8 lg:col-span-8">
          {event.sample ? <PlaceholderBadge label="Sample" /> : null}
          <h3 className="mt-3 text-3xl leading-tight">
            <Link href={`/events/${event.slug}` as Route} className="rounded hover:text-emerald-deep">
              {event.title}
            </Link>
          </h3>
          <p className="mt-2 text-ink-muted">
            <EventDuration event={event} />
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {event.youtubeUrl ? (
              <ButtonLink
                href={event.youtubeUrl as `https://${string}`}
                variant={live ? "live" : "secondary"}
                className="w-full sm:w-auto"
              >
                {live ? "Watch live on YouTube" : "Watch on YouTube"}
              </ButtonLink>
            ) : (
              <Button variant="secondary" disabled aria-describedby={youtubeNote} className="w-full sm:w-auto">
                Watch on YouTube
              </Button>
            )}
            {/* The primary action leads: Watch while live, otherwise Set a reminder. */}
            <ButtonLink
              href="/subscribe"
              variant={live ? "secondary" : "primary"}
              arrow
              className={`w-full sm:w-auto ${live ? "" : "order-first"}`}
            >
              Set a reminder
            </ButtonLink>
            {/* TODO: link to the .ics file generated at build time once events carry real dates. */}
            <Button variant="secondary" disabled aria-describedby={calendarNote} className="w-full sm:w-auto">
              <Icon name="calendar" className="size-5" />
              Add to calendar
            </Button>
          </div>
          <div className="mt-4 space-y-1 text-sm text-ink-muted">
            {event.youtubeUrl ? null : (
              <p id={youtubeNote}>
                <Placeholder>[YOUTUBE LINK TO BE SUPPLIED]</Placeholder>
              </p>
            )}
            <p id={calendarNote}>
              <Placeholder>[CALENDAR FILE AVAILABLE ONCE A DATE IS SUPPLIED]</Placeholder>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

/** A session in a list. The whole card links to the session page. */
export function EventCard({ event }: { event: PlaceholderEvent }) {
  return (
    <li className={`${cardClass} ${interactiveCardClass} flex flex-col gap-5 sm:flex-row sm:items-center`}>
      <IconTile name={event.kind === "live" ? "live" : "calendar"} size="lg" />
      <div className="flex-1">
        <p className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">{eventKindLabel[event.kind]}</span>
          {event.sample ? <PlaceholderBadge label="Sample" /> : null}
        </p>
        <h3 className="mt-2 text-2xl leading-snug">{event.title}</h3>
        <p className="mt-2 text-ink">
          <EventWhen event={event} />
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          <EventDuration event={event} />
        </p>
      </div>
      <Link
        href={`/events/${event.slug}` as Route}
        className="inline-flex items-center gap-2 font-semibold text-emerald-deep underline underline-offset-4 after:absolute after:inset-0 after:rounded-card after:content-['']"
      >
        Details<span className="sr-only">: {event.title}</span>
        <Icon name="arrow-right" className="size-5" />
      </Link>
    </li>
  );
}
