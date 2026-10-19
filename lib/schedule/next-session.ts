import { cacheLife } from "next/cache";
import { siteConfig } from "@/lib/site-config";
import { nextOccurrence } from "./weekly";

/**
 * The next weekly live session as ISO 8601 in UTC. Cached for an hour at
 * most, so a prerendered page never shows a session that has ended for
 * longer than that, and a clock change shows up within the hour. The
 * visitor's own clock corrects it further (SessionTimesClient).
 */
export async function getNextLiveSession(): Promise<string> {
  "use cache";
  cacheLife({ stale: 60 * 5, revalidate: 60 * 60, expire: 60 * 60 * 24 });
  return nextOccurrence(siteConfig.liveSession, new Date()).toISOString();
}
