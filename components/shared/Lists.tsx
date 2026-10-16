import type { ReactNode } from "react";
import { IconTile, type IconName } from "./icons";

export type FeatureItem = ReactNode | { icon: IconName; text: ReactNode };

const isIconItem = (item: FeatureItem): item is { icon: IconName; text: ReactNode } =>
  typeof item === "object" && item !== null && "icon" in item;

/** Short list with an icon tile per item. Works on white and on green surfaces. */
export function FeatureList({ items, columns = 2 }: { items: FeatureItem[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-x-8 gap-y-5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-4 text-lg leading-snug text-fg">
          <IconTile name={isIconItem(item) ? item.icon : "check"} size="sm" />
          <span className="pt-1.5">{isIconItem(item) ? item.text : item}</span>
        </li>
      ))}
    </ul>
  );
}

export type Step = { title?: string; text: ReactNode; icon?: IconName };

/**
 * Numbered steps. A title, when given, leads the step in bold. With an icon
 * the step shows an icon tile and the number sits beside it.
 */
export function StepList({ steps, columns = 4 }: { steps: Step[]; columns?: 2 | 4 | 5 }) {
  const grid = {
    2: "sm:grid-cols-2",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-2 lg:grid-cols-5",
  }[columns];
  return (
    <ol className={`grid gap-5 ${grid}`}>
      {steps.map((step, index) => (
        <li
          key={index}
          className="relative rounded-card border border-border bg-surface p-6 shadow-soft"
        >
          <div className="flex items-center gap-3">
            {step.icon ? <IconTile name={step.icon} /> : null}
            <span
              aria-hidden="true"
              className={
                step.icon
                  ? "font-serif text-3xl font-semibold text-border-strong"
                  : "bg-green-tile inline-flex size-12 items-center justify-center rounded-tile font-serif text-xl font-semibold text-lime"
              }
            >
              {String(index + 1).padStart(step.icon ? 2 : 1, "0")}
            </span>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-ink">
            {step.title ? <strong className="font-semibold text-green">{step.title} </strong> : null}
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
