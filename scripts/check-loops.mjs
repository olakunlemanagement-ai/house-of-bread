// Proves the decorative loops behave in a real browser (CLAUDE.md section 7,
// Decorative motion loops and Motion):
//
// - every loop starts by itself, muted and inline, with no gesture
// - it plays past its end and restarts with no flash, freeze or blank frame
//   (the restart gap and the picture change at the loop point are measured
//   per clip, in light and in dark)
// - it pauses when scrolled offscreen and resumes when it returns
// - nothing stops it but Motion Off, Save-Data or prefers-reduced-motion:
//   it keeps playing over several loops and across a theme change
// - with Motion Off (the footer or menu control, or saved) no loop video
//   plays or shows, and the choice survives a reload
//
//   PLAYWRIGHT=<path to playwright package> node scripts/check-loops.mjs http://localhost:3100
//
// Playwright is not a project dependency. Point PLAYWRIGHT at any installed
// copy, such as one in the npx cache (npx playwright install chromium).
// Chromium plays the VP9 WebM; the MP4 seams are checked offline by
// npm run loops:seams. Exits 1 on any failure.

import { createRequire } from "node:module";
import path from "node:path";

const PAGES = ["/", "/about", "/academy"];
const HERO = { "/": "ambient-light", "/about": "dust-light", "/academy": "open-bible" };
const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 375, height: 812 };

// Thresholds at the loop point. A frame at 24 fps lasts 41.7 ms and a 60 Hz
// display shows it for 33 or 50 ms; the restart's seek may hold the last
// frame one refresh longer. A freeze is a frame held past two frame periods
// (83.3 ms, plus 1 ms of timing jitter), and any skipped frame fails on its
// own. Picture change: up to 2.5 times the clip's typical frame to frame
// change reads as motion, not a cut. A blank frame is one whose mean
// brightness drops by more than half from a neighbour.
const MAX_RESTART_GAP_MS = (2 * 1000) / 24 + 1;
const MAX_SEAM_RATIO = 2.5;

const base = process.argv[2];
const playwrightPath = process.env.PLAYWRIGHT;
if (!base || !playwrightPath) {
  console.error("Usage: PLAYWRIGHT=<path to playwright package> node scripts/check-loops.mjs <base-url>");
  process.exit(2);
}
const require = createRequire(path.join(path.resolve(playwrightPath), "index.js"));
const { chromium } = require(path.resolve(playwrightPath));

let failures = 0;
function fail(message) {
  failures += 1;
  console.log(`  FAIL ${message}`);
}
function check(ok, message) {
  if (!ok) fail(message);
  return ok;
}

const url = (route) => new URL(route, base).href;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** State of every loop on the page. */
function loopStates(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("[data-loop]")].map((frame) => {
      const video = frame.querySelector("video");
      return {
        id: frame.getAttribute("data-loop"),
        video: Boolean(video),
        playing: Boolean(video && !video.paused && video.readyState >= 2),
        shown: Boolean(video && getComputedStyle(video).display !== "none" && getComputedStyle(video).opacity !== "0"),
        src: video?.currentSrc ?? "",
        muted: Boolean(video?.muted),
        mutedAttr: Boolean(video?.hasAttribute("muted")),
        playsInline: Boolean(video?.playsInline),
        loop: Boolean(video?.loop),
        controls: Boolean(video?.controls),
      };
    }),
  );
}

