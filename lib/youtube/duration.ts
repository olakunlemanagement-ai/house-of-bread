// Video durations. The YouTube Data API gives ISO 8601 durations ("PT28M14S").
// Without the API there is no duration at all, and nothing shows: a badge is
// never a guess. Framework free.

const ISO_DURATION = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

/** Seconds from an ISO 8601 duration, or null when it is missing, malformed or zero (a live stream). */
export function parseIsoDuration(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const match = ISO_DURATION.exec(value.trim());
  if (!match || value.trim() === "P" || value.trim() === "PT") return null;
  const [days, hours, minutes, seconds] = match.slice(1).map((part) => Number(part ?? 0));
  const total = days * 86400 + hours * 3600 + minutes * 60 + seconds;
  return Number.isFinite(total) && total > 0 ? total : null;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "4:05", "28:14" or "1:02:03". */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rest = s % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(rest)}` : `${m}:${pad(rest)}`;
}

/** The same duration in words, for screen readers: "28 minutes 14 seconds". */
export function durationInWords(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const parts: [number, string][] = [
    [Math.floor(s / 3600), "hour"],
    [Math.floor((s % 3600) / 60), "minute"],
    [s % 60, "second"],
  ];
  return parts
    .filter(([n]) => n > 0)
    .map(([n, unit]) => `${n} ${unit}${n === 1 ? "" : "s"}`)
    .join(" ");
}
