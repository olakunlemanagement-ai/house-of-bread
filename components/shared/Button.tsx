import Link from "next/link";
import type { Route } from "next";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./icons";

/** Live is the gold emphasis button, used only while a session is live. */
export type ButtonVariant = "primary" | "secondary" | "live";
/** The surface the button sits on: light is white, cream, mint or gold; green is any green surface. */
export type ButtonTone = "light" | "green";

/** An in-page anchor or an external address. Rendered as a plain anchor. */
export type PlainHref = `#${string}` | `https://${string}`;

// 48px tall on mobile, 52px from sm. Hover lifts 2px. No button is underlined.
const base =
  "group/button inline-flex min-h-12 items-center justify-center gap-2 rounded-button px-6 py-3 text-base font-semibold leading-tight no-underline transition-transform duration-200 sm:min-h-13 motion-safe:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0";

// Pairings and ratios are logged in docs/PLACEHOLDERS.md.
const styles: Record<ButtonTone, Record<ButtonVariant, string>> = {
  light: {
    // White on emerald 6.57:1, on emerald-deep 7.65:1.
    primary: "bg-emerald text-white shadow-soft hover:bg-emerald-deep disabled:bg-ink-muted",
    // Emerald text on white 6.57:1, on surface-mint 5.94:1.
    secondary:
      "border-2 border-emerald bg-white text-emerald hover:bg-surface-mint disabled:border-dashed disabled:border-ink-muted disabled:text-ink-muted disabled:hover:bg-white",
    live: "bg-gold text-ink shadow-soft hover:bg-gold-soft",
  },
  green: {
    // Ink on lime-bright 10.23:1.
    primary: "bg-lime-bright text-ink shadow-soft hover:bg-white disabled:bg-on-green-muted",
    // White at 12% over emerald 5.01:1. Keep off the light end of a gradient.
    secondary:
      "border-[1.5px] border-white bg-white/12 text-white hover:bg-white/20 disabled:border-dashed disabled:bg-transparent",
    live: "bg-gold text-ink shadow-soft hover:bg-gold-soft",
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
