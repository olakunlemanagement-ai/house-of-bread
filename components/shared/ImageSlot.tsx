import Image, { type StaticImageData } from "next/image";

export type ImageSlotRatio = "16/9" | "4/5" | "1/1" | "3/2";

const ratioClass: Record<ImageSlotRatio, string> = {
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};

const kindLabel = { photo: "Photo", video: "Video", screenshot: "Screenshot" } as const;

type ImageSlotProps = {
  ratio?: ImageSlotRatio;
  /** What belongs here, as a phrase: "the teacher in a live session". Logged in docs/PLACEHOLDERS.md. */
  brief: string;
  kind?: keyof typeof kindLabel;
  /**
   * The real image. Set it (with alt) and the slot shows the photo in the
   * same box, so swapping one in is a one line change. No stock photos.
   */
  src?: StaticImageData | string;
  alt?: string;
  sizes?: string;
  className?: string;
};

/**
 * A fixed ratio frame where a photo belongs. Until one is supplied it shows
 * a designed placeholder: a soft green tinted gradient, a faint pinstripe
 * and a caption naming the intended photo ("Photo: ..."). Ink on the white
 * caption pill holds 16.1:1.
 */
export function ImageSlot({
  ratio = "16/9",
  brief,
  kind = "photo",
  src,
  alt = "",
  sizes = "(min-width: 1024px) 40vw, 100vw",
  className = "",
}: ImageSlotProps) {
  const frame = `relative overflow-hidden rounded-card border border-border shadow-soft ${ratioClass[ratio]} ${className}`;

  if (src) {
    return (
      <div className={frame}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  const caption = `${kindLabel[kind]}: ${brief}`;
  return (
    <div
      role="img"
      aria-label={`${caption} (to come)`}
      data-placeholder
      className={`${frame} bg-surface-mint [background-image:radial-gradient(120%_90%_at_15%_10%,var(--slot-glow),transparent_60%),linear-gradient(135deg,var(--surface-mint),var(--surface-warm)_75%)]`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,var(--glyph)_0_1px,transparent_1px_14px)]"
      />
      <svg
        viewBox="0 0 200 280"
        aria-hidden="true"
        focusable="false"
        className="absolute right-6 top-6 h-20 w-14 text-glyph opacity-15"
      >
        <path d="M85 0h30v80h85v30h-85v170H85V110H0V80h85z" fill="currentColor" />
      </svg>
      {kind === "video" ? (
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
        <span className="inline-flex max-w-full items-start gap-2 rounded-xl bg-surface-raised px-3 py-1.5 font-sans text-sm leading-snug text-ink shadow-soft">
          <span className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-glyph" />
          {caption}
        </span>
      </p>
    </div>
  );
}
