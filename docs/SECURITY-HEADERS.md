# Security headers

Last updated: 17 October 2026

## Decision

Security headers are set statically in `next.config.ts` through `headers()`, built by `lib/security/headers.ts`. Every page stays prerendered and served from the CDN.

A nonce policy was rejected. A nonce forces every page to render on each request, which turns off static generation and Partial Prerendering for all routes. Each page view would become a server render in one region. For visitors in Nigeria on mobile data, that means slower first loads and higher hosting cost. A hash policy was also rejected: the inline payload scripts change per page and per build, so it would need a custom post-build step.

## The weakness

`script-src` allows `'unsafe-inline'`. Each prerendered page carries inline React Server Components payload scripts, and a static header cannot name them. As a result, the policy does not stop an injected inline script from running. If a cross-site scripting bug ever let hostile HTML into a page, this policy would not contain it.

The risk is low today:

- No content comes from users. All content is MDX in the repository.
- The site uses no `dangerouslySetInnerHTML`.
- React escapes all output.

The policy still blocks external script hosts, limits where data can be sent (`connect-src`) and where images can be loaded from (`img-src`), and prevents clickjacking (`frame-ancestors 'none'`). It also limits framing to YouTube on pages with an embed.

**Revisit** if the site ever renders HTML supplied by users or editors, such as comments, rich-text fields or CMS embeds. At that point, move to a nonce policy and accept the cost.

## Policy

- Site wide: `default-src 'self'`; `img-src` adds `data:` and `i.ytimg.com`; `connect-src` adds `plausible.io`; `frame-src 'none'`; `object-src 'none'`; `base-uri 'self'`; `form-action 'self'`; `frame-ancestors 'none'`.
- Embed routes (`EMBED_ROUTES`: `/`, `/media`, `/events`): `frame-src https://www.youtube-nocookie.com`. Add a path to the list when a page gains an embed.
- Other headers: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and `X-Frame-Options`. Vercel sends `Strict-Transport-Security` itself.
- When the Plausible script is added, `script-src` needs `https://plausible.io`, or Plausible can be proxied through a rewrite so it stays `'self'`.

## Checking the headers

Run `node scripts/check-headers.mjs <base-url>` against a production server (`npm run build`, then `npm run start`) or a deployed preview. The script prints the headers for `/`, `/media`, `/events`, `/app`, `/contact` and `/subscribe`, and exits 1 if any check fails.

On 17 October 2026 all checks passed against a local production build. Home showed `frame-src https://www.youtube-nocookie.com`, and every other route showed `frame-src 'none'`.

## Outstanding before launch

The Vercel preview checks below have not been run yet, because no remote or preview exists. They must be run before launch.

1. Run `scripts/check-headers.mjs` against the preview URL. Also confirm that `strict-transport-security` is present and that `x-vercel-cache` shows the pages are served static.
2. Turn off the Vercel Toolbar for previews, so its `vercel.live` scripts do not show up as violations. Then load Home, Media, Events, App, Contact and Subscribe with the console open and confirm there are no Content-Security-Policy violations. Navigate between pages with the header links as well.
3. With `siteConfig.startHereVideoId` set, click Play on the Home facade and confirm the player loads with no violation.
4. With `YOUTUBE_CHANNEL_ID` set, confirm that the Media thumbnails load with no `img-src` or `style-src` violation.
5. With `KIT_API_KEY` and `KIT_FORM_ID` set, submit the newsletter form on `/subscribe`. Confirm the success message appears and there is no `connect-src` violation. Then repeat the submission with JavaScript off.
   With the Resend variables set, do the same with the question form on `/ask`. It posts to `/api/questions` on the same origin and Resend is called from the server, so the policy needs no change for it.
6. Frame the preview from another origin and confirm the browser refuses to show it.
