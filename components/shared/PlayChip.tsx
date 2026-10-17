import { Icon } from "./icons";

/**
 * "Watch" chip for cards with something to watch. White on green-night at
 * 85%, 10:1 or more over any thumbnail. Hidden from assistive technology,
 * because the card's own button or link carries the action. Shows on the
 * card's hover and focus, through .play-chip and .lift.
 */
export function PlayChip({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`play-chip inline-flex items-center gap-1.5 rounded-full bg-green-night/85 px-3.5 py-1.5 text-sm font-semibold text-white ${className}`}
    >
      <Icon name="play" className="size-4" />
      Watch
    </span>
  );
}
