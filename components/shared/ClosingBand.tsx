import type { ReactNode } from "react";

/** Short closing call to action on a soft mint panel. Centred, as short closing bands are. */
export function ClosingBand({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  /** The band's actions. Full width and stacked on mobile. */
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="bg-panel-tint relative overflow-hidden border-y border-border">
      <div className="container-page reveal relative py-20 text-center md:py-24">
        <span aria-hidden="true" className="mx-auto block h-0.5 w-10 rounded-full bg-emerald" />
        {eyebrow ? (
          <p className="eyebrow mt-5">{eyebrow}</p>
        ) : null}
        <h2 id={`${id}-heading`} className="mx-auto mt-4 max-w-3xl text-h2">
          {title}
        </h2>
        <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center [&>*]:w-full sm:[&>*]:w-auto">
          {children}
        </div>
      </div>
    </section>
  );
}
