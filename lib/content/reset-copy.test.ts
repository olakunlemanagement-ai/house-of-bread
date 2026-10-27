import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// docs/RESET-BRIEF.md section 2: phrases the site never uses. Checked on
// every page and component the reset has rewritten so far. Add files here
// as each page is reset.
const resetFiles = [
  "app/(marketing)/page.tsx",
  "components/shared/Hero.tsx",
  "components/shared/SiteHeader.tsx",
  "components/shared/SiteFooter.tsx",
  "components/shared/nav-links.ts",
  "components/shared/CourseCard.tsx",
  "components/shared/NumberedRows.tsx",
  "components/shared/HomeTeachings.tsx",
];

const banned = [
  "Come and be fed",
  "Be fed by the Word",
  "Transform your life",
  "Unforgettable",
  "Journey of faith",
  "Learn more",
];

describe("reset copy rules", () => {
  for (const file of resetFiles) {
    it(`${file} uses none of the banned phrases`, () => {
      const text = readFileSync(file, "utf8").replace(/\s+/g, " ").toLowerCase();
      const found = banned.filter((phrase) => text.includes(phrase.toLowerCase()));
      expect(found).toEqual([]);
    });
  }
});
