import type { ReactNode } from "react";
import { resolvePassage, Scripture, type ScriptureVersion } from "./Scripture";

type ScriptureBlockProps = {
  passage: string;
  version?: ScriptureVersion;
  /** Optional label above the text, such as "The name behind the ministry". */
  label?: string;
  /** Light for teaching text. Feature is the larger panel beside a split section (Home, About). */
  variant?: "light" | "feature";
  /** One string per verse, so each verse keeps its own line. */
  verses?: ReactNode[];
  /** Paragraphs from MDX, used when `verses` is not given. */
  children?: ReactNode;
};

export function ScriptureBlock({
  passage,
  version = "KJV",
  label,
  variant = "light",
  verses,
  children,
}: ScriptureBlockProps) {
  const feature = variant === "feature";
  const { canonical } = resolvePassage(passage);

  const caption = (
    <span className="mt-7 flex flex-wrap items-center gap-3 font-sans text-sm font-semibold uppercase tracking-[0.16em]">
      <cite className="not-italic text-emerald-deep">{canonical}</cite>
      <span className="rounded-full bg-emerald px-2.5 py-0.5 text-xs text-white">
        {version}
      </span>
    </span>
  );

  return (
    <div
      className={
        feature
          ? "relative overflow-hidden rounded-r-card border border-l-4 border-border border-l-emerald bg-surface-mint p-8 shadow-soft sm:p-10"
          : "rounded-r-card border-l-4 border-emerald bg-surface-mint px-6 py-7 sm:px-9"
      }
    >
      {feature ? (
        <span
          aria-hidden="true"
          className="absolute left-6 top-1 font-serif text-[6rem] leading-none text-emerald opacity-15 sm:left-8"
        >
          &ldquo;
        </span>
      ) : null}
      {label ? (
        <p className={`eyebrow relative mb-5 ${feature ? "pt-8" : ""}`}>{label}</p>
      ) : null}
      <Scripture
        passage={passage}
        version={version}
        caption={caption}
        className={`relative ${feature && !label ? "pt-8" : ""}`}
      >
        <div
          className={`space-y-3 font-serif ${
            feature ? "text-xl leading-relaxed text-ink" : "text-lg leading-[1.7] text-ink"
          }`}
        >
          {verses ? verses.map((verse, index) => <p key={index}>{verse}</p>) : children}
        </div>
      </Scripture>
    </div>
  );
}

/** John 6:33-35, KJV. The passage behind the ministry's name. */
export const john6_33to35 = [
  "For the bread of God is he which cometh down from heaven, and giveth life unto the world.",
  "Then said they unto him, Lord, evermore give us this bread.",
  "And Jesus said unto them, I am the bread of life: he that cometh to me shall never hunger; and he that believeth on me shall never thirst.",
];
