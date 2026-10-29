import { describe, expect, it } from "vitest";
import { count, courseProgress, formatDuration, lessonNeighbours, parseTab, progressLabel, startingCourses, withTab } from "./navigation";

const lessons = ["one", "two", "three"];

describe("previous and next lesson", () => {
  it("has no previous on the first lesson", () => {
    expect(lessonNeighbours(lessons, "one")).toEqual({ next: "two", position: 1, total: 3 });
  });

  it("has both in the middle", () => {
    expect(lessonNeighbours(lessons, "two")).toEqual({ previous: "one", next: "three", position: 2, total: 3 });
  });

  it("has no next on the last lesson, so the page offers Finish course", () => {
    expect(lessonNeighbours(lessons, "three")).toEqual({ previous: "two", position: 3, total: 3 });
  });

  it("has neither for a one lesson course or an unknown lesson", () => {
    expect(lessonNeighbours(["only"], "only")).toEqual({ position: 1, total: 1 });
    expect(lessonNeighbours(lessons, "ghost")).toEqual({ position: 0, total: 3 });
  });
});

describe("course progress", () => {
  it("is not started with nothing done, resuming at the first lesson", () => {
    const progress = courseProgress(lessons, new Set());
    expect(progress).toEqual({ status: "not-started", done: 0, total: 3, resume: "one" });
    expect(progressLabel(progress)).toBe("Not started");
  });

  it("resumes at the next unfinished lesson in order, even past a gap", () => {
    const progress = courseProgress(lessons, new Set(["one", "three"]));
    expect(progress).toEqual({ status: "in-progress", done: 2, total: 3, resume: "two" });
    expect(progressLabel(progress)).toBe("2 of 3 lessons");
  });

  it("is completed when every lesson is done, with nowhere to resume", () => {
    const progress = courseProgress(lessons, new Set(lessons));
    expect(progress).toEqual({ status: "completed", done: 3, total: 3 });
    expect(progressLabel(progress)).toBe("Completed");
  });

  it("ignores a lesson no longer in the course", () => {
    expect(courseProgress(lessons, new Set(["removed"])).status).toBe("not-started");
  });
});

describe("tabs in the URL", () => {
  const tabs = ["sections", "overview", "resources"] as const;

  it("reads a known tab and falls back for a missing or unknown one", () => {
    expect(parseTab("?tab=overview", tabs, "sections")).toBe("overview");
    expect(parseTab("", tabs, "sections")).toBe("sections");
    expect(parseTab("?tab=admin", tabs, "sections")).toBe("sections");
  });

  it("writes the tab, drops it for the default and keeps other parameters", () => {
    expect(withTab("", "overview", "sections")).toBe("?tab=overview");
    expect(withTab("?tab=overview", "sections", "sections")).toBe("");
    expect(withTab("?utm=x&tab=overview", "resources", "sections")).toBe("?utm=x&tab=resources");
  });
});

describe("time and counts", () => {
  it("writes minutes as hours and minutes", () => {
    expect([formatDuration(45), formatDuration(60), formatDuration(125)]).toEqual(["45 min", "1 hr", "2 hr 5 min"]);
  });

  it("pluralises", () => {
    expect([count(1, "lesson"), count(3, "section")]).toEqual(["1 lesson", "3 sections"]);
  });
});

describe("starting courses", () => {
  const course = (slug: string, category: string, startHere = false) => ({ slug, category, startHere });

  it("opens the Start Here course, then the first course in another category", () => {
    const courses = [course("a", "found"), course("b", "found", true), course("c", "nt"), course("d", "ot")];
    expect(startingCourses(courses).map((c) => c?.slug)).toEqual(["b", "c"]);
  });

  it("falls back to the first courses when there is no Start Here or no other category", () => {
    expect(startingCourses([course("a", "found"), course("b", "found")]).map((c) => c?.slug)).toEqual(["a", "b"]);
    expect(startingCourses<{ slug: string; category: string; startHere: boolean }>([]).map((c) => c?.slug)).toEqual([undefined, undefined]);
  });
});
