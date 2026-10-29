import { isVideoId, type FeedVideo } from "./feed";

/**
 * Shown when a configured video is not in the channel feed, so its title is
 * not known. Listed in docs/PLACEHOLDERS.md.
 */
export const VIDEO_TITLE_PLACEHOLDER = "[VIDEO TITLE TO BE SUPPLIED]";

/**
 * A configured video as a FeedVideo. Takes the title and date from the feed
 * when the video is there, otherwise the placeholder title, no date and the
 * standard i.ytimg.com thumbnail. Null when the id is missing or malformed.
 * Framework free, so it can be tested directly.
 */
export function resolveVideo(id: string | null, feed: FeedVideo[]): FeedVideo | null {
  if (!isVideoId(id)) return null;
  const found = feed.find((video) => video.id === id);
  if (found) return found;
  return {
    id,
    title: VIDEO_TITLE_PLACEHOLDER,
    publishedAt: null,
    url: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

/** True when the video's title came from the placeholder, not the feed. */
export function hasPlaceholderTitle(video: FeedVideo): boolean {
  return video.title === VIDEO_TITLE_PLACEHOLDER;
}
