// Approved copy reused on more than one page. Source: docs/CONTENT-PACK.md.

/** The five headings every book introduction uses. */
export const introductionHeadings = [
  "Who wrote it and when",
  "The audience and the situation behind the letter",
  "The central argument and how it unfolds",
  "The themes that run through it",
  "Where it sits in the wider story of Scripture",
] as const;

/** How a New Testament journey works, used on /plans and on each journey page. */
export const journeySteps = [
  { text: "Choose the pace that fits your week." },
  { text: "Open the official app and start day one." },
  { text: "Read each day. Progress is tracked automatically." },
  { text: "Come back any time and continue exactly where the last session ended." },
];

/** Who the classes are for. */
export const classAudience = [
  "New believers who want a structured way into the New Testament",
  "Readers who have started and stalled before",
  "Students and teachers who want to handle Scripture with more care",
  "Anyone who wants to know the Scriptures rather than simply own one",
];

/** Who the app is for. */
export const appAudience = [
  "New believers who want a structured way into the New Testament",
  "Readers who have started Bible plans before and stalled",
  "Students and teachers who want translation comparison without a desk full of books",
  "Anyone who wants to know the Scriptures rather than simply own one",
];

/** The shared line about the ministry's name, used on Home and About. */
export const nameText =
  "The name comes from Bethlehem, the house of bread, and from the One who claimed the title for himself. The aim is not information for its own sake, but Scripture read well, understood clearly, and allowed to feed.";

export const regions = ["United Kingdom", "Africa", "United States"] as const;

export const newsletterCopy = {
  heading: "Stay close to the ministry",
  text: "Reminders before each live session, new teaching, and news from House of Bread Global, sent to your inbox.",
} as const;
