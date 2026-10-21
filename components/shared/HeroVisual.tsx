import { LocalTime } from "./LocalTime";
import { PhoneFrame } from "./PhoneFrame";
import { Placeholder } from "./Placeholder";

/** The session the floating card shows: on Home, the next weekly session. */
export type HeroSession = { title: string; startsAtUtc: string; timeZone: string | null };

// Translucent white over the hero tint and the phone. 84% keeps ink-muted
// above 4.5:1 even where the card overlaps the dark phone frame.
const floating = "glass-card absolute z-10 rounded-tile border border-(--glass-border) p-4";

/**
 * Hero visual: a CSS phone with two floating cards. Illustrative, not a
 * screenshot and not live data, except that the session card shows the next
 * next real session (on Home, the next weekly session). A soft emerald radial sits behind the
 * phone.
 */
export function HeroVisual({
  nextSession,
  showSession = true,
}: {
  nextSession?: HeroSession;
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
        className="pointer-events-none absolute left-1/2 top-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full [background-image:radial-gradient(closest-side,var(--halo),transparent)] lg:size-[30rem]"
      />
      <div aria-hidden="true" className="relative">
        <PhoneFrame className="mx-auto" />

        {showSession ? (
          // Illustrative card overlapping the phone's left edge.
          <div className={`${floating} left-0 top-12 w-44 sm:-left-6 sm:w-56`}>
            <div className="flex items-center gap-2">
              <p className="eyebrow eyebrow-dot leading-tight">Next live session</p>
            </div>
            {nextSession ? (
              <>
                <p className="mt-3 font-serif text-base font-semibold leading-snug text-emerald-deep">
                  {nextSession.title}
                </p>
                <p className="mt-1 text-xs leading-snug text-ink-muted">
                  {nextSession.timeZone ? (
                    <LocalTime iso={nextSession.startsAtUtc} timeZone={nextSession.timeZone} />
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
            <div className="h-full w-[8%] rounded-full bg-glyph" />
          </div>
        </div>
      </div>
    </div>
  );
}
