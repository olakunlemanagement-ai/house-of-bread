import type { ReactNode } from "react";
import { RevealHeading } from "@/components/shared/RevealHeading";

/*
  The Teachings pages (/media, a teaching, a series) follow BibleProject's
  Videos page since 29 October 2026, an agreed exception to the house hero
  and rhythm: a plain hero (no loop, no scrim, not full screen), one plain
  surface throughout, and a tight rhythm between sections. Everything else
  (buttons, tokens, both themes, Motion) is the house system.
*/

/** The tight rhythm between Teachings sections: 24px on phones, 40px from md, top and bottom. */
export const teachingsBandClass = "container-page py-6 md:py-10";

/**
 * The plain hero: the surface, with the transparent header over its top
 * (top padding is the 64px header plus the clear space). Text on the left,
 * the visual larger on the right from lg; on phones the text comes first.
 * `data-hero-text` marks the text for the checks, as in every hero.
 */
export function TeachingsHero({
  eyebrow,
  title,
  lead,
  meta,
  actions,
  visual,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  visual?: ReactNode;
}) {
  return (
    <div className="bg-surface">
      <div className="container-page grid items-center gap-8 pb-6 pt-24 sm:pt-28 md:pb-10 lg:grid-cols-12 lg:gap-12">
        <div data-hero-text className="lg:col-span-5">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-h2 font-medium lg:text-[2.5rem] lg:leading-[1.12]">{title}</h1>
          {lead ? <p className="mt-4 max-w-xl text-lead text-ink-muted">{lead}</p> : null}
          {meta ? <div className="mt-3">{meta}</div> : null}
          {actions ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto">
              {actions}
            </div>
          ) : null}
        </div>
        {visual ? <div className="lg:col-span-7">{visual}</div> : null}
      </div>
    </div>
  );
}

/** A section heading in the Teachings size: smaller than the house h2, so the rows lead. */
export const teachingsHeadingClass = "text-2xl font-medium leading-tight md:text-[1.75rem]";

/** A Teachings section: its heading, then its content close beneath. `data-region` is what check-noscript measures. */
export function TeachingsSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="bg-surface">
      <div className={teachingsBandClass}>
        <RevealHeading id={`${id}-heading`} text={title} className={teachingsHeadingClass} />
        <div data-region={id} className="mt-4 md:mt-5">
          {children}
        </div>
      </div>
    </section>
  );
}
