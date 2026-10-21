import type { Metadata } from "next";
import { Suspense } from "react";
import { AppBand } from "@/components/shared/AppBand";
import { IconTile, type IconName } from "@/components/shared/icons";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section, SectionHeader } from "@/components/shared/Section";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { SignupError } from "./SignupError";
import { SourcedSubscribeForm, SubscribeForm } from "./SubscribeForm";

export const metadata: Metadata = {
  title: "Join the newsletter",
  description:
    "Live session reminders, new teaching and news from House of Bread Global, sent to your inbox.",
};

const expect: { icon: IconName; text: string }[] = [
  { icon: "bell", text: "Reminders before live sessions." },
  { icon: "scroll", text: "New teaching and journeys." },
  { icon: "globe", text: "Occasional news from the ministry." },
];

export default function SubscribePage({ searchParams }: PageProps<"/subscribe">) {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Newsletter"
        title="Stay close to the ministry"
        lead="Reminders before each live session, new teaching and news from House of Bread Global, sent to your inbox. No spam, and you can leave at any time."
      />

      <section id="signup" data-newsletter aria-labelledby="signup-heading" className="scroll-mt-6 bg-surface">
        <div className="container-page grid gap-8 py-18 md:py-24 lg:grid-cols-12 lg:gap-10">
          <div className="rounded-card border border-border bg-surface p-6 shadow-raised sm:p-10 lg:col-span-7">
            <h2 id="signup-heading" className="mb-8 text-3xl">
              Subscribe
            </h2>
            <Suspense fallback={null}>
              <SignupError searchParams={searchParams} />
            </Suspense>
            <Suspense fallback={<SubscribeForm />}>
              <SourcedSubscribeForm searchParams={searchParams} />
            </Suspense>
          </div>

          <aside
            aria-labelledby="expect-heading"
            className="rounded-card bg-surface-mint p-6 sm:p-10 lg:col-span-5"
          >
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
        </div>
      </section>

      <Section
        id="follow"
        title="Follow the ministry"
        intro="Live sessions stream on YouTube, and the ministry shares teaching on its social pages."
        tone="warm"
      >
        <SocialLinks />
      </Section>

      <AppBand idPrefix="subscribe-app" action={{ href: "/app", label: "Get the app" }} />
    </main>
  );
}
