import type { ReactNode } from "react";

type SectionProps = {
  /** Used for the heading id, so the section is labelled by its heading. */
  id: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "white" | "tint";
  /** Narrow keeps reading width for text heavy sections. */
  width?: "wide" | "narrow";
  children?: ReactNode;
};

export function Section({
  id,
  title,
  intro,
  tone = "white",
  width = "wide",
  children,
}: SectionProps) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={tone === "tint" ? "bg-surface-tint" : "bg-surface"}
    >
      <div
        className={`mx-auto px-4 py-16 sm:px-6 md:py-24 ${
          width === "narrow" ? "max-w-3xl" : "max-w-6xl"
        }`}
      >
        <SectionHeading id={`${id}-heading`}>{title}</SectionHeading>
        {intro ? (
          <div className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">{intro}</div>
        ) : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}

/** The recurring motif: a short lime rule above a deep green heading. */
export function SectionHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-lime" />
      <h2 id={id} className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        {children}
      </h2>
    </>
  );
}
