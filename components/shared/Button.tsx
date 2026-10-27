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

// Pills, 48px tall on mobile and 52px from sm. No button is underlined and
// none lifts: only the arrow nudges on hover. Colour changes are instant.
const base =
  "group/button inline-flex min-h-12 items-center justify-center gap-2 rounded-button py-3 font-semibold leading-tight no-underline sm:min-h-13 disabled:cursor-not-allowed";

// Pairings and ratios are logged in docs/PLACEHOLDERS.md.
const styles: Record<ButtonTone, Record<ButtonVariant, string>> = {
  light: {
    // Solid deep green. White on green-deep 13.53:1, on the emerald hover
    // 6.57:1. Dark: white on emerald-night 5.82:1.
    primary: "bg-fill-primary text-white hover:bg-fill-hover disabled:bg-fill-disabled",
    // Outline. Emerald-deep text on white 7.65:1, on tint 6.81:1.
    secondary:
      "border-[1.5px] border-glyph bg-transparent text-emerald-deep hover:bg-tint disabled:border-dashed disabled:border-ink-muted disabled:text-ink-muted disabled:hover:bg-transparent",
    live: "bg-gold text-on-gold hover:bg-gold-soft",
  },
  green: {
    // Green-deep on white 13.53:1.
    primary: "bg-white text-green-deep hover:bg-on-green-hover disabled:bg-on-green-muted",
    // White at 12% over green-deep 9.43:1.
    secondary:
      "border-[1.5px] border-white bg-white/12 text-white hover:bg-white/20 disabled:border-dashed disabled:bg-transparent",
    live: "bg-gold text-on-gold hover:bg-gold-soft",
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

/** The arrow every pill link carries by default. It nudges 4px right on hover. */
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
  arrow = true,
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
