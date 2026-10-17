// Reading plans stay placeholder until their identifiers are confirmed
// against the app (SPEC-v3 section 13). Everything else now comes from
// /content through lib/content.

export type PlaceholderPlan = {
  /** Temporary slug, to confirm against the app's plan identifiers. */
  slug: string;
  name: string;
  days: 30 | 60 | 90;
  pace: string;
  line: string;
};

// TODO: replace with MDX content pipeline. Pace labels are drawn from the
// approved one line descriptions, to confirm with the ministry. Slugs are
// temporary until confirmed against the app's plan identifiers.
export const placeholderPlans: PlaceholderPlan[] = [
  {
    slug: "30-day-plan",
    name: "30 Day NT Journey",
    days: 30,
    pace: "Focused",
    line: "Focused and fast moving.",
  },
  {
    slug: "60-day-plan",
    name: "60 Day NT Journey",
    days: 60,
    pace: "Steady",
    line: "Steady and balanced.",
  },
  {
    slug: "90-day-plan",
    name: "90 Day NT Journey",
    days: 90,
    pace: "Unhurried",
    line: "Unhurried, with room to think.",
  },
];

export function findBySlug<T extends { slug: string }>(
  entries: T[],
  slug: string,
): T | undefined {
  return entries.find((entry) => entry.slug === slug);
}
