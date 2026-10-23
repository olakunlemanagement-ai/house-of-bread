import { newsletterCopy } from "@/lib/content/copy";
import type { NewsletterSource } from "@/lib/newsletter/schema";
import { IconTile } from "./icons";
import { LoopVideo } from "./LoopVideo";
import { NewsletterForm } from "./NewsletterForm";

// Radial tints behind the translucent card. No blur filter.
const tint = {
  gold: "[background-image:radial-gradient(40rem_22rem_at_15%_30%,var(--surface-gold),transparent_70%),radial-gradient(36rem_22rem_at_90%_80%,var(--surface-mint),transparent_70%)]",
  mint: "[background-image:radial-gradient(40rem_22rem_at_15%_30%,var(--surface-mint),transparent_70%),radial-gradient(36rem_22rem_at_90%_80%,var(--tint),transparent_70%)]",
};

type NewsletterCardProps = {
  idPrefix: string;
  heading?: string;
  text?: string;
  source?: NewsletterSource;
  /** The tint behind the card. Gold by default, mint where gold sits next to a live state. */
  surface?: "gold" | "mint";
};

/**
 * The closing signup: a translucent white card inset in a framed panel of
 * warm bread steam (a poster only on phones), on soft gold or mint radial
 * tints, with an emerald button. Never a green band. data-newsletter lets
 * the footer hide its own "Stay close to the ministry" strip on pages that
 * already end with this card.
 */
export function NewsletterCard({
  idPrefix,
  heading = newsletterCopy.heading,
  text = newsletterCopy.text,
  source = "footer",
  surface = "gold",
}: NewsletterCardProps) {
  const headingId = `${idPrefix}-heading`;
  return (
    <section
      data-newsletter
      aria-labelledby={headingId}
      className={`bg-surface ${surface === "gold" ? tint.gold : tint.mint}`}
    >
      <div className="container-page py-20 md:py-30">
        {/* Warm bread steam in a framed panel, the glass card inset over it. */}
        <div className="reveal relative overflow-hidden rounded-card border border-border shadow-soft">
          <LoopVideo id="bread-steam" fill sizes="(min-width: 1280px) 1200px, 100vw" />
          <div className="relative p-3 sm:p-6 lg:p-10">
            <div className="glass-card grid gap-10 rounded-card border border-(--glass-border) p-6 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-12">
              <div className="lg:col-span-5">
                <IconTile name="mail" size="lg" />
                <h2 id={headingId} className="mt-6 text-h2">
                  {heading}
                </h2>
                <p className="mt-4 max-w-md text-lead text-ink-muted">{text}</p>
              </div>
              <div className="lg:col-span-7 lg:pt-2">
                <NewsletterForm idPrefix={idPrefix} source={source} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
