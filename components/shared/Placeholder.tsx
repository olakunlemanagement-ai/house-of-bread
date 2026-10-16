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

export function PlaceholderBadge({ label = "Placeholder" }: { label?: string }) {
  return (
    <span className="inline-block rounded-full bg-lime px-2.5 py-0.5 font-sans text-xs font-bold uppercase tracking-wider text-on-lime">
      {label}
    </span>
  );
}

/**
 * Art directed frame where real photography belongs. Gradient, a subtle
 * pattern and a small "Photo to come" label. No stock photos.
 * TODO: replace with next/image, explicit dimensions, once photos arrive.
 */
export function PhotoFrame({
  ratio = "16/9",
  subject,
  label = "Photo to come",
  className = "",
}: {
  ratio?: "16/9" | "4/5";
  /** What the photo will show. Read by screen readers and logged. */
  subject: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${label}: ${subject}`}
      data-placeholder
      className={`relative overflow-hidden rounded-card bg-green-hero shadow-raised ${
        ratio === "4/5" ? "aspect-[4/5]" : "aspect-video"
      } ${className}`}
    >
      {/* Diagonal pinstripe and a soft lime corner, drawn in CSS. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,var(--lime)_0_1px,transparent_1px_14px)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-1/4 -top-1/4 size-3/4 rounded-full [background-image:radial-gradient(closest-side,color-mix(in_srgb,var(--lime)_14%,transparent),transparent)]"
      />
      <svg
        viewBox="0 0 200 280"
        aria-hidden="true"
        focusable="false"
        className="absolute bottom-6 right-6 h-20 w-14 text-lime opacity-20"
      >
        <path d="M85 0h30v80h85v30h-85v170H85V110H0V80h85z" fill="currentColor" />
      </svg>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 p-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-green-night/80 px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-on-green">
          <span className="size-1.5 rounded-full bg-lime" />
          {label}
        </span>
        <p className="mt-2 max-w-xs font-sans text-sm text-on-green-muted">{subject}</p>
      </div>
    </div>
  );
}
