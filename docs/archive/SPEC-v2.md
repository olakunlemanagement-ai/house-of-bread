> **SUPERSEDED.** This document is superseded by `docs/SPEC-v3.md` and must not be followed. Kept for reference only.

# House of Bread Global
## Platform Specification, version 2.0

Date: 15 October 2026
Owner: Olakunle (Isaac Olanrewaju)
Supersedes: version 1.0, 07 October 2026

---

## What changed from version 1.0

Version 1.0 treated the website as the origin of all content and listed a
native mobile app as a non goal. Both are now wrong. The House of Bread app is
a shipped React Native product carrying 30, 60 and 90 day New Testament plans,
explanations of the New Testament books, articles, and the Bible in six
translations.

The four corrections:

- The mobile app is removed from non goals and treated as a first class client
- Content architecture changes from website-as-origin to one source, two clients
- Supabase becomes the shared account and progress layer for web and app
- Translation licensing is added as a release blocker for the public web

---

## 1. Purpose

House of Bread Global teaches the Scriptures with doctrinal precision to an
audience that thinks. Two clients serve one body of content.

The app is where study happens. The website is where it is found.

App content cannot be indexed by search engines, so an app alone has no
discovery channel other than the store. A website alone has no daily habit
loop. Together they cover both.

### Division of labour

- Website: discovery, search ranking, AI citation, courses, donations, email
- App: daily reading, plan progress, offline study, translation comparison

### Success criteria, first twelve months

- Organic search delivers the majority of new app installs
- The archive is published once and consumed by both clients
- A correction to any article propagates without an app release
- A mailing list exists and grows weekly
- The Foundations course runs with students completing lessons
- Donations arrive reliably from the UK, Africa and the US

---

## 2. Content architecture

This is the central decision of version 2.0.

### The rule

MDX files in the website repository are the single source of truth. A build
step compiles them into JSON and publishes that JSON to Supabase. The website
renders the MDX directly at build time. The app fetches the JSON, caches it
locally, and works offline.

```
/content/*.mdx  (repo, authored in Claude Code)
       |
       |  build step: parse, validate, compile
       v
  content JSON  ->  Supabase  ->  app fetches, caches, works offline
       |
       v
  website: static pages, Scripture Index, search
```

### Why this shape

- Authoring stays in MDX in the repo, which is where Claude Code is effective
- Git history gives version control and rollback with no CMS to build
- A content fix is a publish, not an app store release and review cycle
- Neither client holds its own copy, so the two cannot drift
- Offline reading still works, because the app caches rather than streams

### What this replaces

Content must not be bundled into the app binary. Bundled content means every
typo correction waits on store review, and the website then holds a second
copy that must be edited separately. Within months the two versions disagree
and no one knows which is correct.

**This decision is urgent.** Content currently being written into the app
directly should be moved to the repository before the volume makes migration
painful.

### Content distribution

| Content type | Website | App |
|---|---|---|
| Doctrine articles, word studies | yes | yes |
| New Testament book explanations | yes | yes |
| Reading plan day content | yes | yes |
| Apologetics answers | yes | yes |
| Video transcripts | yes | no |
| Scripture Index pages | yes | no |
| Course lessons | yes | later |
| Events and service info | yes | no |

Transcripts and index pages are web only. They are built for search engines
and would add weight to the app without adding value.

### The content API

A single versioned endpoint, served from Supabase.

```
GET /content/manifest.json     version, counts, last published timestamp
GET /content/articles.json     article list with metadata
GET /content/articles/{slug}   full article body
GET /content/plans/{slug}      plan structure with day content
GET /content/books/{slug}      New Testament book explanation
```

The app compares the manifest version against its cached copy on launch and
fetches only what changed. A failed fetch falls back to cache, so the app
remains usable with no connection.

---

## 3. Shared account layer

One Supabase project serves both clients. One account, one progress record.

A reader finishing day fourteen of the 60 day plan on the phone sees day
fifteen waiting on the laptop that evening. This is the single most valuable
thing the two products gain from each other, and it costs very little if
designed in now.

### Schema

