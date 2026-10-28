import { ButtonLink } from "./Button";
import { HeroBackdrop, heroBodyClass, heroFrameClass } from "./HeroBackdrop";

/**
 * Home hero: one statement, one line, two buttons, filling the first
 * screen with the header over its top (heroFrameClass). The ambient light
 * loop plays behind ink type (HeroBackdrop), and on phones too, from its
 * phone crop. It stands in until the photo of Isaac Ola teaching arrives.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className={heroFrameClass}>
      <HeroBackdrop loop="ambient-light" phone hold={70} />
      <div className={`${heroBodyClass} flex flex-col justify-center`}>
        <div data-hero-text className="max-w-4xl">
          <h1 id="hero-heading" className="text-statement">
            Understand the Bible you&apos;ve been reading.
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-ink-muted sm:text-xl sm:leading-relaxed">
            Courses and teaching that bring you into an accurate understanding of God&apos;s Word,
            and a real encounter with Him.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/academy" className="w-full sm:w-auto">
              Browse courses
            </ButtonLink>
            <ButtonLink href="#teachings" variant="secondary" className="w-full sm:w-auto">
              Watch the latest teaching
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
