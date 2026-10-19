import type { ReactNode } from "react";

/**
 * Section surfaces. Pages are white, with warm (cream) and mint bands for
 * rhythm. There are no green or deep green sections.
 */
export type SectionTone = "white" | "warm" | "mint";

const toneClass: Record<SectionTone, string> = {
  white: "bg-surface",
  warm: "bg-surface-warm",
  mint: "bg-surface-mint",
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
  /** False when the cards inside reveal one by one (.card-motion), so nothing fades twice. */
  reveal?: boolean;
  children?: ReactNode;
};

/** A page section: 80px vertical rhythm on mobile, 120px on desktop. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  tone = "white",
  width = "wide",
  align = "left",
  reveal = true,
  children,
}: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={toneClass[tone]}>
      <div className="container-page relative py-20 md:py-30">
        <div className={`${reveal ? "reveal" : ""} ${width === "narrow" ? "max-w-3xl" : ""}`}>
          <SectionHeader
            id={`${id}-heading`}
            eyebrow={eyebrow}
            intro={intro}
            align={align}
          >
            {title}
          </SectionHeader>
          {children ? <div className="mt-10 md:mt-12">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

/**
 * The recurring motif: a short emerald rule above the heading, then an
 * optional eyebrow and intro.
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
        className={`block h-0.5 w-10 rounded-full bg-emerald ${centred ? "mx-auto" : ""}`}
      />
      {eyebrow ? (
        <p className="mt-5">
          <span className="eyebrow">{eyebrow}</span>
        </p>
      ) : null}
      <Heading
        id={id}
        className={`${eyebrow ? "mt-3" : "mt-5"} ${size === "large" ? "text-h2" : "text-2xl leading-tight"}`}
      >
        {children}
      </Heading>
      {/* Body text stays left aligned on phones, even under a centred heading. */}
      {intro ? (
        <div className={`mt-4 text-lead text-fg-muted ${centred ? "text-left sm:text-center" : ""}`}>{intro}</div>
      ) : null}
    </div>
  );
}
