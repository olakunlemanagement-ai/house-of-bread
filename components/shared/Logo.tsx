import Image from "next/image";
import mark from "@/public/logo-mark.png";
import { Wordmark } from "./Wordmark";

/**
 * The House of Bread mark beside the text wordmark. The mark is a trimmed
 * PNG on white with no transparency, so on the deep green footer it sits in
 * a small white tile. TODO: swap for the SVG once the ministry supplies it.
 */
export function Logo({
  priority = false,
  onDeep = false,
  className = "",
  compact = false,
}: {
  /** True in the header, so the mark loads first. */
  priority?: boolean;
  /** The footer: the mark sits in a white rounded tile. */
  onDeep?: boolean;
  className?: string;
  /** Hide the name on very narrow screens (the header), keeping the mark. */
  compact?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`inline-flex shrink-0 items-center justify-center ${
          onDeep ? "size-10 rounded-xl bg-white p-1.5" : "size-9"
        }`}
      >
        <Image src={mark} alt="" priority={priority} sizes="36px" className="h-full w-auto" />
      </span>
      <span className={compact ? "hidden min-[420px]:inline" : ""}>
        <Wordmark className="tracking-[0.14em] sm:tracking-[0.18em]" />
      </span>
    </span>
  );
}
