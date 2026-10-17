import Link from "next/link";
import type { Route } from "next";
import type { BookGroup, BookListing } from "@/lib/content/book-groups";
import { Icon } from "./icons";

type BookGridProps = {
  groups: BookGroup[];
  books: BookListing[];
};

/** The New Testament index, grouped. Books without a page are not links. */
export function BookGrid({ groups, books }: BookGridProps) {
  return (
    <div className="space-y-14">
      {groups.map((group) => {
        const groupId = `group-${group.toLowerCase().replace(/[^a-z]+/g, "-")}`;
        const items = books.filter((book) => book.group === group);
        return (
          <section key={group} aria-labelledby={groupId}>
            <h3 id={groupId} className="flex items-baseline gap-3 text-2xl">
              {group}
              <span className="font-sans text-base font-normal text-ink-muted">({items.length})</span>
            </h3>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {items.map((book) =>
                book.hasPage ? (
                  <li key={book.slug} className="lift rounded-tile">
                    <Link
                      href={`/new-testament/${book.slug}` as Route}
                      className="flex min-h-18 items-center justify-between gap-2 rounded-tile border border-border-strong bg-surface px-4 py-3 font-serif text-lg font-semibold text-emerald-deep shadow-soft"
                    >
                      {book.name}
                      <Icon name="arrow-right" className="size-4 shrink-0" />
                    </Link>
                  </li>
                ) : (
                  <li
                    key={book.slug}
                    className="flex min-h-18 flex-col justify-center rounded-tile border border-dashed border-border-strong bg-surface-mint px-4 py-3"
                  >
                    <span className="font-serif text-lg font-semibold text-ink">{book.name}</span>
                    <span className="text-sm text-ink-muted">Coming soon</span>
                  </li>
                ),
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
