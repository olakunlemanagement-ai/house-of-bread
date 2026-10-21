import type { Metadata } from "next";
import { AppBand } from "@/components/shared/AppBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { SignupSection, type ExpectItem } from "./SubscribeForm";

export const metadata: Metadata = {
  title: "Join the newsletter",
  description:
    "Live session reminders, new teaching and news from House of Bread Global, sent to your inbox.",
};

const expect: ExpectItem[] = [
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

      <SignupSection source="subscribe-page" idPrefix="subscribe" expect={expect} searchParams={searchParams} />

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
