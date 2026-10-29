import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { academyErrors } from "./academy-checks.ts";
import { formatError, loadCollection, parseEntry, type Entry, type ParseResult } from "./core.ts";
import type { ContentType } from "./schemas.ts";

const file = (frontmatter: string, body = "Body.\n") => `---\n${frontmatter.trim()}\n---\n\n${body}`;

const course = (extra = "", overrides: Record<string, string> = {}) => {
  const fields: Record<string, string> = {
    title: '"A course"',
    slug: "a-course",
    description: '"Who is Jesus? Two or three sentences follow."',
    date: "2026-10-29",
    scriptureRange: '"Matthew 1-4"',
    category: "foundations",
    order: "1",
    outcomes: '["One", "Two", "Three"]',
    image: "academy-course-reading-the-bible",
    sections: '[{ number: 1, title: "S1", description: "One paragraph.", image: "academy-section-reading-the-bible-1" }]',
    ...overrides,
  };
  return file(Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join("\n") + `\n${extra}`);
};

const lesson = (overrides: Record<string, string> = {}) => {
  const fields: Record<string, string> = {
    title: '"A lesson"',
    slug: "a-lesson",
    course: "a-course",
    section: "1",
    number: "1",
    description: '"One line."',
    minutes: "20",
    ...overrides,
  };
  return file(Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join("\n"));
};

const messages = <T extends ContentType>(result: ParseResult<T>) => (result.ok ? [] : result.errors.map(formatError));
const parseCourse = (source: string) => parseEntry("academyCourse", "content/academy/courses/a-course.mdx", source);
const parseLesson = (source: string) => parseEntry("academyLesson", "content/academy/lessons/a-course/a-lesson.mdx", source);

describe("academy course schema", () => {
  it("parses a valid course with defaults", () => {
    const result = parseCourse(course());
    expect(messages(result)).toEqual([]);
    if (!result.ok) return;
    expect(result.entry.data.teacher).toBe("[Isaac Ola]");
    expect(result.entry.data.startHere).toBe(false);
    expect(result.entry.data.tags).toEqual([]);
    expect(result.entry.data.resources).toEqual([]);
  });

  it("needs the description to open with a question", () => {
    const result = parseCourse(course("", { description: '"Jesus is Lord. Who is He?"' }));
    expect(messages(result).join("\n")).toMatch(/description: must open with a question/);
  });

  it("checks the scripture range through lib/scripture, in canonical form", () => {
    expect(messages(parseCourse(course("", { scriptureRange: '"Matt 1-4"' }))).join("\n")).toMatch(/canonical form as "Matthew 1-4"/);
    expect(messages(parseCourse(course("", { scriptureRange: '"Hezekiah 1"' }))).join("\n")).toMatch(/not a known book/);
  });

  it("allows a [bracketed] range only on a placeholder course, still checking the reference", () => {
    expect(messages(parseCourse(course("", { scriptureRange: '"[Matthew 1-4]"' }))).join("\n")).toMatch(/placeholder: true/);
    expect(messages(parseCourse(course("placeholder: true", { scriptureRange: '"[Matthew 1-4]"' })))).toEqual([]);
    expect(messages(parseCourse(course("placeholder: true", { scriptureRange: '"[Matthew 40]"' }))).join("\n")).toMatch(/28 chapters/);
  });

  it("rejects an unknown image slot, tag or field", () => {
    expect(messages(parseCourse(course("", { image: "no-such-slot" }))).join("\n")).toMatch(/not an image slot/);
    expect(messages(parseCourse(course('tags: ["Free"]'))).join("\n")).toMatch(/tags/);
    expect(messages(parseCourse(course("price: 10"))).join("\n")).toMatch(/price: is not a field/);
  });

  it("numbers sections 1, 2, 3 in order", () => {
    const sections =
      '[{ number: 2, title: "S", description: "P.", image: "academy-section-reading-the-bible-1" }]';
    expect(messages(parseCourse(course("", { sections }))).join("\n")).toMatch(/sections.0.number: must be 1/);
  });

  it("takes resources as PDFs under /academy only", () => {
    expect(messages(parseCourse(course('resources: [{ title: "Notes", kind: PDF, file: /academy/notes.pdf }]')))).toEqual([]);
    expect(
      messages(parseCourse(course('resources: [{ title: "Notes", kind: PDF, file: "https://example.com/a.pdf" }]'))).join("\n"),
    ).toMatch(/PDF path under \/academy/);
  });
});

describe("academy lesson schema", () => {
  it("parses a minimal lesson", () => {
    expect(messages(parseLesson(lesson()))).toEqual([]);
  });

  it("checks the video id and the reflection's shape", () => {
    expect(messages(parseLesson(lesson({ videoId: "not-an-id" }))).join("\n")).toMatch(/videoId: must be a YouTube video id/);
    expect(messages(parseLesson(lesson({ reflection: '{ question: "Q?" }' }))).join("\n")).toMatch(/reflection.response/);
  });
});

