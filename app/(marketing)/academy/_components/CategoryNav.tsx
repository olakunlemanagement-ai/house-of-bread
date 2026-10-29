"use client";

import { useEffect, useState } from "react";

type CategoryLink = { slug: string; title: string };

/**
 * "Course categories": anchor links to each category on the page. From lg
 * a sticky list beside the courses; below lg a row of chips that wraps (no
 * sideways scroll, no dropdown). The category in view is marked with
 * aria-current and a tint pill with an inset ring. It follows scroll
 * (IntersectionObserver) and moves at once on a click, so it never lags
 * behind the jump. The weight never changes, so no chip rewraps. Without
 * script the links still jump; nothing is marked.
 */
export function CategoryNav({ categories }: { categories: CategoryLink[] }) {
  const [active, setActive] = useState<string | null>(null);
  const slugs = categories.map((category) => category.slug).join(" ");

  useEffect(() => {
    const ids = slugs.split(" ");
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const first = ids.find((id) => visible.get(id));
        if (first) setActive(first);
      },
      // A band across the upper middle of the screen: the category crossing it is the one being read.
      { rootMargin: "-20% 0px -55% 0px" },
    );
    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [slugs]);

  return (
    <nav aria-labelledby="category-nav-heading">
      <h3 id="category-nav-heading" className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
        Course categories
      </h3>
      <ul className="mt-3 flex flex-wrap gap-2 lg:mt-4 lg:flex-col lg:gap-1">
        {categories.map((category) => {
          const current = active === category.slug;
          return (
            <li key={category.slug}>
              <a
                href={`#${category.slug}`}
                aria-current={current ? "true" : undefined}
                onClick={() => setActive(category.slug)}
                className={`flex min-h-11 items-center rounded-full border px-4 text-[0.95rem] font-medium lg:rounded-xl lg:px-3.5 ${
                  current
                    ? "border-transparent bg-tint text-emerald-deep ring-1 ring-inset ring-glyph/25"
                    : "border-border text-ink hover:bg-tint lg:border-transparent"
                }`}
              >
                {category.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
