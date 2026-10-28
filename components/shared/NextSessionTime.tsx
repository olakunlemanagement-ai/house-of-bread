"use client";

import type { WeeklyRule } from "@/lib/schedule/weekly";
import { LocalTime } from "./LocalTime";
import { useNextSession } from "./useNextSession";

/**
 * The next weekly live session's time, in the visitor's zone with the
 * ministry's beside it. The server HTML carries the cached occurrence, so
 * it reads without JavaScript; the visitor's clock corrects a page cached
 * across a session's end.
 */
export function NextSessionTime({ rule, serverIso }: { rule: WeeklyRule; serverIso: string }) {
  const iso = useNextSession(rule, serverIso);
  return <LocalTime iso={iso} timeZone={rule.timeZone} />;
}
