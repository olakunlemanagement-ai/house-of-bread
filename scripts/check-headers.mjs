// Checks the security headers on key routes of a running site.
//
//   node scripts/check-headers.mjs http://localhost:3100
//   node scripts/check-headers.mjs https://<preview-url>
//
// Prints the headers per route and exits 1 if any check fails. No
// dependencies: uses the global fetch in Node 18 and later.

// Every route frames youtube-nocookie.com and nothing else (lib/security/headers.ts).
// A watch page stands in for /media/watch/:videoId.
const WATCH = "/media/watch/dC-2yHdPyGo";
const SERIES = "/media/series/PLUHSYJnvnito";
const COURSE = "/academy/reading-the-bible";
const LESSON = "/academy/reading-the-bible/one-story-many-books";
const ROUTES = ["/", "/media", "/media/all", WATCH, SERIES, "/academy", COURSE, LESSON, "/events", "/about", "/app", "/contact", "/subscribe", "/ask", "/teachings", "/privacy"];
const YOUTUBE_FRAME = "https://www.youtube-nocookie.com";

const REQUIRED = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
};

const base = process.argv[2];
if (!base) {
  console.error("Usage: node scripts/check-headers.mjs <base-url>");
  process.exit(2);
}

function directive(csp, name) {
  const part = csp
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${name} `));
  return part ? part.slice(name.length + 1) : undefined;
}

let failures = 0;
function check(ok, message) {
  if (!ok) {
    failures += 1;
    console.log(`  FAIL ${message}`);
  }
}

for (const route of ROUTES) {
  const url = new URL(route, base);
  let response;
  try {
    response = await fetch(url, { method: "HEAD", redirect: "manual" });
  } catch (error) {
    failures += 1;
    console.log(`\n${route}\n  FAIL request failed: ${error instanceof Error ? error.message : error}`);
    continue;
  }

  const h = response.headers;
  const csp = h.get("content-security-policy") ?? "";
  console.log(`\n${route}  ${response.status}`);
  console.log(`  content-security-policy: ${csp || "(missing)"}`);
  for (const key of [...Object.keys(REQUIRED), "permissions-policy", "strict-transport-security", "x-vercel-cache"]) {
    console.log(`  ${key}: ${h.get(key) ?? "(missing)"}`);
  }

  check(response.status === 200, `status ${response.status}, expected 200`);
  for (const [key, value] of Object.entries(REQUIRED)) {
    check(h.get(key) === value, `${key} should be ${value}`);
  }
  check(Boolean(h.get("permissions-policy")), "permissions-policy missing");
  check(directive(csp, "frame-ancestors") === "'none'", "frame-ancestors should be 'none'");
  check(!csp.includes("'unsafe-eval'"), "CSP contains 'unsafe-eval' (development build?)");

  check(directive(csp, "frame-src") === YOUTUBE_FRAME, `frame-src should be ${YOUTUBE_FRAME}`);
}

console.log(failures ? `\n${failures} check(s) failed.` : "\nAll checks passed.");
// exitCode rather than exit(), so open fetch handles close cleanly first.
process.exitCode = failures ? 1 : 0;
