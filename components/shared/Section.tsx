import type { ReactNode } from "react";
import { Grain } from "./Decor";

/**
 * Section surfaces. Light pages alternate white, warm (cream) and mint.
 * Green is the lighter feature band. Deep green is reserved for the footer
 * and one feature panel per page, so it is not a section tone.
 */
export type SectionTone = "white" | "warm" | "mint" | "green";

const toneClass: Record<SectionTone, string> = {
  white: "bg-surface",
  warm: "bg-surface-warm",
  mint: "bg-surface-mint",
  green: "tone-green bg-green-band relative overflow-hidden",
};

type SectionProps = {
  /** Used for the heading id, so the section is labelled by its heading. */
  id: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: SectionTone;
  /** Narrow keeps reading width for text heavy sections. */
  width?: "wide" | "narrow";
  /** Centre only short closing bands. Content stays left aligned. */
  align?: "left" | "center";
  children?: ReactNode;
};

/** A page section: 72px vertical rhythm on mobile, 112px on desktop. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  tone = "white",
  width = "wide",
  align = "left",
  children,
}: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={toneClass[tone]}>
      {tone === "green" ? <Grain /> : null}
      <div className="container-page relative py-18 md:py-28">
        <div className={`reveal ${width === "narrow" ? "max-w-3xl" : ""}`}>
          <SectionHeader
            id={`${id}-heading`}
            eyebrow={eyebrow}
            intro={intro}
            align={align}
          >
            {title}
          </SectionHeader>
          {children ? <div className="mt-10 md:mt-14">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

/**
 * The recurring motif: a short rule above the heading, lime on green
 * surfaces and deep green on white, then an optional eyebrow and intro.
 */
export function SectionHeader({
  id,
  eyebrow,
  intro,
  align = "left",
  as: Heading = "h2",
  size = "large",
  children,
}: {
  id?: string;
  eyebrow?: string;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h2" | "h3";
  /** Compact for headings inside cards. */
  size?: "large" | "compact";
  children: ReactNode;
}) {
  const centred = align === "center";
  return (
    <div className={centred ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span
        aria-hidden="true"
        className={`block h-1 w-12 rounded-full bg-fg-accent ${centred ? "mx-auto" : ""}`}
      />
      {eyebrow ? <p className="eyebrow mt-5">{eyebrow}</p> : null}
      <Heading
        id={id}
        className={`${eyebrow ? "mt-3" : "mt-5"} ${size === "large" ? "text-h2" : "text-3xl leading-tight"}`}
      >
        {children}
      </Heading>
      {intro ? <div className="mt-5 text-lead text-fg-muted">{intro}</div> : null}
    </div>
  );
}
