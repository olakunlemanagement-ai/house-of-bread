import type { Metadata } from "next";
import { Suspense } from "react";
import { AppBand } from "@/components/shared/AppBand";
import { IconTile, type IconName } from "@/components/shared/icons";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { SignupError } from "./SignupError";

export const metadata: Metadata = {
  title: "Join the newsletter",
  description:
    "Teaching, new reading plans and live session reminders from House of Bread Global, sent to your inbox.",
};

const expect: { icon: IconName; text: string }[] = [
  { icon: "scroll", text: "New teaching and reading plans." },
  { icon: "live", text: "Reminders before live sessions." },
  { icon: "globe", text: "Occasional news from the ministry." },
];

export default function SubscribePage({ searchParams }: PageProps<"/subscribe">) {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Newsletter"
        title="Stay close to the teaching"
        lead="Teaching, new reading plans and reminders for live sessions, sent to your inbox. No spam, and you can leave at any time."
      />

      <section id="signup" aria-label="Signup" className="scroll-mt-24 bg-surface">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-10">
            <Suspense fallback={null}>
              <SignupError searchParams={searchParams} />
            </Suspense>
            <NewsletterForm
              idPrefix="subscribe"
              source="subscribe-page"
              withLiveNotify
              consent="short"
            />
          </div>

          <aside aria-labelledby="expect-heading" className="rounded-3xl bg-surface-tint p-6 sm:p-10">
            <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-lime" />
            <h2 id="expect-heading" className="mt-4 text-2xl font-bold">
              What to expect
            </h2>
            <ul className="mt-6 space-y-5">
              {expect.map((item) => (
                <li key={item.text} className="flex items-center gap-4 text-lg text-ink">
                  <IconTile name={item.icon} />
                  {item.text}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <AppBand idPrefix="subscribe-app" />
    </main>
  );
}
