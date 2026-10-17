import type { DatedEvent } from "@/lib/content/placeholder-data";
import { ButtonLink } from "./Button";
import { TextCTA } from "./TextCTA";
import { CrossWatermark, CurveEdge, Grain, Leaves } from "./Decor";
import { HeroVisual } from "./HeroVisual";
import { RegionChips } from "./RegionChips";

/**
 * Home hero. Rich green gradient with grain, watermark and leaves. The visual
 * hangs below the curved edge on desktop, into the white page.
 */
export function Hero({ nextEvent }: { nextEvent?: DatedEvent }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="tone-green bg-green-hero relative overflow-x-clip"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <Grain />
        <CrossWatermark className="-left-10 bottom-10 h-[26rem] w-72 opacity-[0.05] lg:left-auto lg:right-[42%] lg:top-10" />
        <Leaves className="-bottom-8 left-1/3 size-72 opacity-[0.06]" />
      </div>

      <div className="container-page relative grid items-center gap-8 pb-36 pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-12 lg:pb-40 lg:pt-24">
        <div className="lg:col-span-7">
          {/* White in a 12% white pill at the dark top left of the gradient (7.41:1). */}
          <p className="rise">
            <span className="eyebrow eyebrow-pill">House of Bread Global</span>
          </p>
          <h1 id="hero-heading" className="rise-text rise-1 mt-5 text-display">
            Come and be fed{" "}
            {/* Lime-bright on its own line, so it stays on the green-rich end (6.45:1). */}
            <span className="block whitespace-nowrap text-lime-bright">by the Word.</span>
          </h1>
          <p className="rise rise-2 mt-7 max-w-2xl text-lead text-on-green">
            A global teaching ministry serving believers across the United Kingdom, Africa and the
            United States, through live teaching, House of Bread Academy, written teaching and the
            official House of Bread app.
          </p>
          <div className="rise rise-3 mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/events" tone="green" arrow className="w-full sm:w-auto">
              Join the next live session
            </ButtonLink>
            <ButtonLink href="/app" tone="green" variant="secondary" className="w-full sm:w-auto">
              Get the official app
            </ButtonLink>
          </div>
          <p className="rise rise-3 mt-4">
            <TextCTA href="/academy">Explore the Academy</TextCTA>
          </p>
          <div className="rise rise-4 mt-10 space-y-5">
            <RegionChips />
            <p className="eyebrow tracking-[0.4em]">Study . Pray . Grow</p>
          </div>
        </div>

        {/* Rises without fading: on desktop this may be the largest element, so it paints at once. */}
        <div className="rise-text rise-4 relative z-10 lg:col-span-5 lg:translate-y-52 lg:self-end">
          <HeroVisual nextEvent={nextEvent} />
        </div>
      </div>

      <CurveEdge />
    </section>
  );
}
