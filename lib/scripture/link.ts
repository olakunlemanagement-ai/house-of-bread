// Website deep links into the Scripture Index (stage two pages).
// Format from SPEC-v3 section 8: /scripture/john/6#35
// The app's own URL scheme is an open item and is not built here.

import type { ScriptureRef } from "./parse.ts";

export function scriptureHref(ref: ScriptureRef): string {
  const { book, start } = ref;
  const base = `/scripture/${book.id}/${start.chapter}`;
  return start.verse === undefined ? base : `${base}#${start.verse}`;
}
