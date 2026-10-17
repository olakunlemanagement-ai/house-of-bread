import type { Route } from "next";
import type { ReactNode } from "react";
import type { EventData } from "@/lib/content/schemas";
import type { PlainHref } from "./Button";
import { TextCTA } from "./TextCTA";

/**
 * The announcement bar itself. Gold is the live colour: gold while a session
 * is live (ink 9.02:1), gold-soft when one starts within 24 hours (ink
 * 11.85:1). Muted text is pinned to ink, because ink-muted fails on gold.
 */
export function AnnouncementBarView({
  kind,
  event,
  when,
}: {
  kind: "live" | "soon";
  event: EventData;
  when?: ReactNode;
}) {
  const href = event.youtubeUrl ?? `/events/${event.slug}`;
  return (
    <div className={`text-ink [--fg-muted:var(--ink)] ${kind === "live" ? "bg-gold" : "bg-gold-soft"}`}>
      <p className="container-page flex min-h-11 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-sm font-semibold sm:text-base">
        <span className="inline-flex flex-wrap items-center justify-center gap-x-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-ink" />
          {kind === "live" ? (
            <>Live now: {event.title}.</>
          ) : (
            // TODO: confirm wording with the ministry. The pack gives only the live wording.
            <>
              Coming up: {event.title}
              {when ? <>, {when}</> : null}.
            </>
          )}
        </span>
        {/* Light TextCTA: emerald-deep label on gold 4.19:1 is large text only, so pin it to ink. */}
        <TextCTA
          href={href as Route | PlainHref}
          className="min-h-9 [--cta-arrow:var(--ink)] [--cta-chip-border:var(--ink)] [--cta-label:var(--ink)] [--cta-chip-hover-bg:var(--ink)] [--cta-arrow-hover:var(--gold-soft)]"
        >
          Watch on YouTube
        </TextCTA>
      </p>
    </div>
  );
}
