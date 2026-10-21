"use client";

import { sessionTimeRegions } from "@/lib/content/copy";
import { timeIn, timesByRegion, type WeeklyRule } from "@/lib/schedule/weekly";
import { Flag } from "./Flags";
import { Icon } from "./icons";
import { LocalTime } from "./LocalTime";
import { useNextSession, useVisitorTimeZone } from "./useNextSession";

const dayFormat = (timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone });

type SessionTimesProps = {
  rule: WeeklyRule;
  /** The cached next occurrence from the server, ISO 8601 in UTC. */
  serverIso: string;
  headingId: string;
  /** h4 inside the session card, h3 when it stands alone. */
  headingLevel?: 3 | 4;
};

/**
 * "Session times by region": the next weekly session in each region's local
 * time. Rendered on the server, so every time shows without script. With
 * script, a "Your time" row is added in the visitor's own zone.
 * Ink and ink-muted on white hold 16.1 and 7.3:1 (scripts/check-contrast.mjs).
 */
export function SessionTimes({ rule, serverIso, headingId, headingLevel = 4 }: SessionTimesProps) {
  const iso = useNextSession(rule, serverIso);
  const visitorZone = useVisitorTimeZone();
  const instant = new Date(iso);
  const ministryDay = timeIn(instant, rule.timeZone).weekday;
  const rows = timesByRegion(instant, sessionTimeRegions);
  const yours = visitorZone ? timeIn(instant, visitorZone) : null;
  const Heading = headingLevel === 3 ? "h3" : "h4";

  return (
    <div>
      <Heading id={headingId} className={headingLevel === 3 ? "text-2xl leading-snug" : "text-xl leading-snug"}>
        Session times by region
      </Heading>
      <p className="mt-1 text-sm text-ink-muted">
        <time dateTime={iso}>{dayFormat(rule.timeZone).format(instant)}</time>, online from anywhere
      </p>
      <ul aria-labelledby={headingId} className="mt-4 grid gap-x-8 sm:grid-cols-2">
        {rows.map((row) => (
          <li key={row.timeZone} className="flex items-center gap-3 border-b border-border py-2.5">
            <Flag code={row.flag} className="w-6" />
            <span className="text-base text-ink">{row.name}</span>
            <span className="ml-auto whitespace-nowrap text-right text-base font-semibold tabular-nums text-ink">
              {row.time}
              {row.weekday === ministryDay ? null : (
                <span className="ml-1.5 text-sm font-normal text-ink-muted">{row.weekday}</span>
              )}
            </span>
          </li>
        ))}
        {yours ? (
          <li className="flex items-center gap-3 border-b border-border py-2.5 sm:col-span-2">
            <Icon name="clock" className="size-6 shrink-0 text-glyph" />
            <span className="text-base font-semibold text-emerald-deep">Your time</span>
            <span className="ml-auto whitespace-nowrap text-right text-base font-semibold tabular-nums text-ink">
              {yours.time}
              {yours.weekday === ministryDay ? null : (
                <span className="ml-1.5 text-sm font-normal text-ink-muted">{yours.weekday}</span>
              )}
            </span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

/** The next session's date and time, corrected by the visitor's clock. */
export function SessionWhen({ rule, serverIso }: { rule: WeeklyRule; serverIso: string }) {
  return <LocalTime iso={useNextSession(rule, serverIso)} timeZone={rule.timeZone} hour12 />;
}
