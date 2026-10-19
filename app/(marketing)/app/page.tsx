import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { HeroVisual } from "@/components/shared/HeroVisual";
import { IconTile, type IconName } from "@/components/shared/icons";
import { FeatureList } from "@/components/shared/Lists";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { ImageSlot } from "@/components/shared/ImageSlot";
import { Section, SectionHeader } from "@/components/shared/Section";
import { StoreButtons } from "@/components/shared/StoreButtons";
import { appAudience } from "@/lib/content/copy";

export const metadata: Metadata = {
  title: "The official House of Bread app",
  description:
    "The official app of House of Bread Global. New Testament journeys, every book introduced, six translations and the ministry's teaching, on your phone.",
};

const features: { id: string; title: string; icon: IconName; text: string; screen: string }[] = [
  {
    id: "journeys",
    title: "New Testament journeys",
    icon: "route",
    text: "Three guided routes through the New Testament, in the order the books were written. Progress is tracked automatically. Open the app and continue exactly where the last session ended.",
    screen: "a journey's daily reading and progress",
  },
  {
    id: "books",
    title: "Every book introduced",
    icon: "scroll",
    text: "Twenty-seven books, each with a written introduction covering who wrote it, who received it, the central argument, the themes and where it sits in Scripture.",
    screen: "a book introduction",
  },
  {
    id: "translations",
    title: "Six translations",
    icon: "book",
    text: "Comparing translations is one of the simplest ways to see what a passage is actually saying. The King James Version is the default text, and versions switch without losing your place.",
    screen: "switching between translations",
  },
  {
    id: "teaching",
    title: "The ministry's teaching",
    icon: "compass",
    text: "A growing library of written teaching on doctrine, interpretation and the questions believers actually ask.",
    screen: "the teaching library",
  },
];

export default function AppPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="The official app"
        title="The official House of Bread app"
        lead="Bible study, trusted teaching and practical guidance all in one place. Equipping you for a deeper understanding of God's Word and a stronger walk with Him."
        actions={
          <div className="flex w-full flex-col gap-4">
            <StoreButtons confirmLabel="CONFIRM" />
            <p>
              <ButtonLink href="#inside" variant="secondary" className="w-full sm:w-auto">
                See what is inside
              </ButtonLink>
            </p>
          </div>
        }
        visual={<HeroVisual showSession={false} />}
      />

      <div id="inside">
        {features.map((feature, index) => {
          const flip = index % 2 === 1;
          return (
            <section
              key={feature.id}
              id={feature.id}
              aria-labelledby={`${feature.id}-heading`}
              className={flip ? "bg-surface-warm" : "bg-surface"}
            >
              <div className="container-page reveal grid items-center gap-10 py-18 md:py-28 lg:grid-cols-12 lg:gap-16">
                <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                  <IconTile name={feature.icon} size="lg" />
                  <div className="mt-7">
                    <SectionHeader id={`${feature.id}-heading`}>{feature.title}</SectionHeader>
                  </div>
                  <p className="mt-6 max-w-xl text-lead text-ink">{feature.text}</p>
                </div>
                <ImageSlot
                  className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}
                  kind="screenshot"
                  brief={feature.screen}
                />
              </div>
            </section>
          );
        })}
      </div>

      <Section id="daily" title="Built for daily use">
        <FeatureList
          items={[
            { icon: "book", text: "Clean, distraction-free reading" },
            { icon: "swipe", text: "Swipe navigation between chapters" },
            { icon: "type", text: "Readable typography for long sessions" },
            { icon: "signal", text: "Works on modest devices and modest data" },
          ]}
        />
      </Section>

      <Section id="for" title="Who it is for" tone="mint">
        <FeatureList items={appAudience} />
      </Section>

      <NewsletterCard idPrefix="app-newsletter" heading="Hear about new features and sessions" />
    </main>
  );
}
