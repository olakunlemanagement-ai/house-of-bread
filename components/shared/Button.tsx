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

/*
  The button style chosen on 29 October 2026: Engraved, with a touch of
  Ruled. Geist small caps, wide tracking, a 6px radius and a fine inset
  hairline. On hover a deeper fill sweeps in from the left and a fine rule
  draws out beneath the label; keyboard focus draws the rule too. With
  Motion Off or reduced motion both appear at once. Label only, no arrow,
  never underlined. The shape lives in .btn (app/globals.css); each
  variant sets its colours as custom properties:
    --btn-fill   resting fill        --btn-ink    text
    --btn-sweep  hover fill          --btn-press  press fill
    --btn-line   1px outer edge      --btn-inner  hairline 4px inside
  The focus ring is the global 3px one. Pairings are logged in
  docs/PLACEHOLDERS.md.
*/
const base =
  "btn inline-flex items-center justify-center gap-2 text-center leading-tight no-underline disabled:cursor-not-allowed";

const sizes: Record<ButtonSize, string> = {
  md: "min-h-12 px-7 py-3 text-[0.95rem] sm:min-h-13",
  sm: "min-h-11 px-5 py-2.5 text-[0.9rem]",
};

const styles: Record<ButtonTone, Record<ButtonVariant, string>> = {
  light: {
    // White on green-deep 13.53:1, on the emerald sweep 6.57:1. Dark: white on emerald-night 5.82:1.
    primary:
      "[--btn-fill:var(--fill-primary)] [--btn-ink:var(--on-fill)] [--btn-sweep:var(--fill-hover)] [--btn-press:var(--fill-press)] [--btn-line:var(--hairline-on-fill)] disabled:[--btn-fill:var(--fill-disabled)]",
    // Emerald-deep on white 7.65:1, on the tint sweep 6.81:1. The glyph edge holds 3:1 on every band.
    secondary:
      "[--btn-fill:transparent] [--btn-ink:var(--emerald-deep)] [--btn-sweep:var(--tint)] [--btn-press:var(--tint-strong)] [--btn-line:var(--glyph)] [--btn-inner:var(--border-strong)] disabled:[--btn-ink:var(--ink-muted)] disabled:[--btn-line:var(--ink-muted)] disabled:after:border-dashed",
    // Emerald-deep on tint-strong 6.01:1, on the tint-press sweep 5.28:1.
    tertiary:
      "[--btn-fill:var(--tint-strong)] [--btn-ink:var(--emerald-deep)] [--btn-sweep:var(--tint-press)] [--btn-press:var(--tint-press)] [--btn-line:var(--border-strong)] disabled:[--btn-ink:var(--ink-muted)]",
    live: "[--btn-fill:var(--gold)] [--btn-ink:var(--on-gold)] [--btn-sweep:var(--gold-soft)] [--btn-press:var(--gold)] [--btn-line:var(--on-gold-line)]",
  },
  green: {
    // Green-deep on white 13.53:1, on the mint sweep higher still.
    primary:
      "[--btn-fill:var(--on-fill)] [--btn-ink:var(--green-deep)] [--btn-sweep:var(--on-green-hover)] [--btn-press:var(--on-green-muted)] [--btn-line:var(--on-deep-line)] disabled:[--btn-fill:var(--on-green-muted)]",
    // White over 12% white on green-deep 9.43:1; the sweep is 20%, the press 25%.
    secondary:
      "[--btn-fill:var(--on-deep-fill)] [--btn-ink:var(--on-fill)] [--btn-sweep:var(--on-deep-hover)] [--btn-press:var(--on-deep-press)] [--btn-line:var(--on-fill)] [--btn-inner:var(--hairline-on-fill)] disabled:after:border-dashed",
    tertiary:
      "[--btn-fill:var(--on-deep-fill)] [--btn-ink:var(--on-fill)] [--btn-sweep:var(--on-deep-hover)] [--btn-press:var(--on-deep-press)] [--btn-line:var(--hairline-on-fill)]",
    live: "[--btn-fill:var(--gold)] [--btn-ink:var(--on-gold)] [--btn-sweep:var(--gold-soft)] [--btn-press:var(--gold)] [--btn-line:var(--on-gold-line)]",
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

/**
 * The label inside a button, which carries the ruled line. Button and
 * ButtonLink wrap their children in it; anything else drawn with
 * buttonClasses wraps its text in it too.
 */
export function ButtonLabel({ children }: { children: ReactNode }) {
  return <span className="btn-label">{children}</span>;
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
        <ButtonLabel>{children}</ButtonLabel>
      </a>
    );
  }
  return (
    <Link href={href as Route} className={classes}>
      <ButtonLabel>{children}</ButtonLabel>
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
      <ButtonLabel>{children}</ButtonLabel>
    </button>
  );
}
