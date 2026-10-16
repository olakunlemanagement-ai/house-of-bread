import Link from "next/link";
import type { Route } from "next";
import type { BookGroup, PlaceholderBook } from "@/lib/content/placeholder-data";

type BookGridProps = {
  groups: BookGroup[];
  books: PlaceholderBook[];
};

/** The New Testament index, grouped. Books without a page are not links. */
export function BookGrid({ groups, books }: BookGridProps) {
  return (
    <div className="space-y-12">
      {groups.map((group) => {
        const groupId = `group-${group.toLowerCase().replace(/[^a-z]+/g, "-")}`;
        const items = books.filter((book) => book.group === group);
        return (
          <section key={group} aria-labelledby={groupId}>
            <h3 id={groupId} className="text-xl font-bold">
              {group}
              <span className="ml-2 text-base font-normal text-ink-muted">
                ({items.length})
              </span>
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {items.map((book) =>
                book.hasPage ? (
                  <li key={book.slug}>
                    <Link
                      href={`/new-testament/${book.slug}` as Route}
                      className="flex min-h-16 items-center rounded-xl border border-border-strong bg-surface px-4 py-3 font-semibold text-green shadow-card transition-[border-color,box-shadow] hover:border-green hover:shadow-card-hover"
                    >
                      {book.name}
                    </Link>
                  </li>
                ) : (
                  <li
                    key={book.slug}
                    className="flex min-h-16 flex-col justify-center rounded-xl border border-dashed border-border bg-surface-tint px-4 py-3"
                  >
                    <span className="font-semibold text-ink">{book.name}</span>
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
