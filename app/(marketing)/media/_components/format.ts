import type { Route } from "next";
import type { Series } from "@/lib/youtube/catalog";

// Dates in the ministry's own style, fixed to UTC so server and browser agree.
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatVideoDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** "6 teachings", "1 teaching", or "15+ teachings" when a feed's cap was reached. */
export function teachingCount(series: Series): string {
  const n = series.episodes.length;
  if (series.countIsMinimum) return `${n}+ teachings`;
  return `${n} ${n === 1 ? "teaching" : "teachings"}`;
}

export const watchHref = (id: string) => `/media/watch/${id}` as Route;
export const seriesHref = (id: string) => `/media/series/${id}` as Route;
