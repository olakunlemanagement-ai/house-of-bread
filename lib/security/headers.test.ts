import { describe, expect, it } from "vitest";
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

describe("securityHeaders", () => {
  const rules = securityHeaders(false);

  it("blocks frames site wide", () => {
    expect(directive(cspFor(rules, "/(.*)"), "frame-src")).toBe("'none'");
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
