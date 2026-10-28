import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { EventCard } from "@/components/shared/LiveSessionCard";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { SessionTimes } from "@/components/shared/SessionTimes";
import { getAll, upcomingEvents } from "@/lib/content";
import { sessionTimeRegions } from "@/lib/content/copy";
import { getNextLiveSession } from "@/lib/schedule/next-session";
import { timeIn } from "@/lib/schedule/weekly";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Live every Monday",
  description:
    "New teaching live every Monday at 8 pm Lagos time, on YouTube. See the session times where you are.",
};

/**
 * Events, per docs/RESET-BRIEF.md section 5: "Live every Monday", the
 * session times block unchanged (#rhythm, which Home and Teachings link
 * to), any dated session or training that is coming up, then the next
 * step to the latest teaching. Live meetings are supporting detail, so
 * nothing else.
 */
export default async function EventsPage() {
  const upcoming = upcomingEvents(getAll("event"));
  const weekly = await getNextLiveSession();
  const rule = siteConfig.liveSession;
  const ministryTime = timeIn(new Date(weekly), rule.timeZone);
  const ministryRegion = sessionTimeRegions.find((region) => region.timeZone === rule.timeZone)?.name;

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="dust-light"
        eyebrow="Live"
        title="Live every Monday"
        lead="New teaching live every Monday at 8 pm Lagos time."
      />

      <Section id="rhythm" title="Weekly rhythm">
        <p className="max-w-2xl text-lead text-ink">
          Every {ministryTime.weekday} at {ministryTime.time} {ministryRegion} time, live on YouTube.
          Every session is online, so join from wherever you are.
        </p>
        <div className="mt-10 max-w-3xl rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
          <SessionTimes rule={rule} serverIso={weekly} headingId="events-region-times" headingLevel={3} />
        </div>
      </Section>

      {upcoming.length > 0 ? (
        <Section id="upcoming" title="What else is coming up?" tone="mint">
          <ul className="space-y-4">
            {upcoming.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </ul>
        </Section>
      ) : null}

      <NextStep
        tone={upcoming.length > 0 ? "warm" : "mint"}
        title="Need a word for this season?"
        text="Sit under the teaching of the Word, wherever you are."
      >
        <ButtonLink href="/media">Watch the latest teaching</ButtonLink>
      </NextStep>
    </main>
  );
}
