// TODO: replace with MDX content pipeline.
// Sample entries only, so pages and dynamic routes have something to render.
// Nothing here is a real event, class, teaching or plan. Every field that
// would need a fact nobody has supplied is null, and the page renders a
// marked placeholder in its place.

export type EventKind = "live" | "training" | "meeting";
export type EventStatus = "scheduled" | "live" | "replay";

export type PlaceholderEvent = {
  slug: string;
  title: string;
  kind: EventKind;
  /** ISO 8601 in UTC. Null until a real date is supplied. */
  startsAtUtc: string | null;
  /** IANA time zone the ministry announces in. Null until supplied. */
  timeZone: string | null;
  durationMinutes: number | null;
  youtubeUrl: string | null;
  status: EventStatus;
  sample: true;
};

export type PlaceholderClass = {
  slug: string;
  title: string;
  sample: true;
};

export type PlaceholderTeaching = {
  slug: string;
  title: string;
  sample: true;
};

export type BookGroup =
  | "The Gospels and Acts"
  | "Paul's letters"
  | "Hebrews and the general letters"
  | "Prophecy";

export type PlaceholderBook = {
  /** Temporary. Canonical identifiers must come from /lib/scripture. */
  slug: string;
  name: string;
  group: BookGroup;
  /** True when the book has a page to link to. */
  hasPage: boolean;
};

export type PlaceholderPlan = {
  /** Temporary slug, to confirm against the app's plan identifiers. */
  slug: string;
  name: string;
  days: 30 | 60 | 90;
  pace: string;
  line: string;
};

// TODO: replace with MDX content pipeline.
export const placeholderEvents: PlaceholderEvent[] = [
  {
    slug: "sample-event-one",
    title: "Sample event one",
    kind: "live",
    startsAtUtc: null,
    timeZone: null,
    durationMinutes: null,
    youtubeUrl: null,
    status: "scheduled",
    sample: true,
  },
  {
    slug: "sample-event-two",
    title: "Sample event two",
    kind: "training",
    startsAtUtc: null,
    timeZone: null,
    durationMinutes: null,
    youtubeUrl: null,
    status: "scheduled",
    sample: true,
  },
];

// TODO: replace with MDX content pipeline.
export const placeholderClasses: PlaceholderClass[] = [
  { slug: "sample-class-one", title: "Sample class one", sample: true },
  { slug: "sample-class-two", title: "Sample class two", sample: true },
];

// TODO: replace with MDX content pipeline.
export const placeholderTeachings: PlaceholderTeaching[] = [
  { slug: "sample-teaching-one", title: "Sample teaching one", sample: true },
  { slug: "sample-teaching-two", title: "Sample teaching two", sample: true },
];

const book = (name: string, group: BookGroup, hasPage = false): PlaceholderBook => ({
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  name,
  group,
  hasPage,
});

// TODO: replace with MDX content pipeline and /lib/scripture identifiers.
// Matthew and Mark carry sample pages so the book layout can be reviewed.
export const placeholderBooks: PlaceholderBook[] = [
  book("Matthew", "The Gospels and Acts", true),
  book("Mark", "The Gospels and Acts", true),
  book("Luke", "The Gospels and Acts"),
  book("John", "The Gospels and Acts"),
  book("Acts", "The Gospels and Acts"),
  book("Romans", "Paul's letters"),
  book("1 Corinthians", "Paul's letters"),
  book("2 Corinthians", "Paul's letters"),
  book("Galatians", "Paul's letters"),
  book("Ephesians", "Paul's letters"),
  book("Philippians", "Paul's letters"),
  book("Colossians", "Paul's letters"),
  book("1 Thessalonians", "Paul's letters"),
  book("2 Thessalonians", "Paul's letters"),
  book("1 Timothy", "Paul's letters"),
  book("2 Timothy", "Paul's letters"),
  book("Titus", "Paul's letters"),
  book("Philemon", "Paul's letters"),
  book("Hebrews", "Hebrews and the general letters"),
  book("James", "Hebrews and the general letters"),
  book("1 Peter", "Hebrews and the general letters"),
  book("2 Peter", "Hebrews and the general letters"),
  book("1 John", "Hebrews and the general letters"),
  book("2 John", "Hebrews and the general letters"),
  book("3 John", "Hebrews and the general letters"),
  book("Jude", "Hebrews and the general letters"),
  book("Revelation", "Prophecy"),
];

export const bookGroups: BookGroup[] = [
  "The Gospels and Acts",
  "Paul's letters",
  "Hebrews and the general letters",
  "Prophecy",
];

// TODO: replace with MDX content pipeline. Pace labels are drawn from the
// approved one line descriptions, to confirm with the ministry.
export const placeholderPlans: PlaceholderPlan[] = [
  {
    slug: "30-day-plan",
    name: "30 day plan",
    days: 30,
    pace: "Focused",
    line: "A focused, fast-moving read.",
  },
  {
    slug: "60-day-plan",
    name: "60 day plan",
    days: 60,
    pace: "Steady",
    line: "A steady, balanced pace.",
  },
  {
    slug: "90-day-plan",
    name: "90 day plan",
    days: 90,
    pace: "Unhurried",
    line: "Unhurried reading with room to think.",
  },
];

export function findBySlug<T extends { slug: string }>(
  entries: T[],
  slug: string,
): T | undefined {
  return entries.find((entry) => entry.slug === slug);
}

export type DatedEvent = PlaceholderEvent & { startsAtUtc: string };

const isDated = (event: PlaceholderEvent): event is DatedEvent =>
  event.startsAtUtc !== null;

/**
 * Scheduled events that have a real start time, soonest first. Status, not
 * the clock, decides what is upcoming, because pages are built statically.
 */
export function upcomingEvents(events: PlaceholderEvent[]): DatedEvent[] {
  return events
    .filter(isDated)
    .filter((event) => event.status !== "replay")
    .sort((a, b) => Date.parse(a.startsAtUtc) - Date.parse(b.startsAtUtc));
}

/** Past sessions with a replay, most recent first. */
export function replayEvents(events: PlaceholderEvent[]): DatedEvent[] {
  return events
    .filter(isDated)
    .filter((event) => event.status === "replay")
    .sort((a, b) => Date.parse(b.startsAtUtc) - Date.parse(a.startsAtUtc));
}
