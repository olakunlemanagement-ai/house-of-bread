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
    <span className="inline-block rounded-full bg-gold-soft px-2.5 py-0.5 font-sans text-xs font-bold uppercase tracking-wider text-on-gold">
      {label}
    </span>
  );
}
