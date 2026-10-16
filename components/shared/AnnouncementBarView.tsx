import type { ReactNode } from "react";
import type { PlaceholderEvent } from "@/lib/content/placeholder-data";
import { Icon } from "./icons";

/**
 * The announcement bar itself. Lime with deep green text (7.10:1). Muted
 * text is pinned to deep green too, because ink-muted fails on lime.
 */
export function AnnouncementBarView({
  kind,
  event,
  when,
}: {
  kind: "live" | "soon";
  event: PlaceholderEvent;
  when?: ReactNode;
}) {
  const href = event.youtubeUrl ?? `/events/${event.slug}`;
  return (
    <div className="bg-lime text-on-lime [--fg-muted:var(--on-lime)] [--fg:var(--on-lime)]">
      <p className="container-page flex min-h-11 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-sm font-semibold sm:text-base">
        <span className="inline-flex flex-wrap items-center justify-center gap-x-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-green" />
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
        <a href={href} className="inline-flex items-center gap-1 underline decoration-2 underline-offset-4">
          Watch on YouTube
          <Icon name="arrow-right" className="size-4" />
        </a>
      </p>
    </div>
  );
}
