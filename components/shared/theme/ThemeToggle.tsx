"use client";

import { Icon } from "../icons";
import { setTheme, useTheme } from "./theme-store";

/**
 * Header switch, wide screens only: a 44px icon button that turns the dark
 * theme on or off. aria-pressed carries the state. The icon is chosen by CSS
 * (a moon in light, a sun in dark), so it is right before hydration too.
 * Hidden without JavaScript (data-theme-control).
 */
export function ThemeToggle() {
  const { resolved } = useTheme();
  const dark = resolved === "dark";
  return (
    <button
      type="button"
      data-theme-control
      aria-label="Dark theme"
      aria-pressed={dark}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink hover:bg-tint"
    >
      <Icon name="moon" className="size-5 dark:hidden" />
      <Icon name="sun" className="hidden size-5 dark:block" />
    </button>
  );
}
