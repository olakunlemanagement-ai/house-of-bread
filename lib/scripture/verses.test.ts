import { describe, expect, it } from "vitest";
import { books } from "./books.ts";
import { parseReference } from "./parse.ts";
import { versesPerChapter } from "./verses.ts";

const sum = (counts: readonly number[]) => counts.reduce((total, n) => total + n, 0);
const totalOf = (testament: "OT" | "NT") =>
  sum(books.filter((book) => book.testament === testament).map((book) => sum(versesPerChapter[book.id] ?? [])));

describe("verses per chapter", () => {
  it("has a count for every chapter of every book", () => {
    for (const book of books) {
      expect(versesPerChapter[book.id]?.length, book.id).toBe(book.chapters);
      expect(versesPerChapter[book.id]?.every((n) => Number.isInteger(n) && n > 0), book.id).toBe(true);
    }
    expect(Object.keys(versesPerChapter)).toHaveLength(66);
  });

  it("matches the standard KJV totals: 31,102 verses, 23,145 Old Testament, 7,957 New", () => {
    expect(totalOf("OT")).toBe(23145);
    expect(totalOf("NT")).toBe(7957);
  });

  it("matches known chapters", () => {
    expect(versesPerChapter.john?.[2]).toBe(36);
    expect(versesPerChapter.psalms?.[118]).toBe(176);
    expect(versesPerChapter.psalms?.[116]).toBe(2);
    expect(versesPerChapter.malachi).toEqual([14, 17, 18, 6]);
    expect(versesPerChapter["3-john"]).toEqual([14]);
  });

  it("says what is wrong with a verse past the end", () => {
    expect(parseReference("John 3:999")).toEqual({ ok: false, error: 'John 3 has 36 verses, "John 3:999" asks for verse 999' });
    expect(parseReference("Psalms 117:3")).toEqual({ ok: false, error: 'Psalm 117 has 2 verses, "Psalms 117:3" asks for verse 3' });
  });
});
