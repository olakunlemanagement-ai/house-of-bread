"use client";

import { useSyncExternalStore } from "react";

type LocalTimeProps = {
  /** ISO 8601 in UTC. */
  iso: string;
  /** The ministry's IANA time zone. */
  timeZone: string;
};

const format = (iso: string, timeZone?: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  }).format(new Date(iso));

const subscribe = () => () => {};

/**
 * Shows an event time in the visitor's local zone with the ministry's zone
 * beside it. The server HTML carries the ministry time, so the page still
 * says when the event is without JavaScript.
 */
export function LocalTime({ iso, timeZone }: LocalTimeProps) {
  const ministry = format(iso, timeZone);
  const local = useSyncExternalStore(
    subscribe,
    () => format(iso),
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
