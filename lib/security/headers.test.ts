import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { themeScript } from "@/components/shared/theme/theme-script";
import { buildCsp, securityHeaders } from "./headers";

function directive(csp: string, name: string): string | undefined {
  return csp
    .split("; ")
    .find((part) => part.startsWith(`${name} `))
    ?.slice(name.length + 1);
}

function cspFor(rules: ReturnType<typeof securityHeaders>, source: string): string {
  const value = rules
    .find((rule) => rule.source === source)
    ?.headers.find((header) => header.key === "Content-Security-Policy")?.value;
  if (!value) throw new Error(`No CSP for ${source}`);
  return value;
}

describe("buildCsp", () => {
  it("keeps eval and websockets out of production", () => {
    const csp = buildCsp({ dev: false });
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain("ws:");
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("adds eval and websockets in development only", () => {
    const csp = buildCsp({ dev: true });
    expect(directive(csp, "script-src")).toContain("'unsafe-eval'");
    expect(directive(csp, "connect-src")).toContain("ws:");
  });

  it("always sets the fixed directives", () => {
    for (const dev of [true, false]) {
      const csp = buildCsp({ dev });
      expect(directive(csp, "frame-ancestors")).toBe("'none'");
      expect(directive(csp, "object-src")).toBe("'none'");
      expect(directive(csp, "img-src")).toContain("https://i.ytimg.com");
    }
    expect(directive(buildCsp({ dev: false }), "connect-src")).toBe("'self' https://plausible.io");
  });
});

describe("theme script", () => {
  // The inline head script sets the theme before first paint. 'unsafe-inline'
  // is ignored once script-src carries a hash or a nonce, so then the
  // script's own hash must be listed. See docs/SECURITY-HEADERS.md.
  it("is allowed to run by script-src", () => {
    const scriptSrc = directive(buildCsp({ dev: false }), "script-src") ?? "";
    const hash = `'sha256-${createHash("sha256").update(themeScript).digest("base64")}'`;
    const usesHashes = /'(?:sha256|sha384|sha512|nonce)-/.test(scriptSrc);
    expect(usesHashes ? scriptSrc.includes(hash) : scriptSrc.includes("'unsafe-inline'")).toBe(true);
  });
});

describe("securityHeaders", () => {
  const rules = securityHeaders(false);

  it("is one rule for every route", () => {
    expect(rules.map((rule) => rule.source)).toEqual(["/(.*)"]);
  });

  // Site wide, because a browser keeps the first page's policy across
  // in-site navigation: a player reached from a page that blocked frames
  // would stay empty.
  it("allows youtube-nocookie and no other frame, on every route", () => {
    expect(directive(cspFor(rules, "/(.*)"), "frame-src")).toBe("https://www.youtube-nocookie.com");
  });

  it("sends the non CSP headers on every route", () => {
    const keys = rules[0].headers.map((header) => header.key);
    expect(keys).toEqual(
      expect.arrayContaining(["X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "X-Frame-Options"]),
    );
  });
});
