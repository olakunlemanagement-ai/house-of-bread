export type NavLayout = "inline" | "stacked" | "footer" | "legal";

/**
 * Shared by the client nav and its static fallback. No underlines: hover is
 * a soft pill, and the current page is marked by aria-current plus a tint
 * pill with an inset emerald ring and heavier weight, not colour alone.
 * Header and menu are light (emerald-deep on the tint pill, 6.25:1 over the
 * header's worst background). Footer and legal sit on deep green.
 */
const lightState = (current: boolean) =>
  current
    ? "bg-tint font-semibold text-emerald-deep ring-1 ring-inset ring-glyph/25"
    : "text-ink hover:bg-tint";

const deepState = (current: boolean) =>
  current ? "bg-white/15 font-semibold ring-1 ring-inset ring-white/45" : "hover:bg-white/8";

export function navLinkClass(layout: NavLayout, current: boolean) {
  switch (layout) {
    case "inline":
      return `flex min-h-11 items-center whitespace-nowrap rounded-full px-3.5 text-[0.95rem] font-medium ${lightState(current)}`;
    case "stacked":
      return `flex min-h-14 items-center rounded-2xl px-4 font-serif text-xl font-medium ${lightState(current)}`;
    case "footer":
      return `-mx-3 inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-3 text-on-green ${deepState(current)}`;
    case "legal":
      return `-mx-3 inline-flex min-h-10 items-center rounded-full px-3 text-on-green sm:mx-0 ${deepState(current)}`;
  }
}

export const navListClass: Record<NavLayout, string> = {
  inline: "flex items-center gap-0.5",
  stacked: "flex flex-col gap-1",
  footer: "mt-4 flex flex-col items-start gap-1",
  legal: "flex",
};
