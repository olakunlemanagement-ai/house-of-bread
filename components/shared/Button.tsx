import Link from "next/link";
import type { Route } from "next";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";
/** The surface the button sits on. */
export type ButtonTone = "light" | "green";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors disabled:cursor-not-allowed";

const styles: Record<ButtonTone, Record<ButtonVariant, string>> = {
  light: {
    primary:
      "bg-green text-white hover:bg-green-deep disabled:bg-ink-muted",
    secondary:
      "border-2 border-green text-green hover:bg-surface-tint",
  },
  green: {
    primary:
      "bg-lime text-on-lime hover:bg-on-green disabled:bg-on-green-muted",
    secondary:
      "border-2 border-lime text-on-green hover:bg-green-night",
  },
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  tone: ButtonTone = "light",
  className = "",
) {
  return `${base} ${styles[tone][variant]} ${className}`;
}

type ButtonLinkProps = {
  href: Route;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  tone = "light",
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses(variant, tone, className)}>
      {children}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
};

export function Button({
  variant = "primary",
  tone = "light",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, tone, className)} {...props} />
  );
}

/** Underlined text link. Deep green on white, lime on green surfaces. */
export const textLinkClass =
  "font-semibold text-fg-link underline underline-offset-4 decoration-2 hover:decoration-[3px]";
