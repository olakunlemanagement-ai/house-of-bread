import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { ButtonLink } from "./Button";

/** Card on light surfaces: raised white, hairline edge, soft shadow, 20px radius. */
export const cardClass = "rounded-card border border-border bg-surface-raised p-6 shadow-soft sm:p-8";

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
