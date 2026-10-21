import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { NoopProgressProvider } from "./noop";
import type { AppSession, ProgressProvider } from "./types";

// The seam is not used at launch: these tests keep it inert and unused.

const anySession = {} as AppSession;

describe("NoopProgressProvider", () => {
  it("returns an empty list", async () => {
    const provider: ProgressProvider = new NoopProgressProvider();
    expect(await provider.getProgress(anySession)).toEqual([]);
  });

  it("makes no network calls", () => {
    const text = fs.readFileSync(path.join(process.cwd(), "lib", "app-integration", "noop.ts"), "utf8");
    expect(text).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|https?:\/\//);
  });
});

describe("the app integration seam", () => {
  const dir = path.join(process.cwd(), "lib", "app-integration");

  it("imports no framework code", () => {
    for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".ts"))) {
      const text = fs.readFileSync(path.join(dir, file), "utf8");
      expect(text, file).not.toMatch(/from\s+["'](next|react)(\/[^"']*)?["']/);
    }
  });

  it("is not imported by any page, component or route at launch", () => {
    const users: string[] = [];
    for (const root of ["app", "components"]) {
      const files = fs.readdirSync(root, { recursive: true, encoding: "utf8" });
      for (const file of files.filter((name) => /\.(tsx?|mts)$/.test(name))) {
        if (/app-integration/.test(fs.readFileSync(path.join(root, file), "utf8"))) users.push(`${root}/${file}`);
      }
    }
    expect(users).toEqual([]);
  });
});
