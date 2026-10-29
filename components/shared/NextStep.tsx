import type { ReactNode } from "react";
import { RevealHeading } from "./RevealHeading";
import { bandClass, toneClass, type SectionTone } from "./Section";

/**
 * The last section of every page: one line that names the next step, and
 * its button (docs/RESET-BRIEF.md section 1: no page is a dead end). The
 * button is the page's closing primary action. Left aligned, in the Home
 * rhythm, on the tint the page has not just used.
 */
export function NextStep({
  id = "next-step",
  title,
  text,
  tone = "mint",
  tight = false,
  children,
}: {
  id?: string;
  /** A short line or question. A plain string reveals once, like every section heading. */
  title: ReactNode;
  text?: ReactNode;
  tone?: SectionTone;
  /** The Teachings pages' tight rhythm (BibleProject's pattern), instead of the house band. */
  tight?: boolean;
  /** The button or buttons. Full width and stacked on phones. */
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section aria-labelledby={headingId} className={toneClass[tone]}>
      <div className={tight ? "container-page py-8 md:py-12" : bandClass}>
        {typeof title === "string" ? (
          <RevealHeading id={headingId} className="max-w-3xl text-h2" text={title} />
        ) : (
          <h2 id={headingId} className="max-w-3xl text-h2">
            {title}
          </h2>
        )}
        {text ? <p className="mt-4 max-w-2xl text-lead text-ink-muted">{text}</p> : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto">
          {children}
        </div>
      </div>
    </section>
  );
}
