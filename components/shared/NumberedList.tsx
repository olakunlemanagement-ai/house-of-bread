import type { ReactNode } from "react";

/**
 * Big numbered rows (01, 02, 03) between thin dividers, for a short list
 * with nothing to click: a bold title and a line of text each, or a line
 * of text alone. The same look as NumberedRows, without the button.
 */
export function NumberedList({
  items,
  className = "",
}: {
  items: { title?: string; text: ReactNode }[];
  className?: string;
}) {
  return (
    <ol className={`border-b border-border ${className}`}>
      {items.map((item, index) => (
        <li
          key={index}
          className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 border-t border-border py-5 sm:grid-cols-[5.5rem_1fr] sm:gap-x-8 sm:py-7"
        >
          <span aria-hidden="true" className="font-serif text-3xl font-medium leading-none text-emerald-deep sm:text-5xl">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            {item.title ? (
              <>
                <h3 className="font-serif text-xl font-semibold leading-snug text-ink sm:text-2xl">{item.title}</h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-ink-muted">{item.text}</p>
              </>
            ) : (
              <p className="max-w-2xl text-lg leading-relaxed text-ink">{item.text}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
