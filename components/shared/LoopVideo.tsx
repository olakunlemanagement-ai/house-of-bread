import Image from "next/image";
import { getLoop, videosOf, type LoopId } from "@/lib/media/loops";
import { LoopVideoClient } from "./LoopVideoClient";

type LoopVideoProps = {
  id: LoopId;
  /** Size and shape of the frame, such as "aspect-video rounded-card". */
  className?: string;
  /** Fill the nearest positioned parent instead of sizing itself. */
  fill?: boolean;
  /** next/image sizes for the poster. */
  sizes: string;
  /** Preload the poster. Only for a loop that is the first screen's largest image. */
  priority?: boolean;
  /** Multiply the loop onto the page. Only for a loop keyed to pure white. */
  blend?: "multiply";
};

/**
 * A short silent decorative loop over its poster. The poster is a normal
 * next/image, so it is the LCP candidate and holds the space; the video lays
 * over it and fades in only once playing, so nothing shifts (the phone
 * rendition is a centred crop of the same frame, so it lines up too). Decorative:
 * the poster has empty alt text and the video is hidden from assistive tech.
 * A loop with a dark rendition carries both posters, and CSS shows the one
 * for the theme in effect, so the right one paints first. The dark poster
 * loads lazily, so light never fetches it (display: none never intersects).
 * See LoopVideoClient for when it plays.
 */
export function LoopVideo({ id, className = "", fill = false, sizes, priority = false, blend }: LoopVideoProps) {
  const loop = getLoop(id);
  return (
    <div data-loop={id} className={`${fill ? "absolute inset-0" : "relative"} ${className}`}>
      <LoopVideoClient
        light={videosOf(loop)}
        dark={loop.dark ? videosOf(loop.dark) : undefined}
        mediaClassName={blend === "multiply" ? "mix-blend-multiply" : ""}
      >
        <Image
          src={loop.poster}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${loop.dark ? "dark:hidden" : ""}`}
        />
        {loop.dark ? (
          <Image src={loop.dark.poster} alt="" fill sizes={sizes} className="hidden object-cover dark:block" />
        ) : null}
      </LoopVideoClient>
    </div>
  );
}
