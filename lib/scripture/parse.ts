// Scripture reference parser. Framework free.
//
// Accepts common human spellings and emits one canonical form:
//   John 6            whole chapter
//   John 6-7          chapter span
//   John 6:35         one verse
//   John 6:33-35      verse range
//   John 6:70-7:2     cross chapter range
//
// Verse counts per chapter are not checked yet. Chapter counts are.

import { type Book, findBook } from "./books.ts";

export type Point = { chapter: number; verse?: number };

export type ScriptureRef = {
  book: Book;
  start: Point;
  /** Absent for a single chapter or a single verse. */
  end?: Point;
};

export type ParseResult = { ok: true; ref: ScriptureRef } | { ok: false; error: string };

// Hyphen, en dash, em dash and minus all mean "to" in a range.
const DASH = "[-‐-―−]";
const PATTERN = new RegExp(
  `^(.*?[A-Za-z].*?)\\s*(\\d+)(?:\\s*:\\s*(\\d+))?(?:\\s*${DASH}\\s*(\\d+)(?:\\s*:\\s*(\\d+))?)?$`,
);

const fail = (error: string): ParseResult => ({ ok: false, error });

export function parseReference(input: string): ParseResult {
  const text = input.trim().replace(/\s+/g, " ");
  const match = PATTERN.exec(text);
  if (!match) return fail(`"${input}" is not a scripture reference, for example "John 6:35"`);

  const [, bookText, a, b, c, d] = match;
  const book = findBook(bookText);
  if (!book) return fail(`"${bookText.trim()}" is not a known book`);

  const n = (value: string | undefined) => (value === undefined ? undefined : Number(value));
  let start: Point;
  let end: Point | undefined;

  if (b !== undefined) {
    // Starts with chapter:verse.
    start = { chapter: n(a)!, verse: n(b) };
    if (c !== undefined) {
      end = d !== undefined ? { chapter: n(c)!, verse: n(d) } : { chapter: start.chapter, verse: n(c) };
    }
  } else if (d !== undefined) {
    return fail(`"${input}" mixes a whole chapter with a verse, write it as "${book.name} ${a}:1-${c}:${d}"`);
  } else if (book.chapters === 1 && !(n(a) === 1 && c === undefined)) {
    // One chapter books are often cited by verse alone: "Jude 3" is Jude 1:3.
    start = { chapter: 1, verse: n(a) };
    if (c !== undefined) end = { chapter: 1, verse: n(c) };
  } else {
    start = { chapter: n(a)! };
    if (c !== undefined) end = { chapter: n(c)! };
  }

  for (const point of end ? [start, end] : [start]) {
    if (point.chapter < 1 || (point.verse !== undefined && point.verse < 1)) {
      return fail(`"${input}" has a chapter or verse of 0`);
    }
    if (point.chapter > book.chapters) {
      return fail(`${book.name} has ${book.chapters} chapter${book.chapters === 1 ? "" : "s"}, "${input}" asks for chapter ${point.chapter}`);
    }
  }

  if (end) {
    const before =
      end.chapter < start.chapter ||
      (end.chapter === start.chapter && (end.verse ?? 0) <= (start.verse ?? 0));
    if (before) return fail(`"${input}" ends before it starts`);
  }

  return { ok: true, ref: { book, start, ...(end ? { end } : {}) } };
}

const point = (p: Point) => (p.verse === undefined ? `${p.chapter}` : `${p.chapter}:${p.verse}`);

/** Canonical text form, for example "John 6:33-35". */
export function formatReference(ref: ScriptureRef): string {
  const { book, start, end } = ref;
  if (!end) return `${book.name} ${point(start)}`;
  const tail = end.chapter === start.chapter && end.verse !== undefined ? `${end.verse}` : point(end);
  return `${book.name} ${point(start)}-${tail}`;
}

/** Parses and formats in one step. Returns undefined when the input does not parse. */
export function canonicalise(input: string): string | undefined {
  const result = parseReference(input);
  return result.ok ? formatReference(result.ref) : undefined;
}
