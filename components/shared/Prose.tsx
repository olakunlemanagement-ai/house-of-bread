import type { ReactNode } from "react";

/** Styled wrapper for MDX body content. See .prose in app/globals.css. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose">{children}</div>;
}
