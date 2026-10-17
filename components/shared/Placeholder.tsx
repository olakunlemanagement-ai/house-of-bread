import type { ReactNode } from "react";

/**
 * Marks a fact nobody has supplied yet. The text stays in square brackets so
 * it cannot be mistaken for final copy, and data-placeholder lets every
 * instance be found in the built HTML. Each one is listed in
 * docs/PLACEHOLDERS.md.
 */
export function Placeholder({
  children,
  block = false,
}: {
  children: ReactNode;
  block?: boolean;
}) {
  if (!block) {
    return (
      <span
        data-placeholder
        className="rounded-md border border-dashed border-fg-link px-1.5 py-0.5 font-mono text-[0.85em] text-fg [overflow-wrap:anywhere]"
      >
        {children}
      </span>
    );
  }

  return (
    <div
      data-placeholder
      className="rounded-card border-2 border-dashed border-fg-link p-6 text-fg"
    >
      <PlaceholderBadge />
      <p className="mt-3 font-mono text-sm leading-relaxed [overflow-wrap:anywhere]">{children}</p>
    </div>
  );
}

/** Gold-soft badge with ink text (11.85:1). Readable on every surface. */
export function PlaceholderBadge({ label = "Placeholder" }: { label?: string }) {
  return (
    <span className="inline-block rounded-full bg-gold-soft px-2.5 py-0.5 font-sans text-xs font-bold uppercase tracking-wider text-ink">
      {label}
    </span>
  );
}

/**
 * Art directed frame where real photography or video belongs. A light mint
 * to cream wash, an emerald pinstripe and a small label. No stock photos.
 * TODO: replace with next/image, explicit dimensions, once photos arrive.
 */
export function PhotoFrame({
  ratio = "16/9",
  subject,
  label = "Photo to come",
  media = "photo",
  className = "",
}: {
  ratio?: "16/9" | "4/5";
  /** What the photo will show. Read by screen readers and logged. */
  subject: string;
  label?: string;
  /** Video frames show a play mark in the centre. */
  media?: "photo" | "video";
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${label}: ${subject}`}
      data-placeholder
      className={`relative overflow-hidden rounded-card border border-border bg-surface-mint shadow-soft [background-image:linear-gradient(135deg,var(--surface-mint),var(--surface-warm)_70%)] ${
        ratio === "4/5" ? "aspect-[4/5]" : "aspect-video"
      } ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(135deg,var(--emerald)_0_1px,transparent_1px_14px)]"
      />
      <svg
        viewBox="0 0 200 280"
        aria-hidden="true"
        focusable="false"
        className="absolute right-6 top-6 h-20 w-14 text-emerald opacity-15"
      >
        <path d="M85 0h30v80h85v30h-85v170H85V110H0V80h85z" fill="currentColor" />
      </svg>
      {media === "video" ? (
        <span
          aria-hidden="true"
          className="bg-green-tile absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-raised sm:size-20"
        >
          <svg viewBox="0 0 24 24" className="ml-1 size-7 sm:size-8" fill="currentColor" focusable="false">
            <path d="M7 4.5v15l12-7.5z" />
          </svg>
        </span>
      ) : null}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 p-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-soft">
          <span className="size-1.5 rounded-full bg-emerald" />
          {label}
        </span>
        {/* Video frames drop the subject line on small screens, clear of the play mark. */}
        <p className={`mt-2 max-w-xs font-sans text-sm text-ink-muted ${media === "video" ? "hidden sm:block" : ""}`}>
          {subject}
        </p>
      </div>
    </div>
  );
}
