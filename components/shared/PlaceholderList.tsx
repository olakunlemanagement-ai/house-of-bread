import Link from "next/link";
import type { Route } from "next";

type PlaceholderListProps = {
  heading: string;
  items: { href: Route; title: string }[];
};

export function PlaceholderList({ heading, items }: PlaceholderListProps) {
  return (
    <section aria-labelledby="sample-entries">
      <h2 id="sample-entries" className="text-xl font-semibold">
        {heading}
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-link underline underline-offset-4"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