```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  country text,
  timezone text,
  created_at timestamptz default now()
);

create table plan_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  plan_slug text not null,
  day integer not null,
  completed_at timestamptz default now(),
  client text,                        -- 'web' | 'app', for analytics
  unique (user_id, plan_slug, day)
);

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  course_slug text not null,
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique (user_id, course_slug)
);

create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  course_slug text not null,
  lesson_slug text not null,
  status text not null default 'in_progress',
  last_position integer default 0,
  updated_at timestamptz default now(),
  unique (user_id, course_slug, lesson_slug)
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  context_type text not null,
  context_slug text not null,
  scripture_ref text,
  body text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  scripture_ref text not null,
  translation text,
  created_at timestamptz default now()
);

create table resource_downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  resource_slug text not null,
  downloaded_at timestamptz default now()
);

create table donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  provider text not null,
  provider_ref text not null unique,
  amount_minor integer not null,
  currency text not null,
  recurring boolean default false,
  gift_aid boolean default false,
  donor_email text,
  status text not null,
  created_at timestamptz default now()
);
```

Every table gets row level security in the same migration that creates it,
with owner scoped policies and a test that attempts cross user access and
asserts failure. `donations` accepts writes from the service role only.

### Anonymous progress

The app must work without an account. Progress is held locally for anonymous
users and merged into the account on first sign in, keyed by plan and day with
the earlier completion winning. Forcing registration before a reader can begin
a plan loses more users than the sync feature gains.

---

## 4. Scripture reference handling

Both clients resolve scripture references, and they must agree.

The website parses references from MDX frontmatter to build the Scripture
Index. The app resolves references against its translation data. If the two
use different book naming or verse range conventions, deep links between app
and website break silently.

One canonical mapping, published as a shared module:

- Book identifiers, canonical and abbreviated forms
- Chapter and verse range notation, including cross chapter spans
- A parser that accepts common human spellings and emits the canonical form

Deep link format, resolved by both clients:

```
hobglobal.online/scripture/john/6#35
houseofbread://scripture/john/6/35
```

---

## 5. Translation licensing

A release blocker, not a detail.

Public domain, free to publish in full on the open web: King James Version,
American Standard Version, Young's Literal Translation, Darby, World English
Bible.

Under active licence and enforced: NIV, ESV, NLT, NASB, CSB, NKJV and others.
These licences generally permit limited quotation, not full text publication,
and app terms are not website terms.

An app distributes quietly to a few thousand installs. A website puts full
text in front of search engines and rights holders' monitoring. The exposure
is not comparable.

Required before any text is served from the public web:

- Confirm which six translations the app carries
- Confirm the permission under which each is distributed
- Serve only public domain texts in full from the website
- Limit licensed texts to quotation within teaching content

The Play Store listing also states what the app contains, which makes it a
public claim worth getting right.

---

## 6. Information architecture

### Public website

```
/                         Home
/about                    Ministry, teacher, doctrinal position
/teachings                Archive index, filterable
/teachings/[slug]         Individual teaching
/series                   Series index
/series/[slug]            Series landing
/new-testament            Book index
/new-testament/[book]     Book explanation, shared with app
/scripture/[book]/[ch]    Scripture Index, web only
/doctrine/[slug]          Doctrine hub
/answers/[slug]           Apologetics answer, FAQPage schema
/watch/[slug]             Video with transcript, web only
/plans                    Reading plan index
/plans/[slug]             Plan landing with app call to action
/courses/[slug]           Course landing
/events                   Services and meetings
/give                     Donations
/app                      App landing and store links
/privacy                  Privacy policy, required by Play Console
/subscribe
/contact
```

### Authenticated website

```
/dashboard                Progress across both clients
/learn/[course]/[lesson]  Lesson player
/dashboard/plans          Plan progress and streaks
/dashboard/notes          Notes and bookmarks
/dashboard/library        Gated downloads
/account
```

---

## 7. Differentiating features

### The Scripture Index

Every passage ever taught gets a permanent page listing every teaching, lesson,
video and answer that touches it. Generated from frontmatter at build time.
The highest leverage feature on the platform and the hardest to copy, because
it requires the content to have been structured from the start.

