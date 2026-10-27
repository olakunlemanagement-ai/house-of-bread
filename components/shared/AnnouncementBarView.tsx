import type { Route } from "next";
import type { ReactNode } from "react";
import type { EventData } from "@/lib/content/schemas";
import { ButtonLink, type PlainHref } from "./Button";

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
    <div className={`text-on-gold [--fg-muted:var(--on-gold)] ${kind === "live" ? "bg-gold" : "bg-gold-soft"}`}>
      <p className="container-page flex min-h-11 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-sm font-semibold sm:text-base">
        <span className="inline-flex flex-wrap items-center justify-center gap-x-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-on-gold" />
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
        {/* An outline button pinned to ink: emerald-deep on gold 4.19:1 is large text only. */}
        <ButtonLink
          href={href as Route | PlainHref}
          variant="secondary"
          size="sm"
          className="border-on-gold! text-on-gold! hover:bg-gold-soft! active:bg-gold-soft!"
        >
          Watch on YouTube
        </ButtonLink>
      </p>
    </div>
  );
}
