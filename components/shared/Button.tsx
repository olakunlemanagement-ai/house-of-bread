import Link from "next/link";
import type { Route } from "next";
import type { ComponentProps, ReactNode } from "react";

/**
 * Primary is the one solid button per screen. Secondary is an outline.
 * Tertiary is a soft tinted fill, for actions inside cards and rows. Live
 * is the gold button, used only while a session is live.
 */
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "live";
/** The surface the button sits on: light is any light surface; green is the deep green footer. */
export type ButtonTone = "light" | "green";
/** md: 48px tall, 52px from sm. sm: 44px, for cards, rows and the header. */
export type ButtonSize = "md" | "sm";

/** An in-page anchor or an external address. Rendered as a plain anchor. */
export type PlainHref = `#${string}` | `https://${string}`;

// Pills with a text label only, no arrow. Nothing moves: hover and press
// change the colour, instantly. No button is underlined. The focus ring is
// the global 3px one (globals.css).
const base =
  "inline-flex items-center justify-center gap-2 rounded-button text-center font-semibold leading-tight no-underline disabled:cursor-not-allowed";

const sizes: Record<ButtonSize, string> = {
  md: "min-h-12 px-6 py-3 text-base sm:min-h-13",
  sm: "min-h-11 px-4 py-2.5 text-sm",
};

// Pairings and ratios are logged in docs/PLACEHOLDERS.md.
const styles: Record<ButtonTone, Record<ButtonVariant, string>> = {
  light: {
    // Solid deep green. White on green-deep 13.53:1, on the emerald hover
    // 6.57:1, on the green-night press higher still. Dark: white on
    // emerald-night 5.82:1.
    primary:
      "bg-fill-primary text-white hover:bg-fill-hover active:bg-fill-press disabled:bg-fill-disabled",
    // Outline. Emerald-deep text on white 7.65:1, on tint 6.81:1.
    secondary:
      "border-[1.5px] border-glyph bg-transparent text-emerald-deep hover:bg-tint active:bg-tint-strong disabled:border-dashed disabled:border-ink-muted disabled:text-ink-muted disabled:hover:bg-transparent",
    // Soft fill, strong enough to read on the mint band. Emerald-deep on
    // tint-strong 6.01:1, on tint-press (hover, press) 5.28:1; the press
    // adds an inset glyph ring.
    tertiary:
      "bg-tint-strong text-emerald-deep hover:bg-tint-press active:bg-tint-press active:ring-1 active:ring-inset active:ring-glyph disabled:text-ink-muted disabled:hover:bg-tint-strong",
    live: "bg-gold text-on-gold hover:bg-gold-soft active:bg-gold",
  },
  green: {
    // Green-deep on white 13.53:1.
    primary:
      "bg-white text-green-deep hover:bg-on-green-hover active:bg-on-green-muted disabled:bg-on-green-muted",
    // White at 12% over green-deep 9.43:1.
    secondary:
      "border-[1.5px] border-white bg-white/12 text-white hover:bg-white/20 active:bg-white/25 disabled:border-dashed disabled:bg-transparent",
    tertiary: "bg-white/12 text-white hover:bg-white/20 active:bg-white/25",
    live: "bg-gold text-on-gold hover:bg-gold-soft active:bg-gold",
  },
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  tone: ButtonTone = "light",
  className = "",
  size: ButtonSize = "md",
) {
  return `${base} ${sizes[size]} ${styles[tone][variant]} ${className}`;
}

type ButtonLinkProps = {
  href: Route | PlainHref;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
  /** Opens an external address in a new tab (rel noopener noreferrer). */
  newTab?: boolean;
  children: ReactNode;
};

/** A link drawn as a button: anything that asks the visitor to act. */
export function ButtonLink({
  href,
  variant = "primary",
  tone = "light",
  size = "md",
  className,
  newTab = false,
  children,
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, tone, className, size);
  if (href.startsWith("#") || href.startsWith("https://")) {
    return (
      <a
        href={href}
        className={classes}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href as Route} className={classes}>
      {children}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  tone = "light",
  size = "md",
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, tone, className, size)} {...props}>
      {children}
    </button>
  );
}
