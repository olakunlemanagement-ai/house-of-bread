import { regions } from "@/lib/content/copy";
import { Flag } from "./Flags";

/** The three regions the ministry serves, as chips. Works on white and green. */
export function RegionChips({ label = "Regions served" }: { label?: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {regions.map((region) => (
        <li
          key={region.name}
          className="inline-flex items-center gap-2 rounded-full border border-fg-accent/40 bg-[var(--chip-fill)] px-3.5 py-1.5 text-sm font-semibold text-fg"
        >
          <Flag code={region.flag} className="w-6" />
          {region.name}
        </li>
      ))}
    </ul>
  );
}
