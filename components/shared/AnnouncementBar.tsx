import { announcementCandidates } from "@/lib/content/announcement";
import { getAll, type EventData } from "@/lib/content";
import { AnnouncementBarClient } from "./AnnouncementBarClient";
import { AnnouncementBarView } from "./AnnouncementBarView";

/**
 * Gold bar above the header, shown only while a session is live. Pages are
 * static, so:
 * - an event marked live renders here, in the server HTML;
 * - otherwise, if any dated session exists, a small client script checks the
 *   visitor's clock against it;
 * - with no candidates, nothing renders and no script runs.
 */
export function AnnouncementBar({ events = getAll("event") }: { events?: EventData[] }) {
  const live = events.find((event) => event.status === "live");
  if (live) return <AnnouncementBarView kind="live" event={live} />;

  const candidates = announcementCandidates(events);
  if (candidates.length === 0) return null;
  return <AnnouncementBarClient events={candidates} />;
}
