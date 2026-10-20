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
};

/**
 * A fixed ratio frame where a photo belongs. When scripts/images/build-slots.mjs
 * has built public/images/slots/<id>.webp, the slot shows it through
 * next/image with a blur placeholder, in the same box, so nothing shifts.
 * Until then it shows a designed placeholder: a soft green tinted gradient,
 * a faint pinstripe and a caption naming the intended photo ("Photo: ...").
 * Ink on the white caption pill holds 16.1:1.
 */
export function ImageSlot({ id, sizes = "(min-width: 1024px) 40vw, 100vw", className = "" }: ImageSlotProps) {
  const slot = getImageSlot(id);
  const image = getSlotImage(id);
  const frame = `relative overflow-hidden rounded-card border border-border shadow-soft ${ratioClass[slot.ratio]} ${className}`;

  if (image) {
    return (
      <div
        className={`${frame} bg-tint`}
        data-slot={id}
        // An interim (AI generated) image is still a placeholder until replaced.
        data-placeholder={slot.status === "interim" ? "interim-image" : undefined}
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
  return (
    <div
      role="img"
      aria-label={`${caption} (to come)`}
      data-placeholder
      data-slot={id}
      className={`${frame} bg-surface-mint [background-image:radial-gradient(120%_90%_at_15%_10%,rgb(27_107_51/0.14),transparent_60%),linear-gradient(135deg,var(--surface-mint),var(--surface-warm)_75%)]`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,var(--emerald)_0_1px,transparent_1px_14px)]"
      />
      <svg
        viewBox="0 0 200 280"
        aria-hidden="true"
        focusable="false"
        className="absolute right-6 top-6 h-20 w-14 text-emerald opacity-15"
      >
        <path d="M85 0h30v80h85v30h-85v170H85V110H0V80h85z" fill="currentColor" />
      </svg>
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
      <p aria-hidden="true" className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <span className="inline-flex max-w-full items-start gap-2 rounded-xl bg-white px-3 py-1.5 font-sans text-sm leading-snug text-ink shadow-soft">
          <span className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-emerald" />
          {caption}
        </span>
      </p>
    </div>
  );
}
