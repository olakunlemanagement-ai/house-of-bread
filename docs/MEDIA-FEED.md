# Library video feed

Last updated: 17 October 2026

## Decision

The Library page (`/media`) shows the latest six videos from the channel's public feed (`youtube.com/feeds/videos.xml`), fetched on the server by `getLatestVideos()` in `lib/media/videos.ts` and refreshed hourly. When a refresh fails, the page keeps the last list that loaded. The empty state shows only when no fetch has succeeded for the current deployment, or when the channel has no videos.

## How it works

The function is a `"use cache"` function, and its result is baked into the prerendered Media page. Each layer of cache only keeps the old copy if the refresh actually fails. A function that catches the failure and returns "unavailable" counts as a successful refresh, and the empty state replaces the videos. That was the behaviour before this change.

So the function now does this:

- Retries once, because the endpoint fails intermittently.
- At runtime in production, throws when every attempt fails. The page refresh fails, and the previous page stays in place.
- During `next build`, and in development, returns "unavailable" instead, with a one minute revalidate, so a build that hits an outage recovers quickly. Next 16.4.2 fails the whole build if a cached function throws while prerendering, even when the caller catches the error.
- Treats a real Atom feed with no entries as a channel with no videos. An HTML error page or anything else that parses to nothing is a failure.
- Logs the failure with the status or error name only. The channel id, URL and error cause are never logged.
- Uses a 30 day expire. A page past its expire renders while the visitor waits, and a failed feed would then fail the page. The long expire keeps that out of reach.

## Evidence for Next 16.4.2

From the installed source (`node_modules/next/dist`):

- `server/lib/cache-handlers/default.js`, `set()`: when the cached function errors, reading its result stream throws, and the entry is not written. The previous entry stays.
- `server/use-cache/use-cache-wrapper.js`: a stale entry is served while the refresh runs in the background. A failed background refresh is only logged.
- `server/response-cache/index.js`, `retainPreviousCacheEntry()`: when a page refresh throws, the previous page is stored again and retried within 30 seconds. This is the self-hosted path.

On Vercel, Next runs in minimal mode and Vercel's ISR layer keeps the page. Vercel's ISR documentation, section "On failure", says that when revalidation fails with a network error, a runtime error or a status other than 200, 301, 302, 307, 308, 404 or 410, Vercel keeps serving the existing content and retries after 30 seconds. A thrown error gives a 500, which counts as a failure. A 404 does not, so the Media page must never call `notFound()` for a feed failure.

## Check run on 17 October 2026

A throwaway Next 16.4.2 app with `cacheComponents`, run with `next build` and `next start`, read from a local fake feed that could return a body, a 404 or a dropped connection. Revalidate was set to 3 seconds. One page used the old pattern, returning "unavailable" on failure. The other used the new pattern, throwing at runtime.

| Feed | Old pattern | New pattern |
| --- | --- | --- |
| Good, "B" | B | B |
| 404 | empty state | B |
| Connection dropped | empty state | B |
| Good, "C" | C | C |
| 404, after a cold restart | empty state | C |

Building with the feed returning 404, the new pattern built successfully, showed the empty state with a 2 second revalidate, then moved to the new list once the feed recovered and kept it through later failures. A probe without the build fallback failed the build, which confirmed the note above about errors during prerendering.

The unit tests in `lib/media/videos.test.ts` cover the retry, the failure types, the build and development fallback, and that no message contains the channel id.

## Limits

- The last good list lasts for the life of a deployment. A new deployment that builds during an outage starts with the empty state, and recovers on the first successful refresh after a minute.
- During an outage, both Vercel and Next retry every 30 seconds on traffic. Each retry is one serverless invocation and two feed requests.
