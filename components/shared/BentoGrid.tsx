import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { buttonClasses } from "./Button";
import { Icon3D, type Icon3DName } from "./Icon3D";
import { Icon, IconTile, type IconName } from "./icons";
import { TextCTA } from "./TextCTA";

/**
 * Asymmetric grid: one large tile on the left spanning two rows beside two
 * stacked tiles, then a small tile across the full width. The large tile is
 * sized by its neighbours, not a minimum height, so it holds no empty void.
 * Stacks to one column on mobile.
 */
export function BentoGrid({ children }: { children: ReactNode }) {
  return <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">{children}</ul>;
}

type BentoTileProps = {
  size: "large" | "medium" | "small";
  surface: "white" | "warm" | "mint";
  icon: IconName;
  /** A Fluent 3D icon in place of the line icon (Home). */
  icon3d?: Icon3DName;
  /** Extra classes, such as card-motion and its index. */
  className?: string;
  title: string;
  children: ReactNode;
  cta: { href: Route; label: string };
};

const placement = {
  large: "md:col-span-2 lg:col-span-7 lg:row-span-2",
  medium: "lg:col-span-5",
  small: "md:col-span-2 lg:col-span-12",
};

const surfaceClass = {
  white: "bg-surface border-border",
  warm: "bg-surface-warm border-border",
  mint: "bg-surface-mint border-border",
};

/**
 * A tile whose call to action is stretched over the whole tile: one tab stop,
 * and the tile lifts on hover and focus.
 */
export function BentoTile({ size, surface, icon, icon3d, className = "", title, children, cta }: BentoTileProps) {
  const large = size === "large";
  const small = size === "small";
  return (
    <li
      className={`lift cta-host isolate flex flex-col rounded-card border shadow-soft ${placement[size]} ${surfaceClass[surface]} ${className} ${
        large ? "p-6 sm:p-10" : small ? "p-6 sm:p-7" : "p-6 sm:p-8"
      }`}
    >
      {large ? (
        // Decor sits under the content, clipped to the tile, so the lift
        // shadow outside the tile is not clipped with it.
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden rounded-card">
          <Icon
            name={icon}
            className="pointer-events-none absolute right-8 top-8 size-24 text-emerald opacity-[0.08]"
          />
        </div>
      ) : null}
      <div className={`flex flex-1 flex-col ${small ? "sm:flex-row sm:items-start sm:gap-5" : ""}`}>
        {icon3d ? <Icon3D name={icon3d} size={large ? "lg" : "md"} /> : <IconTile name={icon} size={large ? "lg" : "md"} />}
        {/* The large tile anchors its text to the bottom, below the icon. */}
        <div
          className={`flex flex-col ${
            small ? "mt-5 flex-1 sm:mt-0" : large ? "mt-auto pt-14" : "mt-6 flex-1"
          }`}
        >
          <h3 className={large ? "text-3xl font-medium leading-tight sm:text-4xl" : "text-xl leading-snug sm:text-2xl"}>
            {title}
          </h3>
          <p
            className={`mt-3 leading-relaxed ${large ? "max-w-md text-lead text-ink-muted" : "text-ink-muted"}`}
          >
            {children}
          </p>
          <div className={large ? "mt-8" : "mt-auto pt-5"}>
            {large ? (
              // The emerald primary, stretched over the tile.
              <Link
                href={cta.href}
                className={`${buttonClasses("primary")} after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring`}
              >
                {cta.label}
                <Icon
                  name="arrow-right"
                  className="size-5 transition-transform duration-200 motion-safe:group-hover/button:translate-x-1"
                />
              </Link>
            ) : (
              <TextCTA href={cta.href} stretch>
                {cta.label}
              </TextCTA>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