describe("lesson folders", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("loads lessons from a folder per course and checks the folder matches the course", () => {
    root = mkdtempSync(path.join(tmpdir(), "hob-academy-"));
    const dir = path.join(root, "content", "academy", "lessons");
    mkdirSync(path.join(dir, "a-course"), { recursive: true });
    mkdirSync(path.join(dir, "other-course"), { recursive: true });
    writeFileSync(path.join(dir, "a-course", "a-lesson.mdx"), lesson());
    writeFileSync(path.join(dir, "other-course", "a-lesson.mdx"), lesson());
    writeFileSync(path.join(dir, "stray.mdx"), lesson());

    const { entries, errors } = loadCollection(root, "academyLesson");
    expect(entries.map((entry) => entry.file)).toEqual(["content/academy/lessons/a-course/a-lesson.mdx"]);
    expect(errors.map(formatError)).toEqual([
      'content/academy/lessons/other-course/a-lesson.mdx: course: "a-course" must match the folder name "other-course"',
      "content/academy/lessons/stray.mdx: belongs in a folder named after its course",
    ]);
  });
});

// Cross-file rules, on in-memory entries.
const entry = <T extends ContentType>(type: T, name: string, data: unknown): Entry<T> =>
  ({ type, file: `content/${name}.mdx`, data, body: "" }) as Entry<T>;

const category = (slug: string, order: number) => entry("academyCategory", `academy/categories/${slug}`, { slug, title: slug, order });
const courseData = (slug: string, sections: number, extra: Record<string, unknown> = {}) =>
  entry("academyCourse", `academy/courses/${slug}`, {
    slug,
    category: "foundations",
    order: 1,
    startHere: false,
    sections: Array.from({ length: sections }, (_, index) => ({ number: index + 1 })),
    ...extra,
  });
const lessonData = (course: string, slug: string, number: number, section: number) =>
  entry("academyLesson", `academy/lessons/${course}/${slug}`, { course, slug, number, section });

describe("academy cross-file rules", () => {
  const valid = () => ({
    academyCategory: [category("foundations", 1)],
    academyCourse: [courseData("a-course", 2, { startHere: true })],
    academyLesson: [lessonData("a-course", "one", 1, 1), lessonData("a-course", "two", 2, 2)],
  });

  it("passes a consistent catalogue", () => {
    expect(academyErrors(valid())).toEqual([]);
  });

  it("needs exactly one Start Here course", () => {
    const none = { ...valid(), academyCourse: [courseData("a-course", 2)] };
    expect(academyErrors(none).map(formatError).join("\n")).toMatch(/one course must be marked startHere/);
    const two = {
      ...valid(),
      academyCourse: [courseData("a-course", 2, { startHere: true }), courseData("b-course", 1, { startHere: true, order: 2 })],
      academyLesson: [...valid().academyLesson, lessonData("b-course", "one", 1, 1)],
    };
    expect(academyErrors(two).map(formatError).join("\n")).toMatch(/only one course .* a-course, b-course/);
  });

  it("names an unknown category, course or section", () => {
    const library = {
      ...valid(),
      academyCourse: [courseData("a-course", 2, { startHere: true, category: "nowhere" })],
      academyLesson: [...valid().academyLesson, lessonData("ghost", "x", 1, 1), lessonData("a-course", "three", 3, 9)],
    };
    const text = academyErrors(library).map(formatError).join("\n");
    expect(text).toMatch(/category: "nowhere" is not a category/);
    expect(text).toMatch(/course: "ghost" is not a course/);
    expect(text).toMatch(/section: a-course has no section 9/);
  });

  it("numbers lessons 1 to N with no gaps, through the sections in order", () => {
    const gap = { ...valid(), academyLesson: [lessonData("a-course", "one", 1, 1), lessonData("a-course", "two", 3, 2)] };
    expect(academyErrors(gap).map(formatError).join("\n")).toMatch(/number: is 3, expected 2/);
    const backwards = { ...valid(), academyLesson: [lessonData("a-course", "one", 1, 2), lessonData("a-course", "two", 2, 1)] };
    expect(academyErrors(backwards).map(formatError).join("\n")).toMatch(/run through the sections in order/);
  });

  it("needs a lesson in every section and every course", () => {
    const empty = { ...valid(), academyLesson: [lessonData("a-course", "one", 1, 1)] };
    expect(academyErrors(empty).map(formatError).join("\n")).toMatch(/section 2 has no lessons/);
    const none = { ...valid(), academyLesson: [] };
    expect(academyErrors(none).map(formatError).join("\n")).toMatch(/has no lessons in content\/academy\/lessons\/a-course/);
  });

  it("keeps category and course orders unique", () => {
    const library = {
      ...valid(),
      academyCategory: [category("foundations", 1), category("other", 1)],
      academyCourse: [courseData("a-course", 1, { startHere: true }), courseData("b-course", 1)],
      academyLesson: [lessonData("a-course", "one", 1, 1), lessonData("b-course", "one", 1, 1)],
    };
    const text = academyErrors(library).map(formatError).join("\n");
    expect(text).toMatch(/order: 1 is already used by the category "foundations"/);
    expect(text).toMatch(/order: 1 is already used in "foundations" by "a-course"/);
  });
});
