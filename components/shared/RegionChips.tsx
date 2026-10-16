import { regions } from "@/lib/content/copy";
import { Icon } from "./icons";

/** The three regions the ministry serves, as chips. Works on white and green. */
export function RegionChips({ label = "Regions served" }: { label?: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {regions.map((region) => (
        <li
          key={region}
          className="inline-flex items-center gap-2 rounded-full border border-fg-accent/40 bg-[var(--chip-fill)] px-3.5 py-1.5 text-sm font-semibold text-fg"
        >
          <Icon name="pin" className="size-4 text-fg-accent" />
          {region}
        </li>
      ))}
    </ul>
  );
}
