import type { ReactNode } from "react";

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
};

/**
 * Opens every inner page: white with a soft emerald light at the top right,
 * a hairline below. Generous top padding keeps the eyebrow well clear of the
 * sticky header.
 */
export function PageHeader({ eyebrow, title, lead, meta, actions, visual }: PageHeaderProps) {
  return (
    <div className="bg-page-tint border-b border-border">
      <div
        className={`container-page pb-16 pt-16 sm:pb-20 sm:pt-24 ${
          visual ? "grid items-center gap-12 lg:grid-cols-12" : ""
        }`}
      >
        <div className={visual ? "lg:col-span-7" : ""}>
          <p className="rise eyebrow eyebrow-dot">{eyebrow}</p>
          <h1 className="rise-text rise-1 mt-5 max-w-3xl text-display">{title}</h1>
          {lead ? <p className="rise rise-2 mt-5 max-w-2xl text-lead text-ink-muted">{lead}</p> : null}
          {meta ? <div className="rise rise-2 mt-6">{meta}</div> : null}
          {actions ? (
            <div className="rise rise-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto">
              {actions}
            </div>
          ) : null}
        </div>
        {visual ? <div className="rise rise-3 lg:col-span-5">{visual}</div> : null}
      </div>
    </div>
  );
}
