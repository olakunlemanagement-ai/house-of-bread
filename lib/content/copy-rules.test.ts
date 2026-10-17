import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// CLAUDE.md section 6: no em dash, no en dash, no bullet symbol, in any
// user facing copy. Every page and component is checked as source.
const roots = ["app", "components", "lib", "content"];
const forbidden = [
  { name: "em dash", char: String.fromCharCode(0x2014) },
  { name: "en dash", char: String.fromCharCode(0x2013) },
  { name: "bullet", char: String.fromCharCode(0x2022) },
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(tsx?|css|mdx?)$/.test(entry.name) ? [path] : [];
  });
}

describe("copy rules", () => {
  const files = roots.flatMap(sourceFiles);

  it("finds source files to check", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  for (const { name, char } of forbidden) {
    it(`uses no ${name}`, () => {
      const offenders = files.filter((file) => readFileSync(file, "utf8").includes(char));
      expect(offenders).toEqual([]);
    });
  }
});
