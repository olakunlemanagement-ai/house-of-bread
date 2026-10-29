/**
 * A row of cards: on phones and tablets one line that scrolls sideways and
 * snaps to each card (no dots, no arrows; the next card peeks in to show
 * there is more), running to the screen's edges so nothing else scrolls
 * sideways; from lg a plain grid. Keep the bleed in step with
 * container-page's 1.5rem padding.
 */
export function rowClass(columns: 4 | 6): string {
  return `-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-3 lg:mx-0 lg:grid lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 ${
    columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-6"
  }`;
}

/** One card's width in a row: wide cards show one and a bit on phones, tall ones two and a bit. */
export function rowItemClass(columns: 4 | 6): string {
  return `shrink-0 snap-start lg:w-auto ${columns === 4 ? "w-[78%] sm:w-[44%]" : "w-[42%] sm:w-[27%]"}`;
}
