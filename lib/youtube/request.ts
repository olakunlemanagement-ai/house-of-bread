// One request for one YouTube feed, with a retry, because the feed endpoint
// fails intermittently. Framework free, so it can be tested with a fake fetch.

import { parseFeed, type ParsedFeed } from "./feed";

/** A failed feed request. The message carries no URL, channel or playlist id. */
export class FeedRequestError extends Error {
  override name = "FeedRequestError";
}

export type RequestOptions = {
  fetch?: typeof fetch;
  attempts?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
};

async function once(url: string, fetcher: typeof fetch, timeoutMs: number): Promise<ParsedFeed> {
  let response: Response;
  try {
    response = await fetcher(url, {
      headers: { Accept: "application/atom+xml, application/xml;q=0.9" },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    // Only the error's name: a fetch error's message or cause can carry the URL.
    const name = error instanceof Error ? error.name : "unknown error";
    throw new FeedRequestError(`YouTube feed request failed (${name})`);
  }
  if (!response.ok) throw new FeedRequestError(`YouTube feed returned status ${response.status}`);
  const feed = parseFeed(await response.text());
  // An HTML error page, or anything else that is not an Atom feed.
  if (!feed) throw new FeedRequestError("YouTube feed returned no usable feed");
  return feed;
}

/** Fetches and parses one feed. Throws FeedRequestError when every attempt fails. */
export async function fetchFeed(
  url: string,
  { fetch: fetcher = fetch, attempts = 2, retryDelayMs = 750, timeoutMs = 6000 }: RequestOptions = {},
): Promise<ParsedFeed> {
  let lastError = new FeedRequestError("YouTube feed request failed");
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await once(url, fetcher, timeoutMs);
    } catch (error) {
      lastError = error instanceof FeedRequestError ? error : new FeedRequestError("YouTube feed request failed");
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
  throw lastError;
}
