// Golden file: input string -> canonical reference.
// A change here changes deep links. Treat it as a breaking change.

import { describe, expect, it } from "vitest";
import { books, canonicalise, findBook, parseReference, scriptureHref } from "./index.ts";

const golden: [input: string, canonical: string][] = [
  ["John 6:35", "John 6:35"],
  ["John 6", "John 6"],
  ["John 6-7", "John 6-7"],
  ["John 6:33-35", "John 6:33-35"],
  ["John 6:70-7:2", "John 6:70-7:2"],
  ["john 6:35", "John 6:35"],
  ["Jn 6:35", "John 6:35"],
  ["Jn. 6:35", "John 6:35"],
  ["JOHN 6 : 35", "John 6:35"],
  ["John6:35", "John 6:35"],
  ["  John   6:33 - 35 ", "John 6:33-35"],
  [`John 6:33${String.fromCharCode(0x2013)}35`, "John 6:33-35"],
  ["Matt 5:3-12", "Matthew 5:3-12"],
  ["Mt 28:19", "Matthew 28:19"],
  ["Rom 8:28", "Romans 8:28"],
  ["1 Cor 13:4-7", "1 Corinthians 13:4-7"],
  ["1Cor 13:4", "1 Corinthians 13:4"],
  ["I Corinthians 15:3-4", "1 Corinthians 15:3-4"],
  ["First Corinthians 1:18", "1 Corinthians 1:18"],
  ["2 Cor. 5:17", "2 Corinthians 5:17"],
  ["II Timothy 3:16-17", "2 Timothy 3:16-17"],
  ["1 Jn 1:9", "1 John 1:9"],
  ["III John 2", "3 John 1:2"],
  ["Jude 3", "Jude 1:3"],
  ["Jude 1", "Jude 1"],
  ["Jude 20-21", "Jude 1:20-21"],
  ["Philemon 1:6", "Philemon 1:6"],
  ["Heb 11:1", "Hebrews 11:1"],
  ["Jas 1:22", "James 1:22"],
  ["Rev 22:21", "Revelation 22:21"],
  ["Revelations 3:20", "Revelation 3:20"],
  ["Phil 4:13", "Philippians 4:13"],
  ["Acts 2:38-39", "Acts 2:38-39"],
];

const rejects: string[] = [
  "",
  "John",
  "6:35",
  "Genesis 1:1",
  "Johnny 6:35",
  "John 22:1",
  "John 0:1",
  "John 6:0",
  "John 6:35-33",
  "John 7-6",
  "John 6-7:2",
  "Jude 2:1",
  "John 6:35a",
];

describe("scripture golden file", () => {
  it.each(golden)("%s -> %s", (input, canonical) => {
    expect(canonicalise(input)).toBe(canonical);
  });

  it.each(rejects)("rejects %j", (input) => {
    const result = parseReference(input);
    expect(result.ok).toBe(false);
  });

  it("is stable: canonical output parses to itself", () => {
    for (const [, canonical] of golden) expect(canonicalise(canonical)).toBe(canonical);
  });
});

describe("books", () => {
  it("lists the 27 New Testament books with unique ids", () => {
    expect(books).toHaveLength(27);
    expect(new Set(books.map((book) => book.id)).size).toBe(27);
  });

  it("finds every book by its id and its name", () => {
    for (const book of books) {
      expect(findBook(book.id)).toBe(book);
      expect(findBook(book.name)).toBe(book);
    }
  });
});

describe("scriptureHref", () => {
  const href = (input: string) => {
    const result = parseReference(input);
    if (!result.ok) throw new Error(result.error);
    return scriptureHref(result.ref);
  };

  it("links to the chapter and first verse", () => {
    expect(href("John 6:35")).toBe("/scripture/john/6#35");
    expect(href("John 6:33-35")).toBe("/scripture/john/6#33");
    expect(href("1 Cor 13")).toBe("/scripture/1-corinthians/13");
  });
});
