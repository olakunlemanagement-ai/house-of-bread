import { newsletterCopy } from "@/lib/content/copy";
import type { NewsletterSource } from "@/lib/newsletter/schema";
import { IconTile } from "./icons";
import { LoopVideo } from "./LoopVideo";
import { NewsletterForm } from "./NewsletterForm";

// Flat section tints since the reset. No gradients.
const tint = {
  gold: "bg-surface-warm",
  mint: "bg-surface-mint",
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
 * The signup card: a solid card inset in a framed panel of still bread
 * steam, on a cream or pale green band, with the primary button. Never a
 * green band. data-newsletter marks every signup form.
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
      className={surface === "gold" ? tint.gold : tint.mint}
    >
      <div className="container-page py-20 md:py-30">
        {/* Still bread steam in a framed panel, the solid card inset over it. */}
        <div className="reveal relative overflow-hidden rounded-card border border-border shadow-soft">
          <LoopVideo id="bread-steam" still fill sizes="(min-width: 1280px) 1200px, 100vw" />
          <div className="relative p-3 sm:p-6 lg:p-10">
            <div className="grid gap-10 rounded-card border border-border bg-surface-raised p-6 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-12">
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
