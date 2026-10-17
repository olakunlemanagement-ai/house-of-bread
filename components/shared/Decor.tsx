// Decorative inline SVG and layers for green surfaces. Low opacity, hidden
// from assistive technology, and never placed behind lime text at a strength
// that could weaken contrast. No images, no blur, no backdrop-filter.

export function CrossWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 280"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute text-lime ${className}`}
    >
      <path d="M85 0h30v80h85v30h-85v170H85V110H0V80h85z" fill="currentColor" />
    </svg>
  );
}

export function Leaves({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      aria-hidden="true"
      focusable="false"
      fill="none"
      className={`pointer-events-none absolute text-lime ${className}`}
    >
      <path
        d="M40 200C40 120 100 60 200 40c0 100-60 160-160 160z"
        fill="currentColor"
        opacity="0.6"
      />
      <path d="M40 200 170 70" stroke="currentColor" strokeWidth="3" opacity="0.8" />
      <path
        d="M20 120c0-50 30-85 90-100 0 60-35 95-90 100z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

/** Faint noise over a green surface. Sits under the content layer. */
export function Grain() {
  return <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />;
}

/**
 * Soft curved edge from a green band into the white page below. `tone`
 * matches the colour of the section that follows.
 */
export type EdgeTone = "white" | "warm" | "mint";

const edgeClass: Record<EdgeTone, string> = {
  white: "text-surface",
  warm: "text-surface-warm",
  mint: "text-surface-mint",
};

export function CurveEdge({ tone = "white" }: { tone?: EdgeTone }) {
  return (
    <svg
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-x-0 -bottom-px block h-10 w-full sm:h-16 ${edgeClass[tone]}`}
    >
      <path d="M0 64V32C240 0 480 0 720 16s480 48 720 16v32z" fill="currentColor" />
    </svg>
  );
}
