import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// CLAUDE.md section 7, Themes: components use tokens only, so every one
// works in light and dark. Colours are defined in app/globals.css and
// nowhere else. This test fails on a hex value, a colour function, or a
// literal white or black utility in app/ or components/, outside the
// theme invariant uses listed below.

const roots = ["app", "components"];

const patterns = [
  { name: "hex colour", re: /(?<![\w&])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3})\b/gi },
  // No \b here: Tailwind arbitrary values put an underscore before rgb( (0_0_0_1px_rgb).
  { name: "colour function", re: /(?<![a-z-])(?:rgba?|hsla?|oklch|oklab|color-mix)\(/gi },
  {
    name: "literal white or black utility",
    re: /\b(?:bg|text|border(?:-[trblxy])?|ring|from|via|to|fill|stroke|outline|decoration|divide|placeholder|caret|accent|shadow)-(?:white|black)\b/g,
  },
];

/**
 * Theme invariant uses: the same in both themes on purpose. Each entry is a
 * file and the lines in it that may use a literal colour.
 */
const allowed: { file: string; line: RegExp; why: string }[] = [
  { file: "components/shared/SocialIcons.tsx", line: /./, why: "Brand marks keep their own colours on white tiles" },
  { file: "components/shared/SocialLinks.tsx", line: /bg-white/, why: "White tiles behind the brand marks, both themes" },
  { file: "components/shared/Logo.tsx", line: /bg-white/, why: "The footer's white logo tile" },
  { file: "components/shared/theme/theme-script.ts", line: /THEME_COLOR/, why: "theme-color meta values must be literal" },
  { file: "components/shared/SiteFooter.tsx", line: /border-white\/15/, why: "The footer is deep green in both themes" },
  { file: "components/shared/nav-styles.ts", line: /white\//, why: "Footer and legal pills on deep green" },
  { file: "components/shared/Button.tsx", line: /bg-white text-green-deep|border-white bg-white\/12|bg-white\/12 text-white/, why: "Footer buttons on deep green" },
  { file: "components/shared/forms.tsx", line: /border-white/, why: "Inputs on deep green" },
  { file: "components/shared/StoreButtons.tsx", line: /bg-white font-semibold text-green-deep/, why: "Footer store badges on deep green" },
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !entry.name.endsWith(".test.ts") ? [path] : [];
  });
}

describe("colour tokens", () => {
  const files = roots.flatMap(sourceFiles).map((path) => path.replaceAll("\\", "/"));

  it("finds source files to check", () => {
    expect(files.length).toBeGreaterThan(40);
  });

  it("uses tokens, not literal colours", () => {
    const found: string[] = [];
    for (const file of files) {
      readFileSync(file, "utf8")
        .split(/\r?\n/)
        .forEach((line, index) => {
          for (const { name, re } of patterns) {
            for (const match of line.matchAll(re)) {
              // White text sits only on fills that are the same in both
              // themes (emerald, green-night), so it is always allowed.
              if (/^text-white$/.test(match[0])) continue;
              if (allowed.some((entry) => entry.file === file && entry.line.test(line))) continue;
              found.push(`${file}:${index + 1} ${name} "${match[0]}"`);
            }
          }
        });
    }
    expect(found).toEqual([]);
  });
});

describe("light islands (.tone-light)", () => {
  const css = readFileSync("app/globals.css", "utf8");
  const block = (start: RegExp) => {
    const at = css.search(start);
    expect(at, String(start)).toBeGreaterThan(-1);
    const open = css.indexOf("{", at);
    let depth = 0;
    for (let i = open; i < css.length; i++) {
      if (css[i] === "{") depth++;
      if (css[i] === "}" && --depth === 0) return css.slice(open, i);
    }
    return "";
  };
  const names = (text: string) => new Set([...text.matchAll(/(--[a-z-]+):/g)].map((match) => match[1]));

  it("restates every token the dark theme changes, so no dark value leaks into a light panel", () => {
    const dark = names(block(/:root \{\s*@variant dark \{/));
    const light = names(block(/^\.tone-light \{/m));
    expect(dark.size).toBeGreaterThan(20);
    const missing = [...dark].filter((name) => !light.has(name) && !["--scrim", "--scrim-tail"].includes(name));
    expect(missing).toEqual([]);
  });
});
