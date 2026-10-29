import Image from "next/image";
import mark from "@/public/logo-mark.png";
import { Wordmark } from "./Wordmark";

/**
 * The House of Bread mark beside the text wordmark. The mark is a PNG with
 * alpha, cut from the supplied logo by scripts/logo/make-transparent.mjs, so
 * in the header it sits straight on the hero tint with no tile. On the deep
 * green footer the lid's edge falls to 2.49:1 (under 3:1), so there it sits in
 * a small white tile that keeps its true colours. In the dark theme the
 * header mark reads poorly on night too, so it gets the same white tile
 * (.logo-mark in globals.css), drawn by box-shadow so the 36px box and the
 * layout do not move.
 * TODO: swap for the SVG once the ministry supplies it, with a reversed
 * (light) version for dark, which would let the dark tile go.
 */
export function Logo({
  priority = false,
  onDeep = false,
  className = "",
  compact = false,
}: {
  /** True in the header, so the mark loads first. */
  priority?: boolean;
  /** The footer: the mark sits in a white rounded tile (see above). */
  onDeep?: boolean;
  className?: string;
  /**
   * Hide the name below 375px (the header), keeping the mark: at 320 and 360 the
   * name, the theme switch and the Menu button would overflow the screen.
   * The link around the logo carries the full name as its label.
   */
  compact?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`inline-flex shrink-0 items-center justify-center ${
          onDeep ? "size-10 rounded-xl bg-white p-1.5" : "logo-mark size-9"
        }`}
      >
        <Image src={mark} alt="" priority={priority} sizes="36px" className="h-full w-auto" />
      </span>
      <span className={compact ? "hidden min-[375px]:inline" : ""}>
        <Wordmark className="tracking-[0.14em] sm:tracking-[0.18em]" />
      </span>
    </span>
  );
}
