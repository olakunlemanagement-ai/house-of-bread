import type { DatedEvent } from "@/lib/content/events";
import { IconTile } from "./icons";
import { LocalTime } from "./LocalTime";
import { PhoneFrame } from "./PhoneFrame";
import { Placeholder } from "./Placeholder";

const floating = "tone-light absolute z-10 rounded-tile border border-border bg-surface p-4 shadow-raised";

/**
 * Hero visual: a CSS phone with two floating cards. Illustrative, not a
 * screenshot and not live data, except that the session card shows the next
 * real session once one is dated. The lime glow sits here, behind the
 * phone, and never behind lime text.
 */
export function HeroVisual({
  nextEvent,
  showSession = true,
}: {
  nextEvent?: DatedEvent;
  /** The app page shows only the progress card. */
  showSession?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={
        showSession
          ? "Illustration of the official House of Bread app, with a card for the next live session and a 30 Day NT Journey progress card"
          : "Illustration of the official House of Bread app, with a 30 Day NT Journey progress card"
      }
      className="relative mx-auto w-full max-w-[26rem] py-6"
    >
      <div
        aria-hidden="true"
        className="hero-glow drift pointer-events-none absolute left-1/2 top-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full lg:size-[34rem]"
      />
      <div aria-hidden="true" className="relative">
        <PhoneFrame className="mx-auto" />

        {showSession ? (
          // Illustrative card overlapping the phone's left edge.
          <div className={`${floating} left-0 top-12 w-44 sm:-left-6 sm:w-56`}>
            <div className="flex items-center gap-2">
              <IconTile name="live" size="sm" />
              <p className="eyebrow leading-tight">Next live session</p>
            </div>
            {nextEvent ? (
              <>
                <p className="mt-3 font-serif text-base font-semibold leading-snug text-emerald-deep">
                  {nextEvent.title}
                </p>
                <p className="mt-1 text-xs leading-snug text-ink-muted">
                  {nextEvent.timeZone ? (
                    <LocalTime iso={nextEvent.startsAtUtc} timeZone={nextEvent.timeZone} />
                  ) : null}
                </p>
              </>
            ) : (
              <p className="mt-3 text-xs leading-snug">
                <Placeholder>[DATE AND TIME TO BE SUPPLIED]</Placeholder>
              </p>
            )}
          </div>
        ) : null}

        {/* Illustrative progress card overlapping the phone's lower right. */}
        <div className={`${floating} bottom-10 right-0 w-48 sm:-right-4 sm:w-56`}>
          <p className="font-serif text-base font-semibold leading-snug text-emerald-deep">30 Day NT Journey</p>
          <p className="mt-1 text-sm text-ink-muted">Day 1 of 30</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-mint">
            <div className="h-full w-[8%] rounded-full bg-emerald" />
          </div>
        </div>
      </div>
    </div>
  );
}
