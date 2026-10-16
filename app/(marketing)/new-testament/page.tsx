import type { Metadata } from "next";
import { AppBand } from "@/components/shared/AppBand";
import { BookGrid } from "@/components/shared/BookGrid";
import { StepList } from "@/components/shared/Lists";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { introductionHeadings } from "@/lib/content/copy";
import { bookGroups, placeholderBooks } from "@/lib/content/placeholder-data";

export const metadata: Metadata = {
  title: "Every New Testament book, explained",
  description:
    "Twenty-seven books, each with a written introduction: who wrote it, who received it, the central argument, the themes, and where it sits in the story of Scripture.",
};

export default function NewTestamentPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="The New Testament"
        title="Every book, explained"
        lead="Twenty-seven books, each with a written introduction. Context is not decoration. A letter read without knowing what prompted it will be misread, and most misreadings of the New Testament begin exactly there."
      />

      <Section id="covers" title="What each introduction covers" tone="tint">
        <StepList columns={5} steps={introductionHeadings.map((text) => ({ text }))} />
      </Section>

      <Section id="index" title="Book index">
        <BookGrid groups={bookGroups} books={placeholderBooks} />
      </Section>

      <AppBand idPrefix="nt-app" heading="Read each book alongside the text in the app." />
    </main>
  );
}