### Transcript pages

Every video gets a readable transcript page with the video embedded and
scripture references linked into the Index. Triples the indexable surface of
work already filmed, and serves readers who will not or cannot watch.

### Answer Engine Optimisation

Apologetics content structured as FAQPage schema, with a maintained
`llms.txt`. The goal is for this material to be the source cited when someone
asks an AI whether eternal security is biblical.

### App and web cross promotion

Each plan page on the website shows the full plan structure and the first few
days of content, then offers the app for tracking and offline reading. The
content earns the ranking, the app earns the install.

---

## 8. Payments

- Stripe Checkout for UK and US donations, recurring supported
- Paystack for Nigerian and wider African donations, routed by location with
  manual override always visible
- Both route through the existing Paystack webhook router rather than a new
  handler written for this site
- Webhooks verify signatures before processing
- Receipts via Resend

### Gift Aid

If House of Bread Global is a registered UK charity, Gift Aid adds twenty five
percent to eligible UK donations. Neither Stripe nor Paystack handles the
declaration natively. Either capture declarations in the giving form and store
them against the donation for HMRC, or route UK giving through Donorbox.

Decide before the giving page is built. Declarations cannot be collected
retrospectively.

---

## 9. Build phases

### Stage one, weeks one to four. Public platform.

- Repository, Next.js scaffold, Tailwind and shadcn, `CLAUDE.md` in place
- Deploy to Vercel on day one
- Design system, typography scale, dark mode
- MDX pipeline with frontmatter validation
- **Content build step and JSON publish to Supabase**
- **Privacy policy page, required for Play Console submission**
- Home, about, contact, events
- Teaching archive, series pages, New Testament book pages
- Scripture Index and canonical reference module
- Answers section with FAQPage schema
- Plan landing pages with app call to action
- Static search
- Email signup wired to Kit
- Giving page, Stripe and Paystack live
- Sitemap, robots.txt, llms.txt, Open Graph images, Plausible
- Migrate the Introduction to the New Testament series out of the app and into
  the repository as the first content set

### Stage two, weeks five to nine. Shared platform.

- Supabase schema, migrations, RLS policies and policy tests
- Magic link and Google authentication
- **App wired to the same Supabase project and content API**
- **Anonymous to account progress merge**
- Course catalogue, lesson player, progress tracking
- Reading plans with streaks, synced across clients
- Gated downloads via signed URLs
- Notes, bookmarks, student dashboard
- Launch the eighteen lesson Foundations course

### Stage three, ongoing.

- Remaining archive migration
- Course certificates
- Paid courses if demand justifies
- iOS release

---

## 10. Non goals

- No content management system. The repository is the source.
- No custom payment processing. Hosted checkout only.
- No community forum at launch.
- No live streaming. YouTube does this well already.
- No multi author roles. One publisher.
- No duplicate content stores. One source, two clients, no exceptions.

---

## 11. Risks

- **Content hardcoded into the app.** The live risk. Every day the series is
  written directly into the app increases migration cost. Address first.
- **Translation licensing.** Serving licensed text in full from an indexed
  website is a real exposure. Confirm before launch.
- **Content migration workload.** The code finishes long before the archive
  does. Budget for it or the platform launches empty.
- **RLS misconfiguration.** The main security exposure. Policy tests are not
  optional.
- **African payment reliability.** Monitor decline rates from week one.
- **Solo maintenance.** Keep the dependency surface small.

---

## 12. Open items

Two decisions block parts of this spec.

- Which six translations the app carries, and the permission for each
- Where the app's content currently lives: bundled in the binary, a Supabase
  project, or elsewhere

Both affect stage one. The first gates what the website may publish. The
second determines whether the content migration is a copy or a rewrite.

---

## 13. Opening instruction for Claude Code

> Read `CLAUDE.md` and `docs/SPEC-v2.md` in full. Then propose a plan for
> stage one, week one only: repository scaffold, design system, MDX content
> pipeline with frontmatter validation, the content build step that compiles
> MDX to JSON, and a deployed holding page with email capture and a privacy
> policy. Do not write code until the plan is approved.
