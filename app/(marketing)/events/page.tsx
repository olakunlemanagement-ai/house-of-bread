import type { Metadata } from "next";
import { EmptyState } from "@/components/shared/EmptyState";
import { StepList } from "@/components/shared/Lists";
import { LiveSessionCard } from "@/components/shared/LiveSessionCard";
import { NewsletterBand } from "@/components/shared/NewsletterBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { placeholderEvents, replayEvents, upcomingEvents } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "Live sessions and events",
  description:
    "Live teaching sessions stream on YouTube. See what is coming, in your local time, and ask to be notified.",
};

export default function EventsPage() {
  const upcoming = upcomingEvents(placeholderEvents);
  const replays = replayEvents(placeholderEvents);

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Live"
        title="Live sessions and events"
        lead="Live sessions stream on YouTube. This page shows what is coming, in your local time."
      />

      <Section id="how" title="How it works" tone="tint">
        <StepList
          steps={[
            { text: "Find a session below." },
            { text: "Add it to your calendar, or ask to be notified by email." },
            { text: "Join on YouTube when it starts." },
            { text: "Watch the replay afterwards if you miss it." },
          ]}
        />
      </Section>

      <Section id="upcoming" title="Upcoming">
        {upcoming.length > 0 ? (
          <ul className="space-y-4">
            {upcoming.map((event) => (
              <LiveSessionCard key={event.slug} event={event} />
            ))}
          </ul>
        ) : (
          <EmptyState icon="calendar" action={{ href: "/subscribe", label: "Subscribe" }}>
            No sessions are scheduled yet. Subscribe and the next date will arrive in your inbox.
          </EmptyState>
        )}
      </Section>

      <Section id="rhythm" title="Weekly rhythm" tone="tint" width="narrow">
        <Placeholder block>[WEEKLY SCHEDULE AND MINISTRY TIME ZONE TO BE SUPPLIED]</Placeholder>
      </Section>

      <Section id="replays" title="Replays">
        {replays.length > 0 ? (
          <ul className="space-y-4">
            {replays.map((event) => (
              <LiveSessionCard key={event.slug} event={event} />
            ))}
          </ul>
        ) : (
          <EmptyState icon="live">Replays will appear here after each session.</EmptyState>
        )}
      </Section>

      <NewsletterBand
        idPrefix="events-newsletter"
        heading="Get a reminder before each session"
        source="live-notify"
      />
    </main>
  );
}
