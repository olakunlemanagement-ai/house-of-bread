import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { IconTile, type IconName } from "./icons";
import { TextCTA, TextCTAChip, TextCTALabel } from "./TextCTA";

/** Card on light surfaces: white, 14% emerald edge, soft shadow, 24px radius. */
export const cardClass = "rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8";

/** A stronger edge on hover and focus, nothing moves. See .lift. */
export const interactiveCardClass = "lift";

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

/** Icon tile, heading and one line. Used for feature and topic grids. */
export function FeatureCard({
  icon,
  className = "",
  title,
  children,
  headingLevel = 3,
}: {
  icon: IconName;
  className?: string;
  title: string;
  children: ReactNode;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Card as="li" className={`flex flex-col ${className}`}>
      <IconTile name={icon} />
      <Heading className="mt-6 text-2xl leading-snug">{title}</Heading>
      <p className="mt-3 leading-relaxed text-ink-muted">{children}</p>
    </Card>
  );
}

/**
 * Icon tile, heading, one line and a TextCTA stretched over the card: one tab
 * stop, and hovering the card moves the arrow chip.
 */
export function CTACard({
  icon,
  badge,
  title,
  children,
  cta,
  className = "",
}: {
  icon: IconName;
  /** A small label beside the icon, such as a "Coming soon" badge. */
  badge?: ReactNode;
  title: string;
  children: ReactNode;
  cta: { href: Route; label: string };
  className?: string;
}) {
  return (
    <Card as="li" className={`cta-host flex flex-col ${interactiveCardClass} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <IconTile name={icon} />
        {badge}
      </div>
      <h3 className="mt-6 text-2xl leading-snug">{title}</h3>
      <p className="mt-3 leading-relaxed text-ink-muted">{children}</p>
      <div className="mt-auto pt-5">
        <TextCTA href={cta.href} stretch>
          {cta.label}
        </TextCTA>
      </div>
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
  cta,
}: {
  href: Route;
  title: string;
  eyebrow?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** Visible call to action label, such as "View class". The title is the link. */
  cta?: string;
}) {
  return (
    <Card as="article" className={`cta-host flex w-full flex-col ${interactiveCardClass}`}>
      {eyebrow ? <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">{eyebrow}</div> : null}
      <h3 className="text-2xl leading-snug">
        <Link
          href={href}
          className="rounded after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
        >
          {title}
        </Link>
      </h3>
      {children ? <div className="mt-3 leading-relaxed text-ink-muted">{children}</div> : null}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
        {footer}
        <span className="ml-auto">{cta ? <TextCTALabel>{cta}</TextCTALabel> : <TextCTAChip />}</span>
      </div>
    </Card>
  );
}
