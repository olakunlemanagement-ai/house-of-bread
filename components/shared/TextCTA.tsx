import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import type { PlainHref } from "./Button";
import { Icon } from "./icons";

/**
 * The arrow chip on its own. Used decoratively where the card title is the
 * link, so the card still shows the same call to action shape.
 */
export function TextCTAChip({ direction = "forward" }: { direction?: "forward" | "back" }) {
  return (
    <span aria-hidden="true" data-back={direction === "back" ? "" : undefined} className="text-cta-chip">
      <Icon name={direction === "back" ? "arrow-left" : "arrow-right"} strokeWidth={2.2} />
    </span>
  );
}

// Stretches the link over the nearest positioned ancestor (a card), with the
// focus ring drawn on the stretched area.
const stretchClass =
  "after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring";

/**
 * A call to action written as text: a weight 600 label and a 28px circular
 * arrow chip, never underlined. Colours follow the surface (see --cta-* in
 * globals.css). Use a Button when the action must stand out more.
 */
export function TextCTA({
  href,
  children,
  direction = "forward",
  stretch = false,
  className = "",
}: {
  href: Route | PlainHref;
  children: ReactNode;
  /** Back puts the chip first with a left arrow, for "Back to ..." links. */
  direction?: "forward" | "back";
  /** Stretch the hit area over the parent card. Mark the card with .cta-host. */
  stretch?: boolean;
  className?: string;
}) {
  const classes = `text-cta ${stretch ? stretchClass : ""} ${className}`;
  const content =
    direction === "back" ? (
      <>
        <TextCTAChip direction="back" />
        <span>{children}</span>
      </>
    ) : (
      <>
        <span>{children}</span>
        <TextCTAChip />
      </>
    );
  if (href.startsWith("#") || href.startsWith("https://")) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href as Route} className={classes}>
      {content}
    </Link>
  );
}

/** The TextCTA look without a link, for cards whose title already links. */
export function TextCTALabel({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden="true" className="text-cta">
      <span>{children}</span>
      <TextCTAChip />
    </span>
  );
}
