import { describe, expect, it } from "vitest";
import { formatError, parseEntry, splitFrontmatter, type ContentError } from "./core.ts";

const teaching = (frontmatter: string, body = "Body text.\n") =>
  `---\n${frontmatter.trim()}\n---\n\n${body}`;

const validTeaching = `
title: A teaching
slug: a-teaching
description: A short description.
date: 2026-10-17
passages:
  - John 6:35
`;

const validEvent = `
title: An event
slug: an-event
description: A short description.
date: 2026-10-17
kind: live
status: scheduled
startsAtUtc: 2026-11-01T18:00:00Z
timeZone: Europe/London
durationMinutes: 90
youtubeUrl: https://www.youtube.com/watch?v=abcdefghijk
`;

const errorsOf = (result: ReturnType<typeof parseEntry>): ContentError[] =>
  result.ok ? [] : result.errors;

const lines = (result: ReturnType<typeof parseEntry>) => errorsOf(result).map(formatError);

describe("valid content passes", () => {
  it("parses a teaching with defaults applied", () => {
    const result = parseEntry("teaching", "content/teachings/a-teaching.mdx", teaching(validTeaching));
    expect(lines(result)).toEqual([]);
    if (!result.ok) return;
    expect(result.entry.data.placeholder).toBe(false);
    expect(result.entry.data.passages).toEqual(["John 6:35"]);
    expect(result.entry.body.trim()).toBe("Body text.");
  });

  it("parses a full event", () => {
    const result = parseEntry("event", "content/events/an-event.mdx", teaching(validEvent));
    expect(lines(result)).toEqual([]);
  });

  it("allows null event facts on a placeholder event", () => {
    const source = validEvent
      .replace("startsAtUtc: 2026-11-01T18:00:00Z", "startsAtUtc: null")
      .replace("timeZone: Europe/London", "timeZone: null")
      .concat("placeholder: true\n");
    expect(lines(parseEntry("event", "content/events/an-event.mdx", teaching(source)))).toEqual([]);
  });

  it("accepts CRLF line endings", () => {
    const source = teaching(validTeaching).replace(/\n/g, "\r\n");
    expect(lines(parseEntry("teaching", "content/teachings/a-teaching.mdx", source))).toEqual([]);
  });

  it("accepts a valid Scripture component in the body", () => {
    const body = '<Scripture passage="Jn 6:33-35" version="KJV">\nText.\n</Scripture>\n';
    expect(lines(parseEntry("teaching", "content/teachings/a-teaching.mdx", teaching(validTeaching, body)))).toEqual([]);
  });
});

describe("invalid frontmatter fails, naming the file and field", () => {
  const file = "content/teachings/a-teaching.mdx";

  it("reports a missing field", () => {
    const result = parseEntry("teaching", file, teaching(validTeaching.replace("description: A short description.\n", "")));
    expect(result.ok).toBe(false);
    expect(lines(result)).toEqual([expect.stringMatching(/^content\/teachings\/a-teaching\.mdx: description: /)]);
  });

  it("reports a wrong type and a bad date", () => {
    const result = parseEntry("teaching", file, teaching(validTeaching.replace("date: 2026-10-17", "date: 17 October")));
    expect(errorsOf(result)).toEqual([expect.objectContaining({ file, field: "date" })]);
  });

  it("reports an unknown field", () => {
    const result = parseEntry("teaching", file, teaching(`${validTeaching}\nauthr: Someone`));
    expect(errorsOf(result)).toEqual([expect.objectContaining({ field: "authr", message: "is not a field of this content type" })]);
  });

  it("reports a slug that does not match the file name", () => {
    const result = parseEntry("teaching", "content/teachings/other-name.mdx", teaching(validTeaching));
    expect(errorsOf(result)).toEqual([expect.objectContaining({ field: "slug" })]);
  });

  it("reports missing frontmatter", () => {
    expect(errorsOf(parseEntry("teaching", file, "No frontmatter here.\n"))).toHaveLength(1);
  });

  it("reports invalid YAML", () => {
    const result = parseEntry("teaching", file, teaching("title: [unclosed\nslug: a-teaching"));
    expect(lines(result)[0]).toMatch(/frontmatter is not valid YAML/);
  });

  it("reports a null event fact when the event is not a placeholder", () => {
    const result = parseEntry("event", "content/events/an-event.mdx", teaching(validEvent.replace("timeZone: Europe/London", "timeZone: null")));
    expect(errorsOf(result)).toEqual([expect.objectContaining({ field: "timeZone" })]);
  });

  it("reports an unknown time zone, a non UTC time and a non YouTube link", () => {
    const source = validEvent
      .replace("Europe/London", "Europe/Atlantis")
      .replace("2026-11-01T18:00:00Z", "2026-11-01T18:00:00+01:00")
      .replace("https://www.youtube.com/watch?v=abcdefghijk", "https://example.com/video");
    const fields = errorsOf(parseEntry("event", "content/events/an-event.mdx", teaching(source))).map((e) => e.field);
    expect(fields.sort()).toEqual(["startsAtUtc", "timeZone", "youtubeUrl"]);
  });

  it("reports a book slug that is not a canonical book id", () => {
    const source = validTeaching.replace("slug: a-teaching", "slug: matt");
    const result = parseEntry("book", "content/books/matt.mdx", teaching(source));
    expect(errorsOf(result)).toEqual([expect.objectContaining({ field: "slug" })]);
  });

  it("reports an em dash in the copy", () => {
    const body = `One${String.fromCharCode(0x2014)}two.\n`;
    const result = parseEntry("teaching", file, teaching(validTeaching, body));
    expect(errorsOf(result)).toEqual([expect.objectContaining({ line: 10 })]);
  });
});

