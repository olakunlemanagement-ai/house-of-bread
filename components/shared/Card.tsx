import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { IconTile, type IconName } from "./icons";
import { ButtonLink } from "./Button";

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

/** Icon tile, heading, one line and a tertiary button. Nothing moves on hover. */
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
    <Card as="li" className={`flex flex-col ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <IconTile name={icon} />
        {badge}
      </div>
      <h3 className="mt-6 text-2xl leading-snug">{title}</h3>
      <p className="mt-3 leading-relaxed text-ink-muted">{children}</p>
      <div className="mt-auto pt-5">
        <ButtonLink href={cta.href} variant="tertiary" size="sm" className="w-full sm:w-auto">
          {cta.label}
        </ButtonLink>
      </div>
    </Card>
  );
}

/**
 * A card for one page. Without a call to action the title is the link,
 * stretched over the whole card (one tab stop, readable text, the edge
 * deepens on hover). With one, the title is plain text and a tertiary button
 * is the link, because anything that asks the visitor to act is a button.
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
  /** Button label, such as "View class". The button is then the link. */
  cta?: string;
}) {
  return (
    <Card as="article" className={`flex w-full flex-col ${cta ? "" : interactiveCardClass}`}>
      {eyebrow ? <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">{eyebrow}</div> : null}
      <h3 className="text-2xl leading-snug">
        {cta ? (
          title
        ) : (
          <Link
            href={href}
            className="rounded after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
          >
            {title}
          </Link>
        )}
      </h3>
      {children ? <div className="mt-3 leading-relaxed text-ink-muted">{children}</div> : null}
      {footer || cta ? (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          {footer}
          {cta ? (
            <ButtonLink href={href} variant="tertiary" size="sm" className="ml-auto">
              {cta}
              <span className="sr-only">: {title}</span>
            </ButtonLink>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
