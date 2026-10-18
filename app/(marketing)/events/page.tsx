import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { StepList } from "@/components/shared/Lists";
import { EventCard, LiveSessionCard } from "@/components/shared/LiveSessionCard";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PhotoFrame } from "@/components/shared/Placeholder";
import { RegionTimes } from "@/components/shared/RegionTimes";
import { Section, SectionHeader } from "@/components/shared/Section";
import { YouTubeSubscribeButton } from "@/components/shared/SocialLinks";
import {
  LatestSession,
  LatestSessionSkeleton,
  LivePlayer,
  showLatestSession,
} from "@/components/shared/LatestSession";
import { getAll, replayEvents, upcomingEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Live sessions and events",
  description:
    "House of Bread Global teaches live on YouTube. See what is coming, in your local time, and set a reminder.",
};

export default function EventsPage() {
  const events = getAll("event");
  const [next, ...rest] = upcomingEvents(events);
  const replays = replayEvents(events);
  const latest = showLatestSession({
    liveNow: events.some((event) => event.status === "live"),
    hasReplay: replays.length > 0,
  });

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Live"
        title="Live teaching, wherever you are"
        lead="House of Bread Global teaches live on YouTube. See what is coming in your local time, and never miss a session."
        actions={
          <>
            <ButtonLink href="/subscribe" arrow>
              Set a reminder
            </ButtonLink>
            <YouTubeSubscribeButton />
          </>
        }
      />

      <Section id="next-up" title="Next up">
        {next ? (
          <LiveSessionCard event={next} idPrefix="events-next" />
        ) : (
          <EmptyState icon="live" action={{ href: "/subscribe", label: "Set a reminder" }}>
            The next session will be announced here and by email. Subscribe and the date arrives in
            your inbox.
          </EmptyState>
        )}
      </Section>

      {latest ? (
        <Section
          id="watch"
          title="Watch the latest session"
          intro="Until the next session is live, the most recent one is here. Press play to watch here, or open YouTube."
          tone="mint"
        >
          <Suspense fallback={<LatestSessionSkeleton />}>
            <LatestSession />
          </Suspense>
        </Section>
      ) : (
        <Section
          id="watch"
          title="Watch live"
          intro="Live sessions stream on the ministry's YouTube channel. Press play to watch here, or open YouTube."
          tone="mint"
        >
          <LivePlayer />
        </Section>
      )}

      <section id="how" aria-labelledby="how-heading" className="bg-surface-warm">
        <div className="container-page reveal grid gap-12 py-18 md:py-28 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-8">
            <SectionHeader id="how-heading">How it works</SectionHeader>
            <div className="mt-10">
              <StepList
                columns={2}
                steps={[
                  { icon: "search", text: "Find a session." },
                  { icon: "bell", text: "Add it to your calendar or ask for an email reminder." },
                  { icon: "play", text: "Join on YouTube when it starts." },
                  { icon: "clock", text: "Watch the replay if you miss it." },
                ]}
              />
            </div>
          </div>
          <PhotoFrame
            className="mx-auto w-full max-w-sm lg:col-span-4 lg:max-w-none"
            ratio="4/5"
            subject="A session streaming live, the teacher on camera"
          />
        </div>
      </section>

      <Section id="upcoming" title="Upcoming">
        {rest.length > 0 ? (
          <ul className="space-y-4">
            {rest.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </ul>
        ) : (
          <EmptyState icon="calendar">
            Sessions are announced here and by email. Ask for a reminder and the next date arrives
            in your inbox.
          </EmptyState>
        )}
      </Section>

      <Section id="rhythm" title="Weekly rhythm" tone="mint">
        <Placeholder block>[WEEKLY SCHEDULE AND MINISTRY TIME ZONE TO BE SUPPLIED]</Placeholder>
        <div className="mt-10">
          <RegionTimes headingId="events-region-times" />
        </div>
      </Section>

      <Section id="replays" title="Replays">
        {replays.length > 0 ? (
          <ul className="space-y-4">
            {replays.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </ul>
        ) : (
          <EmptyState icon="play">Replays will appear here after each session.</EmptyState>
        )}
      </Section>

      <NewsletterCard
        idPrefix="events-newsletter"
        heading="Get a reminder before each session"
        source="live-notify"
      />
    </main>
  );
}
