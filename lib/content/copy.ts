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

/**
 * The regions shown under the weekly live session, each with the IANA zone
 * its local time is worked out in. The first is the ministry's own zone. The
 * US is shown in Eastern time, and the list itself, until the ministry
 * confirms them (docs/PLACEHOLDERS.md).
 */
export const sessionTimeRegions = [
  { name: "Nigeria", flag: "ng", timeZone: "Africa/Lagos" },
  { name: "Ghana", flag: "gh", timeZone: "Africa/Accra" },
  { name: "United Kingdom", flag: "gb", timeZone: "Europe/London" },
  { name: "South Africa", flag: "za", timeZone: "Africa/Johannesburg" },
  { name: "Kenya", flag: "ke", timeZone: "Africa/Nairobi" },
  { name: "United States (Eastern)", flag: "us", timeZone: "America/New_York" },
] as const;

/**
 * The Academy's open or closed status and its waitlist, kept as they were
 * until the ministry decides whether courses are live at launch
 * (docs/PLACEHOLDERS.md, launch blocker). Never claim certificates, live Q
 * and A, lesson counts, durations or prices here until the ministry
 * supplies them.
 */
export const academyCopy = {
  waitlistLabel: "Notify me when the Academy opens",
  waitlistHref: "/subscribe/academy",
  closingHeading: "Hear when the Academy opens",
  closingText:
    "Be among the first to know when the first courses open, with reminders before live sessions and new teaching from House of Bread Global.",
} as const;
