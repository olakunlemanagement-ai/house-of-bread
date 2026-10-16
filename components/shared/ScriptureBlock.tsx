import type { ReactNode } from "react";
import { CrossWatermark } from "./Decor";
import { Scripture, type ScriptureVersion } from "./Scripture";

type ScriptureBlockProps = {
  passage: string;
  version?: ScriptureVersion;
  /** Optional label above the text, such as "The name behind the ministry". */
  label?: string;
  /** Light for teaching text, dark for feature moments on Home and About. */
  variant?: "light" | "dark";
  /** One string per verse, so each verse keeps its own line. */
  verses: ReactNode[];
};

export function ScriptureBlock({
  passage,
  version = "KJV",
  label,
  variant = "light",
  verses,
}: ScriptureBlockProps) {
  const dark = variant === "dark";

  const caption = (
    <span className="mt-6 flex flex-wrap items-center gap-3 font-sans text-sm font-bold uppercase tracking-[0.16em]">
      <cite className={`not-italic ${dark ? "text-lime" : "text-green"}`}>{passage}</cite>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs ${
          dark ? "bg-lime text-on-lime" : "bg-green text-white"
        }`}
      >
        {version}
      </span>
    </span>
  );

  return (
    <div
      className={
        dark
          ? "tone-green bg-green-band relative overflow-hidden rounded-3xl p-8 sm:p-12"
          : "rounded-r-2xl border-l-4 border-green bg-surface-tint px-6 py-6 sm:px-8"
      }
    >
      {dark ? <CrossWatermark className="-right-4 -top-6 h-64 w-44 opacity-[0.07]" /> : null}
      {label ? (
        <p
          className={`relative mb-5 font-sans text-sm font-bold uppercase tracking-[0.2em] ${
            dark ? "text-lime" : "text-green"
          }`}
        >
          {label}
        </p>
      ) : null}
      <Scripture passage={passage} version={version} caption={caption} className="relative">
        <div
          className={`space-y-3 font-serif ${
            dark ? "text-xl leading-relaxed text-on-green sm:text-2xl" : "text-lg leading-[1.7] text-ink"
          }`}
        >
          {verses.map((verse, index) => (
            <p key={index}>{verse}</p>
          ))}
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
