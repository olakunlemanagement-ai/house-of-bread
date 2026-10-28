import type { Route } from "next";
import { ButtonLink } from "./Button";
import { cardClass } from "./Card";

type PlanCardProps = {
  name: string;
  days: number;
  pace: string;
  line: string;
  /** Omit to show the card without a button, as on the home page teaser. */
  href?: Route;
  headingLevel?: 2 | 3;
  className?: string;
};

export function PlanCard({
  name,
  days,
  pace,
  line,
  href,
  headingLevel = 3,
  className = "",
}: PlanCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <li className={`${cardClass} flex flex-col ${className}`}>
      <div className="flex items-end justify-between gap-3">
        {/* Solid emerald, not the leaf gradient: the small label needs 4.5:1 (6.57:1 here). */}
        <span className="inline-flex size-20 flex-col items-center justify-center rounded-tile bg-emerald text-white shadow-[inset_0_1px_0_var(--fill-highlight)]">
          <span className="font-serif text-3xl font-semibold leading-none">{days}</span>
          <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]">days</span>
        </span>
        <span className="eyebrow pb-1">{pace}</span>
      </div>
      <Heading className="mt-6 text-2xl leading-snug">{name}</Heading>
      <p className="mt-2 text-lg leading-relaxed text-ink-muted">{line}</p>
      {href ? (
        <div className="mt-auto pt-7">
          <ButtonLink href={href} variant="tertiary" className="w-full">
            See this journey
            <span className="sr-only">: {name}</span>
          </ButtonLink>
        </div>
      ) : null}
    </li>
  );
}
