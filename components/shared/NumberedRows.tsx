import Link from "next/link";
import type { Route } from "next";
import { Icon } from "./icons";

export type NumberedRow = {
  title: string;
  text: string;
  href: Route;
};

/**
 * Big numbered rows (01, 02, 03) between thin dividers, for a short list of
 * options. Each whole row is one link: the number, a bold title and a
 * line of text, with an arrow that nudges on hover. Nothing else moves.
 */
export function NumberedRows({ items, className = "" }: { items: NumberedRow[]; className?: string }) {
  return (
    <ol className={`border-b border-border ${className}`}>
      {items.map((item, index) => (
        <li key={item.href + item.title} className="border-t border-border">
          <Link
            href={item.href}
            className="group grid grid-cols-[auto_1fr_auto] items-start gap-x-5 py-7 sm:gap-x-10 sm:py-9"
          >
            <span aria-hidden="true" className="font-serif text-4xl font-medium leading-none text-emerald-deep sm:text-6xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="block font-serif text-xl font-semibold leading-snug text-ink sm:text-2xl">
                {item.title}
              </span>
              <span className="mt-2 block leading-relaxed text-ink-muted">{item.text}</span>
            </span>
            <Icon
              name="arrow-right"
              className="mt-1 size-6 shrink-0 text-glyph transition-transform duration-300 ease-(--ease-standard) motion-safe:group-hover:translate-x-1"
            />
          </Link>
        </li>
      ))}
    </ol>
  );
}
