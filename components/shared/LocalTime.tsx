"use client";

import { useSyncExternalStore } from "react";
import { zoneName } from "@/lib/content/dates";

type LocalTimeProps = {
  /** ISO 8601 in UTC. */
  iso: string;
  /** The ministry's IANA time zone. */
  timeZone: string;
  /** "8:00 pm" instead of "20:00", to match the session times by region. */
  hour12?: boolean;
};

/** "Monday 9 November at 20:00": the wall clock in a zone, without its name. */
const format = (iso: string, timeZone: string, hour12?: boolean) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12,
    timeZone,
  }).format(new Date(iso));

const subscribe = () => () => {};
const visitorZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Shows an event time in the visitor's local zone with the ministry's zone
 * beside it, each named by its city ("Lagos time", not "GMT+1"). The server
 * HTML carries the ministry time, so the page still says when the event is
 * without JavaScript. A visitor whose clock reads the same as the
 * ministry's sees it once.
 */
export function LocalTime({ iso, timeZone, hour12 }: LocalTimeProps) {
  const ministryTime = format(iso, timeZone, hour12);
  const ministry = `${ministryTime} ${zoneName(timeZone)}`;
  const zone = useSyncExternalStore(subscribe, visitorZone, () => null);
  const localTime = zone ? format(iso, zone, hour12) : null;

  return (
    <time dateTime={iso}>
      {zone && localTime && localTime !== ministryTime ? (
        <>
          {localTime} {zoneName(zone)} <span className="text-fg-muted">({ministry})</span>
        </>
      ) : (
        ministry
      )}
    </time>
  );
}
