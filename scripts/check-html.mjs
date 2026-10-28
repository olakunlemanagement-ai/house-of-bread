// Checks that every route sends its real content in the first HTML, the way
// a visitor without JavaScript (or a crawler that runs none) receives it.
//
//   node scripts/check-html.mjs http://localhost:3100
//   node scripts/check-html.mjs https://<preview-url>
//
// Routes come from /sitemap.xml plus the noindex pages it leaves out. Each
// page must return 200 with a <main> landmark, its h1 and its key sentence
// visible without script. Content React streams into a hidden <div
// hidden id="S:..."> only appears once script runs, so it does not count.
// A page whose main holds only a loading skeleton fails. Skeletons that sit
// beside real content are listed, not failed.
//
// Exits 1 on any failure. Node built-ins only.

import { pathToFileURL } from "node:url";

/**
 * Expectations per route. `h1` and `key` are exact text (whitespace
 * normalised). A pattern route checks its h1 against the page title instead,
 * and a key sentence from the shared template. A route found in the sitemap
 * with no entry here fails, so new routes get an entry. `source`, where
 * given, is the newsletter source the signup form in main must post as a
 * hidden field, so the Kit tag is right without script.
 */
const EXACT = {
  "/": {
    h1: "Understand the Bible you've been reading.",
    key: "Free courses and teaching that bring you into an accurate understanding of God's Word",
  },
  "/about": {
    h1: "A teaching ministry",
    key: "The name comes from Bethlehem, the house of bread, where the Bread of Life was born.",
  },
  "/academy": {
    h1: "Free Bible courses",
    key: "Self-paced video lessons that take you through Scripture in context. Free, always.",
  },
  "/app": {
    h1: "The official House of Bread app",
    key: "Bible study, trusted teaching and practical guidance all in one place.",
  },
  "/ask": {
    h1: "Ask a question about the Bible",
    key: "Ask anonymously. No name or email needed.",
  },
  "/ask/sent": {
    h1: "Thank you, your question has been sent",
    key: "It reached the ministry without your name or any contact details.",
  },
  "/contact": {
    h1: "Get in touch",
    key: "Questions about the ministry, live sessions, the Academy or the app are welcome.",
  },
  "/events": {
    h1: "Live teaching, wherever you are",
    key: "House of Bread Global teaches live on YouTube.",
  },
  "/media": {
    h1: "Need a word for this season?",
    key: "Every message, in one place. Watch, then go deeper in the Academy.",
  },
  "/new-testament": {
    h1: "Study the New Testament, book by book",
    key: "House of Bread Global introduces every New Testament book before the verses are lifted out.",
  },
  "/plans": {
    h1: "Three journeys through the New Testament",
    key: "Each journey follows the order the books were written",
  },
  "/privacy": {
    h1: "Privacy policy",
    key: "How House of Bread Global collects, uses and protects personal data.",
  },
  "/subscribe": {
    h1: "Stay close to the ministry",
    key: "Reminders before each live session, new teaching and news from House of Bread Global",
    source: "subscribe-page",
  },
  "/subscribe/academy": {
    h1: "Hear when the Academy opens",
    key: "Be among the first to know when the first courses open",
    source: "academy-waitlist",
  },
  "/subscribe/check-email": {
    h1: "Check your email",
    key: "A confirmation email is on its way.",
  },
  "/teachings": {
    h1: "Teaching written to be understood",
    key: "A growing library from the ministry on doctrine",
  },
};

const PATTERNS = [
  { pattern: /^\/academy\/[^/]+$/, key: "What you'll learn" },
  { pattern: /^\/events\/[^/]+$/, key: "About this session" },
  { pattern: /^\/teachings\/[^/]+$/, key: "Related teachings" },
  { pattern: /^\/new-testament\/[^/]+$/, key: "Browse all 27 books" },
  { pattern: /^\/plans\/[^/]+$/, key: "About this journey" },
];

/** Pages the sitemap leaves out on purpose. */
const EXTRA_ROUTES = ["/subscribe/check-email", "/ask/sent"];

/**
 * An unknown slug renders on request. Its status must be 404, which fails
 * the run if not. Its content is reported as a warning only: Next 16.4 with
 * Cache Components sends an on demand 404 as a script only payload, so
 * without script the page is blank, and `dynamicParams` is not available to
 * route it to the static 404 instead.
 */
const NOT_FOUND = {
  path: "/teachings/check-html-no-such-page",
  h1: "This page isn't here.",
  key: "The link may be old, or the address may have been typed differently.",
};

const SKELETON = /class="skeleton\b|aria-busy="true"/g;

