import { Suspense } from "react";
import { IconTile, type IconName } from "@/components/shared/icons";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { bandClass, SectionHeader } from "@/components/shared/Section";
import type { NewsletterSource } from "@/lib/newsletter/schema";
import { SignupError } from "./SignupError";

export type ExpectItem = { icon: IconName; text: string };

/**
 * The signup card, and on the Academy waitlist the "What to expect" panel,
 * shared by /subscribe and /subscribe/academy. The source is fixed per page and posted as a hidden
 * field, so the tag is right with or without JavaScript.
 */
export function SignupSection({
  source,
  idPrefix,
  expect,
  searchParams,
}: {
  source: NewsletterSource;
  idPrefix: string;
  /** The "What to expect" panel. Left out on /subscribe, whose lead says it all. */
  expect?: ExpectItem[];
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <section id="signup" data-newsletter aria-labelledby="signup-heading" className="scroll-mt-6 bg-surface">
      <div className={`${bandClass} grid gap-8 lg:grid-cols-12 lg:gap-10`}>
        <div className="rounded-card border border-border bg-surface-raised p-6 shadow-soft sm:p-10 lg:col-span-7">
          <h2 id="signup-heading" className="mb-8 text-3xl">
            Subscribe
          </h2>
          <Suspense fallback={null}>
            <SignupError searchParams={searchParams} />
          </Suspense>
          <NewsletterForm idPrefix={idPrefix} source={source} withLiveNotify consent="short" />
        </div>

        {expect ? (
          <aside aria-labelledby="expect-heading" className="rounded-card bg-surface-mint p-6 sm:p-10 lg:col-span-5">
            <SectionHeader id="expect-heading" size="compact" as="h2">
              What to expect
            </SectionHeader>
            <ul className="mt-8 space-y-5">
              {expect.map((item) => (
                <li key={item.text} className="flex items-center gap-4 text-lg text-ink">
                  <IconTile name={item.icon} />
                  {item.text}
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
