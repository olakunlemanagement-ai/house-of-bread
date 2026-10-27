import type { ReactNode } from "react";
import { LoopVideo } from "./LoopVideo";

/**
 * Short closing call to action on a soft mint panel. Centred on small
 * screens, as short closing bands are. From lg the text sits left and the
 * green mesh poster sits still in a framed panel on the right.
 */
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
    <section aria-labelledby={`${id}-heading`} className="bg-panel-tint relative overflow-hidden border-y border-border">
      <div className="container-page reveal relative grid items-center gap-12 py-20 text-center md:py-24 lg:grid-cols-12 lg:text-left">
        <div className="lg:col-span-7">
          <span aria-hidden="true" className="mx-auto block h-0.5 w-10 rounded-full bg-glyph lg:mx-0" />
          {eyebrow ? <p className="eyebrow mt-5">{eyebrow}</p> : null}
          <h2 id={`${id}-heading`} className="mx-auto mt-4 max-w-3xl text-h2 lg:mx-0">
            {title}
          </h2>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start [&>*]:w-full sm:[&>*]:w-auto">
            {children}
          </div>
        </div>
        <div className="hidden lg:col-span-5 lg:block">
          <LoopVideo
            id="green-mesh"
            still
            sizes="(min-width: 1024px) 40vw, 1px"
            className="aspect-video overflow-hidden rounded-card border border-border shadow-soft"
          />
        </div>
      </div>
    </section>
  );
}
