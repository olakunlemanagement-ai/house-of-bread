import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { CrossWatermark, Grain } from "./Decor";
import { Icon, IconTile, type IconName } from "./icons";

/**
 * Asymmetric grid: one large tile on the left spanning three rows, and three
 * tiles stacked on the right. Stacks to one column on mobile.
 */
export function BentoGrid({ children }: { children: ReactNode }) {
  return <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">{children}</ul>;
}

type BentoTileProps = {
  size: "large" | "medium" | "small";
  surface: "green" | "white" | "warm" | "mint";
  icon: IconName;
  title: string;
  children: ReactNode;
  cta: { href: Route; label: string };
};

const placement = {
  large: "md:col-span-2 lg:col-span-7 lg:row-span-3",
  medium: "lg:col-span-5",
  small: "md:col-span-2 lg:col-span-5",
};

const surfaceClass = {
  green: "tone-green bg-green-band border-transparent",
  white: "bg-surface border-border",
  warm: "bg-surface-warm border-border",
  mint: "bg-surface-mint border-border",
};

/**
 * A tile whose call to action is stretched over the whole tile: one tab stop,
 * and the tile lifts on hover and focus.
 */
export function BentoTile({ size, surface, icon, title, children, cta }: BentoTileProps) {
  const large = size === "large";
  const small = size === "small";
  return (
    <li
      className={`lift isolate flex flex-col rounded-card border shadow-soft ${placement[size]} ${surfaceClass[surface]} ${
        large ? "p-6 sm:p-10 lg:min-h-[34rem]" : small ? "p-6 sm:p-7" : "p-6 sm:p-8"
      }`}
    >
      {large ? (
        // Decor sits under the content, clipped to the tile, so the lift
        // shadow outside the tile is not clipped with it.
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden rounded-card">
          <Grain />
          <CrossWatermark className="-bottom-10 -right-6 h-80 w-56 opacity-[0.07]" />
          <Icon
            name={icon}
            className="pointer-events-none absolute right-8 top-8 size-28 text-on-green opacity-[0.12]"
          />
        </div>
      ) : null}
      <div className={`flex flex-1 flex-col ${small ? "sm:flex-row sm:items-start sm:gap-5" : ""}`}>
        <IconTile name={icon} size={large ? "lg" : "md"} />
        {/* The large tile anchors its text to the bottom, below the icon. */}
        <div
          className={`flex flex-col ${
            small ? "mt-5 flex-1 sm:mt-0" : large ? "mt-auto pt-16" : "mt-6 flex-1"
          }`}
        >
          <h3 className={large ? "text-4xl leading-tight sm:text-5xl" : "text-2xl leading-snug"}>
            {title}
          </h3>
          <p
            className={`mt-3 leading-relaxed ${large ? "max-w-md text-lead text-on-green" : "text-ink-muted"}`}
          >
            {children}
          </p>
          <div className={large ? "mt-8" : "mt-auto pt-6"}>
            <Link
              href={cta.href}
              className={`group/button inline-flex items-center gap-2 text-base font-semibold after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring ${
                large
                  ? "min-h-12 rounded-button bg-lime-bright px-6 py-3 text-ink hover:bg-white sm:min-h-13"
                  : "text-emerald-deep underline decoration-2 underline-offset-4"
              }`}
            >
              {cta.label}
              <Icon
                name="arrow-right"
                className="size-5 transition-transform duration-200 motion-safe:group-hover/button:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}
