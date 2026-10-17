import type { ReactNode } from "react";

export type Stat = { value: string; label: ReactNode };

/** Approved figures from CONTENT-PACK section 3. Not attendance figures. */
export const homeStats: Stat[] = [
  { value: "3", label: "regions served: the United Kingdom, Africa and the United States" },
  { value: "27", label: "New Testament books introduced" },
  { value: "6", label: "translations in the app" },
  { value: "3", label: "New Testament journeys: 30, 60 and 90 days" },
];

/** A quiet row of figures with hairline dividers, just under the hero. */
export function StatStrip({ stats, className = "" }: { stats: Stat[]; className?: string }) {
  return (
    <ul
      aria-label="The ministry at a glance"
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border shadow-soft lg:grid-cols-4 ${className}`}
    >
      {stats.map((stat, index) => (
        <li key={index} className="bg-surface p-5 sm:p-6">
          <span className="block font-serif text-3xl font-medium leading-none text-emerald-deep sm:text-4xl">
            {stat.value}
          </span>
          <span className="mt-2.5 block text-sm leading-snug text-ink-muted">
            {stat.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
