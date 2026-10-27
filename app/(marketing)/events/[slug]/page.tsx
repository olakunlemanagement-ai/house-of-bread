import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, ButtonLink } from "@/components/shared/Button";
import { Icon } from "@/components/shared/icons";
import { EventDuration, EventWhen, eventKindLabel } from "@/components/shared/LiveSessionCard";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { MdxBody } from "@/components/shared/MdxBody";
import { PassageList } from "@/components/shared/PassageList";
import { getAll, getEntry } from "@/lib/content";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return getAll("event").map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry("event", slug);
  if (!entry) return {};
  return { title: entry.data.title, description: entry.data.description };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const entry = getEntry("event", slug);
  if (!entry) notFound();
  const event = entry.data;

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="dust-light"
        eyebrow={eventKindLabel[event.kind]}
        title={event.title}
        meta={
          <div className="space-y-3">
            {event.placeholder ? <PlaceholderBadge label="Sample" /> : null}
            <p className="flex flex-wrap items-center gap-2 text-lg text-ink">
              <Icon name="calendar" className="size-5 text-glyph" />
              <EventWhen event={event} />
            </p>
            <p className="flex flex-wrap items-center gap-2 text-ink-muted">
              <Icon name="clock" className="size-5 text-glyph" />
              <EventDuration event={event} />
            </p>
          </div>
        }
        actions={
          <>
            {event.youtubeUrl ? (
              <ButtonLink href={event.youtubeUrl as `https://${string}`}>
                Watch on YouTube
              </ButtonLink>
            ) : (
              <Button disabled aria-describedby="youtube-note">
                Watch on YouTube
              </Button>
            )}
            {/* TODO: link to the .ics file generated at build time once events carry real dates. */}
            <Button variant="secondary" disabled aria-describedby="calendar-note">
              <Icon name="calendar" className="size-5" />
              Add to calendar
            </Button>
            <div className="basis-full space-y-1 text-sm text-ink-muted">
              {event.youtubeUrl ? null : (
                <p id="youtube-note">
                  <Placeholder>[YOUTUBE LINK TO BE SUPPLIED]</Placeholder>
                </p>
              )}
              <p id="calendar-note">
                <Placeholder>[CALENDAR FILE AVAILABLE ONCE A DATE IS SUPPLIED]</Placeholder>
              </p>
            </div>
          </>
        }
      />

      <Section id="about" title="About this session" width="narrow">
        <MdxBody source={entry.body} />
      </Section>

      <Section id="passages" title="Passages" tone="mint" width="narrow">
        {event.passages.length > 0 ? (
          <PassageList passages={event.passages} />
        ) : (
          <Placeholder block>[PASSAGES TO BE SUPPLIED]</Placeholder>
        )}
      </Section>

      <nav aria-label="Sessions" className="bg-surface">
        <div className="container-page pt-10">
          <ButtonLink href="/events" variant="secondary" size="sm">
            Back to all sessions
          </ButtonLink>
        </div>
      </nav>

      <NewsletterCard
        idPrefix="event-newsletter"
        heading="Get a reminder before each session"
        source="live-notify"
      />
    </main>
  );
}
