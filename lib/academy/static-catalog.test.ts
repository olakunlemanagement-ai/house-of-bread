import { describe, expect, it } from "vitest";
import type { AcademyCategoryData, AcademyCourseData, AcademyLessonData } from "../content/schemas";
import { roundToFive, StaticCourseCatalog, type AcademySource } from "./static-catalog";

const category = (slug: string, order: number): AcademyCategoryData => ({ slug, title: `[${slug}]`, order, placeholder: true });

const course = (slug: string, categorySlug: string, order: number, sections: number): AcademyCourseData => ({
  title: `[${slug}]`,
  slug,
  description: "Who is this course for? It is for everyone.",
  date: "2026-10-29",
  placeholder: true,
  scriptureRange: "[John 6]",
  teacher: "[Isaac Ola]",
  category: categorySlug,
  order,
  startHere: slug === "first",
  tags: [],
  outcomes: ["One", "Two", "Three"],
  image: "academy-course-reading-the-bible",
  resources: [],
  sections: Array.from({ length: sections }, (_, index) => ({
    number: index + 1,
    title: `Section ${index + 1}`,
    description: "A paragraph.",
    image: "academy-section-reading-the-bible-1",
  })),
});

const lesson = (courseSlug: string, slug: string, number: number, section: number, minutes: number): AcademyLessonData => ({
  title: slug,
  slug,
  course: courseSlug,
  section,
  number,
  description: "One line.",
  minutes,
  placeholder: true,
  ...(number === 1 ? { videoId: "wpNuDtvzMzs" } : {}),
});

// Lessons given out of order, to check the catalog orders them.
const source: AcademySource = {
  categories: () => [category("found", 1), category("nt", 2)],
  courses: () => [
    { data: course("later", "nt", 1, 1), body: "" },
    { data: course("second", "found", 2, 1), body: "" },
    { data: course("first", "found", 1, 2), body: "Overview of first." },
  ],
  lessons: () => [
    { data: lesson("first", "c", 3, 2, 25), body: "Notes c." },
    { data: lesson("first", "a", 1, 1, 18), body: "\nNotes a.\n" },
    { data: lesson("first", "b", 2, 1, 24), body: "" },
    { data: lesson("second", "x", 1, 1, 30), body: "" },
    { data: lesson("later", "y", 1, 1, 61), body: "" },
  ],
};

const catalog = new StaticCourseCatalog(source);

describe("StaticCourseCatalog", () => {
  it("lists courses by category order, then course order", async () => {
    expect((await catalog.listCourses()).map((c) => c.slug)).toEqual(["first", "second", "later"]);
  });

  it("computes totals: sections, lessons, minutes and the average lesson", async () => {
    const [first] = await catalog.listCourses();
    expect(first).toMatchObject({ sections: 2, lessons: 3, minutes: 67, minutesPerLesson: 20, lessonSlugs: ["a", "b", "c"] });
  });

  it("computes each section's lesson range and time", async () => {
    const detail = await catalog.getCourse("first");
    expect(detail?.sectionCount).toBe(2);
    expect(detail?.sections.map(({ number, firstLesson, lastLesson, minutes }) => ({ number, firstLesson, lastLesson, minutes }))).toEqual([
      { number: 1, firstLesson: 1, lastLesson: 2, minutes: 42 },
      { number: 2, firstLesson: 3, lastLesson: 3, minutes: 25 },
    ]);
    expect(detail?.sections[0]?.lessons.map((l) => [l.slug, l.hasVideo])).toEqual([
      ["a", true],
      ["b", false],
    ]);
    expect(detail?.overview).toBe("Overview of first.");
  });

  it("finds a lesson only within its own course, with its notes trimmed", async () => {
    expect(await catalog.getLesson("first", "a")).toMatchObject({ number: 1, notes: "Notes a.", videoId: "wpNuDtvzMzs" });
    expect(await catalog.getLesson("second", "a")).toBeUndefined();
    expect(await catalog.getCourse("nowhere")).toBeUndefined();
  });

  it("rounds the average lesson to 5 minutes, never below 5", () => {
    expect([roundToFive(1), roundToFive(22.3), roundToFive(22.5), roundToFive(61)]).toEqual([5, 20, 25, 60]);
  });
});
