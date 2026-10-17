import type { Route } from "next";
import type { ReactNode } from "react";
import { ButtonLink } from "./Button";
import { HeroVisual } from "./HeroVisual";
import { FeatureList, type FeatureItem } from "./Lists";
import { StoreButtons } from "./StoreButtons";

/** What the official app carries. CONTENT-PACK section 3. */
export const appFeatures: FeatureItem[] = [
  { icon: "route", text: "New Testament journeys of 30, 60 and 90 days." },
  { icon: "scroll", text: "A written introduction to every New Testament book." },
  { icon: "book", text: "Six translations, with the King James Version as the default." },
  { icon: "compass", text: "Articles and teaching." },
  { icon: "check", text: "Progress tracked automatically." },
  { icon: "signal", text: "Works on modest devices and modest data." },
];

type AppBandProps = {
  idPrefix: string;
  eyebrow?: string;
  heading?: string;
  text?: ReactNode;
  features?: FeatureItem[];
  /** The band's one primary action. Without it, the store buttons lead. */
  action?: { href: Route; label: string };
  /** Extra placeholder or note under the store buttons. */
  note?: ReactNode;
};

/** The official app band: a soft mint panel with a radial tint, feature list, CSS phone frame. */
export function AppBand({
  idPrefix,
  eyebrow = "The official app",
  heading = "The ministry in your pocket",
  text = "The official House of Bread app brings the ministry's teaching and study tools together on your phone, so the Word goes where you go.",
  features = appFeatures,
  action,
  note,
}: AppBandProps) {
  const headingId = `${idPrefix}-heading`;
  return (
    <section aria-labelledby={headingId} className="bg-panel-tint relative overflow-hidden border-y border-border">
      <div className="container-page relative grid items-center gap-12 py-20 md:py-30 lg:grid-cols-12">
        <div className="reveal lg:col-span-7">
          <span aria-hidden="true" className="block h-0.5 w-10 rounded-full bg-emerald" />
          <p className="eyebrow mt-5">{eyebrow}</p>
          <h2 id={headingId} className="mt-3 text-h2">
            {heading}
          </h2>
          {text ? <p className="mt-4 max-w-xl text-lead text-ink-muted">{text}</p> : null}
          <div className="mt-9">
            <FeatureList items={features} />
          </div>
          <div className="mt-10 space-y-4">
            {action ? (
              <ButtonLink href={action.href} arrow className="w-full sm:w-auto">
                {action.label}
              </ButtonLink>
            ) : null}
            <StoreButtons />
          </div>
          {note ? <div className="mt-6">{note}</div> : null}
        </div>
        <div className="reveal lg:col-span-5">
          <HeroVisual showSession={false} />
        </div>
      </div>
    </section>
  );
}
