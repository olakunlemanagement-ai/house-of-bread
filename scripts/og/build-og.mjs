// Builds app/opengraph-image.png (1200 x 630), the share image every page
// uses: the mark, the ministry name and the Home headline, on white. It
// renders in a browser against the running site, so it uses the site's own
// fonts (Literata, Geist) and colour tokens.
//
//   PLAYWRIGHT=<path to playwright package> node scripts/og/build-og.mjs http://localhost:3100
//
// Playwright is not a project dependency (see scripts/check-noscript.mjs).
// Rebuild when the headline or the logo changes, and update
// app/opengraph-image.alt.txt to match.

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(ROOT, "app", "opengraph-image.png");
export const HEADLINE = "Understand the Bible you've been reading.";
export const LINE = "Free Bible courses and teaching";

const base = process.argv[2];
const playwrightPath = process.env.PLAYWRIGHT;
if (!base || !playwrightPath) {
  console.error("Usage: PLAYWRIGHT=<path> node scripts/og/build-og.mjs <base-url>");
  process.exit(2);
}
const require = createRequire(path.join(path.resolve(playwrightPath), "index.js"));
const { chromium } = require(path.resolve(playwrightPath));

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, colorScheme: "light" });
  await page.goto(new URL("/privacy", base).href, { waitUntil: "load" });
  await page.evaluate(
    ({ headline, line }) => {
      document.documentElement.setAttribute("data-theme", "light");
      document.body.innerHTML = `
        <div style="width:1200px;height:630px;display:flex;align-items:center;gap:64px;padding:0 96px;box-sizing:border-box;background:var(--surface)">
          <img src="/logo-mark.png" alt="" style="width:240px;height:auto;flex-shrink:0" />
          <div>
            <p class="eyebrow" style="font-size:22px;letter-spacing:0.16em">House of Bread Global</p>
            <p class="font-serif" style="margin-top:20px;font-size:64px;line-height:1.08;font-weight:500;letter-spacing:-0.02em;color:var(--ink)">${headline}</p>
            <p class="font-sans" style="margin-top:24px;font-size:28px;color:var(--ink-muted)">${line}</p>
          </div>
        </div>`;
      document.body.style.margin = "0";
    },
    { headline: HEADLINE, line: LINE },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log(`Wrote ${path.relative(ROOT, OUT)}`);
} finally {
  await browser.close();
}
