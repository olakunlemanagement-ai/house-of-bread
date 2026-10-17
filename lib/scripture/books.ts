// Canonical book identifiers. Framework free: no React or Next imports, so
// this module can move into a shared package later.
//
// Changing an id or a display name changes deep links. Treat it as a
// breaking change and update the golden tests deliberately.
//
// New Testament only for now. Old Testament books are added later.

export type Testament = "NT";

export type Book = {
  /** Canonical id, used in URLs: `john`, `1-corinthians`. */
  id: string;
  /** Display name, used in canonical references: `John`, `1 Corinthians`. */
  name: string;
  testament: Testament;
  /** Number of chapters, so a reference past the last chapter is rejected. */
  chapters: number;
  /** Extra spellings the parser accepts, beyond the name and id. */
  aliases: readonly string[];
};

const nt = (id: string, chapters: number, name: string, aliases: string[]): Book => ({
  id,
  name,
  chapters,
  testament: "NT",
  aliases,
});

export const books: readonly Book[] = [
  nt("matthew", 28, "Matthew", ["Matt", "Mat", "Mt"]),
  nt("mark", 16, "Mark", ["Mrk", "Mk", "Mr"]),
  nt("luke", 24, "Luke", ["Luk", "Lk"]),
  nt("john", 21, "John", ["Jhn", "Jn"]),
  nt("acts", 28, "Acts", ["Act", "Ac", "Acts of the Apostles"]),
  nt("romans", 16, "Romans", ["Rom", "Ro", "Rm"]),
  nt("1-corinthians", 16, "1 Corinthians", ["1 Cor", "1 Co", "I Corinthians", "I Cor", "First Corinthians"]),
  nt("2-corinthians", 13, "2 Corinthians", ["2 Cor", "2 Co", "II Corinthians", "II Cor", "Second Corinthians"]),
  nt("galatians", 6, "Galatians", ["Gal", "Ga"]),
  nt("ephesians", 6, "Ephesians", ["Eph", "Ephes"]),
  nt("philippians", 4, "Philippians", ["Phil", "Php", "Pp"]),
  nt("colossians", 4, "Colossians", ["Col"]),
  nt("1-thessalonians", 5, "1 Thessalonians", ["1 Thess", "1 Thes", "1 Th", "I Thessalonians", "First Thessalonians"]),
  nt("2-thessalonians", 3, "2 Thessalonians", ["2 Thess", "2 Thes", "2 Th", "II Thessalonians", "Second Thessalonians"]),
  nt("1-timothy", 6, "1 Timothy", ["1 Tim", "1 Ti", "I Timothy", "First Timothy"]),
  nt("2-timothy", 4, "2 Timothy", ["2 Tim", "2 Ti", "II Timothy", "Second Timothy"]),
  nt("titus", 3, "Titus", ["Tit", "Ti"]),
  nt("philemon", 1, "Philemon", ["Philem", "Phm", "Pm"]),
  nt("hebrews", 13, "Hebrews", ["Heb"]),
  nt("james", 5, "James", ["Jas", "Jm"]),
  nt("1-peter", 5, "1 Peter", ["1 Pet", "1 Pe", "1 Pt", "I Peter", "First Peter"]),
  nt("2-peter", 3, "2 Peter", ["2 Pet", "2 Pe", "2 Pt", "II Peter", "Second Peter"]),
  nt("1-john", 5, "1 John", ["1 Jn", "1 Jhn", "I John", "First John"]),
  nt("2-john", 1, "2 John", ["2 Jn", "2 Jhn", "II John", "Second John"]),
  nt("3-john", 1, "3 John", ["3 Jn", "3 Jhn", "III John", "Third John"]),
  nt("jude", 1, "Jude", ["Jud", "Jd"]),
  nt("revelation", 22, "Revelation", ["Rev", "Re", "Revelations", "The Revelation"]),
];

/** Lower case, dots removed, spaces and hyphens collapsed to one space. */
export function normaliseBookName(input: string): string {
  return input
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/^(\d)(?=[a-z])/, "$1 ")
    .replace(/[\s-]+/g, " ")
    .trim();
}

const lookup = new Map<string, Book>();
for (const book of books) {
  for (const key of [book.id, book.name, ...book.aliases]) {
    const normal = normaliseBookName(key);
    const existing = lookup.get(normal);
    if (existing && existing !== book) {
      throw new Error(`Scripture alias "${key}" is claimed by both ${existing.id} and ${book.id}`);
    }
    lookup.set(normal, book);
  }
}

/** Finds a book from any accepted spelling, or undefined. */
export function findBook(input: string): Book | undefined {
  return lookup.get(normaliseBookName(input));
}

/** Finds a book by its canonical id only. */
export function bookById(id: string): Book | undefined {
  return books.find((book) => book.id === id);
}
