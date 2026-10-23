import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LOOP_IDS, getLoop, playableSource, type LoopId, type PlayContext } from "@/lib/media/loops";
import { resolveMotion } from "./motion-store";
import { MOTION_KEY, THEME_KEY, themeScript } from "./theme-script";

// CLAUDE.md section 7, Motion: one Motion control (On or Off) in the footer
// and the mobile menu stops every loop (WCAG 2.2.2). There is no per loop
// Pause/Play button.

/** Runs the head script against a stub html element, storage and media query. */
function runHeadScript({ saved = {}, reduce = false, storageThrows = false }: {
  saved?: Record<string, string>;
  reduce?: boolean;
  storageThrows?: boolean;
}) {
  const attrs = new Map<string, string>();
  const documentElement = { setAttribute: (name: string, value: string) => attrs.set(name, value) };
  const localStorage = {
    getItem(key: string) {
      if (storageThrows) throw new Error("SecurityError");
      return saved[key] ?? null;
    },
  };
  const matchMedia = (query: string) => ({ matches: reduce && query.includes("reduce") });
  const window = { matchMedia };
  new Function("document", "localStorage", "matchMedia", "window", themeScript)(
    { documentElement },
    localStorage,
    matchMedia,
    window,
  );
  return attrs;
}

describe("head script", () => {
  it("marks the page as scripted", () => {
    expect(runHeadScript({}).get("data-js")).toBe("");
  });

  it("follows prefers-reduced-motion when nothing is saved", () => {
    expect(runHeadScript({ reduce: false }).get("data-motion")).toBe("on");
    expect(runHeadScript({ reduce: true }).get("data-motion")).toBe("off");
  });

  it("applies a saved Motion choice over the system setting", () => {
    expect(runHeadScript({ saved: { [MOTION_KEY]: "off" }, reduce: false }).get("data-motion")).toBe("off");
    expect(runHeadScript({ saved: { [MOTION_KEY]: "on" }, reduce: true }).get("data-motion")).toBe("on");
  });

  it("ignores a stored value it does not know", () => {
    expect(runHeadScript({ saved: { [MOTION_KEY]: "paused" }, reduce: true }).get("data-motion")).toBe("off");
  });

  it("still sets Motion when storage throws", () => {
    const attrs = runHeadScript({ storageThrows: true, reduce: true });
    expect(attrs.get("data-motion")).toBe("off");
    expect(attrs.has("data-theme")).toBe(false);
  });

  it("still applies a saved theme", () => {
    expect(runHeadScript({ saved: { [THEME_KEY]: "dark" } }).get("data-theme")).toBe("dark");
  });
});

describe("resolveMotion", () => {
  it("prefers the saved choice", () => {
    expect(resolveMotion("on", true)).toBe("on");
    expect(resolveMotion("off", false)).toBe("off");
  });

  it("falls back to prefers-reduced-motion", () => {
    expect(resolveMotion(null, true)).toBe("off");
    expect(resolveMotion(null, false)).toBe("on");
    expect(resolveMotion("1", false)).toBe("on");
  });
});

describe("which loops play", () => {
  /** What LoopVideo hands LoopVideoClient: each video source, the dark one included. */
  const sources = (id: LoopId) => {
    const loop = getLoop(id);
    return { full: loop.full, mobile: loop.mobile, dark: loop.dark?.full };
  };

  const contexts: Omit<PlayContext, "motion">[] = [];
  for (const theme of ["light", "dark"] as const)
    for (const phone of [false, true])
      for (const saveData of [false, true]) contexts.push({ theme, phone, saveData });

  it("plays no loop anywhere when Motion is off", () => {
    for (const id of LOOP_IDS)
      for (const context of contexts) {
        expect(playableSource(sources(id), { ...context, motion: "off" }), `${id} ${JSON.stringify(context)}`).toBeNull();
      }
  });

  it("plays no loop with Save-Data on", () => {
    for (const id of LOOP_IDS)
      for (const context of contexts.filter((c) => c.saveData)) {
        expect(playableSource(sources(id), { ...context, motion: "on" })).toBeNull();
      }
  });

  it("plays every loop on a light desktop with Motion on", () => {
    for (const id of LOOP_IDS) {
      const loop = getLoop(id);
      expect(playableSource(sources(id), { motion: "on", saveData: false, theme: "light", phone: false })).toEqual(loop.full);
    }
  });

  it("plays the dark rendition in dark, and nothing for a loop without one", () => {
    for (const id of LOOP_IDS) {
      const loop = getLoop(id);
      expect(playableSource(sources(id), { motion: "on", saveData: false, theme: "dark", phone: false })).toEqual(
        loop.dark?.full ?? null,
      );
    }
  });

  it("gives every hero loop a dark rendition", () => {
    for (const id of ["ambient-light", "dust-light", "open-bible"] as const) {
      expect(getLoop(id).dark, id).toBeDefined();
    }
  });
});

describe("Motion controls", () => {
  const css = readFileSync("app/globals.css", "utf8");

  it("hides every loop video by CSS when Motion is off, from the first paint", () => {
    expect(css).toMatch(/html\[data-motion="off"\] \[data-loop\] video\s*\{\s*display: none !important;/);
  });

  it("has no Pause or Play control on any loop", () => {
    const files = (function walk(dir: string): string[] {
      return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return walk(path);
        return /\.tsx$/.test(entry.name) ? [path] : [];
      });
    })("components");
    const found = files.filter((file) => /Pause|"pause"|"resume"|background motion/.test(readFileSync(file, "utf8")));
    expect(found).toEqual([]);
  });

  it("places the Motion control beside the theme choice in the footer and the mobile menu", () => {
    for (const file of ["components/shared/SiteFooter.tsx", "components/shared/SiteHeader.tsx"]) {
      const source = readFileSync(file, "utf8");
      expect(source, file).toMatch(/<ThemeChoice[^>]*\/>\s*<MotionToggle/);
    }
  });

  it("gives the Motion control a name, a pressed state and a 3px focus ring", () => {
    const source = readFileSync("components/shared/theme/MotionToggle.tsx", "utf8");
    expect(source).toContain("aria-pressed={on}");
    expect(source).toContain("aria-labelledby={labelId}");
    expect(source).toContain("focus-visible:outline-3");
    expect(source).toContain("data-theme-control");
  });
});
