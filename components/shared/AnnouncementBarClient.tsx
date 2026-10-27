"use client";

import { useSyncExternalStore } from "react";
import { announcementFor } from "@/lib/content/announcement";
import type { EventData } from "@/lib/content/schemas";
import { AnnouncementBarView } from "./AnnouncementBarView";

const subscribe = () => () => {};

/**
 * Decides from the visitor's clock whether a scheduled session is under way.
 * Only a live session shows: since the reset there is no "Coming up" bar,
 * as the weekly session already has its one small line on Home. Renders
 * nothing on the server, so the static HTML never shows a stale bar.
 */
export function AnnouncementBarClient({ events }: { events: EventData[] }) {
  // A string snapshot, so React compares by value between renders.
  const key = useSyncExternalStore(
    subscribe,
    () => {
      const found = announcementFor(events, Date.now());
      return found?.kind === "live" ? found.event.slug : "";
    },
    () => "",
  );
  if (!key) return null;

  const event = events.find((entry) => entry.slug === key);
  if (!event) return null;

  return <AnnouncementBarView kind="live" event={event} />;
}
