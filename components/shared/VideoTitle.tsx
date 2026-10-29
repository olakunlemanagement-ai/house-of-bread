import { hasPlaceholderTitle } from "@/lib/youtube/featured";
import type { FeedVideo } from "@/lib/youtube/feed";
import { Placeholder } from "./Placeholder";

/** A video's title, marked as a placeholder when the feed did not supply it. */
export function VideoTitle({ video }: { video: FeedVideo }) {
  return hasPlaceholderTitle(video) ? <Placeholder>{video.title}</Placeholder> : <>{video.title}</>;
}
