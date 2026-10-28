import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { academyCopy } from "@/lib/content/copy";
import { SignupSection, type ExpectItem } from "../SubscribeForm";

export const metadata: Metadata = {
  title: "Hear when the Academy opens",
  description:
    "Join the House of Bread Academy waitlist: an email when the first courses open, with live session reminders and new teaching from House of Bread Global.",
};

const expect: ExpectItem[] = [
  { icon: "book", text: "An email when the first Academy courses open." },
  { icon: "bell", text: "Reminders before live sessions." },
  { icon: "scroll", text: "New teaching and journeys." },
];

/**
 * The Academy waitlist. A static page whose form posts the academy-waitlist
 * source as a hidden field, so the Kit tag is right without JavaScript.
 */
export default function AcademySubscribePage({ searchParams }: PageProps<"/subscribe/academy">) {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="bread-steam"
        eyebrow="House of Bread Academy"
        title={academyCopy.closingHeading}
        lead={academyCopy.closingText}
      />

      <SignupSection
        source="academy-waitlist"
        idPrefix="subscribe-academy"
        expect={expect}
        searchParams={searchParams}
      />

      <NextStep title="Need a word for this season?" text="Sit under the teaching of the Word, wherever you are.">
        <ButtonLink href="/media">Watch the latest teaching</ButtonLink>
      </NextStep>
    </main>
  );
}
