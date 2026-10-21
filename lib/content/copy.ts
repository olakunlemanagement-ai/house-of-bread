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

/** Who House of Bread Academy is for. */
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

/**
 * The three countries the region chips and the About page name, each with
 * its flag. Nigeria stands for the ministry's work in Africa; prose that
 * says "Africa" stays as written.
 */
export const regions = [
  { name: "United Kingdom", flag: "gb" },
  { name: "Nigeria", flag: "ng" },
  { name: "United States", flag: "us" },
] as const;

/**
 * Where live sessions are watched, with the IANA zone each region's time is
 * shown in. The US zone is Eastern until the ministry confirms otherwise
 * (docs/PLACEHOLDERS.md).
 */
export const sessionRegions = [
  { name: "United Kingdom", flag: "gb", timeZone: "Europe/London", zoneLabel: "UK time" },
  { name: "Nigeria", flag: "ng", timeZone: "Africa/Lagos", zoneLabel: "Lagos time" },
  { name: "United States", flag: "us", timeZone: "America/New_York", zoneLabel: "Eastern time" },
] as const;

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

export const newsletterCopy = {
  heading: "Stay close to the ministry",
  text: "Reminders before each live session, new teaching, and news from House of Bread Global, sent to your inbox.",
} as const;

/**
 * House of Bread Academy (/academy). The Academy is not open yet: the steps
 * and answers describe what it will offer, and are ministry copy to confirm
 * (docs/PLACEHOLDERS.md). Never claim certificates, live Q and A, lesson
 * counts, durations or prices here until the ministry supplies them.
 */
export const academyCopy = {
  tagline: "Equipped in the truth",
  lead: "House of Bread Academy will give believers a structured place to study the Bible, one course at a time and at their own pace.",
  waitlistLabel: "Notify me when the Academy opens",
  waitlistHref: "/subscribe?source=academy-waitlist#signup",
  courses: {
    title: "Courses in preparation",
    intro: "The first courses are being prepared now, and each one opens here when it is ready.",
    cta: "See the course",
  },
  steps: {
    title: "How the Academy will work",
    intro: "This is what the Academy is being built to offer.",
    items: [
      { title: "Create an account.", text: "One account opens every course." },
      { title: "Choose a course.", text: "Start with the one that meets you where you are." },
      {
        title: "Learn at your own pace.",
        text: "Work through each lesson when it suits you, and see your progress as you go.",
      },
    ],
  },
  why: {
    title: "Why learn here",
    intro: "Teaching that keeps every passage in its context and explains it in plain English.",
    items: [
      {
        title: "Who it is for",
        text: "Believers who want to go further than reading alone, from new believers to those who already teach others.",
      },
      { title: "Who teaches", text: undefined },
      {
        title: "How it teaches",
        text: "From the King James Version, in plain contemporary English, with Scripture always read in its context.",
      },
    ],
  },
  questions: {
    title: "Questions",
    intro: "What people ask most about the Academy before it opens.",
    items: [
      { question: "Will the Academy be free or paid?", answer: undefined, confirm: "free, paid, or some of each" },
      {
        question: "What will I need to take part?",
        answer: "A phone, tablet or computer with an internet connection.",
        confirm: "device and connection",
      },
      { question: "How long will I have access to a course?", answer: undefined, confirm: "how long access lasts" },
      {
        question: "Will I need to attend anything live?",
        answer: "Courses are planned to be self paced, so nothing needs to be attended live.",
        confirm: "no live attendance",
      },
    ],
    ask: "Ask a question anonymously",
  },
  closingHeading: "Hear when the Academy opens",
  closingText:
    "Be among the first to know when the first courses open, with reminders before live sessions and new teaching from House of Bread Global.",
} as const;
