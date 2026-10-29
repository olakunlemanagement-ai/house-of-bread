import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { themeScript } from "@/components/shared/theme/theme-script";
import { EMBED_ROUTES, buildCsp, securityHeaders } from "./headers";

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
    const csp = buildCsp({ dev: false, allowYouTubeFrame: false });
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain("ws:");
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("adds eval and websockets in development only", () => {
    const csp = buildCsp({ dev: true, allowYouTubeFrame: false });
    expect(directive(csp, "script-src")).toContain("'unsafe-eval'");
    expect(directive(csp, "connect-src")).toContain("ws:");
  });

  it("always sets the fixed directives", () => {
    for (const allowYouTubeFrame of [true, false]) {
      const csp = buildCsp({ dev: false, allowYouTubeFrame });
      expect(directive(csp, "frame-ancestors")).toBe("'none'");
      expect(directive(csp, "object-src")).toBe("'none'");
      expect(directive(csp, "img-src")).toContain("https://i.ytimg.com");
      expect(directive(csp, "connect-src")).toBe("'self' https://plausible.io");
    }
  });
});

describe("theme script", () => {
  // The inline head script sets the theme before first paint. 'unsafe-inline'
  // is ignored once script-src carries a hash or a nonce, so then the
  // script's own hash must be listed. See docs/SECURITY-HEADERS.md.
  it("is allowed to run by script-src", () => {
    const scriptSrc = directive(buildCsp({ dev: false, allowYouTubeFrame: true }), "script-src") ?? "";
    const hash = `'sha256-${createHash("sha256").update(themeScript).digest("base64")}'`;
    const usesHashes = /'(?:sha256|sha384|sha512|nonce)-/.test(scriptSrc);
    expect(usesHashes ? scriptSrc.includes(hash) : scriptSrc.includes("'unsafe-inline'")).toBe(true);
  });
});

describe("securityHeaders", () => {
  const rules = securityHeaders(false);

  it("blocks frames site wide", () => {
    expect(directive(cspFor(rules, "/(.*)"), "frame-src")).toBe("'none'");
  });

  it("lists exactly the routes that render an embed", () => {
    expect([...EMBED_ROUTES]).toEqual(["/", "/media", "/media/watch/:videoId", "/academy/:course", "/academy/:course/:lesson"]);
    // The catalogue has no player, so no pattern names /academy itself.
    expect(EMBED_ROUTES).not.toContain("/academy");
  });

  it("gives no other rule a YouTube frame", () => {
    const embed = new Set<string>(EMBED_ROUTES);
    for (const rule of rules.filter((r) => !embed.has(r.source))) {
      expect(directive(cspFor(rules, rule.source), "frame-src")).toBe("'none'");
    }
  });

  it("allows only youtube-nocookie on embed routes", () => {
    for (const route of EMBED_ROUTES) {
      expect(directive(cspFor(rules, route), "frame-src")).toBe("https://www.youtube-nocookie.com");
    }
  });

  it("puts embed overrides after the site wide rule, since the last match wins", () => {
    const siteWide = rules.findIndex((rule) => rule.source === "/(.*)");
    expect(siteWide).toBe(0);
    for (const route of EMBED_ROUTES) {
      expect(rules.findIndex((rule) => rule.source === route)).toBeGreaterThan(siteWide);
    }
  });

  it("sends the non CSP headers on every route", () => {
    const keys = rules[0].headers.map((header) => header.key);
    expect(keys).toEqual(
      expect.arrayContaining(["X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "X-Frame-Options"]),
    );
  });
});
