import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppBand } from "@/components/shared/AppBand";
import { ButtonLink } from "@/components/shared/Button";
import { Icon } from "@/components/shared/icons";
import { PageHeader } from "@/components/shared/PageHeader";
import { Placeholder, PlaceholderBadge } from "@/components/shared/Placeholder";
import { Prose } from "@/components/shared/Prose";
import { Section } from "@/components/shared/Section";
import { introductionHeadings } from "@/lib/content/copy";
import { placeholderBooks, type PlaceholderBook } from "@/lib/content/placeholder-data";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

const withPages = placeholderBooks.filter((book) => book.hasPage);

export function generateStaticParams() {
  return withPages.map((entry) => ({ book: entry.slug }));
}

const findBook = (slug: string) => withPages.find((entry) => entry.slug === slug);

export async function generateMetadata({
  params,
}: PageProps<"/new-testament/[book]">): Promise<Metadata> {
  const { book } = await params;
  const entry = findBook(book);
  if (!entry) return {};
  return {
    title: `${entry.name}: an introduction`,
    description: `An introduction to ${entry.name}: who wrote it, who received it, the central argument, the themes, and where it sits in the story of Scripture.`,
  };
}

function Neighbour({ book, direction }: { book: PlaceholderBook; direction: "previous" | "next" }) {
  const label = direction === "previous" ? "Previous book" : "Next book";
  const content = (
    <>
      <span className="eyebrow block">{label}</span>
      <span className="mt-2 flex items-center gap-2 font-serif text-2xl font-semibold">
        {direction === "previous" ? <Icon name="arrow-left" className="size-5" /> : null}
        {book.name}
        {direction === "next" ? <Icon name="arrow-right" className="size-5" /> : null}
      </span>
    </>
  );
  const align = direction === "next" ? "sm:text-right sm:[&>span]:justify-end" : "";
  return book.hasPage ? (
    <Link
      href={`/new-testament/${book.slug}` as Route}
      className={`lift block rounded-card border border-border-strong bg-surface p-6 text-green shadow-soft ${align}`}
    >
      {content}
    </Link>
  ) : (
    <div className={`rounded-card border border-dashed border-border-strong bg-surface-tint p-6 text-ink ${align}`}>
      {content}
      <span className="mt-1 block text-sm text-ink-muted">Coming soon</span>
    </div>
  );
}

export default async function BookPage({ params }: PageProps<"/new-testament/[book]">) {
  const { book } = await params;
  const entry = findBook(book);
  if (!entry) notFound();

  const index = placeholderBooks.indexOf(entry);
  const previous = placeholderBooks[index - 1];
  const next = placeholderBooks[index + 1];

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="New Testament study"
        title={`${entry.name}: an introduction`}
        meta={<PlaceholderBadge label="Sample" />}
        actions={
          <>
            <ButtonLink href="/app" tone="green" arrow>
              Read this book in the app
            </ButtonLink>
            <ButtonLink href="/new-testament" tone="green" variant="secondary">
              Browse all 27 books
            </ButtonLink>
          </>
        }
      />

      {introductionHeadings.map((heading, position) => (
        <Section
          key={heading}
          id={`part-${position + 1}`}
          title={heading}
          tone={position % 2 === 0 ? "white" : "tint"}
          width="narrow"
        >
          <Prose>
            <Placeholder block>[BODY TEXT FOR THIS SECTION TO BE SUPPLIED]</Placeholder>
          </Prose>
        </Section>
      ))}

      <nav aria-label="Books" className="bg-surface">
        <div className="container-page grid gap-4 py-12 sm:grid-cols-2">
          <div>{previous ? <Neighbour book={previous} direction="previous" /> : null}</div>
          <div>{next ? <Neighbour book={next} direction="next" /> : null}</div>
        </div>
      </nav>

      <AppBand
        idPrefix="book-app"
        heading={`Read ${entry.name} in the app`}
        action={{ href: "/app", label: "Read this book in the app" }}
      />
    </main>
  );
}