/** Waits until the loop's video is playing and its time moves. */
async function waitPlaying(page, id, timeout = 8000) {
  try {
    await page.waitForFunction(
      (loopId) => {
        const video = document.querySelector(`[data-loop="${loopId}"] video`);
        return video && !video.paused && video.currentTime > 0.2 && video.readyState >= 3;
      },
      id,
      { timeout },
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Watches one loop through `wraps` restarts with requestVideoFrameCallback,
 * timing every presented frame by its presentation time. With pixels on,
 * the frames within 0.3 s of the loop point are also drawn to a 48 x 27
 * canvas, so the picture change across it can be compared with the
 * ordinary steps beside it. Reading pixels back costs main thread time
 * right at the restart, so timing is taken from a pass without it.
 */
function measureLoop(page, id, wraps, pixels = false) {
  return page.evaluate(
    ({ loopId, wanted, withPixels }) =>
      new Promise((resolve) => {
        const video = document.querySelector(`[data-loop="${loopId}"] video`);
        if (!video || !("requestVideoFrameCallback" in video)) return resolve({ error: "no video or no rVFC" });
        const W = 48;
        const H = 27;
        const NEAR = 0.3;
        const canvas = document.createElement("canvas");
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const frames = [];
        let seen = 0;
        const limit = setTimeout(() => finish("timed out"), (video.duration * (wanted + 1) + 4) * 1000);
        function grab() {
          ctx.drawImage(video, 0, 0, W, H);
          const data = ctx.getImageData(0, 0, W, H).data;
          const gray = new Uint8Array(W * H);
          let sum = 0;
          for (let i = 0; i < W * H; i++) {
            gray[i] = (data[i * 4] * 2126 + data[i * 4 + 1] * 7152 + data[i * 4 + 2] * 722) / 10000;
            sum += gray[i];
          }
          return { gray, mean: sum / (W * H) };
        }
        function mad(a, b) {
          let s = 0;
          for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
          return s / a.length;
        }
        function finish(error) {
          clearTimeout(limit);
          const steps = [];
          const gaps = [];
          const seams = [];
          for (let i = 1; i < frames.length; i++) {
            const a = frames[i - 1];
            const b = frames[i];
            const gap = b.at - a.at;
            if (b.t < a.t - 0.5) {
              seams.push({
                gap,
                step: a.gray && b.gray ? mad(a.gray, b.gray) : NaN,
                lastBefore: a.t,
                firstAfter: b.t,
                opacity: b.opacity,
                blank:
                  (a.mean !== undefined && b.mean < 0.5 * a.mean) ||
                  (frames[i + 1]?.mean !== undefined && b.mean < 0.5 * frames[i + 1].mean),
              });
            } else {
              if (a.gray && b.gray) steps.push(mad(a.gray, b.gray));
              gaps.push(gap);
            }
          }
          const median = (list) => [...list].sort((x, y) => x - y)[Math.floor(list.length / 2)] ?? 0;
          resolve({
            error,
            duration: video.duration,
            frames: frames.length,
            medianStep: median(steps),
            medianGap: median(gaps),
            maxGap: Math.max(0, ...gaps),
            seams,
          });
        }
        function onFrame(now, meta) {
          const t = meta.mediaTime;
          const near = withPixels && (t < NEAR || t > video.duration - NEAR);
          frames.push({ at: meta.presentationTime, t, ...(near ? grab() : {}), opacity: near ? getComputedStyle(video).opacity : "1" });
          const n = frames.length;
          if (n > 1 && frames[n - 1].t < frames[n - 2].t - 0.5) seen += 1;
          // A few frames past the last restart, so a blank frame after it is caught.
          if (seen >= wanted && t > NEAR) return finish(null);
          video.requestVideoFrameCallback(onFrame);
        }
        video.requestVideoFrameCallback(onFrame);
      }),
    { loopId: id, wanted: wraps, withPixels: pixels },
  );
}

async function scrollTo(page, id) {
  await page.evaluate((loopId) => {
    document.querySelector(`[data-loop="${loopId}"]`)?.scrollIntoView({ block: "center" });
  }, id);
}

const report = [];

async function checkLoopsOn(context, theme) {
  const seenIds = new Set();
  for (const route of PAGES) {
    const page = await context.newPage();
    await page.goto(url(route), { waitUntil: "load" });
    const ids = (await loopStates(page)).map((s) => s.id).filter((id) => !seenIds.has(id));
    for (const id of [...new Set(ids)]) {
      seenIds.add(id);
      await scrollTo(page, id);
      const hero = HERO[route] === id;
      const started = await waitPlaying(page, id);
      const state = (await loopStates(page)).find((s) => s.id === id);
      const where = `${theme} ${route} ${id}`;
      if (!state.video) {
        // Only a loop with no rendition for this theme may stay still.
        report.push({ theme, id, route, note: "poster only (no rendition for this theme)" });
        check(theme === "dark" && !hero, `${where}: no video`);
        continue;
      }
      check(started, `${where}: did not start by itself`);
      check(state.muted && state.mutedAttr, `${where}: not muted`);
      check(state.playsInline, `${where}: not playsinline`);
      check(state.loop, `${where}: no loop attribute`);
      check(!state.controls, `${where}: shows native controls`);
      if (theme === "dark") check(/-dark\.webm$/.test(state.src), `${where}: plays ${state.src}, not its dark rendition`);
      if (!started) continue;

      // Timing: two restarts for heroes, one for panels. Then one more
      // restart with pixels, for the picture change and a blank frame.
      const m = await measureLoop(page, id, hero ? 2 : 1);
      if (!check(!m.error && m.seams.length > 0, `${where}: could not measure the loop point (${m.error})`)) continue;
      const p = await measureLoop(page, id, 1, true);
      if (!check(!p.error && p.seams.length > 0, `${where}: could not capture the loop point (${p.error})`)) continue;
      const picture = p.seams[0];
      const ratio = p.medianStep ? picture.step / p.medianStep : 0;
      check(ratio <= MAX_SEAM_RATIO, `${where}: picture jumps at the loop point (${ratio.toFixed(2)}x a frame step)`);
      check(!picture.blank, `${where}: blank frame at the loop point`);
      check(picture.opacity === "1", `${where}: video faded (opacity ${picture.opacity}) at the loop point`);
      for (const seam of m.seams) {
        // Media frames skipped across the restart: the last frame should be one frame before the end, the first frame 0.
        const skipped = Math.max(0, Math.round((m.duration - seam.lastBefore + seam.firstAfter) * 24) - 1);
        report.push({
          theme,
          id,
          route,
          duration: m.duration,
          gap: seam.gap,
          medianGap: m.medianGap,
          ratio,
          lastBefore: seam.lastBefore,
          firstAfter: seam.firstAfter,
          blank: picture.blank,
          skipped,
        });
        check(skipped === 0, `${where}: ${skipped} frame(s) skipped at the loop point`);
        check(seam.gap <= MAX_RESTART_GAP_MS, `${where}: restart gap ${seam.gap.toFixed(0)} ms (freeze)`);
      }
      // A stall away from the loop point that does not repeat is the machine,
      // not the file: measure once more before failing.
      let maxGap = m.maxGap;
      if (maxGap > 120) {
        const again = await measureLoop(page, id, 1);
        console.log(`  note: ${where} stalled ${maxGap.toFixed(0)} ms mid loop; remeasured, worst gap ${again.maxGap?.toFixed(0)} ms`);
        maxGap = again.error ? maxGap : again.maxGap;
      }
      check(maxGap <= 120, `${where}: a ${maxGap.toFixed(0)} ms freeze mid loop, twice`);
      // Nothing stopped it over the restarts.
      const after = (await loopStates(page)).find((s) => s.id === id);
      check(after.playing, `${where}: stopped after looping`);
    }
    await page.close();
  }
  for (const id of ["ambient-light", "dust-light", "open-bible", "wheat-field", "bread-steam", "water-light", "green-mesh"]) {
    check(seenIds.has(id), `${theme}: loop ${id} not found on ${PAGES.join(", ")}`);
  }
}

async function checkOffscreen(context) {
  console.log("\nOffscreen pause and resume (Home hero)");
  const page = await context.newPage();
  await page.goto(url("/"), { waitUntil: "load" });
  check(await waitPlaying(page, "ambient-light"), "hero did not start");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pause(800);
  const away = (await loopStates(page)).find((s) => s.id === "ambient-light");
  console.log(`  scrolled to the footer: ${away.playing ? "playing" : "paused"}`);
  check(!away.playing, "hero kept playing offscreen");
  const t0 = await page.evaluate(() => document.querySelector('[data-loop="ambient-light"] video').currentTime);
  await pause(600);
  const t1 = await page.evaluate(() => document.querySelector('[data-loop="ambient-light"] video').currentTime);
  check(t0 === t1, "hero time moved while offscreen");
  await page.evaluate(() => window.scrollTo(0, 0));
  const back = await waitPlaying(page, "ambient-light", 4000);
  console.log(`  scrolled back: ${back ? "playing" : "still paused"}`);
  check(back, "hero did not resume on return");

  // A theme change swaps the rendition and keeps it moving.
  await page.click('header button[aria-pressed][data-theme-control]');
  await pause(300);
  const swapped = await waitPlaying(page, "ambient-light", 6000);
  const dark = (await loopStates(page)).find((s) => s.id === "ambient-light");
  console.log(`  after the theme switch: ${swapped ? "playing" : "stopped"} ${dark.src.split("/").pop()}`);
  check(swapped && /-dark\.webm$/.test(dark.src), "theme switch stopped the hero or kept the light rendition");
  await page.close();
}

async function checkMotionControl(browser) {
  console.log("\nMotion control");
  // Footer, desktop, keyboard.
  const context = await browser.newContext({ viewport: DESKTOP });
  const page = await context.newPage();
  await page.goto(url("/"), { waitUntil: "load" });
  check(await waitPlaying(page, "ambient-light"), "hero did not start");
  check((await page.locator("button:has-text('Pause'), button:has-text('Play background')").count()) === 0, "a Pause/Play button is on the page");
  const footerMotion = page.locator("footer button[aria-pressed]", { hasText: "On" });
  check((await footerMotion.count()) === 1, "footer has no single Motion control");
  check((await footerMotion.getAttribute("aria-pressed")) === "true", "Motion is not pressed (on) by default");
  check((await footerMotion.evaluate((b) => b.getAttribute("aria-labelledby") && document.getElementById(b.getAttribute("aria-labelledby")).textContent.trim())) === "Motion", "Motion control is not named Motion");
  // Reach it with Tab only.
  await page.evaluate(() => {
    const theme = document.querySelector("footer input[type=radio]:checked");
    theme?.focus();
  });
  let reached = false;
  for (let i = 0; i < 10 && !reached; i++) {
    await page.keyboard.press("Tab");
    reached = await page.evaluate(() => document.activeElement?.closest("footer")?.querySelector("button[aria-pressed]") === document.activeElement);
  }
  check(reached, "footer Motion control not reachable by Tab");
  const ring = await page.evaluate(() => {
    const s = getComputedStyle(document.activeElement);
    return { width: s.outlineWidth, style: s.outlineStyle };
  });
  console.log(`  footer control reached by Tab, focus ring ${ring.width} ${ring.style}`);
  check(ring.width === "3px" && ring.style === "solid", `focus ring is ${ring.width} ${ring.style}, not 3px solid`);
  await page.keyboard.press("Enter");
  await pause(400);
  check((await footerMotion.getAttribute("aria-pressed")) === "false", "Enter did not turn Motion off");
  const off = await loopStates(page);
  check(off.every((s) => !s.playing && !s.shown), `a loop still plays or shows with Motion off: ${JSON.stringify(off.filter((s) => s.playing || s.shown))}`);
  check((await page.evaluate(() => document.documentElement.dataset.motion)) === "off", "data-motion is not off");
  console.log(`  Motion off: ${off.filter((s) => s.video).length} video elements, ${off.filter((s) => s.playing).length} playing`);

  // Survives a reload, before first paint: no loop video plays or shows on any page.
  for (const route of PAGES) {
    await page.goto(url(route), { waitUntil: "load" });
    for (const s of await loopStates(page)) await scrollTo(page, s.id);
    await pause(1500);
    const states = await loopStates(page);
    check(states.every((s) => !s.playing && !s.shown), `${route}: a loop plays with Motion saved off`);
    console.log(`  reload ${route} with Motion off: ${states.filter((s) => s.playing).length} of ${states.length} loops playing`);
  }
  // Space turns it back on.
  await page.goto(url("/"), { waitUntil: "load" });
  await page.locator("footer button[aria-pressed]", { hasText: "On" }).focus();
  await page.keyboard.press("Space");
  await page.evaluate(() => window.scrollTo(0, 0));
  check(await waitPlaying(page, "ambient-light"), "hero did not start again when Motion turned on");
  await context.close();

  // Mobile menu, at 375 px.
  const phone = await browser.newContext({ viewport: PHONE });
  const mpage = await phone.newPage();
  // After hydration: the menu closes itself on navigation, hydration included.
  await mpage.goto(url("/"), { waitUntil: "networkidle" });
  await mpage.click("details[data-menu] summary");
  const menuMotion = mpage.locator("details[data-menu] button[aria-pressed]");
  check((await menuMotion.count()) === 1 && (await menuMotion.isVisible()), "mobile menu has no visible Motion control");
  const box = await menuMotion.boundingBox();
  check(box && box.height >= 44, `menu Motion control is ${box?.height}px tall, under 44`);
  await menuMotion.click();
  check((await menuMotion.getAttribute("aria-pressed")) === "false", "menu Motion control did not turn off");
  check((await mpage.evaluate(() => localStorage.getItem("hob:motion"))) === "off", "choice not saved");
  console.log("  mobile menu control: present, 44px or taller, saves off");
  await phone.close();
}

async function checkStoppers(browser) {
  console.log("\nOnly Motion, Save-Data and reduced motion stop a loop");
  const cases = [
    { name: "prefers-reduced-motion, no choice saved", options: { reducedMotion: "reduce" }, expect: false },
    { name: "prefers-reduced-motion, Motion saved on", options: { reducedMotion: "reduce" }, saved: "on", expect: true },
    { name: "Save-Data on", options: {}, saveData: true, expect: false },
    { name: "Motion saved off", options: {}, saved: "off", expect: false },
    { name: "none of these", options: {}, expect: true },
  ];
  for (const c of cases) {
    const context = await browser.newContext({ viewport: DESKTOP, ...c.options });
    await context.addInitScript(({ saved, saveData }) => {
      try {
        if (saved) localStorage.setItem("hob:motion", saved);
      } catch {}
      if (saveData) Object.defineProperty(navigator, "connection", { value: { saveData: true } });
    }, c);
    const page = await context.newPage();
    await page.goto(url("/"), { waitUntil: "load" });
    const playing = await waitPlaying(page, "ambient-light", c.expect ? 8000 : 2500);
    const states = await loopStates(page);
    console.log(`  ${c.name}: hero ${playing ? "plays" : "still"}, ${states.filter((s) => s.shown).length} videos shown`);
    check(playing === c.expect, `${c.name}: expected the hero to ${c.expect ? "play" : "stay still"}`);
    if (!c.expect) check(states.every((s) => !s.shown), `${c.name}: a video shows`);
    await context.close();
  }
}

const browser = await chromium.launch();
try {
  for (const theme of ["light", "dark"]) {
    console.log(`\nEvery loop, ${theme}, ${DESKTOP.width}px`);
    const context = await browser.newContext({ viewport: DESKTOP, colorScheme: theme });
    await checkLoopsOn(context, theme);
    if (theme === "light") await checkOffscreen(context);
    await context.close();
  }
  await checkMotionControl(browser);
  await checkStoppers(browser);
} finally {
  await browser.close();
}

console.log("\nRestart gap per clip (VP9 WebM in Chromium). Gap is the time between the last frame before the restart and the first after it; a normal frame is the median gap.");
console.log("theme  loop           page      length  gap ms  normal ms  last -> first (s)  skipped  picture change  blank");
for (const r of report) {
  if (r.note) {
    console.log(`${r.theme.padEnd(6)} ${r.id.padEnd(14)} ${r.route.padEnd(9)} ${r.note}`);
    continue;
  }
  console.log(
    `${r.theme.padEnd(6)} ${r.id.padEnd(14)} ${r.route.padEnd(9)} ${r.duration.toFixed(2).padStart(6)}  ${r.gap.toFixed(0).padStart(6)}  ${r.medianGap.toFixed(0).padStart(9)}  ${r.lastBefore.toFixed(3)} -> ${r.firstAfter.toFixed(3)}  ${String(r.skipped).padStart(7)}  ${r.ratio.toFixed(2).padStart(5)}x step    ${r.blank ? "YES" : "no"}`,
  );
}
console.log(failures > 0 ? `\n${failures} failure(s).` : "\nAll checks passed.");
process.exit(failures > 0 ? 1 : 0);
