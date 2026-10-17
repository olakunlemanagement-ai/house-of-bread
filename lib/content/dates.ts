/** "17 October 2026" from "2026-10-17". UTC, so the build machine's zone never shifts the day. */
export function formatContentDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${isoDate}T00:00:00Z`),
  );
}
