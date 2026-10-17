import { newsletterCopy } from "@/lib/content/copy";
import type { NewsletterSource } from "@/lib/newsletter/schema";
import { IconTile } from "./icons";
import { NewsletterForm } from "./NewsletterForm";

type NewsletterCardProps = {
  idPrefix: string;
  heading?: string;
  text?: string;
  source?: NewsletterSource;
  /** Card colour. Gold by default, mint where gold sits next to a live state. */
  surface?: "gold" | "mint";
};

/**
 * The closing signup: a light rounded card with an emerald button, not a
 * green band. data-newsletter lets the footer hide its own "Stay close to
 * the ministry" strip on pages that already end with this card.
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
    <section data-newsletter aria-labelledby={headingId} className="bg-surface">
      <div className="container-page py-18 md:py-28">
        <div
          className={`reveal grid gap-10 rounded-card border border-border p-6 shadow-soft sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-14 ${
            surface === "gold" ? "bg-surface-gold" : "bg-surface-mint"
          }`}
        >
          <div className="lg:col-span-5">
            <IconTile name="mail" size="lg" />
            <h2 id={headingId} className="mt-7 text-h2">
              {heading}
            </h2>
            <p className="mt-5 max-w-md text-lead text-ink-muted">{text}</p>
          </div>
          <div className="lg:col-span-7 lg:pt-2">
            <NewsletterForm idPrefix={idPrefix} source={source} />
          </div>
        </div>
      </div>
    </section>
  );
}
