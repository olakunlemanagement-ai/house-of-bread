import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { courseProgress, lessonAdvance } from "./navigation";
import { completedIn, LocalLessonProgress } from "./progress";

const lessons = ["one", "two", "three"];

function memoryStorage() {
  const data = new Map<string, string>();
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value) };
}

describe("moving on from a lesson", () => {
  it("offers Next lesson and completes the lesson being left", () => {
    expect(lessonAdvance(lessons, "one")).toEqual({ label: "Next lesson", next: "two", completes: "one" });
  });

  it("offers Finish course on the last lesson, which also completes it", () => {
    expect(lessonAdvance(lessons, "three")).toEqual({ label: "Finish course", completes: "three" });
  });

  it("lets a course whose last lesson has no video reach Completed", () => {
    const storage = memoryStorage();
    const store = new LocalLessonProgress(() => storage);
    // Lessons one and two have videos that played to the end.
    store.setCompleted("a-course", "one", true);
    store.setCompleted("a-course", "two", true);
    expect(courseProgress(lessons, completedIn(store.snapshot(), "a-course")).status).toBe("in-progress");
    // Lesson three has no video: Finish course is the only way to complete it.
    const finish = lessonAdvance(lessons, "three");
    store.setCompleted("a-course", finish.completes, true);
    expect(courseProgress(lessons, completedIn(store.snapshot(), "a-course"))).toEqual({ status: "completed", done: 3, total: 3 });
  });

  it("marks the lesson complete in the button's click, before the link navigates", () => {
    const link = readFileSync("app/(player)/academy/[course]/[lesson]/_components/AdvanceLink.tsx", "utf8");
    expect(link).toMatch(/onClick=\{\(\) => setLessonCompleted\(course, advance\.completes, true\)\}/);
    const page = readFileSync("app/(player)/academy/[course]/[lesson]/page.tsx", "utf8");
    expect(page).toContain("<AdvanceLink");
    // Next lesson and Finish course are drawn only by AdvanceLink, never as a plain link.
    expect(page).not.toMatch(/>\s*(Next lesson|Finish course)\s*</);
  });

  it("shows Previous lesson disabled on lesson 1, in the same place and size", () => {
    const page = readFileSync("app/(player)/academy/[course]/[lesson]/page.tsx", "utf8");
    expect(page).toMatch(
      /<button type="button" disabled className=\{buttonClasses\("secondary", "light", "w-full sm:w-auto"\)\}>\s*<ButtonLabel>Previous lesson<\/ButtonLabel>/,
    );
    expect(page).toMatch(/<ButtonLink href=\{lessonHref\(previous\)\} variant="secondary" className="w-full sm:w-auto">/);
  });

  it("still completes a video lesson when its video ends", () => {
    const video = readFileSync("app/(player)/academy/[course]/[lesson]/_components/LessonVideo.tsx", "utf8");
    expect(video).toMatch(/onEnded=\{\(\) => setLessonCompleted\(course, lesson, true\)\}/);
  });
});
