import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/shared/Button";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlaceholderBadge } from "@/components/shared/Placeholder";
import { MdxBody } from "@/components/shared/MdxBody";
import { bandClass } from "@/components/shared/Section";
import { getAll, getEntry } from "@/lib/content";
import { bookListings, type BookListing } from "@/lib/content/book-groups";

// Render the full page before responding, so an unknown slug returns a real
// 404 status rather than a 200 shell with not found content streamed in.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return getAll("book").map((entry) => ({ book: entry.slug }));
}

function findBook(slug: string) {
  const found = getEntry("book", slug);
  if (!found) return undefined;
  const listings = bookListings(new Set(getAll("book").map((book) => book.slug)));
  const index = listings.findIndex((listing) => listing.slug === slug);
  return { found, listing: listings[index], previous: listings[index - 1], next: listings[index + 1] };
}

export async function generateMetadata({
  params,
}: PageProps<"/new-testament/[book]">): Promise<Metadata> {
  const { book } = await params;
  const match = findBook(book);
  if (!match) return {};
  return { title: match.found.data.title, description: match.found.data.description };
}

function Neighbour({ book, direction }: { book: BookListing; direction: "previous" | "next" }) {
  const label = direction === "previous" ? "Previous book" : "Next book";
  const content = (
    <>
      <span className="eyebrow block">{label}</span>
      <span className="mt-2 block font-serif text-2xl font-semibold">{book.name}</span>
    </>
  );
  const align = direction === "next" ? "sm:text-right" : "";
  return book.hasPage ? (
    <Link
      href={`/new-testament/${book.slug}` as Route}
      className={`block rounded-card border border-border-strong bg-surface-raised p-6 text-emerald-deep hover:border-glyph ${align}`}
    >
      {content}
    </Link>
  ) : (
    <div className={`rounded-card border border-dashed border-border-strong bg-surface-mint p-6 text-ink ${align}`}>
      {content}
      <span className="mt-1 block text-sm text-ink-muted">Coming soon</span>
    </div>
  );
}

export default async function BookPage({ params }: PageProps<"/new-testament/[book]">) {
  const { book } = await params;
  const match = findBook(book);
  if (!match) notFound();
  const { found, previous, next } = match;

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="open-bible"
        eyebrow="New Testament study"
        title={found.data.title}
        meta={found.data.placeholder ? <PlaceholderBadge label="Sample" /> : null}
        actions={
          <>
            <ButtonLink href="/app">Get the app</ButtonLink>
            <ButtonLink href="/new-testament" variant="secondary">
              See all 27 books
            </ButtonLink>
          </>
        }
      />

      <article aria-labelledby="book-heading" className="bg-surface">
        <div className={bandClass}>
          <div className="mx-auto max-w-[68ch]">
            <h2 id="book-heading" className="sr-only">
              {found.data.title}
            </h2>
            <MdxBody source={found.body} />
          </div>
        </div>
      </article>

      <nav aria-label="Books" className="bg-surface">
        <div className="container-page grid gap-4 py-12 sm:grid-cols-2">
          <div>{previous ? <Neighbour book={previous} direction="previous" /> : null}</div>
          <div>{next ? <Neighbour book={next} direction="next" /> : null}</div>
        </div>
      </nav>

      <NextStep tone="warm" title="Want a guide through it?" text="Our free courses take you through it, one lesson at a time.">
        <ButtonLink href="/academy">Browse free courses</ButtonLink>
      </NextStep>
    </main>
  );
}
