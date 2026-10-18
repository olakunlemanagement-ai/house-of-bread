import Image from "next/image";
import { getLoop, type LoopId } from "@/lib/media/loops";
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
 * over it and fades in only once playing, so nothing shifts. Decorative:
 * the poster has empty alt text and the video is hidden from assistive tech.
 * See LoopVideoClient for when it plays.
 */
export function LoopVideo({ id, className = "", fill = false, sizes, priority = false, blend }: LoopVideoProps) {
  const loop = getLoop(id);
  return (
    <div data-loop={id} className={`${fill ? "absolute inset-0" : "relative"} ${className}`}>
      <LoopVideoClient
        full={loop.full}
        mobile={loop.mobile}
        mediaClassName={blend === "multiply" ? "mix-blend-multiply" : ""}
      >
        <Image src={loop.poster} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      </LoopVideoClient>
    </div>
  );
}