function decode(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function textOf(html) {
  return decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

/**
 * The HTML a visitor sees without script: everything before React's first
 * hidden streamed segment, minus scripts, styles and templates. <noscript>
 * content stays, since that is exactly what such a visitor sees.
 */
function visibleHtml(html) {
  const streamed = html.search(/<div hidden id="S:/);
  const shell = streamed === -1 ? html : html.slice(0, streamed);
  return shell
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<template\b[\s\S]*?<\/template>/gi, "")
    .replace(/<template\b[^>]*\/?>/gi, "");
}

/** Checks one page's HTML. Returns { failures, notes }. Exported for testing. */
export function analyse(html, { h1: expectedH1, key, h1InTitle = false, source }) {
  const failures = [];
  const notes = [];
  const visible = visibleHtml(html);

  const mainStart = visible.search(/<main\b/i);
  if (mainStart === -1) {
    failures.push(
      /<main\b/i.test(html)
        ? "the main landmark arrives only in a hidden streamed chunk, so it needs script"
        : "no main landmark",
    );
    return { failures, notes };
  }
  const mainEnd = visible.indexOf("</main>", mainStart);
  const main = visible.slice(mainStart, mainEnd === -1 ? undefined : mainEnd);
  // The visually hidden "Loading" status inside a LoadingRegion is not content.
  const mainText = textOf(main.replace(/<p role="status"[^>]*>[\s\S]*?<\/p>/g, ""));

  const h1s = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => textOf(match[1]));
  if (h1s.length === 0) {
    failures.push(/<h1\b/i.test(html) ? "the h1 arrives only after script runs" : "no h1 in main");
  } else if (h1s.length > 1) {
    failures.push(`more than one h1: ${h1s.map((h) => `"${h}"`).join(", ")}`);
  }
  const h1 = h1s[0] ?? "";
  if (h1 && expectedH1 && h1 !== expectedH1) failures.push(`h1 is "${h1}", expected "${expectedH1}"`);
  if (h1 && h1InTitle) {
    const title = textOf(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    if (!title.includes(h1)) failures.push(`h1 "${h1}" does not appear in the title "${title}"`);
  }

  if (!mainText.includes(key)) {
    failures.push(
      textOf(html).includes(key)
        ? `key sentence arrives only after script runs: "${key}"`
        : `key sentence missing: "${key}"`,
    );
  }

  if (source) {
    const sources = [...main.matchAll(/<input\b[^>]*\sname="source"[^>]*>/g)].map(
      ([input]) => input.match(/\svalue="([^"]*)"/)?.[1],
    );
    if (sources.length === 0) failures.push("no signup form with a source field in main");
    else if (sources.some((value) => value !== source)) {
      failures.push(`signup source is ${sources.join(", ")}, expected ${source}`);
    }
  }

  const skeletons = main.match(SKELETON)?.length ?? 0;
  if (skeletons > 0) {
    const withoutH1 = mainText.replace(h1, "").trim();
    if (withoutH1.length < 200) failures.push("a loading skeleton is the only main content");
    const regions = [...main.matchAll(/<p role="status"[^>]*>([\s\S]*?)<\/p>/g)].map((m) => textOf(m[1]));
    notes.push(`skeleton shown without script beside real content: ${regions.join(", ") || "unlabelled"}`);
  }

  return { failures, notes, h1 };
}

async function routesFrom(base) {
  const routes = new Set(Object.keys(EXACT));
  try {
    const response = await fetch(new URL("/sitemap.xml", base));
    if (!response.ok) throw new Error(`status ${response.status}`);
    const xml = await response.text();
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      // The sitemap names the production domain. Keep the path, use the base.
      routes.add(new URL(decode(loc)).pathname);
    }
  } catch (error) {
    console.log(`WARN sitemap unavailable (${error instanceof Error ? error.message : error}), checking known routes only`);
  }
  for (const route of EXTRA_ROUTES) routes.add(route);
  return [...routes].sort();
}

function expectationFor(route) {
  if (EXACT[route]) return EXACT[route];
  const match = PATTERNS.find(({ pattern }) => pattern.test(route));
  return match ? { key: match.key, h1InTitle: true } : undefined;
}

async function checkRoute(base, route, expectation, expectedStatus = 200) {
  let response;
  try {
    response = await fetch(new URL(route, base), {
      redirect: "manual",
      headers: { Accept: "text/html", "User-Agent": "check-html (no JavaScript)" },
    });
  } catch (error) {
    return { failures: [`request failed: ${error instanceof Error ? error.message : error}`], notes: [] };
  }
  if (response.status !== expectedStatus) {
    return { failures: [`status ${response.status}, expected ${expectedStatus}`], notes: [] };
  }
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html")) return { failures: [`content type ${type || "(none)"}`], notes: [] };
  return analyse(await response.text(), expectation);
}

async function main() {
  const base = process.argv[2];
  if (!base) {
    console.error("Usage: node scripts/check-html.mjs <base-url>");
    process.exit(2);
  }

  const routes = await routesFrom(base);
  let failed = 0;

  async function report(route, result) {
    const status = result.failures.length > 0 ? "FAIL" : "ok  ";
    if (result.failures.length > 0) failed += 1;
    console.log(`${status} ${route}${result.h1 ? `  h1: "${result.h1}"` : ""}`);
    for (const failure of result.failures) console.log(`       - ${failure}`);
    for (const note of result.notes) console.log(`       note: ${note}`);
  }

  for (const route of routes) {
    const expectation = expectationFor(route);
    if (!expectation) {
      await report(route, { failures: ["no expectation defined in scripts/check-html.mjs"], notes: [] });
      continue;
    }
    await report(route, await checkRoute(base, route, expectation));
  }
  const notFound = await checkRoute(base, NOT_FOUND.path, NOT_FOUND, 404);
  if (notFound.failures.some((failure) => failure.startsWith("status") || failure.startsWith("request"))) {
    await report(`${NOT_FOUND.path} (404)`, notFound);
  } else {
    await report(`${NOT_FOUND.path} (404)`, { failures: [], notes: notFound.notes, h1: notFound.h1 });
    for (const failure of notFound.failures) console.log(`       WARN ${failure}`);
  }

  const total = routes.length + 1;
  console.log(`\n${total - failed} of ${total} routes passed.`);
  process.exit(failed > 0 ? 1 : 0);
}

// Run only when called directly, so analyse() can be imported by a test.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
