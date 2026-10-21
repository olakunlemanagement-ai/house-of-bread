import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { ButtonLink } from "@/components/shared/Button";
import { CTACard } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { IconTile, type IconName } from "@/components/shared/icons";
import { LiveSessionCard } from "@/components/shared/LiveSessionCard";
import { NewsletterCard } from "@/components/shared/NewsletterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Section } from "@/components/shared/Section";
import { SocialLinks, YouTubeChannelButton } from "@/components/shared/SocialLinks";
import { TextCTA } from "@/components/shared/TextCTA";
import { VideoGrid, VideoGridSkeleton } from "@/components/shared/VideoGrid";
import { getAll, upcomingEvents } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Library",
  description: "Live sessions, replays, audio and the ministry's social pages, all in one place.",
};

const sections = [
  { id: "live", label: "Live and replays" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
  { id: "social", label: "Social" },
  { id: "written", label: "Read and study" },
] as const;

/** Anchor chips under the header. Pill shaped, never underlined. */
function SectionChips() {
  return (
    <nav aria-label="Library sections" className="mt-2">
      <ul className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-[0.95rem] font-semibold text-emerald-deep hover:border-border-strong hover:bg-tint"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** A platform card: icon, name, one line and its button. */
function PlatformCard({
  icon,
  name,
  children,
  action,
}: {
  icon: IconName;
  name: string;
  children?: ReactNode;
  action: ReactNode;
}) {
  return (
    <li className="flex flex-col rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
      <IconTile name={icon} />
      <h3 className="mt-6 text-2xl leading-snug">{name}</h3>
      {children ? <div className="mt-3 leading-relaxed text-ink-muted">{children}</div> : null}
      <div className="mt-auto pt-6">{action}</div>
    </li>
  );
}

/** Shown in a platform card's place until the ministry supplies the links. */
function PendingPlatformCard({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <li
      data-placeholder
      className="flex flex-col rounded-card border-2 border-dashed border-border-strong bg-surface p-6 sm:p-8"
    >
      <IconTile name={icon} />
      <p className="mt-6">
        <PlaceholderBadge />
      </p>
      <p className="mt-3 font-mono text-sm leading-relaxed text-ink [overflow-wrap:anywhere]">{children}</p>
    </li>
  );
}

export default function MediaPage() {
  const next = upcomingEvents(getAll("event"))[0];
  const live = next?.status === "live";
  const { audio } = siteConfig.links;

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="Library"
        title="Everything the ministry shares, in one place"
        lead="Live sessions, replays, audio teaching and social pages. Watch, listen and follow wherever you are."
        meta={<SectionChips />}
      />

      <Section id="live" title="Live and replays">
        {next ? (
          <LiveSessionCard event={next} idPrefix="media-next" />
        ) : (
          <EmptyState icon="live">The next session will be announced here and by email.</EmptyState>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <YouTubeChannelButton
            label="Watch live on YouTube"
            variant={live ? "live" : "secondary"}
            className="w-full sm:w-auto"
          />
          {/* The featured card carries its own reminder button. */}
          {next ? null : (
            <ButtonLink href="/subscribe" arrow className="w-full sm:order-first sm:w-auto">
              Set a reminder
            </ButtonLink>
          )}
        </div>
        <p className="mt-6">
          <TextCTA href="/events">See the full schedule</TextCTA>
        </p>
      </Section>

      <Section
        id="video"
        title="Watch on YouTube"
        intro="Teaching videos from House of Bread Global, on YouTube."
        tone="warm"
      >
        <Suspense fallback={<VideoGridSkeleton />}>
          <VideoGrid />
        </Suspense>
      </Section>

      <Section
        id="audio"
        title="Listen on the go"
        intro="Audio teaching for the car, the walk or low data."
        tone="mint"
      >
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {audio.length > 0 ? (
            audio.map((platform) => (
              <PlatformCard
                key={platform.href}
                icon="headphones"
                name={platform.label}
                action={
                  <ButtonLink href={platform.href as `https://${string}`} variant="secondary" className="w-full">
                    Listen on {platform.label}
                  </ButtonLink>
                }
              />
            ))
          ) : (
            <PendingPlatformCard icon="headphones">
              [AUDIO PLATFORMS AND LINKS TO BE SUPPLIED]. Each platform gets a card with a
              &quot;Listen on&quot; button.
            </PendingPlatformCard>
          )}
        </ul>
      </Section>

      <Section
        id="social"
        title="Follow the ministry"
        intro={
          <>
            Teaching clips, announcements and updates from the ministry.{" "}
            <Placeholder>[CONFIRM CONTENT]</Placeholder>
          </>
        }
      >
        <SocialLinks variant="labelled" />
      </Section>

      <Section id="written" title="Read and study" tone="warm">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CTACard icon="scroll" title="Teachings" cta={{ href: "/teachings", label: "Read the teachings" }}>
            Doctrine, interpretation and the questions believers actually ask.
          </CTACard>
          <CTACard
            icon="book"
            title="Study the New Testament"
            cta={{ href: "/new-testament", label: "Browse all 27 books" }}
          >
            An introduction to every New Testament book, before the verses are lifted out.
          </CTACard>
          <CTACard icon="route" title="New Testament journeys" cta={{ href: "/plans", label: "Choose a journey" }}>
            Three guided routes from Matthew to Revelation, in the order the books were written.
          </CTACard>
        </ul>
      </Section>

      <NewsletterCard idPrefix="media-newsletter" />
    </main>
  );
}
