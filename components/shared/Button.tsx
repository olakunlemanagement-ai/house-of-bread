import Link from "next/link";
import type { Route } from "next";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./icons";

export type ButtonVariant = "primary" | "secondary" | "ghost";
/** The surface the button sits on: light is on white or tint, green is on a green surface. */
export type ButtonTone = "light" | "green";

/** An in-page anchor or an external address. Rendered as a plain anchor. */
export type PlainHref = `#${string}` | `https://${string}`;

const base =
  "group/button inline-flex min-h-12 items-center justify-center gap-2 rounded-button px-6 py-3 text-base font-semibold leading-tight transition-transform duration-200 sm:min-h-13 motion-safe:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0";

// Never white on lime or mint, never lime or mint on white (CONTENT-PACK 1.9).
const styles: Record<ButtonTone, Record<ButtonVariant, string>> = {
  light: {
    primary: "bg-green text-white shadow-soft hover:bg-green-deep disabled:bg-ink-muted",
    secondary:
      "border-2 border-green text-green hover:bg-surface-tint disabled:border-ink-muted disabled:border-dashed disabled:text-ink-muted",
    ghost:
      "text-green underline-offset-4 hover:bg-surface-tint hover:underline disabled:text-ink-muted disabled:no-underline",
  },
  green: {
    primary: "bg-lime text-on-lime shadow-soft hover:bg-on-green disabled:bg-on-green-muted",
    secondary:
      "border-2 border-lime text-on-green hover:bg-green-night disabled:border-dashed disabled:border-on-green-muted disabled:text-on-green-muted",
    ghost:
      "text-on-green underline-offset-4 hover:bg-green-night hover:underline disabled:text-on-green-muted disabled:no-underline",
  },
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  tone: ButtonTone = "light",
  className = "",
) {
  return `${base} ${styles[tone][variant]} ${className}`;
}

/** Arrow for "go to" buttons. It nudges 4px right on hover. */
function Arrow() {
  return (
    <Icon
      name="arrow-right"
      className="size-5 shrink-0 transition-transform duration-200 motion-safe:group-hover/button:translate-x-1"
    />
  );
}

type ButtonLinkProps = {
  href: Route | PlainHref;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  tone = "light",
  arrow = false,
  className,
  children,
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, tone, className);
  const content = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
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

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  arrow?: boolean;
};

export function Button({
  variant = "primary",
  tone = "light",
  arrow = false,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, tone, className)} {...props}>
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}

/** Underlined text link. Deep green on white, lime on green surfaces. */
export const textLinkClass =
  "font-semibold text-fg-link underline underline-offset-4 decoration-2 hover:decoration-[3px]";

/** Text link with a trailing arrow, for "go to" links. */
export function ArrowLink({ href, children }: { href: Route | PlainHref; children: ReactNode }) {
  const className = `group/button inline-flex items-center gap-2 py-2 ${textLinkClass}`;
  const content = (
    <>
      {children}
      <Arrow />
    </>
  );
  if (href.startsWith("#") || href.startsWith("https://")) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href as Route} className={className}>
      {content}
    </Link>
  );
}
