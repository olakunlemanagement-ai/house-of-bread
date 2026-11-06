import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { NEXT_STEP_COURSES, NextStep } from "@/components/shared/NextStep";
import { TeachingsHero } from "./TeachingsLayout";

const TITLE = { teaching: "This teaching is unavailable right now", series: "This series is unavailable right now" } as const;

type Kind = keyof typeof TITLE;

/** The unavailable state is never indexed: it stands in for a page only while YouTube is not answering. */
export function unavailableMetadata(kind: Kind): Metadata {
  return { title: TITLE[kind], robots: { index: false, follow: false } };
}

/**
 * What a watch or series page shows while YouTube is not answering, so the
 * page cannot tell whether the teaching exists (lib/youtube/pages.ts). A
 * calm line and the way back to Teachings, never an error. It is retried
 * within a minute. `data-state` lets the checks recognise it.
 */
export function TeachingUnavailable({ kind }: { kind: Kind }) {
  return (
    <main id="main" tabIndex={-1} data-state="unavailable">
      <TeachingsHero
        eyebrow={kind === "series" ? "Series" : "Teachings"}
        title={TITLE[kind]}
        lead="YouTube, where the teaching videos are kept, isn't answering at the moment. Please try again in a few minutes."
        actions={<ButtonLink href="/media">See all teachings</ButtonLink>}
      />
      <NextStep tight title={NEXT_STEP_COURSES.title} text={NEXT_STEP_COURSES.text}>
        <ButtonLink href="/academy" variant="secondary">
          Browse courses
        </ButtonLink>
      </NextStep>
    </main>
  );
}
