import type { Metadata } from "next";
import { BookGrid } from "@/components/shared/BookGrid";
import { ButtonLink } from "@/components/shared/Button";
import { NextStep } from "@/components/shared/NextStep";
import { NumberedList } from "@/components/shared/NumberedList";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { introductionHeadings } from "@/lib/content/copy";
import { getAll } from "@/lib/content";
import { bookGroups, bookListings } from "@/lib/content/book-groups";

export const metadata: Metadata = {
  title: "Study the New Testament, book by book",
  description:
    "The ministry's written introduction to all 27 New Testament books: who wrote each one, who received it, the central argument, the themes, and where it sits in the story of Scripture.",
};

/**
 * The New Testament index: what each introduction covers, every book by
 * group, then the next step to the Academy, with the app beside it.
 */
export default function NewTestamentPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="open-bible"
        eyebrow="New Testament study"
        title="Study the New Testament, book by book"
        lead="House of Bread Global introduces every New Testament book before the verses are lifted out. Context is not decoration. A letter read without knowing what prompted it will be misread, and most misreadings of the New Testament begin exactly there."
      />

      <Section id="covers" title="What does each introduction cover?" tone="mint">
        <NumberedList items={introductionHeadings.map((text) => ({ text }))} />
      </Section>

      <Section id="books" title="Which book will you read?">
        <BookGrid groups={bookGroups} books={bookListings(new Set(getAll("book").map((book) => book.slug)))} />
      </Section>

      <NextStep tone="warm" title="Want a guide through it?" text="Our free courses take you through it, one lesson at a time.">
        <ButtonLink href="/academy">Browse free courses</ButtonLink>
        <ButtonLink href="/app" variant="secondary">
          Get the app
        </ButtonLink>
      </NextStep>
    </main>
  );
}
