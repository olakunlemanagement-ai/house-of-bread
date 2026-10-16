import { Leaves } from "./Decor";
import { IconTile } from "./icons";
import type { NewsletterSource } from "@/lib/newsletter/schema";
import { NewsletterForm } from "./NewsletterForm";

type NewsletterBandProps = {
  idPrefix: string;
  heading?: string;
  text?: string;
  source?: NewsletterSource;
};

/** Full width green band with the signup form. Closes most pages. */
export function NewsletterBand({
  idPrefix,
  heading = "Never miss a session",
  text = "Teaching, new reading plans and live session reminders, sent to your inbox.",
  source = "footer",
}: NewsletterBandProps) {
  const headingId = `${idPrefix}-heading`;
  return (
    <section aria-labelledby={headingId} className="tone-green bg-green-band relative overflow-hidden">
      <Leaves className="-left-10 -top-8 size-64 opacity-[0.06]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <div>
          <IconTile name="mail" size="lg" />
          <span aria-hidden="true" className="mt-6 block h-1 w-12 rounded-full bg-lime" />
          <h2 id={headingId} className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-on-green">{text}</p>
        </div>
        <NewsletterForm idPrefix={idPrefix} source={source} tone="green" />
      </div>
    </section>
  );
}
