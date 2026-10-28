/*
  Home's teaching block lays out only the videos it has, so no column is
  left empty when the feed fails or is short. `more` is the number of small
  videos after the lead (0 to 3):

  - 0: the lead alone, full width (the featured video when the feed fails)
  - 1: two equal videos side by side from sm
  - 2: the lead in eight columns from lg, two cards stacked beside it
  - 3: the lead in eight columns from lg, three rows beside it (the skeleton)

  Below sm every small video is a 72px row: thumbnail beside two title lines
  and the date. From sm it is a card, thumbnail above the title, and with
  three it turns back into a row from lg, so the three fit beside the lead.
*/

export type TeachingsLayout = {
  grid: string;
  lead: string;
  list: string;
  item: string;
  thumb: string;
};

const itemBase = "grid h-18 grid-cols-[8rem_1fr] gap-4 sm:h-auto sm:grid-cols-1 sm:gap-3";
const thumbBase = "relative aspect-video w-32 overflow-hidden rounded-xl bg-tint sm:w-full";

export function teachingsLayout(more: number): TeachingsLayout {
  const card = { item: itemBase, thumb: thumbBase };
  switch (Math.max(0, Math.min(3, Math.floor(more)))) {
    case 0:
      return { grid: "grid", lead: "", list: "", ...card };
    case 1:
      return { grid: "grid gap-10 sm:grid-cols-2 sm:gap-8 lg:gap-12", lead: "", list: "grid content-start", ...card };
    case 2:
      return {
        grid: "grid gap-10 lg:grid-cols-12 lg:gap-12",
        lead: "lg:col-span-8",
        list: "grid content-start gap-5 sm:grid-cols-2 sm:gap-8 lg:col-span-4 lg:grid-cols-1 lg:gap-6",
        ...card,
      };
    default:
      return {
        grid: "grid gap-10 lg:grid-cols-12 lg:gap-12",
        lead: "lg:col-span-8",
        list: "grid content-start gap-5 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1 lg:gap-6",
        item: `${itemBase} lg:grid-cols-[9rem_1fr] lg:gap-4`,
        thumb: `${thumbBase} lg:w-36`,
      };
  }
}

/** next/image sizes for a small video's thumbnail, by the same count. */
export function thumbSizes(more: number): string {
  if (more >= 3) return "(min-width: 1024px) 9rem, (min-width: 640px) 30vw, 8rem";
  if (more === 2) return "(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 8rem";
  return "(min-width: 640px) 45vw, 8rem";
}
