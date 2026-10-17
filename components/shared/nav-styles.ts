export type NavLayout = "inline" | "stacked" | "footer";

/**
 * Shared by the client nav and its static fallback. No underlines: hover is
 * a soft pill, and the current page is marked by aria-current plus a
 * stronger pill with an inset ring and heavier weight, not colour alone.
 * White text holds 4.71:1 on the 15% pill over emerald, the header's
 * lightest stop.
 */
export function navLinkClass(layout: NavLayout, current: boolean) {
  const state = current
    ? "bg-white/15 font-semibold ring-1 ring-inset ring-white/45"
    : "hover:bg-white/8";
  switch (layout) {
    case "inline":
      return `flex min-h-11 items-center whitespace-nowrap rounded-full px-3.5 font-medium text-on-green ${state}`;
    case "stacked":
      return `flex min-h-14 items-center rounded-2xl px-4 font-serif text-2xl font-semibold text-on-green ${state}`;
    case "footer":
      return `-mx-3 inline-flex min-h-10 items-center rounded-full px-3 text-on-green ${state}`;
  }
}

export const navListClass: Record<NavLayout, string> = {
  inline: "flex items-center gap-1",
  stacked: "flex flex-col gap-1",
  footer: "mt-4 flex flex-col items-start gap-1",
};
