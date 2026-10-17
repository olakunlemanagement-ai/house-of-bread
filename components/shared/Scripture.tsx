import type { ReactNode } from "react";
import {
  formatReference,
  parseReference,
  scriptureHref,
  type ScriptureVersion,
} from "@/lib/scripture";

export type { ScriptureVersion };

export type ScriptureProps = {
  /** Human reference, for example "John 6:33-35". Not `ref`, which React reserves. */
  passage: string;
  version: ScriptureVersion;
  children: ReactNode;
  className?: string;
  /** Rendered in the figure caption beside the reference. */
  caption?: ReactNode;
};

/** Resolves a passage through /lib/scripture. Throws on an invalid reference, so it fails the build. */
export function resolvePassage(passage: string) {
  const result = parseReference(passage);
  if (!result.ok) throw new Error(`Scripture passage "${passage}": ${result.error}`);
  return { canonical: formatReference(result.ref), href: scriptureHref(result.ref) };
}

/**
 * Machine readable scripture quotation. The canonical reference, its deep
 * link and the version sit on data attributes, so the Scripture Index can
 * find every quotation later. The deep link is data only until the Scripture
 * Index pages exist (stage two).
 */
export function Scripture({ passage, version, children, className, caption }: ScriptureProps) {
  const { canonical, href } = resolvePassage(passage);
  return (
    <figure data-passage={canonical} data-href={href} data-version={version} className={className}>
      <blockquote>{children}</blockquote>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
