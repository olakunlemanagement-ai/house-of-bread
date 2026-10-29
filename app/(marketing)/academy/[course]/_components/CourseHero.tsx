import type { ReactNode } from "react";

/**
 * A course page's plain hero, like the Teachings pages (29 October 2026):
 * no loop, no scrim, not full screen. The transparent header sits over its
 * top, so the top padding is the 64px header plus the clear space. Text on
 * the left, the course image on the right from lg; on phones the text
 * comes first. A hairline closes it above the tabs. `data-hero-text` marks
 * the text for the checks, as in every hero.
 */
export function CourseHero({
  eyebrow,
  title,
  byline,
  lead,
  meta,
  actions,
  visual,
}: {
  eyebrow: string;
  title: string;
  /** Scripture range and teacher, one line. */
  byline: string;
  lead: string;
  meta: ReactNode;
  actions: ReactNode;
  visual: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="container-page grid items-center gap-10 pb-10 pt-24 sm:pt-28 md:pb-14 lg:grid-cols-12 lg:gap-12">
        <div data-hero-text className="lg:col-span-6">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-display">{title}</h1>
          <p className="mt-3 text-base font-semibold text-emerald-deep">{byline}</p>
          <p className="mt-4 max-w-2xl text-lead text-ink-muted">{lead}</p>
          <div className="mt-6">{meta}</div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto">
            {actions}
          </div>
        </div>
        <div className="lg:col-span-6">{visual}</div>
      </div>
    </div>
  );
}
