# House of Bread Global
## Website Specification, version 3.0

Date: 16 October 2026
Supersedes: version 2.0 (15 October 2026) and version 1.0 (07 October 2026)

---

## What changed from version 2.0

Version 2.0 assumed the website would also feed and sync with the mobile app.
That is out of scope. The app already exists and is owned and released
separately. This version specifies the website only.

- Removed: the content publish pipeline to Supabase, the shared account and
  progress layer, the content API
- Deferred: payments, user accounts, the course platform
- Added: live sessions on YouTube, classes and training pages, a newsletter
  flow, and an app integration seam
- Kept: MDX in the repo as the content source, the canonical scripture
  reference module, the translation licensing blocker, the writing rules

---

## 1. Purpose

House of Bread Global is a teaching ministry committed to doctrinal clarity
and careful handling of Scripture, serving readers across the United Kingdom,
Africa and the United States. The name comes from Bethlehem, the house of
bread, and from John 6:35.

The website is where the ministry is found, understood and joined.

### Division of labour

- Website: discovery, ministry information, schedule, classes, newsletter,
  app promotion
- App (existing, separate): daily reading, plan progress, offline study,
  translation comparison
- YouTube: live sessions and video
- Social pages: community, linked from the site, not embedded

### Success criteria, first six months

- Organic search brings readers to teaching pages
- The newsletter list grows every week
- A visitor can see the next live session within one scroll of the home page
- Store link clicks from plan and book pages are measured as a Plausible goal
- Public pages score 95 or above on Lighthouse on a mid range Android profile

---

## 2. Scope

### In at launch

- Content website: home, about, live sessions and events, House of Bread
  Academy (the classes and training), the Library (`/media`),
  teachings, New Testament books, reading plan landing pages, app page,
  contact, privacy
- Newsletter signup with double opt-in and a notify me option for live
  sessions
- Sitemap, robots.txt, `llms.txt`, Open Graph images, Plausible

### Deferred

- Donations (Stripe, Paystack, Gift Aid)
- User accounts, dashboards, notes, bookmarks
- Course lesson player and student progress
- App progress display (see section 9)

### Non goals

- No content management system. The repository is the source.
- No live streaming from the site. YouTube does this.
- No hosted long form video. Short silent decorative loops are allowed: 800 KB
  each or less, with a poster, lazy loaded, paused offscreen, never with
  sound, and off under reduced motion and Save-Data.
- No community forum or live chat.
- No embedded social feeds. Link to the pages instead.
- No custom payment processing, ever. Hosted checkout only when giving returns.

---

## 3. Information architecture

### Online only at launch

Updated 18 October 2026. The ministry is online only at launch. It has no
local centres, campuses, branches or venues, so the site has no location
pages, addresses, maps or "find a location" feature, and no copy implies
one. Visitors join online: they watch live on YouTube, join classes online
and read the teaching here. The United Kingdom, Nigeria and United States
appear only as the regions the ministry serves and as the time zones the
region band shows session times in, for people joining from there. The
changes made for this are listed in `docs/CONTENT-PACK.md`, "Online only
changes".

### Stage one pages

```
/                         Home, next live session, newsletter, app call to action
/about                    Ministry, teacher, doctrinal position
/academy                  House of Bread Academy, front door of the future
                          course platform (was /classes)
/academy/[slug]           Single course: what, who, when, how to join
/media                    Library: live and replays, video, audio,
                          social pages, read and study
/events                   Live sessions, trainings, meetings, schedule
/events/[slug]            Single session with YouTube link, calendar file, notify me
/teachings                Archive index, filterable
/teachings/[slug]         Individual teaching
/new-testament            Book index
/new-testament/[book]     Book explanation
/plans                    Reading plan index
/plans/[slug]             Plan landing with first days and app call to action
/app                      App page and store links
/subscribe                Newsletter signup
/subscribe/check-email    Confirmation prompt
/contact
/privacy
```

`/classes` and `/classes/[slug]` redirect permanently (308) to `/academy` and
`/academy/[slug]`.

### Navigation

Updated 21 October 2026.

- Header, left to right: Home, Academy, Library, About, Contact. Library is
  the label for `/media`, and is also the current item on `/events`.
- One button on the right of the header: "Explore Teachings" (primary,
  emerald), to `/academy`. Subscribe and the app are not in the header.
