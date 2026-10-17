import type { DatedEvent } from "@/lib/content/events";
import { ButtonLink } from "./Button";
import { TextCTA } from "./TextCTA";
import { HeroVisual } from "./HeroVisual";
import { RegionChips } from "./RegionChips";

/**
 * Home hero. White with two soft emerald radial tints, ink type and an
 * emerald accent phrase. The header floats over this section, so the top
 * padding is its 72px plus 64px or more of clear space above the eyebrow.
 */
export function Hero({ nextEvent }: { nextEvent?: DatedEvent }) {
  return (
    <section aria-labelledby="hero-heading" className="bg-hero-tint relative overflow-x-clip">
      <div className="container-page relative grid items-center gap-12 pb-16 pt-38 sm:pt-42 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-46">
        <div className="lg:col-span-7">
          <p className="rise eyebrow eyebrow-dot">House of Bread Global</p>
          <h1 id="hero-heading" className="rise-text rise-1 mt-6 text-display">
            Come and be fed <span className="text-emerald-deep">by the Word.</span>
          </h1>
          <p className="rise rise-2 mt-6 max-w-xl text-lead text-ink-muted">
            A global teaching ministry serving believers across the United Kingdom, Africa and the
            United States, through live teaching, House of Bread Academy, written teaching and the
            official House of Bread app.
          </p>
          <div className="rise rise-3 mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/events" arrow className="w-full sm:w-auto">
              Join the next live session
            </ButtonLink>
            <ButtonLink href="/app" variant="secondary" className="w-full sm:w-auto">
              Get the official app
            </ButtonLink>
          </div>
          <p className="rise rise-3 mt-4">
            <TextCTA href="/academy">Explore the Academy</TextCTA>
          </p>
          <div className="rise rise-4 mt-10 space-y-5">
            <RegionChips />
            <p className="eyebrow tracking-[0.32em] [--fg-accent:var(--ink-muted)]">Study . Pray . Grow</p>
          </div>
        </div>

        {/* Rises without fading: on desktop this may be the largest element, so it paints at once. */}
        <div className="rise-text rise-4 relative lg:col-span-5">
          <HeroVisual nextEvent={nextEvent} />
        </div>
      </div>
    </section>
  );
}
