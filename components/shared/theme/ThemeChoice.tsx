"use client";

import { useId } from "react";
import { Icon, type IconName } from "../icons";
import { setTheme, useTheme, type ThemeChoice as Choice } from "./theme-store";

const OPTIONS: { value: Choice; label: string; icon: IconName }[] = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "monitor" },
];

/**
 * Light, dark or system, as a radio group: the mobile menu and the footer.
 * Colours come from the contextual tokens, so it reads on light, on dark
 * and on the deep green footer. The checked option is a pill with an inset
 * ring and heavier type, like the current nav link, never colour alone.
 * Hidden without JavaScript (data-theme-control).
 */
export function ThemeChoice({ legendClassName = "" }: { legendClassName?: string }) {
  const name = useId();
  const { choice } = useTheme();
  return (
    <fieldset data-theme-control>
      <legend className={legendClassName}>Theme</legend>
      <div className="mt-3 inline-flex gap-1 rounded-full border border-(--choice-edge) p-1">
        {OPTIONS.map((option) => (
          <label key={option.value} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={choice === option.value}
              onChange={() => setTheme(option.value)}
              className="peer sr-only"
            />
            <span className="flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-fg hover:bg-(--chip-hover) peer-checked:bg-(--pill-current-bg) peer-checked:font-semibold peer-checked:text-(--pill-current-fg) peer-checked:ring-1 peer-checked:ring-inset peer-checked:ring-(--pill-current-ring) peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--ring) peer-focus-visible:outline-solid">
              <Icon name={option.icon} className="size-4 shrink-0" />
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
