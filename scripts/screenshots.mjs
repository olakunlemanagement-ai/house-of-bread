// Full page screenshots of every route, light and dark, as a normal visitor
// sees them: no reduced motion, so the Motion control shows its real default
// (On) and the hero loops play. Before each shot the page is scrolled to the
// bottom and back, so every one time heading reveal and the Home typewriter
// have run, then it waits for the loops to start (LOOP_START_DELAY_MS).
//
//   PLAYWRIGHT=<path to playwright package> node scripts/screenshots.mjs <base-url> <out-dir> [widths] [routes]
//
//   widths  comma separated, default 375,1280
//   routes  comma separated, default every route below
//   REDUCED=1 emulates prefers-reduced-motion (Motion then defaults to Off).
//
// Playwright is not a project dependency. Point PLAYWRIGHT at any installed
// copy, such as one in the npx cache (npx playwright install chromium).
// Writes <route>-<width>-<theme>.png and prints each page's height.

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const ROUTES = [
  "/",
  "/academy",
  "/academy/sample-class",
  "/media",
  "/about",
  "/ask",
  "/ask/sent",
  "/app",
  "/events",
  "/subscribe",
  "/subscribe/academy",
  "/subscribe/check-email",
  "/contact",
  "/new-testament",
  "/new-testament/matthew",
  "/plans",
  "/privacy",
  "/this-page-is-not-here",
];

const [base, outDir, widthsArg = "375,1280", routesArg] = process.argv.slice(2);
const playwrightPath = process.env.PLAYWRIGHT;
if (!base || !outDir || !playwrightPath) {
  console.error("Usage: PLAYWRIGHT=<path> node scripts/screenshots.mjs <base-url> <out-dir> [widths] [routes]");
  process.exit(2);
}
const require = createRequire(path.join(path.resolve(playwrightPath), "index.js"));
const { chromium } = require(path.resolve(playwrightPath));

const widths = widthsArg.split(",").map(Number);
const routes = routesArg ? routesArg.split(",") : ROUTES;
fs.mkdirSync(outDir, { recursive: true });

const name = (route) =>
  route === "/" ? "home" : route.slice(1).replace(/\//g, "-");

const browser = await chromium.launch();
try {
  for (const colorScheme of ["light", "dark"]) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: width < 768 ? 812 : 800 },
        colorScheme,
        reducedMotion: process.env.REDUCED ? "reduce" : "no-preference",
      });
      // Light is the default whatever the system says: dark is a saved choice.
      await context.addInitScript((value) => {
        try {
          localStorage.setItem("hob:theme", value);
        } catch {}
      }, colorScheme);
      const page = await context.newPage();
      for (const route of routes) {
        await page.goto(new URL(route, base).href, { waitUntil: "load" });
        // Walk down a screen at a time so every reveal and the typewriter fire.
        await page.evaluate(async () => {
          const step = window.innerHeight * 0.8;
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          window.scrollTo(0, 0);
        });
        // Typewriter (about 2.7 s) and the loop start delay (3 s after load and idle).
        await page.waitForTimeout(4500);
        const motion = await page.evaluate(() => document.documentElement.getAttribute("data-motion"));
        const file = `${name(route)}-${width}-${colorScheme}.png`;
        await page.screenshot({ path: path.join(outDir, file), fullPage: true });
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        console.log(`${file}  ${height}px  motion ${motion}`);
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}
