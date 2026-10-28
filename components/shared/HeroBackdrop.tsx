import type { CSSProperties } from "react";
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

/**
 * Every hero fills the first screen, header included: 100svh (the small
 * viewport height, so it never changes as a phone's address bar slides),
 * so the next section shows only once the visitor scrolls. It grows past
 * that when its content needs more. The 64px header sits over its top (a
 * negative margin in SiteHeader), so the body's top padding is the header
 * plus the same clear space as the bottom padding: the content is centred
 * in the screen below the header. scripts/check-noscript.mjs measures it at
 * 375, 768 and 1280.
 */
export const heroFrameClass = "relative flex min-h-svh flex-col overflow-hidden bg-surface";
export const heroBodyClass =
  "container-page relative z-10 w-full flex-1 pb-16 pt-32 sm:pb-20 sm:pt-36";

const phoneFrame =
  "max-md:inset-auto max-md:left-1/2 max-md:top-1/2 max-md:min-h-full max-md:min-w-full max-md:-translate-x-1/2 max-md:-translate-y-1/2";

/**
 * The moving background of every hero: the page's loop behind a scrim
 * (white at 80% in light, night at 80% in dark; `hero-scrim` in
 * app/globals.css). Below lg the text spans the hero, so the scrim covers
 * it at full strength. From lg it holds full strength over the text column,
 * to `hold` percent of the hero's width (60 by default, 70 on Home, whose
 * heading runs to 67% at 1024), then eases to 6% over the next 20% of the
 * width, so the loop shows clearly on the right. Text inside the hold is measured
 * against every loop's worst pixel: pure black in light, pure white in
 * dark, muted text 4.76:1 and 5.02:1 (docs/PLACEHOLDERS.md).
 * scripts/check-noscript.mjs fails if hero text crosses the hold.
 * Decorative and hidden from assistive tech. The only place a LoopVideo
 * renders (motion.test.ts). The hero clips it.
 */
export function HeroBackdrop({ loop, phone = false, hold = 60 }: { loop: LoopId; phone?: boolean; hold?: number }) {
  const frame = phone && PHONE_FRAME[loop] ? `${phoneFrame} ${PHONE_FRAME[loop]}` : "";
  return (
    <>
      <LoopVideo id={loop} fill priority phone={phone} sizes="100vw" className={frame} />
      <div
        aria-hidden="true"
        data-scrim-hold={hold}
        style={{ "--scrim-hold": `${hold}%` } as CSSProperties}
        className="hero-scrim pointer-events-none absolute inset-0"
      />
    </>
  );
}
