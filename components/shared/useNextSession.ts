"use client";

import { useSyncExternalStore } from "react";
import { nextOccurrence, type WeeklyRule } from "@/lib/schedule/weekly";

const subscribe = () => () => {};

/**
 * The next weekly session, by the visitor's clock. The server HTML carries
 * the cached occurrence (at most an hour old), so the page works without
 * script; once script runs, a page cached across a session's end corrects
 * itself.
 */
export function useNextSession(rule: WeeklyRule, serverIso: string): string {
  return useSyncExternalStore(
    subscribe,
    () => nextOccurrence(rule, new Date()).toISOString(),
    () => serverIso,
  );
}

/** The visitor's own IANA zone, or null on the server. */
export function useVisitorTimeZone(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
    () => null,
  );
}
