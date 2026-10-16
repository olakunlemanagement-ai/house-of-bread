import type { Metadata } from "next";
import { Icon, IconTile, type IconName } from "@/components/shared/icons";
import { FeatureList } from "@/components/shared/Lists";
import { NewsletterBand } from "@/components/shared/NewsletterBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { PhoneFrame } from "@/components/shared/PhoneFrame";
import { Section } from "@/components/shared/Section";
import { StoreButtons } from "@/components/shared/StoreButtons";

export const metadata: Metadata = {
  title: "The House of Bread app",
  description:
    "Bible study, trusted teaching and practical guidance all in one place. Reading plans, every New Testament book explained, and six translations.",
};

const features: { id: string; title: string; icon: IconName; text: string }[] = [
  {
    id: "study-plans",
    title: "Study plans",
    icon: "route",
    text: "Three guided routes through the New Testament, following the order the books were written. Progress is tracked automatically. Open the app and continue exactly where the last session ended.",
  },
  {
    id: "translations",
    title: "Six translations",
    icon: "book",
    text: "Comparing translations is one of the simplest ways to see what a passage is actually saying. Where one rendering is familiar, another often makes the meaning plain. The King James Version is the default text, and versions switch without losing your place.",
  },
  {
    id: "books",
    title: "Every book explained",
    icon: "scroll",
    text: "Twenty-seven books, each with a written introduction covering who wrote it, who received it, the central argument, the themes and where it sits in Scripture.",
  },
  {
    id: "articles",
    title: "Articles and teaching",
    icon: "compass",
    text: "A growing library of written teaching on doctrine, interpretation and the questions believers actually ask.",
  },
];

export default function AppPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="The app"
        title="The House of Bread app"
        lead="Bible study, trusted teaching and practical guidance all in one place. Equipping you for a deeper understanding of God's Word and a stronger walk with Him."
        actions={<StoreButtons confirmLabel="CONFIRM" />}
      />

      {features.map((feature, index) => {
        const flip = index % 2 === 1;
        return (
          <section
            key={feature.id}
            aria-labelledby={`${feature.id}-heading`}
            className={flip ? "bg-surface-tint" : "bg-surface"}
          >
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr] md:py-24">
              <div className={flip ? "md:order-2" : ""}>
                <IconTile name={feature.icon} size="lg" />
                <span aria-hidden="true" className="mt-6 block h-1 w-12 rounded-full bg-lime" />
                <h2 id={`${feature.id}-heading`} className="mt-4 text-3xl font-bold sm:text-4xl">
                  {feature.title}
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink">{feature.text}</p>
              </div>
              {index === 0 ? (
                <div className={`bg-green-hero rounded-3xl px-6 py-10 ${flip ? "md:order-1" : ""}`}>
                  <PhoneFrame />
                </div>
              ) : (
                <div
                  aria-hidden="true"
                  className={`bg-green-band relative hidden aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl md:flex ${
                    flip ? "md:order-1" : ""
                  }`}
                >
                  <Icon name={feature.icon} className="size-28 text-lime opacity-80" />
                </div>
              )}
            </div>
          </section>
        );
      })}

      <Section id="daily" title="Built for daily use">
        <FeatureList
          items={[
            "Clean, distraction-free reading",
            "Swipe navigation between chapters",
            "Readable typography for long sessions",
            "Works on modest devices and modest data",
          ]}
        />
      </Section>

      <Section id="for" title="Who it is for" tone="tint">
        <FeatureList
          items={[
            "New believers who want a structured way into the New Testament",
            "Readers who have started Bible plans before and stalled",
            "Students and teachers who want translation comparison without a desk full of books",
            "Anyone who wants to know the Scriptures rather than simply own one",
          ]}
        />
      </Section>

      <NewsletterBand idPrefix="app-newsletter" />
    </main>
  );
}
