import Link from "next/link";
import { siteConfig, YOUTUBE_CHANNEL_ID } from "@/lib/site-config";
import { Button, ButtonLink } from "./Button";
import { Icon, IconTile } from "./icons";
import { Placeholder } from "./Placeholder";
import { SessionTimes, SessionWhen } from "./SessionTimes";

export const WEEKLY_SESSION_TITLE = "Weekly live teaching";

/**
 * The next weekly live session, from siteConfig.liveSession: its date and
 * time in the visitor's zone with the ministry's beside it, the actions,
 * and below them "Session times by region" as part of the same card.
 * Same frame as LiveSessionCard.
 */
export function WeeklySessionCard({
  serverIso,
  idPrefix,
  linkTitle = true,
}: {
  /** The cached next occurrence (getNextLiveSession). */
  serverIso: string;
  idPrefix: string;
  /** Home links the title to /events. On /events itself it is plain text. */
  linkTitle?: boolean;
}) {
  const rule = siteConfig.liveSession;
  const calendarNote = `${idPrefix}-calendar-note`;
  return (
    <article className="overflow-hidden rounded-card border border-border bg-surface shadow-raised">
      <div className="grid lg:grid-cols-12">
        <div className="flex flex-col justify-between gap-8 bg-surface-mint p-6 sm:p-8 lg:col-span-4">
          <div className="flex flex-wrap items-center gap-3">
            <IconTile name="live" />
            <p className="eyebrow">Every Monday</p>
          </div>
          <p className="flex items-start gap-2 text-ink">
            <Icon name="clock" className="mt-1 size-5 shrink-0 text-emerald" />
            <span>
              <SessionWhen rule={rule} serverIso={serverIso} />
            </span>
          </p>
        </div>
        <div className="p-6 sm:p-8 lg:col-span-8">
          <h3 className="text-3xl leading-tight">
            {linkTitle ? (
              <Link href="/events" className="rounded hover:text-emerald-deep">
                {WEEKLY_SESSION_TITLE}
              </Link>
            ) : (
              WEEKLY_SESSION_TITLE
            )}
          </h3>
          <p className="mt-2 text-ink-muted">
            {rule.durationMinutes === null ? (
              <Placeholder>[DURATION TO BE SUPPLIED]</Placeholder>
            ) : (
              <>{rule.durationMinutes} minutes</>
            )}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/subscribe" arrow className="w-full sm:w-auto">
              Set a reminder
            </ButtonLink>
            <ButtonLink
              href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/live`}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Watch on YouTube
            </ButtonLink>
            {/* TODO: a weekly .ics generated at build time (follow up). */}
            <Button variant="secondary" disabled aria-describedby={calendarNote} className="w-full sm:w-auto">
              <Icon name="calendar" className="size-5" />
              Add to calendar
            </Button>
          </div>
          <p id={calendarNote} className="mt-4 text-sm text-ink-muted">
            <Placeholder>[CALENDAR FILE TO COME]</Placeholder>
          </p>
        </div>
      </div>
      <div className="border-t border-border p-6 sm:p-8">
        <SessionTimes rule={rule} serverIso={serverIso} headingId={`${idPrefix}-region-times`} />
      </div>
    </article>
  );
}
