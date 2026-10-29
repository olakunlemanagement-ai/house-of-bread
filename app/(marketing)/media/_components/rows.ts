export type RowColumns = 5 | 6;

/**
 * A row of cards: on phones and tablets one line that scrolls sideways and
 * snaps to each card (no dots, no arrows; the next card peeks in to show
 * there is more), running to the screen's edges so nothing else scrolls
 * sideways; from lg a plain grid of five (teachings) or six (Shorts), as
 * BibleProject's Videos page. Keep the bleed in step with container-page's
 * 1.5rem padding.
 */
export function rowClass(columns: RowColumns): string {
  return `-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-3 lg:mx-0 lg:grid lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0 ${
    columns === 5 ? "lg:grid-cols-5" : "lg:grid-cols-6"
  }`;
}

/** One card's width in a row: wide cards show one and a bit on phones, tall ones two and a bit. */
export function rowItemClass(columns: RowColumns): string {
  return `shrink-0 snap-start lg:w-auto ${columns === 5 ? "w-[78%] sm:w-[44%]" : "w-[42%] sm:w-[27%]"}`;
}
