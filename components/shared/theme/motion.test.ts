import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  LOOP_IDS,
  LOOP_START_DELAY_MS,
  PHONE_QUERY,
  SLOW_CONNECTIONS,
  getLoop,
  playableVideos,
  videosOf,
  type LoopId,
  type PlayContext,
} from "@/lib/media/loops";
import { resolveMotion } from "./motion-store";
import { MOTION_KEY, THEME_KEY, themeScript } from "./theme-script";

// CLAUDE.md section 7, Motion: one Motion control (On or Off) in the footer
// stops every loop (WCAG 2.2.2). There is no per loop Pause/Play button,
// and only hero loops move.

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
  /** What LoopVideo hands LoopVideoClient: each theme's videos. */
  const videos = (id: LoopId) => {
    const loop = getLoop(id);
    return { light: videosOf(loop), dark: loop.dark ? videosOf(loop.dark) : undefined };
  };
  const on: PlayContext = { motion: "on", saveData: false, slowConnection: false, theme: "light", phone: false };

  const contexts: Omit<PlayContext, "motion">[] = [];
  for (const theme of ["light", "dark"] as const)
    for (const phone of [false, true])
      for (const saveData of [false, true])
        for (const slowConnection of [false, true]) contexts.push({ theme, phone, saveData, slowConnection });

  it("plays no loop anywhere when Motion is off", () => {
    for (const id of LOOP_IDS)
      for (const context of contexts) {
        expect(playableVideos(videos(id), { ...context, motion: "off" }), `${id} ${JSON.stringify(context)}`).toBeNull();
      }
  });

  it("plays no loop with Save-Data on or on a slow connection", () => {
    for (const id of LOOP_IDS)
      for (const context of contexts.filter((c) => c.saveData || c.slowConnection)) {
        expect(playableVideos(videos(id), { ...context, motion: "on" }), `${id} ${JSON.stringify(context)}`).toBeNull();
      }
  });

  it("counts slow-2g, 2g and 3g as slow, and 4g as not", () => {
    expect([...SLOW_CONNECTIONS].sort()).toEqual(["2g", "3g", "slow-2g"]);
  });

  it("plays every loop on a light desktop with Motion on", () => {
    for (const id of LOOP_IDS) {
      expect(playableVideos(videos(id), on)?.full).toEqual(getLoop(id).full);
    }
  });

  it("plays the dark rendition in dark, and nothing for a loop without one", () => {
    for (const id of LOOP_IDS) {
      const loop = getLoop(id);
      expect(playableVideos(videos(id), { ...on, theme: "dark" })?.full ?? null).toEqual(loop.dark?.full ?? null);
    }
  });

  it("plays only the Home and Academy hero loops on phones, with their phone crop in either theme", () => {
    for (const id of LOOP_IDS)
      for (const theme of ["light", "dark"] as const) {
        const played = playableVideos(videos(id), { ...on, theme, phone: true });
        const hero = id === "ambient-light" || id === "open-bible";
        expect(Boolean(played), `${id} ${theme}`).toBe(hero);
        if (played) expect(played.phone?.webm, `${id} ${theme}`).toMatch(theme === "dark" ? /-dark-phone\.webm$/ : /[^k]-phone\.webm$/);
      }
  });

  it("gives every hero loop a dark rendition", () => {
    for (const id of ["ambient-light", "dust-light", "open-bible"] as const) {
      expect(getLoop(id).dark, id).toBeDefined();
    }
  });
});

describe("loop load order", () => {
  const client = readFileSync("components/shared/LoopVideoClient.tsx", "utf8");

  it("creates no video before window load and an idle moment, with a timeout fallback", () => {
    expect(client).toContain('addEventListener("load", idle');
    expect(client).toMatch(/requestIdleCallback\(done, \{ timeout: \d+ \}\)/);
    expect(client).toMatch(/window\.setTimeout\(done, \d+\)/);
    expect(client).toContain("if (!ready) return null;");
  });

  it("waits LOOP_START_DELAY_MS (3 s) more after load and idle before any loop starts", () => {
    expect(LOOP_START_DELAY_MS).toBe(3000);
    // The wait runs inside the idle callback, so it starts only once the page has settled.
    expect(client).toMatch(/const done = \(\) => \{\s*window\.setTimeout\(\(\) => \{\s*settled = true;[\s\S]*?\}, LOOP_START_DELAY_MS\);/);
  });

  it("never preloads a loop, and picks the phone crop with <source media>", () => {
    expect(client).toContain('preload="none"');
    expect(client).toContain("<source media={PHONE_QUERY} src={videos.phone.webm}");
    expect(client.indexOf("videos.phone.webm")).toBeLessThan(client.indexOf("videos.full.webm"));
    expect(PHONE_QUERY).toBe("(max-width: 767px)");
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

  it("places the one Motion control beside the theme choice in the footer, and nowhere else", () => {
    const footer = readFileSync("components/shared/SiteFooter.tsx", "utf8");
    expect(footer).toMatch(/<ThemeChoice[^>]*\/>\s*<MotionToggle/);
    // Since the reset the header and its phone menu carry links only.
    const header = readFileSync("components/shared/SiteHeader.tsx", "utf8");
    expect(header).not.toMatch(/MotionToggle|ThemeChoice|ThemeToggle/);
  });

  it("moves only hero loops: every other LoopVideo is still", () => {
    // The Home hero and each page's top header (PageHeader) may play a
    // loop. A panel lower on a page passes `still`, so it shows its poster.
    const heroes = new Set(["components/shared/Hero.tsx", "components/shared/PageHeader.tsx"]);
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return walk(path);
        return /\.tsx$/.test(entry.name) ? [path] : [];
      });
    const files = [...walk("app"), ...walk("components")];
    expect(files.some((file) => /about[\\/]page\.tsx$/.test(file))).toBe(true);
    for (const file of files) {
      const normalised = file.replace(/\\/g, "/");
      if (heroes.has(normalised) || normalised.endsWith("/LoopVideo.tsx")) continue;
      const uses = readFileSync(file, "utf8").match(/<LoopVideo\b[^>]*>/g) ?? [];
      for (const use of uses) expect(use, normalised).toMatch(/\bstill\b/);
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
