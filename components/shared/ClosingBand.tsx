import type { ReactNode } from "react";
import { CrossWatermark, Grain } from "./Decor";

/** Short closing call to action on green. Centred, as short closing bands are. */
export function ClosingBand({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  /** The band's actions. Full width and stacked on mobile. */
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="tone-green bg-green-band relative overflow-hidden">
      <Grain />
      <CrossWatermark className="left-1/2 top-1/2 h-96 w-64 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]" />
      <div className="container-page reveal relative py-18 text-center md:py-24">
        <span aria-hidden="true" className="mx-auto block h-1 w-12 rounded-full bg-lime" />
        {eyebrow ? <p className="eyebrow mt-5">{eyebrow}</p> : null}
        <h2 id={`${id}-heading`} className="mx-auto mt-4 max-w-3xl text-h2">
          {title}
        </h2>
        <div className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center [&>*]:w-full sm:[&>*]:w-auto">
          {children}
        </div>
      </div>
    </section>
  );
}
