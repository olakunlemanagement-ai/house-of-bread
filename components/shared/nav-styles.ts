/** Shared by the client nav and its static fallback. Current page: lime underline. */
export function navLinkClass(layout: "inline" | "stacked", current: boolean) {
  const marker = current ? "underline decoration-lime decoration-[3px] underline-offset-8" : "";
  return layout === "inline"
    ? `block rounded-lg px-3 py-2 font-medium text-on-green hover:underline hover:decoration-lime hover:decoration-2 hover:underline-offset-8 ${marker}`
    : `flex min-h-14 items-center rounded-xl px-4 font-serif text-2xl font-semibold text-on-green hover:bg-green-night ${marker}`;
}
