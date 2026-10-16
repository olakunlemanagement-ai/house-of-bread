import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { Icon, IconTile, type IconName } from "./icons";

export const cardClass =
  "rounded-2xl border border-border bg-surface p-6 shadow-card transition-[border-color,box-shadow]";

/** Adds the hover and focus treatment to a card that contains a link. */
export const interactiveCardClass =
  "relative hover:border-border-strong hover:shadow-card-hover focus-within:border-border-strong focus-within:shadow-card-hover";

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return <Tag className={`${cardClass} ${className}`}>{children}</Tag>;
}

/** Icon, heading and one line. Used for feature and topic grids. */
export function FeatureCard({
  icon,
  title,
  children,
  headingLevel = 3,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Card as="li" className="flex flex-col">
      <IconTile name={icon} />
      <Heading className="mt-5 text-xl font-bold">{title}</Heading>
      <p className="mt-2 leading-relaxed text-ink-muted">{children}</p>
    </Card>
  );
}

/**
 * Card whose title is a link. The link's hit area is stretched over the
 * whole card, so there is one tab stop and the card text stays readable.
 */
export function LinkCard({
  href,
  title,
  eyebrow,
  children,
  footer,
}: {
  href: Route;
  title: string;
  eyebrow?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card as="article" className={`flex w-full flex-col ${interactiveCardClass}`}>
      {eyebrow ? <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">{eyebrow}</div> : null}
      <h3 className="text-xl font-bold">
        <Link
          href={href}
          className="rounded after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
        >
          {title}
        </Link>
      </h3>
      {children ? <div className="mt-2 leading-relaxed text-ink-muted">{children}</div> : null}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        {footer}
        <span aria-hidden="true" className="ml-auto text-green">
          <Icon name="arrow-right" className="size-5" />
        </span>
      </div>
    </Card>
  );
}
