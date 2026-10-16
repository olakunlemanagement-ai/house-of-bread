import type { ReactNode } from "react";
import { CrossWatermark, CurveEdge, Grain, Leaves } from "./Decor";

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Extra lines under the lead, such as dates or passage chips. */
  meta?: ReactNode;
  /** Buttons. Full width and stacked on mobile. */
  actions?: ReactNode;
  /** Optional visual on the right on desktop, below on mobile. */
  visual?: ReactNode;
  /** Colour of the section that follows, so the curved edge blends in. */
  next?: "white" | "tint";
};

/** Green gradient band that opens every inner page. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
  actions,
  visual,
  next = "white",
}: PageHeaderProps) {
  return (
    <div className="tone-green bg-green-hero relative overflow-hidden">
      <Grain />
      <CrossWatermark className="-right-6 -top-10 h-80 w-56 opacity-[0.06] sm:right-12" />
      <Leaves className="-bottom-10 right-1/3 hidden size-56 opacity-[0.07] md:block" />
      <div
        className={`container-page relative pb-24 pt-14 sm:pb-32 sm:pt-20 ${
          visual ? "grid items-center gap-12 lg:grid-cols-12" : ""
        }`}
      >
        <div className={visual ? "lg:col-span-7" : ""}>
          <p className="eyebrow rise">{eyebrow}</p>
          <h1 className="rise-text rise-1 mt-5 max-w-4xl text-display">{title}</h1>
          {lead ? <p className="rise rise-2 mt-6 max-w-2xl text-lead text-on-green">{lead}</p> : null}
          {meta ? <div className="rise rise-2 mt-6 text-on-green-muted">{meta}</div> : null}
          {actions ? (
            <div className="rise rise-3 mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto">
              {actions}
            </div>
          ) : null}
        </div>
        {visual ? <div className="rise rise-3 lg:col-span-5">{visual}</div> : null}
      </div>
      <CurveEdge tone={next} />
    </div>
  );
}
