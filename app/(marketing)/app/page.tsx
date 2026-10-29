import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/shared/Button";
import { NEXT_STEP_COURSES, NextStep } from "@/components/shared/NextStep";
import { NumberedList } from "@/components/shared/NumberedList";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { StoreButtons } from "@/components/shared/StoreButtons";

export const metadata: Metadata = {
  title: "Take the Word with you",
  description:
    "The official House of Bread app: daily reading and journeys through the New Testament, every book introduced, six translations and the ministry's teaching, in your pocket.",
};

// CONTENT-PACK section 3, shortened to one line each.
const features = [
  {
    title: "New Testament journeys",
    text: "Three guided routes of 30, 60 and 90 days, in the order the books were written. Progress is tracked for you.",
  },
  {
    title: "Every book introduced",
    text: "Who wrote it, who received it, the central argument, the themes and where it sits in Scripture.",
  },
  {
    title: "Six translations",
    text: "The King James Version by default, and versions switch without losing your place.",
  },
  {
    title: "The ministry's teaching",
    text: "Written teaching on doctrine, interpretation and the questions believers actually ask.",
  },
  {
    title: "Made for modest phones",
    text: "Clean reading that works on modest devices and modest data.",
  },
];

/**
 * The App page, per docs/RESET-BRIEF.md section 5: "Take the Word with
 * you.", the features as a short numbered list, then the next step to the
 * Academy. Store badges show as marked placeholders until the app
 * developer supplies the links. The journeys and book introductions stay
 * one link away, in a sentence.
 */
export default function AppPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="green-mesh"
        eyebrow="The app"
        title="Take the Word with you."
        lead="Daily reading and journeys through the New Testament, in your pocket."
        actions={<StoreButtons confirmLabel="CONFIRM" />}
      />

      <Section id="inside" title="What's in the app?">
        <NumberedList items={features} />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
          See the{" "}
          <Link href="/plans" className="link-inline">
            three journeys
          </Link>{" "}
          and the{" "}
          <Link href="/new-testament" className="link-inline">
            New Testament books
          </Link>{" "}
          before you download.
        </p>
      </Section>

      <NextStep title="Prefer to learn on the web?" text={NEXT_STEP_COURSES.text}>
        <ButtonLink href="/academy">Browse courses</ButtonLink>
      </NextStep>
    </main>
  );
}
