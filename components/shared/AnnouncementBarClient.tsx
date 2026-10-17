"use client";

import { useSyncExternalStore } from "react";
import { announcementFor } from "@/lib/content/announcement";
import type { EventData } from "@/lib/content/schemas";
import { AnnouncementBarView } from "./AnnouncementBarView";
import { LocalTime } from "./LocalTime";

const subscribe = () => () => {};

/**
 * Decides from the visitor's clock whether a session is live or within 24
 * hours. Renders nothing on the server, so the static HTML never shows a
 * stale announcement.
 */
export function AnnouncementBarClient({ events }: { events: EventData[] }) {
  // A string snapshot, so React compares by value between renders.
  const key = useSyncExternalStore(
    subscribe,
    () => {
      const found = announcementFor(events, Date.now());
      return found ? `${found.kind}:${found.event.slug}` : "";
    },
    () => "",
  );
  if (!key) return null;

  const split = key.indexOf(":");
  const kind = key.slice(0, split) as "live" | "soon";
  const slug = key.slice(split + 1);
  const event = events.find((entry) => entry.slug === slug);
  if (!event) return null;

  return (
    <AnnouncementBarView
      kind={kind}
      event={event}
      when={
        kind === "soon" && event.startsAtUtc && event.timeZone ? (
          <LocalTime iso={event.startsAtUtc} timeZone={event.timeZone} />
        ) : undefined
      }
    />
  );
}