- Mobile: the same button, the theme switch and a Menu button. The menu
  lists the same five links in the same order, then the theme choice.
- Subscribe and the app stay reachable from the Home hero ("Get the
  official app"), the footer (a Subscribe link and "Get the official app")
  and the newsletter card that closes each page.
- Footer Ministry column follows the header order: Academy, Library, Live
  sessions, About, Contact, Subscribe.

### Library (/media)

One page for everything the ministry shares, in five anchored sections:

- Live and replays (`#live`): the next session from event data, or an empty
  state, with "Watch live on YouTube", "Set a reminder" and a link to the
  full schedule on `/events`.
- Video (`#video`): the latest six videos from the channel's public feed
  (`https://www.youtube.com/feeds/videos.xml?channel_id=...`). Fetched on the
  server at build time and revalidated hourly (`"use cache"` with
  `cacheLife("hours")`), using `YOUTUBE_CHANNEL_ID`. Parsed by a small,
  tested, dependency free function in `/lib/media`. Links and thumbnails are
  rebuilt from the validated video id; thumbnails load from `i.ytimg.com`.
  If the variable is missing or the request fails (the endpoint returns 404
  intermittently), the page shows "Videos will appear here soon" and a
  Subscribe on YouTube button. A player sits above the cards behind the
  click to load `youtube-nocookie.com` facade. The featured video
  (`siteConfig.links.featuredVideoId`) leads it when set, ahead of the feed;
  otherwise the newest feed video does. Every card also links to YouTube.
- Audio (`#audio`): a card and a "Listen on {platform}" button per platform,
  from `siteConfig.links.audio`.
- Social (`#social`): a card and a Follow button per platform. Links, not
  embedded feeds (section 2, non goals).
- Read and study (`#written`): Teachings, Study the New Testament and New
  Testament journeys.

The page closes with the newsletter card.

### Stage two pages

```
/series, /series/[slug]   Series pages
/answers/[slug]           Apologetics answers with FAQPage schema
/scripture/[book]/[ch]    Scripture Index
/watch/[slug]             Video embed with transcript
/doctrine/[slug]          Doctrine hubs
```

---

## 4. Content architecture

MDX files in `/content` are the single source of truth. The website renders
them at build time as static pages.

### Content types

| Type | Folder | Notes |
|---|---|---|
| Teaching | `/content/teachings` | Articles, doctrine deep dives |
| Book | `/content/books` | 27 New Testament introductions |
| Plan | `/content/plans` | Landing copy and first days of each plan |
| Answer | `/content/answers` | Stage two |
| Event | `/content/events` | Live sessions, trainings, meetings |
| Class | `/content/classes` | Class and training descriptions |
| Transcript | `/content/transcripts` | Stage two |

### Frontmatter

Every type validates against a Zod schema. Shared fields: `title`, `slug`,
`description`, `date`, `updated`, `passages` (canonical references),
`series` (optional).

Event fields add: `startsAtUtc`, `timeZone`, `durationMinutes`, `youtubeUrl`,
`kind` (live, training, meeting), `status` (scheduled, live, replay).

### Provenance of existing content

The app already contains teaching content. Before any of it is copied here:

- Confirm permission with the CEO and the app developer
- Decide which side is the source of truth after the copy
- Record the decision in `docs/`

If the answer is "both", the two copies will drift. The cheapest time to
decide is before the first article moves.

---

## 5. Newsletter

### Flow

1. A signup form appears in the footer, on `/subscribe`, and on every event
   page as "Notify me about live sessions".
2. The form posts to `/api/subscribe`. JavaScript enhances it, and a plain
   form post works without JavaScript and redirects to `/subscribe/check-email`.
3. The handler validates with Zod, checks the honeypot, applies the rate limit,
   then adds the subscriber to Kit with a source tag (`footer`, `subscribe-page`,
   `live-notify`, `plan-page`).
4. Kit sends the double opt-in email.
5. The visitor confirms and lands on a thank you page.

### Rules

- Fields: email, optional first name. No country, no phone.
- Same success message whether or not the address exists.
- If Kit is unreachable, show a plain retry message and log the failure without
  the address.
- Rate limit with a Vercel firewall rule on `/api/subscribe`. Add Cloudflare
  Turnstile only if abuse appears.
- Consent wording and a privacy link sit beside every form.
- The privacy policy covers UK GDPR and Nigeria's NDPA.

The `live-notify` tag lets session announcements go only to people who asked
for them.

---

## 6. Live sessions

Live sessions stream on YouTube. The site tells people when, and gives them one
click to join.

- The home page and `/events` show the next session: title, local time, a
  link to YouTube, "Add to calendar" and "Notify me".
- Times show in the visitor's local time with the ministry's zone beside it. A
  small client script converts the time. Without it, the UTC and ministry zone
  still display.
- The YouTube embed is a click to load facade using `youtube-nocookie.com`. A
  plain link to YouTube is an acceptable fallback if a live embed proves
  unreliable.
- Past sessions show as replays linking to YouTube. Transcripts arrive in stage
  two.
- Stage one uses individual dated event files, plus a hand maintained "weekly
  rhythm" section for recurring sessions. Automated recurrence rules are
  deferred because they add complexity for little gain.

---

## 7. House of Bread Academy (classes and training)

The training classes are named House of Bread Academy, at `/academy`.

Stage one provides information pages only: what the class covers, who it is
for, when it runs, how to join, and any cost. Joining uses a method the CEO
chooses (an external form, a WhatsApp link, or a newsletter tag). Student
accounts, lesson players and progress tracking are deferred and are a stage
three decision.

Since 21 October 2026, `/academy` is the front door of a future course
platform: courses in preparation, what the Academy will offer, and a
waitlist (Kit tag `source-academy-waitlist`). Pages read courses only
through `/lib/academy`: a framework free `CourseCatalog` interface (list
courses, get a course) with a `StaticCourseCatalog` over the MDX class
files. A later LMS plugs in behind that interface, and no page changes. No
accounts, sign in or progress exist on the website until stage three.

---

## 8. Scripture reference handling

One canonical module, `/lib/scripture`, owns:

- Book identifiers, canonical and abbreviated forms
- Chapter and verse range notation, including cross chapter spans
- A parser that accepts common human spellings and emits the canonical form
- The deep link builder

Website deep link format:

```
hobglobal.online/scripture/john/6#35
```

The app's own URL scheme is an open item and must not be assumed. The module
stays free of framework imports and carries a golden test file so it can be
shared with the app later without a rewrite.

### Translation licensing

A release blocker, not a detail.

- Public domain, free to publish in full: KJV, ASV, Young's Literal, Darby,
  World English Bible
- Licensed (NIV, ESV, NLT, NASB, CSB, NKJV and others): limited quotation
  within teaching only, never full text
- The app's permissions do not carry over to an indexed public website

Before launch, confirm which six translations the app carries and the
permission for each.

---

## 9. Future: linking to the app

Not built at launch. The goal is that a visitor can later see their reading
plan progress on the website, read from the app's data.

### What the website will need from the app

A read only progress source returning, per plan: plan slug, current day, total
days, streak, and last active time.

### The seam

```ts
// /lib/app-integration
export interface PlanProgress {
  planSlug: string;
  currentDay: number;
  totalDays: number;
  streak: number;
  lastActiveAt: string; // ISO 8601
}

export interface ProgressProvider {
  getProgress(session: AppSession): Promise<PlanProgress[]>;
}
```

At launch only a no-op provider exists. Pages never talk to the app directly,
so adding a real provider later changes one module, not the site.

### Three ways to connect, to decide once the app's backend is known

- The app exposes a REST API protected by OAuth or OIDC, and the website is a
  client of it. Cleanest if the app has no existing auth provider.
- The app already uses a hosted auth provider with row level security (for
  example Supabase or Firebase). The website signs in against the same
  provider and reads the progress tables. Cheapest if that is already true.
- A signed handoff link from the app opens the website with a short lived
  token. Limited, but needs the least work on either side.

Prefer the first or second option, depending on what the app already runs on.
Decide after the app developer answers the open items below.

### Privacy

A person's Bible reading record can reveal religious belief, which UK GDPR
treats as special category data. Showing it on the website needs explicit
consent, a privacy policy update, and read only scope.

---

## 10. Accessibility and performance

- Semantic HTML, keyboard operable, WCAG 2.2 AA contrast
- Lighthouse 95 or above on performance and accessibility
- Mid range Android on mobile data is the design target
- Images optimised, fonts subset, no third party embed before it is asked for
- Cookieless analytics, so no consent banner is needed. Keep it that way.

---

## 11. Build phases

### Stage one, weeks one to three. Launch.

- Repository, Next.js scaffold, Tailwind and shadcn, `CLAUDE.md` in place
- Deploy to Vercel on day one
- Design system, typography scale, dark mode
- MDX pipeline with Zod frontmatter validation
- Canonical scripture module with golden tests
- Newsletter flow, end to end
- Home, about, events, Academy, Library, app page, contact, privacy
- Teaching archive, New Testament book pages, plan landing pages
- Sitemap, robots.txt, `llms.txt`, Open Graph images, Plausible
- Security headers, `.ics` generation, click to load YouTube facade

### Stage two, weeks four to eight. Depth.

- Scripture Index
- Transcript pages and video pages
- Answers with FAQPage schema
- Series and doctrine hubs
- Static search
- Content migration, subject to the provenance decision in section 4

### Stage three, ongoing. Decisions.

- App progress integration (section 9)
- Giving, with the Gift Aid decision made first
- Classes with accounts and lesson progress, if demand justifies
- House of Bread Academy course platform. Decision recorded 21 October
  2026: the ministry prefers a custom built LMS. It is deferred, and no LMS
  code is written until an Academy spec is approved. It plugs in behind
  `/lib/academy` (section 7). It will need:
  - An Academy spec first: courses, lessons, roles, who uploads, how people
    join, free or paid, and what `biblecourse.hobglobal.online` is
    (PLACEHOLDERS, "House of Bread Academy, open questions")
  - An auth provider using a standard (OAuth or OIDC), ideally shared with
    the app's sign in. No custom auth scheme
  - A database for learners, enrolments and progress
  - Video delivery for lessons (YouTube unlisted, or a hosted player), with
    transcripts, under the no hosted long form video rule unless revised
  - Admin upload: a way for the ministry to add courses and lessons without
    a developer
  - Progress tracking, read and written on the server
  - Privacy: course enrolment can reveal religious belief, which is special
    category data under UK GDPR (Article 9), with NDPA obligations for
    Nigerian learners. A lawful basis and condition, a data protection
    impact assessment, minimal collection, retention periods and an
    updated privacy policy come before launch
  - Payments, only if courses are paid: a provider for UK and Nigerian
    cards (for example Stripe and Paystack), with refunds and tax handled

Weeks are estimates. The code will finish before the content does.

---

## 12. Risks

- **Content drift between app and website.** Two copies of the same teaching
  diverge. Decide the source of truth before migrating.
- **Translation licensing.** Full text of a licensed translation on an indexed
  site is a real legal exposure.
- **Launching empty.** Content supply is the long pole. Budget for it.
- **Dependency on another developer.** The app integration needs the app
  developer's time and an API that does not exist yet.
- **Newsletter abuse and data law.** Bot signups, plus UK GDPR and NDPA
  obligations.
- **Solo maintenance.** Keep the dependency surface small.
- **Connectivity.** Many visitors are on slow mobile data.

---

## 13. Open items

Answers needed, in order of how much they block:

- Which six translations does the app carry, and under what permission?
- May the app's existing teaching be copied to the website, and which side owns
  it afterwards?
- What does the app run on today (own API, Supabase, Firebase, other), and who
  can change it?
- What is the app's deep link scheme, and the store links?
- How do people join a class or training: form, WhatsApp, other?
- House of Bread Academy: free or paid, who uploads courses, how people
  join, and what `biblecourse.hobglobal.online` is
- Is giving needed at launch? If yes, is House of Bread Global a registered UK
  charity, since that decides Gift Aid?
- Which time zone are live sessions announced in, and what is the weekly
  schedule?
- Brand assets: logo, colours, typefaces, photography.

---

## 14. Opening instruction for Claude Code

> Read `CLAUDE.md` and `docs/SPEC-v3.md` in full. Then propose a plan for
> stage one, week one only: repository scaffold, design system, MDX content
> pipeline with frontmatter validation, the newsletter flow, and a deployed
> holding page with email capture and a privacy policy. Do not write code
> until the plan is approved.
