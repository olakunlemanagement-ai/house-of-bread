import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { StaticCourseCatalog, type ClassRecord, type ClassSource } from "./static-catalog";

const records: ClassRecord[] = [
  { slug: "first", title: "First course", description: "One line.", placeholder: true },
  {
    slug: "second",
    title: "Second course",
    description: "Another line.",
    audience: "Believers",
    schedule: "Weekly",
    cost: "Free",
    joinUrl: "https://example.com/join",
  },
];

const source: ClassSource = {
  all: () => records,
  one: (slug) => {
    const data = records.find((record) => record.slug === slug);
    return data ? { data, body: `Body of ${slug}` } : undefined;
  },
};

const catalog = new StaticCourseCatalog(source);

describe("StaticCourseCatalog", () => {
  it("lists every class as a course, in source order", async () => {
    const courses = await catalog.listCourses();
    expect(courses.map((course) => course.slug)).toEqual(["first", "second"]);
    expect(courses[0]).toEqual({
      slug: "first",
      title: "First course",
      summary: "One line.",
      status: "coming-soon",
      placeholder: true,
    });
  });

  it("marks a course open only when it has a join link", async () => {
    const [first, second] = await catalog.listCourses();
    expect(first.status).toBe("coming-soon");
    expect(second.status).toBe("open");
    expect(second.placeholder).toBe(false);
  });

  it("returns a course with its overview and details", async () => {
    expect(await catalog.getCourse("second")).toEqual({
      slug: "second",
      title: "Second course",
      summary: "Another line.",
      status: "open",
      placeholder: false,
      overview: "Body of second",
      audience: "Believers",
      schedule: "Weekly",
      cost: "Free",
      joinUrl: "https://example.com/join",
    });
  });

  it("returns undefined for an unknown slug", async () => {
    expect(await catalog.getCourse("missing")).toBeUndefined();
  });
});

describe("the academy seam", () => {
  const dir = path.join(process.cwd(), "lib", "academy");

  it("imports no framework code", () => {
    for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".ts"))) {
      const text = fs.readFileSync(path.join(dir, file), "utf8");
      expect(text, file).not.toMatch(/from\s+["'](next|react)(\/[^"']*)?["']/);
    }
  });

  it("is the only way Academy pages reach course content", () => {
    const pages = path.join(process.cwd(), "app", "(marketing)", "academy");
    const files = fs.readdirSync(pages, { recursive: true, encoding: "utf8" }).filter((f) => f.endsWith(".tsx"));
    for (const file of files) {
      const text = fs.readFileSync(path.join(pages, file), "utf8");
      expect(text, file).not.toMatch(/@\/lib\/content["']/);
    }
  });
});
