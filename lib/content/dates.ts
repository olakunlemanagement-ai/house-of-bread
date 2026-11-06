/** "17 October 2026" from "2026-10-17". UTC, so the build machine's zone never shifts the day. */
export function formatContentDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${isoDate}T00:00:00Z`),
  );
}

/**
 * A time zone as people say it: "Lagos time" from "Africa/Lagos", "New York
 * time" from "America/New_York", the city at the end of the IANA id. A zone
 * with no city ("UTC", "Etc/GMT+1") falls back to its short name, such as
 * "UTC" or "GMT-1".
 */
export function zoneName(timeZone: string): string {
  const city = /^(?:Africa|America|Antarctica|Asia|Atlantic|Australia|Europe|Indian|Pacific)\/(?:.+\/)?([^/]+)$/.exec(timeZone)?.[1];
  if (city) return `${city.replaceAll("_", " ")} time`;
  try {
    const part = new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "short" })
      .formatToParts(new Date(0))
      .find((item) => item.type === "timeZoneName");
    return part?.value ?? timeZone;
  } catch {
    return timeZone;
  }
}
