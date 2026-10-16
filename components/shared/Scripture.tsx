import type { ReactNode } from "react";

export type ScriptureVersion = "KJV" | "ASV" | "YLT" | "DBY" | "WEB" | "NASB" | "NKJV";

export type ScriptureProps = {
  /** Human reference, for example "John 6:33-35". Not `ref`, which React reserves. */
  passage: string;
  version: ScriptureVersion;
  children: ReactNode;
  className?: string;
  /** Rendered in the figure caption beside the reference. */
  caption?: ReactNode;
};

/**
 * Machine readable scripture quotation. The passage and version sit on data
 * attributes so the Scripture Index can find every quotation later.
 *
 * TODO: resolve `passage` through /lib/scripture once it exists, and emit the
 * canonical reference and deep link. Until then the string is passed through
 * unparsed. References must never be parsed here.
 */
export function Scripture({ passage, version, children, className, caption }: ScriptureProps) {
  return (
    <figure data-passage={passage} data-version={version} className={className}>
      <blockquote>{children}</blockquote>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
