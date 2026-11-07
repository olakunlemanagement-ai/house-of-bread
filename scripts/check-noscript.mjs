// Loads key pages in Chromium with JavaScript disabled and checks that each
// one shows its h1 and lead, with real content in main rather than a loading
// skeleton. Then measures each async region with and without JavaScript at
// three widths: without script the Suspense fallback stays on screen, with
// script the real content replaces it, so a height difference is the layout
// shift a visitor would see when the content arrives.
//
//   PLAYWRIGHT=<path to playwright package> node scripts/check-noscript.mjs http://localhost:3100
//   PLAYWRIGHT=<path to playwright package> node scripts/check-noscript.mjs https://<preview-url>
//
// Playwright is not a project dependency. Point PLAYWRIGHT at any installed
// copy, such as one in the npx cache (npx playwright install chromium).
// A page that errors (a failed load, a status other than 200, a check that
// throws) is reported, skipped in the later sections and listed as failed
// at the end, so one broken page never stops the run. Exits 1 on any failure.

import { createRequire } from "node:module";
import path from "node:path";

const PAGES = [
  { path: "/", lead: "Courses and teaching that bring you into an accurate understanding" },
  { path: "/about", lead: "an ancient Greek word that translates to" },
  { path: "/academy", lead: "Self-paced video lessons that take you through Scripture in context." },
  // A course page has a plain hero like the Teachings pages (29 October 2026).
  { path: "/academy/reading-the-bible", lead: "[What is the Bible, and how do you read it well?]", plain: true },
  // A lesson is a plain page like a Teachings watch page: the video opens it, no hero.
  { path: "/academy/reading-the-bible/one-story-many-books", lead: "[One line on what this lesson covers.]", plain: true },
  { path: "/academy/reading-the-bible/how-we-got-the-bible", lead: "This lesson is being prepared.", plain: true },
  // Teachings pages have a plain hero, not a full screen loop (BibleProject's pattern,
  // 29 October 2026): no scrim or full screen checks, the rest as every page.
  { path: "/media", lead: "Featured teaching", plain: true },
  { path: "/media/all", lead: "Every teaching, newest first.", plain: true },
  { path: "/media/series", lead: "Every series, newest first.", plain: true },
  { path: "/media/series/PLUHSYJnvnito", lead: "Series", plain: true },
  { path: "/media/watch/dC-2yHdPyGo", lead: "Teachings", plain: true },
  { path: "/events", lead: "New teaching live every Monday at 8 pm Lagos time." },
  { path: "/app", lead: "Daily reading and journeys through the New Testament, in your pocket." },
  { path: "/contact", lead: "Questions about the ministry, live sessions, the Academy or the app are welcome." },
  { path: "/subscribe", lead: "One email when something new is ready. Nothing else." },
  { path: "/subscribe/academy", lead: "Be among the first to know when the first courses open" },
  { path: "/ask", lead: "No name or email needed. We read every question" },
];

/** Async regions: the element whose height must not change when content replaces the fallback. */
const REGIONS = [
  { path: "/", name: "Home teachings", selector: "[data-region='home-teachings']", fallbackLink: true },
  // Teachings sections. Their cards link to pages on this site, so no "Watch now" link is expected.
  { path: "/media", name: "Latest teachings", selector: "[data-region='latest']", watchLink: false },
  { path: "/media", name: "Latest series", selector: "[data-region='series']", watchLink: false },
  { path: "/media", name: "Bible nuggets", selector: "[data-region='nuggets']", watchLink: false },
];

const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
];

const base = process.argv[2];
const playwrightPath = process.env.PLAYWRIGHT;
if (!base || !playwrightPath) {
  console.error("Usage: PLAYWRIGHT=<path to playwright package> node scripts/check-noscript.mjs <base-url>");
  process.exit(2);
}
const require = createRequire(path.join(path.resolve(playwrightPath), "index.js"));
const { chromium } = require(path.resolve(playwrightPath));

