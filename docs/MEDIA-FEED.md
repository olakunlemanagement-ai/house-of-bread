# YouTube feeds: Home and Teachings

Last updated: 29 October 2026

## Decision

The Library page (`/media`) shows the latest six videos from the channel's public feed (`youtube.com/feeds/videos.xml`), fetched on the server by `getLatestVideos()` in `lib/youtube/videos.ts` (Home's teaching block since the Teachings rebuild) and refreshed hourly. When a refresh fails, the page keeps the last list that loaded. The empty state shows only when no fetch has succeeded for the current deployment, or when the channel has no videos.

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

The unit tests in `lib/youtube/videos.test.ts` cover the retry, the failure types, the build and development fallback, and that no message contains the channel id.

## Limits

- The last good list lasts for the life of a deployment. A new deployment that builds during an outage starts with the empty state, and recovers on the first successful refresh after a minute.
- During an outage, both Vercel and Next retry every 30 seconds on traffic. Each retry is one serverless invocation and two feed requests.

## Teachings (29 October 2026)

Teachings (`/media`), its watch pages and its series pages read one catalog, `getTeachingsCatalog()` in `lib/youtube/teachings.ts`, cached and refreshed hourly with the same failure rule as above: at runtime a section whose requests all fail throws, so the last good page stays; at build time it shows the section's fallback and retries after a minute. The loader itself (`lib/youtube/catalog.ts`) is framework free and tested on fixtures in `lib/youtube/catalog.test.ts` (0, 1, 4 and many items, Shorts mixed in, feed down, API down).

### Data paths, checked on 29 October 2026

| Data | Source | Checked |
| --- | --- | --- |
| Long-form teachings | Each channel's `UULF` + channel id without `UC` playlist feed | Works for both channels. Ministry: 2 videos. Pastor: 8. |
| Shorts | Each channel's `UUSH` playlist feed | Works for both. Ministry: 13. Pastor: 15 (the feed cap). |
| Live streams | `UULV` | 404 for the ministry channel: no live uploads. Not used. |
| Fallback for either | The channel feed, split by each entry's `/shorts/` link | Every Short in the ministry's channel feed links to `/shorts/`. |
| Series | With `YOUTUBE_API_KEY`: every playlist on both channels plus `seriesPlaylistIds`, newest first, eight at most. Without: the `seriesPlaylistIds` playlist feeds. | `PLUHSYJnvnito` (Bible Foundations Series, 6 videos) works as a feed. |
| Durations | Data API `videos.list` only. No key, no badge. | Not run: no key yet. |
| Featured title and description | The catalog, then oEmbed, then `content/videos/<id>.mdx` overrides. | `dC-2yHdPyGo` is in the pastor's long-form feed. |

RSS feeds list 15 entries at most, so without the key a series of 15 shows "15+ teachings", and an older upload drops out of the lists. Its watch page still works: oEmbed confirms it belongs to a teaching channel.

### Watch pages only for our videos

`/media/watch/[videoId]` renders for a video in the catalog, a configured id, an override, or one whose oEmbed `author_url` is a teaching channel's handle URL (`siteConfig.teachingChannels`). Anything else is a 404, so the site never frames someone else's video under its own name.

### Creating YOUTUBE_API_KEY

1. In Google Cloud Console (console.cloud.google.com), create a project, for example "hob-website".
2. APIs and Services, Library: find "YouTube Data API v3" and Enable it.
3. APIs and Services, Credentials: Create credentials, API key.
4. Edit the key. Under API restrictions choose "Restrict key" and tick only YouTube Data API v3. Leave application restrictions at None: the key is called from Vercel's servers, whose addresses change.
5. Put it in `.env.local` as `YOUTUBE_API_KEY=...`, and in Vercel (Settings, Environment Variables) for Production and Preview, marked Sensitive. Never with a `NEXT_PUBLIC_` prefix.

The key travels in the `X-Goog-Api-Key` header, never in a URL, and no log line includes it. Each hourly refresh costs about 15 units (playlists 3, playlist items one per series, videos one per 50 ids): a few hundred a day against the free 10,000.
