import Link from "next/link";
import type { Route } from "next";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./icons";

/** Live is the gold emphasis button, used only while a session is live. */
export type ButtonVariant = "primary" | "secondary" | "live";
/** The surface the button sits on: light is any light surface; green is the deep green footer. */
export type ButtonTone = "light" | "green";

/** An in-page anchor or an external address. Rendered as a plain anchor. */
export type PlainHref = `#${string}` | `https://${string}`;

// 48px tall on mobile, 52px from sm. Hover lifts 2px over 300ms. No button is underlined.
// Only the transform animates: colour changes are instant.
const base =
  "group/button inline-flex min-h-12 items-center justify-center gap-2 rounded-button py-3 font-semibold leading-tight no-underline transition-transform duration-300 ease-(--ease-standard) sm:min-h-13 motion-safe:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0";

// Pairings and ratios are logged in docs/PLACEHOLDERS.md.
const styles: Record<ButtonTone, Record<ButtonVariant, string>> = {
  light: {
    // White on emerald 6.57:1, on emerald-deep 7.65:1.
    primary: "bg-emerald text-white shadow-soft hover:bg-emerald-deep disabled:bg-ink-muted",
    // Emerald-deep text on white 7.65:1, on tint 6.81:1.
    secondary:
      "border-[1.5px] border-emerald/55 bg-white text-emerald-deep hover:border-emerald hover:bg-tint disabled:border-dashed disabled:border-ink-muted disabled:text-ink-muted disabled:hover:bg-white",
    live: "bg-gold text-ink shadow-soft hover:bg-gold-soft",
  },
  green: {
    // Green-deep on white 13.53:1.
    primary: "bg-white text-green-deep shadow-soft hover:bg-surface-mint disabled:bg-on-green-muted",
    // White at 12% over green-deep 9.43:1.
    secondary:
      "border-[1.5px] border-white bg-white/12 text-white hover:bg-white/20 disabled:border-dashed disabled:bg-transparent",
    live: "bg-gold text-ink shadow-soft hover:bg-gold-soft",
  },
};

/** Compact is for the mobile header only: same 48px height, tighter sides. */
export type ButtonSize = "default" | "compact";

const sizes: Record<ButtonSize, string> = {
  default: "px-6 text-base",
  compact: "px-3.5 text-sm",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  tone: ButtonTone = "light",
  className = "",
  size: ButtonSize = "default",
) {
  return `${base} ${sizes[size]} ${styles[tone][variant]} ${className}`;
}

/** Arrow for "go to" buttons. It nudges 4px right on hover. */
function Arrow() {
  return (
    <Icon
      name="arrow-right"
      className="size-5 shrink-0 transition-transform duration-300 ease-(--ease-standard) motion-safe:group-hover/button:translate-x-1"
    />
  );
}

type ButtonLinkProps = {
  href: Route | PlainHref;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  tone = "light",
  size = "default",
  arrow = false,
  className,
  children,
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, tone, className, size);
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