describe("bad scripture references fail", () => {
  const file = "content/teachings/a-teaching.mdx";

  it("rejects a frontmatter passage that does not parse", () => {
    const result = parseEntry("teaching", file, teaching(validTeaching.replace("John 6:35", "John 22:1")));
    expect(errorsOf(result)).toEqual([expect.objectContaining({ field: "passages.0", message: expect.stringMatching(/21 chapters/) })]);
  });

  it("rejects a frontmatter passage that is not in canonical form", () => {
    const result = parseEntry("teaching", file, teaching(validTeaching.replace("John 6:35", "Jn 6:35")));
    expect(errorsOf(result)[0].message).toBe('write "Jn 6:35" in canonical form as "John 6:35"');
  });

  it("rejects a bad body passage and names its line", () => {
    const body = 'Intro.\n\n<Scripture passage="Hezekiah 3:16" version="KJV">\nText.\n</Scripture>\n';
    const result = parseEntry("teaching", file, teaching(validTeaching, body));
    expect(lines(result)).toEqual([
      'content/teachings/a-teaching.mdx line 12: <Scripture passage="Hezekiah 3:16">: "Hezekiah" is not a known book',
    ]);
  });

  it("rejects a missing passage, an expression passage and an unknown version", () => {
    const body = [
      '<Scripture version="KJV">\nText.\n</Scripture>',
      '<Scripture passage={"John 6:35"} version="KJV">\nText.\n</Scripture>',
      '<Scripture passage="John 6:35" version="NIV">\nText.\n</Scripture>',
    ].join("\n\n");
    expect(errorsOf(parseEntry("teaching", file, teaching(validTeaching, body)))).toHaveLength(3);
  });

  it("rejects a markdown blockquote, an unknown component and an import", () => {
    const body = 'import X from "./x"\n\n> A quotation.\n\n<Callout>Hi</Callout>\n';
    const messages = errorsOf(parseEntry("teaching", file, teaching(validTeaching, body))).map((e) => e.message);
    expect(messages).toEqual([
      expect.stringMatching(/import and export are not allowed/),
      expect.stringMatching(/not a markdown blockquote/),
      expect.stringMatching(/<Callout> is not an allowed component/),
    ]);
  });

  it("reports MDX that does not compile", () => {
    const result = parseEntry("teaching", file, teaching(validTeaching, "<Scripture passage=\"John 6:35\"\n"));
    expect(lines(result)[0]).toMatch(/MDX does not compile/);
  });
});

describe("splitFrontmatter", () => {
  it("returns the body's first line number", () => {
    expect(splitFrontmatter("---\na: 1\nb: 2\n---\nBody")?.bodyLine).toBe(5);
  });
});
