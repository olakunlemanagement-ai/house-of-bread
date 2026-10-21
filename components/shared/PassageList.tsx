import { resolvePassage } from "./Scripture";

/**
 * Frontmatter passages as chips. Canonical text and deep link sit on data
 * attributes; they become links once the Scripture Index exists (stage two).
 */
export function PassageList({ passages }: { passages: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Passages">
      {passages.map((passage) => {
        const { canonical, href } = resolvePassage(passage);
        return (
          <li
            key={canonical}
            data-passage={canonical}
            data-href={href}
            className="rounded-full border border-glyph/25 bg-surface px-3.5 py-1.5 text-sm font-semibold text-emerald-deep"
          >
            {canonical}
          </li>
        );
      })}
    </ul>
  );
}
