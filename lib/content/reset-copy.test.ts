import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// docs/RESET-BRIEF.md section 2: phrases the site never uses, and the
// calls to action the reset replaced. Checked in every route, component,
// copy module and content file.
const roots = ["app", "components", "lib", "content"];

const banned = [
  "Come and be fed",
  "Be fed by the Word",
  "want to be fed",
  "Transform your life",
  "Unforgettable",
  "Journey of faith",
  "Learn more",
];

// Old button labels, mapped to the brief's labels or a plain verb
// (docs/PLACEHOLDERS.md, "Phase 2 reset"). Comments may still name them.
const retired = [
  "Join a live session",
  "Contact the ministry",
  "See the course",
  "Join this course",
  "See how to join",
  "Set a reminder",
  "Watch on YouTube",
  "Watch live on YouTube",
  "Listen on",
  "Play here",
  "See what is inside",
  "Subscribe for new teaching",
  "Stay close to the ministry",
  "Browse all 27 books",
  "Read this book in the app",
  "Start a journey in the app",
  "Compare the three paces",
  "View journey",
  "Back to the home page",
  // Pricing is not decided (28 October 2026): no button calls courses free.
  "Browse free courses",
  "Browse all free courses",
];

// Nothing says or shows that a course is free until pricing is decided.
const freeCourse = /\bfree(?: bible)? courses?\b|\bfree, always\b|\bcourse[^.]{0,40}\bfree\b|>\s*free\s*</;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(tsx?|mdx?)$/.test(entry.name) && !entry.name.endsWith(".test.ts") ? [path] : [];
  });
}

/** Source text without comments, flattened, lower case. */
function copyOf(file: string): string {
  return readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:"'`])\/\/.*$/gm, "$1")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

describe("reset copy rules", () => {
  const files = roots.flatMap(sourceFiles);

  it("finds every page to check", () => {
    const pages = files.filter((file) => /page\.tsx$/.test(file));
    expect(pages.length).toBeGreaterThanOrEqual(20);
  });

  it("uses none of the banned phrases anywhere", () => {
    const found = files.flatMap((file) => {
      const text = copyOf(file);
      return banned.filter((phrase) => text.includes(phrase.toLowerCase())).map((phrase) => `${file}: ${phrase}`);
    });
    expect(found).toEqual([]);
  });

  it("never calls a course free", () => {
    const found = files.filter((file) => freeCourse.test(copyOf(file)));
    expect(found).toEqual([]);
  });

  it("uses none of the retired button labels", () => {
    const found = files.flatMap((file) => {
      const text = copyOf(file);
      return retired.filter((label) => text.includes(label.toLowerCase())).map((label) => `${file}: ${label}`);
    });
    expect(found).toEqual([]);
  });
});
