import type { ReactNode } from "react";
import { CrossWatermark, CurveEdge, Leaves } from "./Decor";

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Extra lines under the lead, such as dates or passage chips. */
  meta?: ReactNode;
  actions?: ReactNode;
};

/** Green gradient band that opens every inner page. */
export function PageHeader({ eyebrow, title, lead, meta, actions }: PageHeaderProps) {
  return (
    <div className="tone-green bg-green-band relative overflow-hidden">
      <CrossWatermark className="-right-6 -top-10 h-80 w-56 opacity-[0.06] sm:right-12" />
      <Leaves className="-bottom-10 right-1/3 hidden size-56 opacity-[0.07] md:block" />
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
          {title}
        </h1>
        {lead ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-green sm:text-xl">
            {lead}
          </p>
        ) : null}
        {meta ? <div className="mt-6 text-on-green-muted">{meta}</div> : null}
        {actions ? <div className="mt-8 flex flex-wrap items-center gap-4">{actions}</div> : null}
      </div>
      <CurveEdge />
    </div>
  );
}
