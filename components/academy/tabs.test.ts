import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TAB_IDS } from "./Tabs";

const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");

describe("Academy tabs", () => {
  it("has a rule in app/globals.css that shows each tab's panel", () => {
    for (const id of TAB_IDS) {
      expect(css).toContain(`html[data-js] [data-tabs][data-tab="${id}"] > [data-panel="${id}"]`);
    }
  });

  it("hides the other panels only when script runs, so every panel shows without it", () => {
    expect(css).toMatch(/html\[data-js\] \[data-tabs\] > \[data-panel\] \{\s*display: none;/);
    expect(css).not.toMatch(/(^|[^\]]\s)\[data-tabs\] > \[data-panel\] \{\s*display: none;/m);
  });
});
