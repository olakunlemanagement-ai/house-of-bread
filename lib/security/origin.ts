// Cross-site form posts. A plain form post is a "simple" request, so any site
// could make its visitors' browsers post to our forms (spam in the inbox,
// confirmation emails to addresses an attacker picks). Framework free.

/**
 * True when the browser says the post came from another site. Prefers
 * Sec-Fetch-Site, which every current browser sends; without it, compares
 * Origin with the request's own origin. An absent or "null" Origin (privacy
 * tools, some redirects) is not treated as cross-site, so a real visitor is
 * never turned away.
 */
export function isCrossSitePost(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "cross-site";
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;
  try {
    return new URL(origin).origin !== new URL(request.url).origin;
  } catch {
    return true;
  }
}
