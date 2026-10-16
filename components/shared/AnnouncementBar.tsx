import { announcementCandidates } from "@/lib/content/announcement";
import { placeholderEvents, type PlaceholderEvent } from "@/lib/content/placeholder-data";
import { AnnouncementBarClient } from "./AnnouncementBarClient";
import { AnnouncementBarView } from "./AnnouncementBarView";

/**
 * Lime bar above the header, shown only when a session is live or starts
 * within 24 hours. Pages are static, so:
 * - an event marked live renders here, in the server HTML;
 * - otherwise, if any dated session exists, a small client script checks the
 *   visitor's clock against it;
 * - with no candidates, nothing renders and no script runs.
 */
export function AnnouncementBar({ events = placeholderEvents }: { events?: PlaceholderEvent[] }) {
  const live = events.find((event) => event.status === "live");
  if (live) return <AnnouncementBarView kind="live" event={live} />;

  const candidates = announcementCandidates(events);
  if (candidates.length === 0) return null;
  return <AnnouncementBarClient events={candidates} />;
}
