// Canonical book identifiers. Framework free: no React or Next imports, so
// this module can move into a shared package later.
//
// Changing an id or a display name changes deep links. Treat it as a
// breaking change and update the golden tests deliberately.
//
// All 66 books of the Protestant canon, in canonical order.

export type Testament = "OT" | "NT";

export type Book = {
  /** Canonical id, used in URLs: `john`, `1-corinthians`. */
  id: string;
  /** Display name, used in canonical references: `John`, `1 Corinthians`. */
  name: string;
  /**
   * Name for a reference within one chapter, where it differs: "Psalm 23"
   * but "Psalms 23-24".
   */
  singular?: string;
  testament: Testament;
  /** Number of chapters, so a reference past the last chapter is rejected. */
  chapters: number;
  /** Extra spellings the parser accepts, beyond the name and id. */
  aliases: readonly string[];
};

const book =
  (testament: Testament) =>
  (id: string, chapters: number, name: string, aliases: string[], singular?: string): Book => ({
    id,
    name,
    ...(singular ? { singular } : {}),
    chapters,
    testament,
    aliases,
  });
const ot = book("OT");
const nt = book("NT");

/** Numbered book spellings: "1 Sam", "I Samuel", "First Samuel". */
const numbered = (n: 1 | 2 | 3, name: string, short: string[]): string[] => {
  const roman = ["I", "II", "III"][n - 1];
  const word = ["First", "Second", "Third"][n - 1];
  return [...short.map((s) => `${n} ${s}`), `${roman} ${name}`, ...short.map((s) => `${roman} ${s}`), `${word} ${name}`];
};

export const books: readonly Book[] = [
  ot("genesis", 50, "Genesis", ["Gen", "Ge", "Gn"]),
  ot("exodus", 40, "Exodus", ["Exod", "Exo", "Ex"]),
  ot("leviticus", 27, "Leviticus", ["Lev", "Le", "Lv"]),
  ot("numbers", 36, "Numbers", ["Num", "Nu", "Nm", "Nb"]),
  ot("deuteronomy", 34, "Deuteronomy", ["Deut", "Deu", "Dt", "De"]),
  ot("joshua", 24, "Joshua", ["Josh", "Jos", "Jsh"]),
  ot("judges", 21, "Judges", ["Judg", "Jdg", "Jg", "Jdgs"]),
  ot("ruth", 4, "Ruth", ["Rth", "Ru"]),
  ot("1-samuel", 31, "1 Samuel", numbered(1, "Samuel", ["Sam", "Sa", "Sm"])),
  ot("2-samuel", 24, "2 Samuel", numbered(2, "Samuel", ["Sam", "Sa", "Sm"])),
  ot("1-kings", 22, "1 Kings", numbered(1, "Kings", ["Kgs", "Ki", "Kin"])),
  ot("2-kings", 25, "2 Kings", numbered(2, "Kings", ["Kgs", "Ki", "Kin"])),
  ot("1-chronicles", 29, "1 Chronicles", numbered(1, "Chronicles", ["Chron", "Chr", "Ch"])),
  ot("2-chronicles", 36, "2 Chronicles", numbered(2, "Chronicles", ["Chron", "Chr", "Ch"])),
  ot("ezra", 10, "Ezra", ["Ezr"]),
  ot("nehemiah", 13, "Nehemiah", ["Neh", "Ne"]),
  ot("esther", 10, "Esther", ["Esth", "Est", "Es"]),
  ot("job", 42, "Job", ["Jb"]),
  ot("psalms", 150, "Psalms", ["Psalm", "Ps", "Psa", "Pss", "Psm", "Pslm"], "Psalm"),
  ot("proverbs", 31, "Proverbs", ["Prov", "Pro", "Prv", "Pr"]),
  ot("ecclesiastes", 12, "Ecclesiastes", ["Eccles", "Eccl", "Ecc", "Ec", "Qoheleth"]),
  ot("song-of-solomon", 8, "Song of Solomon", ["Song of Songs", "Song of Sol", "Song", "SOS", "Canticles", "Cant"]),
  ot("isaiah", 66, "Isaiah", ["Isa", "Is"]),
  ot("jeremiah", 52, "Jeremiah", ["Jer", "Je", "Jr"]),
  ot("lamentations", 5, "Lamentations", ["Lam", "La"]),
  ot("ezekiel", 48, "Ezekiel", ["Ezek", "Eze", "Ezk"]),
  ot("daniel", 12, "Daniel", ["Dan", "Da", "Dn"]),
  ot("hosea", 14, "Hosea", ["Hos", "Ho"]),
  ot("joel", 3, "Joel", ["Jl"]),
  ot("amos", 9, "Amos", ["Am"]),
  ot("obadiah", 1, "Obadiah", ["Obad", "Ob"]),
  ot("jonah", 4, "Jonah", ["Jnh", "Jon"]),
  ot("micah", 7, "Micah", ["Mic", "Mc"]),
  ot("nahum", 3, "Nahum", ["Nah", "Na"]),
  ot("habakkuk", 3, "Habakkuk", ["Hab", "Hb"]),
  ot("zephaniah", 3, "Zephaniah", ["Zeph", "Zep", "Zp"]),
  ot("haggai", 2, "Haggai", ["Hag", "Hg"]),
  ot("zechariah", 14, "Zechariah", ["Zech", "Zec", "Zc"]),
  ot("malachi", 4, "Malachi", ["Mal", "Ml"]),
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
