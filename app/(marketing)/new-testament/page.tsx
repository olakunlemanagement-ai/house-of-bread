import type { Metadata } from "next";
import { AppBand } from "@/components/shared/AppBand";
import { BookGrid } from "@/components/shared/BookGrid";
import { ButtonLink } from "@/components/shared/Button";
import type { IconName } from "@/components/shared/icons";
import { StepList } from "@/components/shared/Lists";
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

const headingIcons: IconName[] = ["scroll", "people", "route", "layers", "globe"];

export default function NewTestamentPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="open-bible"
        eyebrow="New Testament study"
        title="Study the New Testament, book by book"
        lead="House of Bread Global introduces every New Testament book before the verses are lifted out. Context is not decoration. A letter read without knowing what prompted it will be misread, and most misreadings of the New Testament begin exactly there."
        actions={
          <ButtonLink href="#books">
            Browse all 27 books
          </ButtonLink>
        }
       
      />

      <Section id="covers" title="What each introduction covers" tone="mint">
        <StepList
          columns={5}
          steps={introductionHeadings.map((text, index) => ({ text, icon: headingIcons[index] }))}
        />
      </Section>

      <Section id="books" title="Book index">
        <BookGrid groups={bookGroups} books={bookListings(new Set(getAll("book").map((book) => book.slug)))} />
      </Section>

      <AppBand
        idPrefix="nt-app"
        heading="Read each book alongside the text in the official app."
        action={{ href: "/app", label: "Get the app" }}
      />
    </main>
  );
}
