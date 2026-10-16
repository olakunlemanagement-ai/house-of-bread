import type { ReactNode } from "react";
import { CrossWatermark } from "./Decor";
import { FeatureList } from "./Lists";
import { PhoneFrame } from "./PhoneFrame";
import { StoreButtons } from "./StoreButtons";

export const appBandFeatures = [
  "Six translations throughout.",
  "Swipe between chapters.",
  "Readable typography for long sessions.",
  "Works on modest devices and modest data.",
];

type AppBandProps = {
  idPrefix: string;
  heading?: string;
  text?: ReactNode;
  features?: ReactNode[];
  /** Extra placeholder or note under the store buttons. */
  note?: ReactNode;
};

/** App promotion band: green gradient, feature list, CSS phone frame. */
export function AppBand({
  idPrefix,
  heading = "Take the reading with you",
  text = "Clean, distraction-free reading with six translations and the King James Version as the default. Switch versions without losing your place.",
  features = appBandFeatures,
  note,
}: AppBandProps) {
  const headingId = `${idPrefix}-heading`;
  return (
    <section aria-labelledby={headingId} className="tone-green bg-green-hero relative overflow-hidden">
      <CrossWatermark className="-left-8 bottom-0 h-72 w-52 opacity-[0.05]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-lime" />
          <h2 id={headingId} className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            {heading}
          </h2>
          {text ? <p className="mt-4 max-w-xl text-lg leading-relaxed text-on-green">{text}</p> : null}
          <div className="mt-8">
            <FeatureList items={features} />
          </div>
          <div className="mt-10">
            <StoreButtons />
          </div>
          {note ? <div className="mt-6">{note}</div> : null}
        </div>
        <PhoneFrame />
      </div>
    </section>
  );
}
