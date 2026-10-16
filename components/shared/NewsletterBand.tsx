import { newsletterCopy } from "@/lib/content/copy";
import type { NewsletterSource } from "@/lib/newsletter/schema";
import { Grain, Leaves } from "./Decor";
import { IconTile } from "./icons";
import { NewsletterForm } from "./NewsletterForm";

type NewsletterBandProps = {
  idPrefix: string;
  heading?: string;
  text?: string;
  source?: NewsletterSource;
};

/** Green band with the signup form: white inputs, lime button. Closes most pages. */
export function NewsletterBand({
  idPrefix,
  heading = newsletterCopy.heading,
  text = newsletterCopy.text,
  source = "footer",
}: NewsletterBandProps) {
  const headingId = `${idPrefix}-heading`;
  return (
    <section aria-labelledby={headingId} className="tone-green bg-green-band relative overflow-hidden">
      <Grain />
      <Leaves className="-left-10 -top-8 size-64 opacity-[0.06]" />
      <div className="container-page relative grid gap-10 py-18 md:py-28 lg:grid-cols-12 lg:items-start lg:gap-14">
        <div className="reveal lg:col-span-5">
          <IconTile name="mail" size="lg" />
          <span aria-hidden="true" className="mt-7 block h-1 w-12 rounded-full bg-lime" />
          <h2 id={headingId} className="mt-5 text-h2">
            {heading}
          </h2>
          <p className="mt-5 max-w-md text-lead text-on-green">{text}</p>
        </div>
        <div className="reveal rounded-card border border-green-rich bg-green-deep/60 p-6 shadow-raised sm:p-8 lg:col-span-7">
          <NewsletterForm idPrefix={idPrefix} source={source} tone="green" />
        </div>
      </div>
    </section>
  );
}
