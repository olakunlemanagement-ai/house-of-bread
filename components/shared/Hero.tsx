import { ButtonLink } from "./Button";
import { LoopVideo } from "./LoopVideo";

/**
 * Home hero: one statement, one line, one primary button. The ambient light
 * loop plays behind ink type under a white scrim (night in dark), checked
 * against its darkest frame (brightest in dark), as logged in
 * docs/PLACEHOLDERS.md. From lg the scrim eases off to the right, where no
 * text sits. It stands in until the photo of Isaac Ola teaching arrives.
 * The sticky header sits above, so the top padding is clear space only.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-x-clip bg-surface">
      <LoopVideo id="ambient-light" fill priority sizes="100vw" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-(--scrim) lg:bg-transparent lg:[background-image:linear-gradient(to_right,var(--scrim)_0%,var(--scrim)_60%,var(--scrim-soft)_100%)]"
      />
      <div className="container-page relative z-10 pb-20 pt-16 sm:pt-20 lg:pb-32 lg:pt-28">
        <div className="max-w-4xl">
          <h1 id="hero-heading" className="text-statement">
            Understand the Bible you&apos;ve been reading.
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-ink-muted sm:text-xl sm:leading-relaxed">
            Free courses and teaching that bring you into an accurate understanding of God&apos;s Word,
            and a real encounter with Him.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/academy" className="w-full sm:w-auto">
              Browse free courses
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
