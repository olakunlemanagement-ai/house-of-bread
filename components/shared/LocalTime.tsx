"use client";

import { useSyncExternalStore } from "react";

type LocalTimeProps = {
  /** ISO 8601 in UTC. */
  iso: string;
  /** The ministry's IANA time zone. */
  timeZone: string;
  /** "8:00 pm" instead of "20:00", to match the session times by region. */
  hour12?: boolean;
};

const format = (iso: string, timeZone?: string, hour12?: boolean) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12,
    timeZone,
    timeZoneName: "short",
  }).format(new Date(iso));

const subscribe = () => () => {};

/**
 * Shows an event time in the visitor's local zone with the ministry's zone
 * beside it. The server HTML carries the ministry time, so the page still
 * says when the event is without JavaScript.
 */
export function LocalTime({ iso, timeZone, hour12 }: LocalTimeProps) {
  const ministry = format(iso, timeZone, hour12);
  const local = useSyncExternalStore(
    subscribe,
    () => format(iso, undefined, hour12),
    () => null,
  );

  return (
    <time dateTime={iso}>
      {local && local !== ministry ? (
        <>
          {local} <span className="text-fg-muted">({ministry})</span>
        </>
      ) : (
        ministry
      )}
    </time>
  );
}
