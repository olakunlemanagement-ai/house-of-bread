import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, textLinkClass } from "@/components/shared/Button";
import { Icon } from "@/components/shared/icons";
import { EventDuration, EventWhen, eventKindLabel } from "@/components/shared/LiveSessionCard";
import { NewsletterBand } from "@/components/shared/NewsletterBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { findBySlug, placeholderEvents } from "@/lib/content/placeholder-data";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return placeholderEvents.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = findBySlug(placeholderEvents, slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: `${eventKindLabel[entry.kind]} session from House of Bread Global. Sample entry, details to be supplied.`,
  };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = findBySlug(placeholderEvents, slug);
  if (!event) notFound();

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow={eventKindLabel[event.kind]}
        title={event.title}
        meta={
          <div className="space-y-3">
            {event.sample ? <PlaceholderBadge label="Sample" /> : null}
            <p className="flex flex-wrap items-center gap-2 text-lg text-on-green">
              <Icon name="calendar" className="size-5 text-lime" />
              <EventWhen event={event} />
            </p>
            <p className="flex flex-wrap items-center gap-2 text-on-green">
              <Icon name="live" className="size-5 text-lime" />
              <EventDuration event={event} />
            </p>
          </div>
        }
        actions={
          <>
            {event.youtubeUrl ? (
              <a href={event.youtubeUrl} className="inline-flex min-h-12 items-center rounded-full bg-lime px-6 py-3 font-semibold text-on-lime">
                Watch on YouTube
              </a>
            ) : (
              <Button tone="green" disabled aria-describedby="youtube-note">
                Watch on YouTube
              </Button>
            )}
            {/* TODO: link to the .ics file generated at build time once events carry real dates. */}
            <Button tone="green" variant="secondary" disabled aria-describedby="calendar-note">
              Add to calendar
            </Button>
            <div className="basis-full space-y-1 text-sm text-on-green-muted">
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
        <Placeholder block>[SESSION DESCRIPTION TO BE SUPPLIED]</Placeholder>
      </Section>

      <Section id="passages" title="Passages" tone="tint" width="narrow">
        <Placeholder block>[PASSAGES TO BE SUPPLIED, LINKED THROUGH /lib/scripture]</Placeholder>
      </Section>

      <NewsletterBand
        idPrefix="event-newsletter"
        heading="Get a reminder before each session"
        tag="live-notify"
      />

      <nav aria-label="Sessions" className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Link href="/events" className={`${textLinkClass} inline-flex items-center gap-2`}>
          <Icon name="arrow-left" className="size-5" />
          Back to all sessions
        </Link>
      </nav>
    </main>
  );
}
