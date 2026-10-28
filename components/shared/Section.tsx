import type { ReactNode } from "react";
import { RevealHeading } from "./RevealHeading";

/**
 * Section surfaces. Pages are white, with warm (cream) and mint bands for
 * rhythm, one tint per section. There are no green or deep green sections.
 */
export type SectionTone = "white" | "warm" | "mint";

export const toneClass: Record<SectionTone, string> = {
  white: "bg-surface",
  warm: "bg-surface-warm",
  mint: "bg-surface-mint",
};

/** One rhythm for every section on every page: 40px on phones, 112px from md. */
export const bandClass = "container-page py-10 md:py-28";

/** The gap between a section's heading block and its content. */
export const bandBodyClass = "mt-6 md:mt-12";

type SectionProps = {
  /** Used for the heading id, so the section is labelled by its heading. */
  id: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: SectionTone;
  /** Narrow keeps reading width for text heavy sections. */
  width?: "wide" | "narrow";
  children?: ReactNode;
};

/** A page section in the Home rhythm: a question-led heading, an optional line, then content. */
export function Section({ id, eyebrow, title, intro, tone = "white", width = "wide", children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={toneClass[tone]}>
      <div className={bandClass}>
        <div className={width === "narrow" ? "max-w-3xl" : ""}>
          <SectionHeader id={`${id}-heading`} eyebrow={eyebrow} intro={intro}>
            {title}
          </SectionHeader>
          {children ? <div className={bandBodyClass}>{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

/**
 * An optional eyebrow, the heading and an optional intro, as on Home. A
 * plain text heading reveals line by line once, as it enters (RevealHeading).
 */
export function SectionHeader({
  id,
  eyebrow,
  intro,
  as: Heading = "h2",
  size = "large",
  children,
}: {
  id?: string;
  eyebrow?: string;
  intro?: ReactNode;
  as?: "h2" | "h3";
  /** Compact for headings inside cards, such as a form's. */
  size?: "large" | "compact";
  children: ReactNode;
}) {
  const headingClass = `${eyebrow ? "mt-4" : ""} ${size === "large" ? "text-h2" : "text-2xl leading-tight"}`;
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {typeof children === "string" ? (
        <RevealHeading as={Heading} id={id} text={children} className={headingClass} />
      ) : (
        <Heading id={id} className={headingClass}>
          {children}
        </Heading>
      )}
      {intro ? <div className="mt-4 text-lead text-ink-muted">{intro}</div> : null}
    </div>
  );
}
