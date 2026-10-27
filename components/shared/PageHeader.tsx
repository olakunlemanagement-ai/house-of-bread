import type { ReactNode } from "react";
import { getLoop, type LoopId } from "@/lib/media/loops";
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
   * panel on the right. Phones see it only for a hero loop with a phone
   * rendition (Academy), below the text; tablets never. False turns it off.
   */
  motion?: boolean;
  /** The loop in that desktop panel. Dust in sunlight unless a page has its own. */
  loop?: LoopId;
};

/**
 * Opens every inner page: flat white, a hairline below. It sits below the
 * sticky header, with 64px or more of clear space above the eyebrow.
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
  // A hero loop that plays on phones: the panel shows there too, and its
  // poster may be the largest paint, so it loads first.
  const onPhones = loopPanel && getLoop(loop).phone !== undefined;
  return (
    <div className="bg-page-tint border-b border-border">
      <div
        className={`container-page pb-16 pt-16 sm:pb-20 sm:pt-20 ${
          visual || loopPanel ? "grid items-center gap-12 lg:grid-cols-12" : ""
        }`}
      >
        <div className={visual || loopPanel ? "lg:col-span-7" : ""}>
          <p className="eyebrow eyebrow-dot">{eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-display">{title}</h1>
          {lead ? <p className="mt-5 max-w-2xl text-lead text-ink-muted">{lead}</p> : null}
          {meta ? <div className="mt-6">{meta}</div> : null}
          {actions ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto">
              {actions}
            </div>
          ) : null}
        </div>
        {visual ? <div className="lg:col-span-5">{visual}</div> : null}
        {loopPanel ? (
          <div
            className={
              onPhones
                ? "w-full max-w-md md:hidden lg:col-span-5 lg:block lg:max-w-none"
                : "hidden lg:col-span-5 lg:block"
            }
          >
            <LoopVideo
              id={loop}
              sizes={onPhones ? "(min-width: 1024px) 40vw, (max-width: 767px) 100vw, 1px" : "(min-width: 1024px) 40vw, 1px"}
              priority={onPhones}
              className="aspect-[4/3] overflow-hidden rounded-card border border-border shadow-soft"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
