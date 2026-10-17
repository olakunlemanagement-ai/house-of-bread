import { books } from "../scripture/index.ts";

export type BookGroup =
  | "The Gospels and Acts"
  | "Paul's letters"
  | "Hebrews and the general letters"
  | "Prophecy";

export const bookGroups: BookGroup[] = [
  "The Gospels and Acts",
  "Paul's letters",
  "Hebrews and the general letters",
  "Prophecy",
];

/** Where each group starts, by canonical id. Books run in canonical order. */
const groupStarts: [id: string, group: BookGroup][] = [
  ["matthew", "The Gospels and Acts"],
  ["romans", "Paul's letters"],
  ["hebrews", "Hebrews and the general letters"],
  ["revelation", "Prophecy"],
];

export type BookListing = {
  /** Canonical id from /lib/scripture. */
  slug: string;
  name: string;
  group: BookGroup;
  /** True when /content/books has an introduction for this book. */
  hasPage: boolean;
};

/** All 27 New Testament books in canonical order, marked by whether a page exists. */
export function bookListings(withPages: ReadonlySet<string>): BookListing[] {
  let group: BookGroup = groupStarts[0][1];
  return books.map((book) => {
    group = groupStarts.find(([id]) => id === book.id)?.[1] ?? group;
    return { slug: book.id, name: book.name, group, hasPage: withPages.has(book.id) };
  });
}
