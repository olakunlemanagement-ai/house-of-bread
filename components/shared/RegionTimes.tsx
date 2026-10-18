import { sessionRegions } from "@/lib/content/copy";
import { siteConfig } from "@/lib/site-config";
import { Flag } from "./Flags";
import { Placeholder } from "./Placeholder";

const formatIn = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(new Date(iso));

/**
 * The regular live session in UK, Nigerian and US time, for believers
 * joining online from those regions. The ministry is online only, so the
 * cards are time zones, never places to attend. Formatted on the
 * server from one UTC time, so it needs no script. Frames are art directed
 * (mint to cream wash, faint emerald lines), never landmark photos.
 * Ink and ink-muted on mint hold 14.88 and 6.90:1.
 */
export function RegionTimes({ headingId }: { headingId: string }) {
  const iso = siteConfig.links.weeklySessionUtc;
  return (
    <div>
      <h3 id={headingId} className="text-2xl leading-snug">
        Session times for joining online
      </h3>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">
        Every session is online. These are the times for believers joining from the United Kingdom,
        Nigeria and the United States.
      </p>
      <ul aria-labelledby={headingId} className="mt-6 grid gap-4 sm:grid-cols-3">
        {sessionRegions.map((region) => (
          <li
            key={region.timeZone}
            className="relative overflow-hidden rounded-card border border-border bg-surface-mint p-6 shadow-soft [background-image:linear-gradient(135deg,var(--surface-mint),var(--surface-warm)_75%)]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,var(--emerald)_0_1px,transparent_1px_14px)]"
            />
            <div className="relative">
              <p className="flex items-center gap-2.5 font-semibold text-ink">
                <Flag code={region.flag} className="w-8" />
                <span>
                  <span className="sr-only">Joining from </span>
                  {region.name}
                </span>
              </p>
              {iso ? (
                <p className="mt-3 font-serif text-2xl font-semibold leading-tight text-ink">
                  {formatIn(iso, region.timeZone)}
                </p>
              ) : (
                <p className="mt-3 text-base">
                  <Placeholder>[SESSION TIME TO BE SUPPLIED]</Placeholder>
                </p>
              )}
              <p className="mt-1 text-sm text-ink-muted">{region.zoneLabel}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
