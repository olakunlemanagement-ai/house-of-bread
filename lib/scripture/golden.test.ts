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

  // Old Testament
  ["Genesis 1:1", "Genesis 1:1"],
  ["Gen 1:1-3", "Genesis 1:1-3"],
  ["Gn 3:15", "Genesis 3:15"],
  ["Ex 20:1-17", "Exodus 20:1-17"],
  ["Exod. 12:13", "Exodus 12:13"],
  ["Lev 17:11", "Leviticus 17:11"],
  ["Num 21:8-9", "Numbers 21:8-9"],
  ["Deut 6:4-5", "Deuteronomy 6:4-5"],
  ["Dt 8:3", "Deuteronomy 8:3"],
  ["Josh 1:9", "Joshua 1:9"],
  ["Judg 6:12", "Judges 6:12"],
  ["Ruth 1:16", "Ruth 1:16"],
  ["Isaiah 53", "Isaiah 53"],
  ["Isa 53:4-6", "Isaiah 53:4-6"],
  ["Is 9:6", "Isaiah 9:6"],
  ["Jer 31:31-34", "Jeremiah 31:31-34"],
  ["Lam 3:22-23", "Lamentations 3:22-23"],
  ["Ezek 36:26", "Ezekiel 36:26"],
  ["Dan 9:24-27", "Daniel 9:24-27"],
  ["Hos 6:6", "Hosea 6:6"],
  ["Joel 2:28-32", "Joel 2:28-32"],
  ["Amos 9:11", "Amos 9:11"],
  ["Obadiah 15", "Obadiah 1:15"],
  ["Jonah 2:9", "Jonah 2:9"],
  ["Mic 5:2", "Micah 5:2"],
  ["Hab 2:4", "Habakkuk 2:4"],
  ["Zeph 3:17", "Zephaniah 3:17"],
  ["Hag 2:9", "Haggai 2:9"],
  ["Zech 12:10", "Zechariah 12:10"],
  ["Mal 3:6", "Malachi 3:6"],
  ["Neh 8:10", "Nehemiah 8:10"],
  ["Esth 4:14", "Esther 4:14"],
  ["Job 19:25-27", "Job 19:25-27"],
  ["Prov 3:5-6", "Proverbs 3:5-6"],
  ["Eccl 3:1", "Ecclesiastes 3:1"],
  ["Ezra 7:10", "Ezra 7:10"],

  // Numbered Old Testament books
  ["1 Samuel 17:45", "1 Samuel 17:45"],
  ["1 Sam 16:7", "1 Samuel 16:7"],
  ["1Sam 3:10", "1 Samuel 3:10"],
  ["I Samuel 15:22", "1 Samuel 15:22"],
  ["II Sam 7:12-16", "2 Samuel 7:12-16"],
  ["Second Samuel 22:2", "2 Samuel 22:2"],
  ["1 Kgs 18:21", "1 Kings 18:21"],
  ["1 Ki 19:12", "1 Kings 19:12"],
  ["2 Kings 2:11", "2 Kings 2:11"],
  ["1 Chron 16:34", "1 Chronicles 16:34"],
  ["2 Chr 7:14", "2 Chronicles 7:14"],
  ["First Chronicles 29:11", "1 Chronicles 29:11"],

  // Psalms: singular within one chapter, plural across chapters
  ["Psalm 23", "Psalm 23"],
  ["Psalms 23", "Psalm 23"],
  ["Psalm 23:1", "Psalm 23:1"],
  ["Psalms 23:1-6", "Psalm 23:1-6"],
  ["Ps 119:105", "Psalm 119:105"],
  ["Psa 1:1-3", "Psalm 1:1-3"],
  ["Pss 120-134", "Psalms 120-134"],
  ["Psalm 22-24", "Psalms 22-24"],
  ["Psalms 150", "Psalm 150"],

  // Song of Solomon
  ["Song of Solomon 2:4", "Song of Solomon 2:4"],
  ["Song of Songs 8:6-7", "Song of Solomon 8:6-7"],
  ["Song 2:16", "Song of Solomon 2:16"],
  ["SOS 1:2", "Song of Solomon 1:2"],
  ["Canticles 4:7", "Song of Solomon 4:7"],
];

const rejects: string[] = [
  "",
  "John",
  "6:35",
  "Genesis 51:1",
  "Psalm 151",
  "Song of Solomon 9:1",
  "Obadiah 2:1",
  "4 Kings 1:1",
  "Malachi 5:1",
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
  it("lists all 66 books with unique ids, 39 Old Testament and 27 New", () => {
    expect(books).toHaveLength(66);
    expect(new Set(books.map((book) => book.id)).size).toBe(66);
    expect(books.filter((book) => book.testament === "OT")).toHaveLength(39);
    expect(books.filter((book) => book.testament === "NT")).toHaveLength(27);
  });

  it("totals 1,189 chapters", () => {
    expect(books.reduce((sum, book) => sum + book.chapters, 0)).toBe(1189);
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
    expect(href("Psalm 23:1")).toBe("/scripture/psalms/23#1");
    expect(href("Song of Songs 2:4")).toBe("/scripture/song-of-solomon/2#4");
  });
});
