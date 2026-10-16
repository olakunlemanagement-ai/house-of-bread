import type { ReactNode } from "react";
import { IconTile } from "./icons";

/** Short checked list. Works on white and on green surfaces. */
export function FeatureList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-lg leading-snug text-fg">
          <IconTile name="check" size="sm" />
          <span className="pt-1.5">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export type Step = { title?: string; text: ReactNode };

/** Numbered steps. A title, when given, leads the step in bold. */
export function StepList({ steps, columns = 4 }: { steps: Step[]; columns?: 2 | 4 | 5 }) {
  const grid = {
    2: "sm:grid-cols-2",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-2 lg:grid-cols-5",
  }[columns];
  return (
    <ol className={`grid gap-6 ${grid}`}>
      {steps.map((step, index) => (
        <li key={index} className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <span
            aria-hidden="true"
            className="bg-green-tile inline-flex size-11 items-center justify-center rounded-xl text-lg font-bold text-lime"
          >
            {index + 1}
          </span>
          <p className="mt-4 text-lg leading-relaxed text-ink">
            {step.title ? <strong className="font-bold text-green">{step.title} </strong> : null}
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
