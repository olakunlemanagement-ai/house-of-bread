import type { Route } from "next";
import { ButtonLink } from "./Button";
import { cardClass, interactiveCardClass } from "./Card";

type PlanCardProps = {
  name: string;
  days: number;
  pace: string;
  line: string;
  /** Omit to show the card without a button, as on the home page teaser. */
  href?: Route;
  /** The middle journey on /plans sits slightly raised. */
  raised?: boolean;
  headingLevel?: 2 | 3;
};

export function PlanCard({
  name,
  days,
  pace,
  line,
  href,
  raised = false,
  headingLevel = 3,
}: PlanCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <li
      className={`${
        raised
          ? "rounded-card border border-border-strong bg-surface p-6 shadow-raised sm:p-8 md:-translate-y-4"
          : cardClass
      } ${href ? interactiveCardClass : ""} flex flex-col`}
    >
      <div className="flex items-end justify-between gap-3">
        <span className="bg-green-tile inline-flex size-20 flex-col items-center justify-center rounded-tile text-lime">
          <span className="font-serif text-3xl font-semibold leading-none">{days}</span>
          <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]">days</span>
        </span>
        <span className="eyebrow pb-1">{pace}</span>
      </div>
      <Heading className="mt-6 text-2xl leading-snug">{name}</Heading>
      <p className="mt-2 text-lg leading-relaxed text-ink-muted">{line}</p>
      {href ? (
        <div className="mt-auto pt-7">
          <ButtonLink href={href} variant={raised ? "primary" : "secondary"} arrow className="w-full">
            View journey
            <span className="sr-only">: {name}</span>
          </ButtonLink>
        </div>
      ) : null}
    </li>
  );
}
