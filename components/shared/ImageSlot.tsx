import Image from "next/image";
import { getImageSlot, type ImageSlotId, type ImageSlotRatio } from "@/lib/media/image-slots";
import { getSlotImage } from "@/lib/media/slot-images";

const ratioClass: Record<ImageSlotRatio, string> = {
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};

const kindLabel = { photo: "Photo", video: "Video", screenshot: "Screenshot" } as const;

type ImageSlotProps = {
  /** The slot in lib/media/image-slots.ts. Ratio, brief and alt come from there. */
  id: ImageSlotId;
  sizes?: string;
  className?: string;
  /**
   * Small frames (a catalogue thumbnail, a round section image): the
   * placeholder drops its caption and cross, which would not fit. Its brief
   * stays in the accessible name unless the slot is decorative.
   */
  compact?: boolean;
  /** "card" (20px corners), "tile" (14px) or "round" (a circle, for a 1/1 slot). */
  shape?: "card" | "tile" | "round";
};

const shapeClass = { card: "rounded-card", tile: "rounded-tile", round: "rounded-full" } as const;

/**
 * A fixed ratio frame where a photo belongs. When scripts/images/build-slots.mjs
 * has built public/images/slots/<id>.webp, the slot shows it through
 * next/image with a blur placeholder, in the same box, so nothing shifts.
 * Until then it shows a designed placeholder: a soft green tinted gradient,
 * a faint pinstripe and a caption naming the intended photo ("Photo: ...").
 * Ink on the raised caption pill holds AA in both themes.
 */
export function ImageSlot({
  id,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  className = "",
  compact = false,
  shape = "card",
}: ImageSlotProps) {
  const slot = getImageSlot(id);
  const image = getSlotImage(id);
  const frame = `relative overflow-hidden ${shapeClass[shape]} border border-border ${compact ? "" : "shadow-soft"} ${ratioClass[slot.ratio]} ${className}`;

  if (image) {
    return (
      <div
        className={`${frame} bg-tint`}
        data-slot={id}
        // An interim (AI generated) or stock image is still a placeholder until replaced.
        data-placeholder={
          slot.status === "interim" ? "interim-image" : slot.status === "stock" ? "stock-image" : undefined
        }
      >
        <Image
          src={image.src}
          alt={slot.decorative ? "" : slot.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          className="object-cover"
        />
      </div>
    );
  }

  const caption = `${kindLabel[slot.kind]}: ${slot.brief}`;
  // A decorative compact slot (the title beside it carries the meaning) is hidden from screen readers.
  const hidden = compact && slot.decorative === true;
  return (
    <div
      {...(hidden ? { "aria-hidden": true } : { role: "img", "aria-label": `${caption} (to come)` })}
      data-placeholder
      data-slot={id}
      className={`${frame} bg-surface-mint [background-image:radial-gradient(120%_90%_at_15%_10%,var(--slot-glow),transparent_60%),linear-gradient(135deg,var(--surface-mint),var(--surface-warm)_75%)]`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,var(--glyph)_0_1px,transparent_1px_14px)]"
      />
      {compact ? null : (
        <svg
          viewBox="0 0 200 280"
          aria-hidden="true"
          focusable="false"
          className="absolute right-6 top-6 h-20 w-14 text-glyph opacity-15"
        >
          <path d="M85 0h30v80h85v30h-85v170H85V110H0V80h85z" fill="currentColor" />
        </svg>
      )}
      {slot.kind === "video" ? (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald text-white shadow-raised sm:size-20"
        >
          <svg viewBox="0 0 24 24" className="ml-1 size-7 sm:size-8" fill="currentColor" focusable="false">
            <path d="M7 4.5v15l12-7.5z" />
          </svg>
        </span>
      ) : null}
      {compact ? null : (
      <p aria-hidden="true" className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <span className="inline-flex max-w-full items-start gap-2 rounded-xl bg-surface-raised px-3 py-1.5 font-sans text-sm leading-snug text-ink shadow-soft">
          <span className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-glyph" />
          {caption}
        </span>
      </p>
      )}
    </div>
  );
}
