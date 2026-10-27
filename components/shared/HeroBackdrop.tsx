import type { LoopId } from "@/lib/media/loops";
import { LoopVideo } from "./LoopVideo";

/**
 * On phones a hero that plays a phone crop keeps its loop frame at the
 * crop's exact shape, at least as wide and as tall as the hero, centred and
 * clipped. The poster (16:9) and the phone video (a centre crop) then cover
 * the same box the same way, whatever the hero's height, so the video fades
 * in over its poster without a jump. Keep in step with the `phone.aspect`
 * of each clip in scripts/loops/config.mjs (motion.test.ts checks).
 */
export const PHONE_FRAME: Partial<Record<LoopId, string>> = {
  "ambient-light": "max-md:aspect-[2/3]",
  "open-bible": "max-md:aspect-[4/3]",
};

const phoneFrame =
  "max-md:inset-auto max-md:left-1/2 max-md:top-1/2 max-md:min-h-full max-md:min-w-full max-md:-translate-x-1/2 max-md:-translate-y-1/2";

/**
 * The moving background of every hero: the page's loop behind a scrim
 * (white at 80% in light, night at 80% in dark). On phones and tablets the
 * scrim covers the whole hero. From lg it holds full strength over the left
 * 60%, where the text sits, then eases to 20% at the right edge, so the
 * loop shows there. Measured against every loop's darkest pixel (pure black)
 * in light and brightest (pure white) in dark: muted text 4.76:1 and 5.03:1
 * (docs/PLACEHOLDERS.md). Decorative and hidden from assistive tech.
 * The only place a LoopVideo renders (motion.test.ts). The hero clips it.
 */
export function HeroBackdrop({ loop, phone = false }: { loop: LoopId; phone?: boolean }) {
  const frame = phone && PHONE_FRAME[loop] ? `${phoneFrame} ${PHONE_FRAME[loop]}` : "";
  return (
    <>
      <LoopVideo id={loop} fill priority phone={phone} sizes="100vw" className={frame} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-(--scrim) lg:bg-transparent lg:[background-image:linear-gradient(to_right,var(--scrim)_0%,var(--scrim)_60%,var(--scrim-soft)_100%)]"
      />
    </>
  );
}
