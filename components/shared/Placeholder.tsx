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
        className="rounded border border-dashed border-fg-link px-1.5 py-0.5 font-mono text-[0.85em] text-fg"
      >
        {children}
      </span>
    );
  }

  return (
    <div
      data-placeholder
      className="rounded-2xl border-2 border-dashed border-fg-link p-5 text-fg"
    >
      <PlaceholderBadge />
      <p className="mt-3 font-mono text-sm leading-relaxed">{children}</p>
    </div>
  );
}

export function PlaceholderBadge({ label = "Placeholder" }: { label?: string }) {
  return (
    <span className="inline-block rounded-full bg-lime px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-on-lime">
      {label}
    </span>
  );
}
