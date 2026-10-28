import type { ReactNode } from "react";
import type { LoopId } from "@/lib/media/loops";
import { HeroBackdrop, heroBodyClass, heroFrameClass } from "./HeroBackdrop";

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Extra lines under the lead, such as dates or passage chips. */
  meta?: ReactNode;
  /** Buttons. Full width and stacked on mobile. */
  actions?: ReactNode;
  /** Optional visual on the right on desktop, below on mobile. Sits on a solid surface of its own. */
  visual?: ReactNode;
  /** The loop behind this hero. Each page picks one (docs/PLACEHOLDERS.md, "Hero loop per page"). */
  loop: LoopId;
  /** Play the loop's phone crop on phones. The Academy only; other pages show the poster there. */
  phoneLoop?: boolean;
};

/**
 * Opens every inner page as a hero, like Home: it fills the first screen
 * with the header over its top (heroFrameClass), the page's loop moving
 * behind the text (HeroBackdrop), a hairline below. The text sits in the
 * left seven columns, inside the scrim's full strength, centred in the
 * screen below the header.
 */
export function PageHeader({ eyebrow, title, lead, meta, actions, visual, loop, phoneLoop = false }: PageHeaderProps) {
  return (
    <div className={`${heroFrameClass} border-b border-border`}>
      <HeroBackdrop loop={loop} phone={phoneLoop} />
      <div className={`${heroBodyClass} grid content-center items-center gap-12 lg:grid-cols-12`}>
        <div data-hero-text className="lg:col-span-7">
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
      </div>
    </div>
  );
}
