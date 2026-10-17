// Security headers for every response, set from next.config so pages stay
// statically generated. Framework free: no Next.js or React imports.
//
// The policy allows 'unsafe-inline' scripts because each prerendered page
// carries inline React Server Components payload scripts, and a nonce would
// force every page to render per request. See docs/SECURITY-HEADERS.md for the
// trade-off and when to revisit it.

/**
 * Routes that render a YouTube embed. Only these may frame
 * youtube-nocookie.com. Add a path here when a page gains an embed.
 */
export const EMBED_ROUTES = ["/", "/media"] as const;

const YOUTUBE_FRAME = "https://www.youtube-nocookie.com";

export type CspOptions = {
  /** Development adds 'unsafe-eval' (React debugging) and ws: (hot reload). */
  dev: boolean;
  /** True only on EMBED_ROUTES. */
  allowYouTubeFrame: boolean;
};

export function buildCsp({ dev, allowYouTubeFrame }: CspOptions): string {
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
    "frame-src": allowYouTubeFrame ? [YOUTUBE_FRAME] : ["'none'"],
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

/**
 * The next.config headers() rules. The site wide rule comes first and each
 * embed route follows it: for the same key, the last matching rule wins.
 */
export function securityHeaders(dev: boolean): HeaderRule[] {
  return [
    {
      source: "/(.*)",
      headers: [
        ...staticHeaders,
        { key: "Content-Security-Policy", value: buildCsp({ dev, allowYouTubeFrame: false }) },
      ],
    },
    ...EMBED_ROUTES.map((source) => ({
      source,
      headers: [{ key: "Content-Security-Policy", value: buildCsp({ dev, allowYouTubeFrame: true }) }],
    })),
  ];
}
