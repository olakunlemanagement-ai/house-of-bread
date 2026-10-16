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
  headingLevel?: 2 | 3;
};

export function PlanCard({ name, days, pace, line, href, headingLevel = 3 }: PlanCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <li className={`${cardClass} ${href ? interactiveCardClass : ""} flex flex-col`}>
      <div className="flex items-end gap-3">
        <span className="bg-green-tile inline-flex size-16 items-center justify-center rounded-2xl text-2xl font-bold text-lime">
          {days}
        </span>
        <span className="pb-1 text-sm font-bold uppercase tracking-[0.18em] text-ink-muted">
          {pace}
        </span>
      </div>
      <Heading className="mt-5 text-2xl font-bold">{name}</Heading>
      <p className="mt-2 text-lg leading-relaxed text-ink-muted">{line}</p>
      {href ? (
        <div className="mt-auto pt-6">
          <ButtonLink href={href} variant="secondary" className="w-full">
            View plan
            <span className="sr-only">: {name}</span>
          </ButtonLink>
        </div>
      ) : null}
    </li>
  );
}
