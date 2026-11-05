// Security headers for every response, set from next.config so pages stay
// statically generated. Framework free: no Next.js or React imports.
//
// The policy allows 'unsafe-inline' scripts because each prerendered page
// carries inline React Server Components payload scripts, and a nonce would
// force every page to render per request. See docs/SECURITY-HEADERS.md for the
// trade-off and when to revisit it.

/**
 * The one host that may be framed, on every page (5 November 2026). It was
 * once allowed only on pages with an embed, but a browser keeps the policy
 * of the first page it loads: after an in-site navigation from a page that
 * blocked frames, the lesson, trailer and teaching players stayed empty.
 * Nothing loads from YouTube until the visitor presses play (YouTubeFacade),
 * and no other host can be framed.
 */
const YOUTUBE_FRAME = "https://www.youtube-nocookie.com";

export type CspOptions = {
  /** Development adds 'unsafe-eval' (React debugging) and ws: (hot reload). */
  dev: boolean;
};

export function buildCsp({ dev }: CspOptions): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", ...(dev ? ["'unsafe-eval'"] : [])],
    // next/image writes a style attribute, so inline styles stay allowed.
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https://i.ytimg.com"],
    "font-src": ["'self'"],
    // 'self' covers /api/subscribe, /api/contact and navigation fetches.
    // When the Plausible script lands, script-src needs plausible.io too.
    "connect-src": ["'self'", "https://plausible.io", ...(dev ? ["ws:"] : [])],
    "frame-src": [YOUTUBE_FRAME],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  const parts = Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`);
  if (!dev) parts.push("upgrade-insecure-requests");
  return parts.join("; ");
}

type Header = { key: string; value: string };
type HeaderRule = { source: string; headers: Header[] };

const staticHeaders: Header[] = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Only features the site never uses. Autoplay, fullscreen, encrypted-media
  // and picture-in-picture stay open for the YouTube player to be delegated.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  // Fallback for older browsers that ignore frame-ancestors.
  { key: "X-Frame-Options", value: "DENY" },
];

/** The next.config headers() rules: one rule for every route. */
export function securityHeaders(dev: boolean): HeaderRule[] {
  return [
    {
      source: "/(.*)",
      headers: [...staticHeaders, { key: "Content-Security-Policy", value: buildCsp({ dev }) }],
    },
  ];
}
