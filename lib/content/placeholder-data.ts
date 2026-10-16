// TODO: replace with MDX content pipeline.
// Sample entries only, so dynamic routes have something to prerender.
// Nothing here is a real event, class, teaching or plan.

export type PlaceholderEntry = {
  slug: string;
  title: string;
  description: string;
};

const sample = (slug: string, title: string): PlaceholderEntry => ({
  slug,
  title,
  description: `Placeholder text for ${title.toLowerCase()}. Final content to come.`,
});

// TODO: replace with MDX content pipeline.
export const placeholderEvents: PlaceholderEntry[] = [
  sample("sample-event-one", "Sample event one"),
  sample("sample-event-two", "Sample event two"),
];

// TODO: replace with MDX content pipeline.
export const placeholderClasses: PlaceholderEntry[] = [
  sample("sample-class-one", "Sample class one"),
  sample("sample-class-two", "Sample class two"),
];

// TODO: replace with MDX content pipeline.
export const placeholderTeachings: PlaceholderEntry[] = [
  sample("sample-teaching-one", "Sample teaching one"),
  sample("sample-teaching-two", "Sample teaching two"),
];

// TODO: replace with MDX content pipeline.
// Book slugs are temporary. Canonical identifiers must come from /lib/scripture
// once it exists, because they become part of deep links.
export const placeholderBooks: PlaceholderEntry[] = [
  sample("matthew", "Matthew"),
  sample("mark", "Mark"),
];

// TODO: replace with MDX content pipeline.
export const placeholderPlans: PlaceholderEntry[] = [
  sample("sample-plan-one", "Sample plan one"),
  sample("sample-plan-two", "Sample plan two"),
];

export function findBySlug(
  entries: PlaceholderEntry[],
  slug: string,
): PlaceholderEntry | undefined {
  return entries.find((entry) => entry.slug === slug);
}