let failures = 0;
function fail(message) {
  failures += 1;
  console.log(`  FAIL ${message}`);
}

/** Pages that errored, with the first reason. Every later section skips them. */
const errored = new Map();
const live = (route) => !errored.has(route);
function pageError(route, where, reason) {
  failures += 1;
  if (!errored.has(route)) errored.set(route, `${where}: ${reason}`);
  console.log(`  FAIL ${route} errored in ${where} (${reason}), skipped from here on`);
}

/** Runs one check in a fresh tab. Anything it throws marks the page as errored instead of stopping the run. */
async function onPage(context, route, where, check) {
  const page = await context.newPage();
  try {
    return await check(page);
  } catch (error) {
    pageError(route, where, error instanceof Error ? error.message.split("\n")[0] : String(error));
    return undefined;
  } finally {
    await page.close().catch(() => {});
  }
}

const browser = await chromium.launch();
try {
  console.log("Without JavaScript");
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: VIEWPORTS[0] });
  for (const { path: route, lead } of PAGES) {
    await onPage(noJs, route, "the no JavaScript check", async (page) => {
      const response = await page.goto(new URL(route, base).href, { waitUntil: "load" });
      const status = response?.status() ?? 0;
      if (status !== 200) {
        console.log(`${route}  ${status}`);
        pageError(route, "the no JavaScript check", `status ${status}`);
        return;
      }
      const result = await page.evaluate((leadText) => {
        const visible = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
        const main = document.querySelector("main");
        const h1 = main?.querySelector("h1");
        const leadEl = [...(main?.querySelectorAll("p, div") ?? [])].find(
          (el) => el.children.length < 3 && el.textContent?.includes(leadText),
        );
        const busy = [...(main?.querySelectorAll('[aria-busy="true"]') ?? [])].filter(visible);
        const text = (main?.innerText ?? "").replace(/\s+/g, " ").trim();
        return {
          main: visible(main),
          h1: visible(h1) ? h1.innerText.replace(/\s+/g, " ").trim() : null,
          lead: visible(leadEl),
          words: text.split(" ").length,
          skeletons: busy.map((el) => el.querySelector('[role="status"]')?.textContent ?? "unlabelled"),
          state: main?.getAttribute("data-state") ?? null,
        };
      }, lead);
      console.log(
        `${route}  ${status}  h1: ${result.h1 ? `"${result.h1}"` : "(not visible)"}  lead: ${result.lead ? "visible" : "missing"}  words in main: ${result.words}`,
      );
      if (!result.main) fail("main is not visible");
      if (!result.h1) fail("h1 is not visible");
      if (!result.lead) fail("lead sentence is not visible");
      // While YouTube's lists are not answering, a watch or series page is short by design:
      // "unavailable" is one line and the way back, "partial" a teaching without its series
      // or "More teachings" (TeachingUnavailable, the watch page).
      if (result.state === "unavailable" || result.state === "partial") {
        console.log(`  note: shows the ${result.state} state (YouTube not answering), word count not checked`);
      } else if (result.words < 60) fail("main has under 60 words");
      for (const label of result.skeletons) console.log(`  note: skeleton stays without JavaScript: ${label}`);
    });
  }
  await noJs.close();

  // From lg the hero scrim holds full strength only to its hold point, then
  // fades so the loop shows (HeroBackdrop). Two shapes, read from the hero
  // text's data-hero-align:
  // - start (left aligned): every line of hero text, every button edge
  //   included, and the header nav must end inside the hold, or they sit
  //   over a weaker scrim than the contrast check assumes.
  // - center: the text spans the middle, so the scrim must hold full
  //   strength across the whole width (a hold of 100), and the text must
  //   sit centred and inside the hero.
  console.log("\nHero text on the scrim's full strength (lg and up)");
  for (const width of [1024, 1280, 1920]) {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    for (const { path: route } of PAGES.filter((p) => !p.plain && live(p.path))) {
      await onPage(context, route, `the scrim check at ${width}px`, async (page) => {
        await page.goto(new URL(route, base).href, { waitUntil: "load" });
        const result = await page.evaluate(() => {
          const scrim = document.querySelector("main [data-scrim-hold]");
          const text = document.querySelector("main [data-hero-text]");
          if (!scrim || !text) return null;
          const box = scrim.getBoundingClientRect();
          let left = Infinity;
          let right = 0;
          const take = (rect) => {
            left = Math.min(left, rect.left);
            right = Math.max(right, rect.right);
          };
          for (const el of text.querySelectorAll("*")) {
            // Visually hidden text (a screen reader's copy of the h1, say) is clipped to 1px, never painted.
            if (el.closest(".sr-only")) continue;
            // Text runs, and the boxes of buttons and pills (their outline sits on the scrim too).
            if (el.matches("a, button")) take(el.getBoundingClientRect());
            for (const node of el.childNodes) {
              if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              for (const rect of range.getClientRects()) take(rect);
            }
          }
          // The transparent header's nav sits on the same scrim (SiteHeader).
          let navRight = 0;
          for (const link of document.querySelectorAll('header nav[aria-label="Main"] a')) {
            if (link.getClientRects().length === 0) continue;
            navRight = Math.max(navRight, link.getBoundingClientRect().right);
          }
          const pct = (x) => ((x - box.left) / box.width) * 100;
          return {
            align: text.getAttribute("data-hero-align") === "center" ? "center" : "start",
            hold: Number(scrim.getAttribute("data-scrim-hold")),
            textStart: pct(left),
            textEnd: pct(right),
            offset: (left + right) / 2 - (box.left + box.right) / 2,
            navEnd: navRight ? pct(navRight) : null,
          };
        });
        if (!result) {
          fail(`${route} at ${width}px has no hero scrim or no marked hero text`);
          return;
        }
        const where = `${route} at ${width}px`;
        const label = `${String(width).padStart(4)}px  ${route.padEnd(20)} ${result.align.padEnd(6)}`;
        const navOk = (hold) => result.navEnd !== null && result.navEnd <= hold;
        const navFailure = (hold) =>
          `${where}: header nav ${result.navEnd === null ? "not found" : `runs to ${result.navEnd.toFixed(1)}%`}, past the scrim hold of ${hold}%`;

        if (result.align === "center") {
          const full = result.hold >= 100;
          const centred = Math.abs(result.offset) <= 4;
          const inside = result.textStart >= 0 && result.textEnd <= 100;
          console.log(
            `${label} text ${result.textStart.toFixed(1)}% to ${result.textEnd.toFixed(1)}%  off centre ${result.offset.toFixed(1)}px  header nav at ${result.navEnd?.toFixed(1) ?? "-"}%  hold ${result.hold}%  ${full && centred && inside && navOk(result.hold) ? "ok" : ""}`,
          );
          if (!full) fail(`${where}: a centred hero needs the scrim at full strength across the width, its hold is ${result.hold}%`);
          if (!centred) fail(`${where}: centred hero text is ${result.offset.toFixed(1)}px off centre`);
          if (!inside) fail(`${where}: hero text runs outside the hero (${result.textStart.toFixed(1)}% to ${result.textEnd.toFixed(1)}%)`);
          if (!navOk(result.hold)) fail(navFailure(result.hold));
          return;
        }

        // Below xl (1280) the scrim holds to 70% at least, for the header nav (hero-scrim, globals.css).
        const hold = width < 1280 ? Math.max(result.hold, 70) : result.hold;
        console.log(
          `${label} text ends at ${result.textEnd.toFixed(1)}%  header nav at ${result.navEnd?.toFixed(1) ?? "-"}%  hold ${hold}%  ${result.textEnd <= hold && navOk(hold) ? "ok" : ""}`,
        );
        if (result.textEnd > hold) fail(`${where}: hero text runs to ${result.textEnd.toFixed(1)}%, past the scrim hold of ${hold}%`);
        if (!navOk(hold)) fail(navFailure(hold));
      });
    }
    await context.close();
  }

  // Every hero fills the first screen, header included (heroFrameClass): the
  // next section starts at or below the fold, the hero text fits inside the
  // hero, and it sits centred in the screen below the header. With script
  // and Motion On the page settles (loops fade in over their posters, the
  // typewriter holds its space) without a layout shift.
  console.log("\nFull screen hero, the next section below the fold, no layout shift");
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
    await context.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    for (const { path: route, plain } of PAGES.filter((p) => live(p.path))) {
      await onPage(context, route, `the full screen check at ${viewport.width}px`, async (page) => {
        await page.goto(new URL(route, base).href, { waitUntil: "load" });
        await page.waitForTimeout(4500);
        const r = await page.evaluate((plainHero) => {
          const hero = document.querySelector("main > :first-child");
          const text = hero?.querySelector("[data-hero-text]");
          const header = document.querySelector("[data-site-header]");
          if (plainHero) return { plain: true, cls: window.__cls };
          if (!hero || !text || !header) return null;
          const h = hero.getBoundingClientRect();
          const t = text.getBoundingClientRect();
          const next = hero.nextElementSibling ?? document.querySelector("footer");
          return {
            fold: window.innerHeight,
            heroBottom: h.bottom + window.scrollY,
            nextTop: next ? next.getBoundingClientRect().top + window.scrollY : Infinity,
            fits: t.bottom <= h.bottom + 0.5,
            above: t.top - header.getBoundingClientRect().bottom,
            below: h.bottom - t.bottom,
            cls: window.__cls,
          };
        }, !!plain);
        if (!r) {
          fail(`${route} at ${viewport.width}px has no hero, marked hero text or header`);
          return;
        }
        const cls = Math.round(r.cls * 10000) / 10000;
        if (r.plain) {
          console.log(`${String(viewport.width).padStart(4)}px  ${route.padEnd(20)} plain hero  CLS ${cls}`);
          if (cls > 0.01) fail(`${route} at ${viewport.width}px: layout shift ${cls}`);
          return;
        }
        const filled = r.heroBottom >= r.fold - 0.5 && r.nextTop >= r.fold - 0.5;
        console.log(
          `${String(viewport.width).padStart(4)}px  ${route.padEnd(20)} hero ${Math.round(r.heroBottom)} of ${r.fold}  next at ${Math.round(r.nextTop)}  space above ${Math.round(r.above)} below ${Math.round(r.below)}  CLS ${cls}`,
        );
        if (!filled) fail(`${route} at ${viewport.width}px: the next section shows above the fold`);
        if (!r.fits) fail(`${route} at ${viewport.width}px: hero text overflows the hero`);
        if (cls > 0.01) fail(`${route} at ${viewport.width}px: layout shift ${cls}`);
      });
    }
    await context.close();
  }

  console.log("\nAsync region heights, fallback (no JavaScript) against content (JavaScript)");
  for (const viewport of VIEWPORTS) {
    const contexts = {
      fallback: await browser.newContext({ javaScriptEnabled: false, viewport, reducedMotion: "reduce" }),
      content: await browser.newContext({ javaScriptEnabled: true, viewport, reducedMotion: "reduce" }),
    };
    for (const region of REGIONS.filter((r) => live(r.path))) {
      const measured = {};
      for (const [mode, context] of Object.entries(contexts)) {
        measured[mode] = await onPage(context, region.path, `the ${region.name} height at ${viewport.width}px`, async (page) => {
          await page.goto(new URL(region.path, base).href, { waitUntil: "load" });
          if (mode === "content") {
            await page.waitForFunction(() => !document.querySelector('main [aria-busy="true"]'), null, { timeout: 15000 });
          }
          return page.$eval(region.selector, (el) => ({
            height: Math.round(el.getBoundingClientRect().height * 10) / 10,
            // A region in its unavailable state says so (data-state), so the table shows which state was measured.
            state: el.querySelector("[data-state]")?.getAttribute("data-state") ?? null,
          }));
        });
      }
      if (!measured.fallback || !measured.content) continue;
      const delta = Math.round((measured.content.height - measured.fallback.height) * 10) / 10;
      console.log(
        `${String(viewport.width).padStart(4)}px  ${region.name.padEnd(26)} fallback ${measured.fallback.height}  content ${measured.content.height}  shift ${delta}${measured.content.state ? `  (${measured.content.state} state)` : ""}`,
      );
      if (Math.abs(delta) > 1) fail(`${region.name} at ${viewport.width}px shifts by ${delta}px`);
    }
    await contexts.fallback.close();
    await contexts.content.close();
  }

  // Each region must offer exactly one visible "Watch now" link without
  // script: on the skeleton where the region has a fallback link, beside it
  // where the page already carries one in the first HTML.
  console.log('\n"Watch now" without JavaScript, reached by Tab');
  const keyboard = await browser.newContext({ javaScriptEnabled: false, viewport: VIEWPORTS[0] });
  for (const region of REGIONS.filter((r) => r.watchLink !== false && live(r.path))) {
    await onPage(keyboard, region.path, 'the "Watch now" check', async (page) => {
      await page.goto(new URL(region.path, base).href, { waitUntil: "load" });
      const found = await page.$eval(region.selector, (root) => {
        const links = [...root.querySelectorAll("a[href]")].filter(
          (a) =>
            a.textContent.trim().startsWith("Watch now") &&
            a.getClientRects().length > 0 &&
            !a.closest('[aria-hidden="true"], [aria-busy="true"]'),
        );
        return links.map((a, index) => {
          a.setAttribute("data-check-link", String(index));
          const box = a.closest(".relative");
          return {
            href: a.getAttribute("href"),
            name: a.textContent.replace(/\s+/g, " ").trim(),
            onSkeleton: !!box?.querySelector(':scope > [aria-busy="true"]'),
          };
        });
      });
      const link = found[0];
      let tabs = 0;
      let reached = false;
      if (link) {
        for (; tabs < 300 && !reached; tabs++) {
          await page.keyboard.press("Tab");
          reached = await page.evaluate(() => document.activeElement?.getAttribute("data-check-link") === "0");
        }
      }
      const where = link ? (link.onSkeleton ? "on the skeleton" : "beside the player") : "";
      console.log(
        `${region.path.padEnd(8)} ${region.name.padEnd(26)} ${found.length} link(s)  ${link ? `"${link.name}" ${where} -> ${link.href}` : ""}  ${reached ? `reached after ${tabs} Tab presses` : "not reached by Tab"}`,
      );
      if (found.length !== 1) fail(`${region.name} has ${found.length} visible "Watch now" links, expected 1`);
      if (link) {
        if (link.onSkeleton !== region.fallbackLink) {
          fail(`${region.name} link is ${where}, expected ${region.fallbackLink ? "on the skeleton" : "beside the player"}`);
        }
        if (!/^https:\/\/www\.youtube\.com\//.test(link.href ?? "")) fail(`${region.name} link is not a YouTube link`);
        if (!reached) fail(`${region.name} link is not reachable by Tab`);
      }
    });
  }
  await keyboard.close();
} finally {
  await browser.close();
}

if (errored.size > 0) {
  console.log("\nPages that errored (failed, and skipped after the error):");
  for (const [route, reason] of errored) console.log(`  FAIL ${route}  ${reason}`);
}
console.log(failures > 0 ? `\n${failures} failure(s).` : "\nAll checks passed.");
process.exit(failures > 0 ? 1 : 0);
