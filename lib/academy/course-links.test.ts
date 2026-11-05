import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { courseLinkFailures } from "../../scripts/check-html.mjs";
import { courseProgress, startCourseLink, viewCourseLink } from "./navigation";

const lessons = ["one", "two", "three"];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return /\.tsx?$/.test(entry.name) && !entry.name.endsWith(".test.ts") ? [path] : [];
  });
}
const progress = (...done: string[]) => courseProgress(lessons, new Set(done));

describe("course buttons: the label matches the destination", () => {
  it("opens the course page from a card", () => {
    expect(viewCourseLink("a-course")).toEqual({ label: "View this course", href: "/academy/a-course" });
  });

  it("starts at lesson 1 on the course page before anything is done", () => {
    expect(startCourseLink("a-course", lessons, progress())).toEqual({ label: "Start this course", href: "/academy/a-course/one" });
  });

  it("continues at the first unfinished lesson once a lesson is done", () => {
    expect(startCourseLink("a-course", lessons, progress("one", "three"))).toEqual({
      label: "Continue learning",
      href: "/academy/a-course/two",
    });
  });

  it("starts again at lesson 1 once the course is completed", () => {
    expect(startCourseLink("a-course", lessons, progress("one", "two", "three"))).toEqual({
      label: "Start this course",
      href: "/academy/a-course/one",
    });
  });

  it("offers no start button for a course with no lessons", () => {
    expect(startCourseLink("a-course", [], courseProgress([], new Set()))).toBeUndefined();
  });

  it("writes the three labels in one place only, so no page can pair one with the wrong link", () => {
    const files = ["app", "components"].flatMap((dir) => walk(dir));
    const code = (file: string) =>
      readFileSync(file, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
    const found = files.filter((file) => /View this course|Start this course|Continue learning/.test(code(file)));
    expect(found).toEqual([]);
    // Every place that draws a course button takes it from lib/academy.
    for (const file of [
      "components/shared/CourseCard.tsx",
      "components/shared/StartingCards.tsx",
      "app/(marketing)/academy/_components/StartHereCard.tsx",
      "app/(marketing)/academy/page.tsx",
      "app/(marketing)/academy/[course]/page.tsx",
    ]) {
      expect(readFileSync(file, "utf8"), file).toContain("viewCourseLink(");
    }
    expect(readFileSync("app/(marketing)/academy/[course]/_components/CourseProgress.tsx", "utf8")).toContain("startCourseLink(");
  });

  it("is checked on the built pages too (check-html)", () => {
    const good = `
      <a class="btn" href="/academy/a-course"><span class="btn-label">View this course<span class="sr-only">: A</span></span></a>
      <a href="/academy/a-course/one"><span>Start this course</span></a>
      <a href="/academy/a-course/two">Continue learning</a>`;
    expect(courseLinkFailures(good)).toEqual([]);
    const bad = `
      <a href="/academy/a-course/one">View this course</a>
      <a href="/academy/a-course">Start this course<span class="sr-only">: A</span></a>
      <a href="/academy">Continue learning</a>`;
    expect(courseLinkFailures(bad)).toEqual([
      '"View this course" goes to "/academy/a-course/one", expected a course page',
      '"Start this course" goes to "/academy/a-course", expected a lesson',
      '"Continue learning" goes to "/academy", expected a lesson',
    ]);
  });
});
