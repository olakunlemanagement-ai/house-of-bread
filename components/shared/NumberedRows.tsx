import type { Route } from "next";
import { ButtonLink } from "./Button";

export type NumberedRow = {
  title: string;
  text: string;
  href: Route;
  /** The row's button label, from the brief's list (such as "Start this course"). */
  action: string;
};

/**
 * Big numbered rows (01, 02, 03) between thin dividers, for a short list of
 * options. Each row: the number, a bold title, a line of text, then a small
 * tertiary button, which is the row's link (below the text on phones, at
 * the row's end from sm). The row title completes the button's accessible
 * name, so two "Start this course" buttons stay distinct. Nothing moves.
 */
export function NumberedRows({ items, className = "" }: { items: NumberedRow[]; className?: string }) {
  return (
    <ol className={`border-b border-border ${className}`}>
      {items.map((item, index) => (
        <li
          key={item.href + item.title}
          className="grid grid-cols-[3rem_1fr] items-start gap-x-4 border-t border-border py-7 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center sm:gap-x-8 sm:py-9"
        >
          <span aria-hidden="true" className="font-serif text-4xl font-medium leading-none text-emerald-deep sm:text-6xl">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-serif text-xl font-semibold leading-snug text-ink sm:text-2xl">{item.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-muted">{item.text}</p>
          </div>
          <div className="col-start-2 mt-4 sm:col-start-3 sm:mt-0">
            <ButtonLink href={item.href} variant="tertiary" size="sm" className="whitespace-nowrap">
              {item.action}
              <span className="sr-only">: {item.title}</span>
            </ButtonLink>
          </div>
        </li>
      ))}
    </ol>
  );
}
