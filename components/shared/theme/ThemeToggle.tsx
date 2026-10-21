"use client";

import { Icon } from "../icons";
import { setTheme, useTheme } from "./theme-store";

/**
 * Header switch, at every width: a 44px round icon button that turns the
 * dark theme on or off, styled like the Menu button. aria-pressed carries
 * the state. The icon is chosen by CSS (a moon in light, a sun in dark), so
 * it is right before hydration and the button never changes size.
 * Hidden without JavaScript (data-theme-control).
 */
export function ThemeToggle() {
  const { resolved } = useTheme();
  const dark = resolved === "dark";
  return (
    <button
      type="button"
      data-theme-control
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-glyph/55 bg-surface-raised text-emerald-deep hover:border-glyph hover:bg-tint"
    >
      <Icon name="moon" className="size-5 dark:hidden" />
      <Icon name="sun" className="hidden size-5 dark:block" />
    </button>
  );
}
