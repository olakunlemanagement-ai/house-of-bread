import type { ReactNode } from "react";
import type { LoopId } from "@/lib/media/loops";
import { LoopVideo } from "./LoopVideo";

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
  /**
   * Without a visual, desktop shows the dust in sunlight loop in a framed
   * panel on the right. Phones never see it. False turns it off.
   */
  motion?: boolean;
  /** The loop in that desktop panel. Dust in sunlight unless a page has its own. */
  loop?: LoopId;
};

/**
 * Opens every inner page: white with a soft emerald light at the top right,
 * a hairline below. The header floats over it, so top padding is its 72px
 * plus 64px or more of clear space above the eyebrow.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
  actions,
  visual,
  motion = true,
  loop = "dust-light",
}: PageHeaderProps) {
  const loopPanel = !visual && motion;
  return (
    <div className="bg-page-tint border-b border-border">
      <div
        className={`container-page pb-16 pt-34 sm:pb-20 sm:pt-42 ${
          visual || loopPanel ? "grid items-center gap-12 lg:grid-cols-12" : ""
        }`}
      >
        <div className={visual || loopPanel ? "lg:col-span-7" : ""}>
          <p className="rise eyebrow eyebrow-dot">{eyebrow}</p>
          <h1 className="rise-text rise-1 mt-5 max-w-3xl text-display">{title}</h1>
          {lead ? <p className="rise rise-2 mt-5 max-w-2xl text-lead text-ink-muted">{lead}</p> : null}
          {meta ? <div className="rise rise-2 mt-6">{meta}</div> : null}
          {actions ? (
            <div className="rise rise-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto">
              {actions}
            </div>
          ) : null}
        </div>
        {visual ? <div className="rise rise-3 lg:col-span-5">{visual}</div> : null}
        {loopPanel ? (
          <div className="rise rise-3 hidden lg:col-span-5 lg:block">
            <LoopVideo
              id={loop}
              sizes="(min-width: 1024px) 40vw, 1px"
              className="aspect-[4/3] overflow-hidden rounded-card border border-border shadow-soft"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
