# Placeholders register

Date: 17 October 2026
Branch: `feat/palette-nav-media` (from `feat/ministry-redesign`)

Everything listed here is temporary. Each item must be replaced or confirmed
before launch. Remove a line once its item is done.

Every bracketed placeholder renders through the `Placeholder` component (or
`StoreButtons`, `SocialLinks`, `YouTubeSubscribeButton`, `ImageSlot`) with a
dashed outline or a "Placeholder" badge, and carries a `data-placeholder`
attribute, so the built HTML can be searched for any that remain.

External links live in one place, `siteConfig.links` in `lib/site-config.ts`.
Filling in a value there turns every matching placeholder into a real link.

---

## Launch blockers

- **LAUNCH BLOCKER: Academy status contradicts Home ('Start this course' vs
  'Academy opens soon').** Home's course cards and rows say "Start this
  course", while the Academy keeps its status line ("The first courses are
  being prepared now...") and "Notify me when the Academy opens", and every
  course without a join link shows "Coming soon". Decide: courses live at
  launch, or Home switches to waitlist copy. (Logged 28 October 2026.)
- **Global noindex flag.** `lib/site-config.ts` sets `noindex: true`, so every
  page sends `noindex, nofollow`. Flip it to `false` at launch, once
  placeholder copy is replaced.
- **`npm run content:validate` does not exist yet.** It arrives with the MDX
  pipeline. Until then no task can meet that line of the definition of done.
- **Privacy policy.** `/privacy` is a draft structure, not legal advice, and
  shows a "Draft, under review" badge. A qualified person must review it.
- **Interim slot images.** Any slot image with status `interim` is an AI
  generated placeholder (logged 20 October 2026). Replace each with a real
  photo before launch. See "Image slots" below.
- **Newsletter needs Kit set up.** The signup code is built. Until the steps
  in "Newsletter setup" below are done, every newsletter form shows a disabled
  button and "Signup opens soon".
- **Anonymous questions need Resend set up.** The code is built. Until the
  steps in "Anonymous questions setup" below are done, `/ask` shows a
  disabled button and "Questions open soon".
- **Contact form is not wired up.** It renders real fields with the submit
  button disabled and a "Messaging opens soon" note until the contact slice.
- **Security headers are not set.** CLAUDE.md requires a
  Content-Security-Policy and the other headers in `next.config`. None exist
  yet. When added, `img-src` must allow `https://i.ytimg.com` (Library page
  thumbnails) and `frame-src` must allow `https://www.youtube-nocookie.com`
  on pages with a video facade (Home).

## Newsletter setup

Manual steps, in this order. The code reads every value from environment
variables, and `.env.example` lists their names.

### 1. Create the Kit form with double opt-in

1. In Kit, go to Grow, then Landing Pages & Forms, and create a new inline
   form. Name it "Website signup". The site never shows this form. It exists
   so the API has a double opt-in form to add people to.
2. Open the form's settings, then the Incentive (confirmation) email. Turn
   double opt-in on, so subscribers must confirm by email.
3. Write the confirmation email. It must follow CLAUDE.md section 6.
4. Copy the form id from the form's URL in Kit. This is `KIT_FORM_ID`.

Use a form you create. Kit's built-in system form is reported to activate
subscribers without sending an email.

### 2. Create the tags

In Kit, go to Subscribers, then Tags, and create these. Copy each id from the
tag's URL.

| Tag | Variable | Applied when |
|---|---|---|
| `live-notify` | `KIT_TAG_LIVE_NOTIFY` | The live session checkbox is ticked, or the form is on an events page |
| `source-footer` | `KIT_TAG_SOURCE_FOOTER` | Signup from a closing newsletter band, including the home page |
| `source-subscribe-page` | `KIT_TAG_SOURCE_SUBSCRIBE_PAGE` | Signup from `/subscribe` |
| `source-live-notify` | `KIT_TAG_SOURCE_LIVE_NOTIFY` | Signup from `/events` or an event page |
| `source-plan-page` | `KIT_TAG_SOURCE_PLAN_PAGE` | Reserved for plan pages, which have no form yet |
| `source-academy-waitlist` | `KIT_TAG_SOURCE_ACADEMY_WAITLIST` | Signup from `/subscribe/academy` (the Academy waitlist buttons) or the closing card on `/academy` and course pages. The source is a fixed hidden field on each, so the tag is right without JavaScript |

Tags are optional in code: a missing id skips that tag. A tag that fails is
logged and the signup still succeeds, so check the logs after setup.

### 3. Create the API key

In Kit, go to Settings, then Developer, and create a V4 API key. V3 keys do
not work. This is `KIT_API_KEY`. Treat it as a secret: never give it a
`NEXT_PUBLIC_` prefix and never commit it.

### 4. Set the variables in Vercel

1. In Vercel, open the project, then Settings, then Environment Variables.
2. Add `KIT_API_KEY`, `KIT_FORM_ID` and each tag variable. Mark `KIT_API_KEY`
   as Sensitive.
3. Choose environments. Production needs them. Leave them off Preview unless
   previews should create real subscribers.
4. Redeploy. Pages are static, so whether the forms are enabled is decided at
   build time. Changing these variables has no effect until the next deploy.

### 5. Add the Vercel Firewall rate limit

1. In Vercel, open the project, then Firewall, then Configure, and add a
   custom rule.
2. Condition: Request Path equals `/api/subscribe`, and Method equals `POST`.
3. Action: Rate Limit, fixed window, 5 requests per 60 seconds, keyed on IP
   address, then Deny (429).
4. Save and publish the rule. Check the current Vercel plan includes rate
   limit rules.

Kit also limits a V4 API key to 120 requests a minute. Each signup uses two
to four, so the firewall rule must stay well below that. Add Cloudflare
Turnstile only if abuse appears (spec section 5).

### 6. Test once with a real address

Kit's API reference does not spell out how double opt-in works through the
API. The code follows the approach other developers report from live tests:
create the subscriber as `inactive`, then add them to a double opt-in form,
which sends the confirmation email. Before launch, confirm all of these:

- A new address receives the confirmation email, and shows as unconfirmed
  in Kit until the link is clicked.
- Clicking the link makes the subscriber active.
- Signing up again with the same address shows the same success message and
  sends no second email.
- The source and live-notify tags appear on the subscriber.
- Signing up with JavaScript turned off lands on `/subscribe/check-email`.

### Open item

Spec section 5 says the visitor "confirms and lands on a thank you page". No
such page exists yet. Kit's default confirmation page is used until the
ministry chooses one. If a site page is wanted, set it as the form's redirect
after confirmation in Kit.

## Anonymous questions setup

Added 21 October 2026. `/ask` takes an anonymous Bible question and
`/api/questions` emails it to the ministry through the Resend REST API. Until
all three variables below are set, the form shows a disabled button and
"Questions open soon".

### 1. Verify the domain in Resend

1. In Resend, open Domains and add `hobglobal.online`.
2. Add the DNS records Resend lists at the domain's DNS host: for SPF, an
   MX and a TXT record on the `send` subdomain; for DKIM, a TXT record
   on `resend._domainkey`. A DMARC record is recommended too.
3. Wait until Resend shows the domain as Verified. Sending from an
   unverified domain fails, and the form then shows its generic error.

### 2. Create the API key

In Resend, open API Keys and create a key with "Sending access" only,
limited to `hobglobal.online`. This is `RESEND_API_KEY`. Treat it as a
secret: never give it a `NEXT_PUBLIC_` prefix and never commit it.

### 3. Set the variables in Vercel

1. In Vercel, open the project, then Settings, then Environment Variables.
2. Add, for Production:
   - `RESEND_API_KEY`: the key from step 2, marked Sensitive
   - `RESEND_FROM`: `House of Bread Global <questions@hobglobal.online>`
     (any address on the verified domain)
   - `QUESTIONS_TO_EMAIL`: the ministry inbox that should receive questions
3. Leave them off Preview unless previews should send real email.
4. Redeploy. Whether the form is enabled is decided at build time.

### 4. Add the Vercel Firewall rate limit

1. In Vercel, open the project, then Firewall, then Configure, and add a
   custom rule.
2. Condition: Request Path equals `/api/questions`, and Method equals `POST`.
3. Action: Rate Limit, fixed window, 3 requests per 600 seconds, keyed on IP
   address, then Deny (429).
4. Save and publish the rule.

The firewall sees the IP address to count requests. The route never reads,
logs or forwards it. Add Cloudflare Turnstile only if abuse appears.

### 5. Test once

- A question sent from `/ask` arrives at `QUESTIONS_TO_EMAIL` with the
  subject "New anonymous Bible question" and only the time, topic and text.
- Sending with JavaScript turned off lands on `/ask/sent`.
- A fourth question within ten minutes is refused by the firewall.

### For the ministry to confirm

- **Safety notice on the form.** "This form cannot reply to you or give
  urgent help. If you or someone else is in danger, contact your local
  emergency services."
- **Privacy line above the question box.** "Please do not include names,
  contact details or other private details about yourself or anyone else."
- **`[CONFIRM HOW QUESTIONS ARE ANSWERED]`** on `/ask`. The page makes no
  promise of a reply and says nothing about how questions are used.
- **`[CONFIRM RETENTION]`** in the privacy policy, section "Anonymous
  questions": how long questions are kept in the ministry inbox.
- **Success copy.** "Thank you, your question has been sent" and "It
  reached the ministry without your name or any contact details."

## Pages that stay noindex permanently

These set their own robots metadata and ignore the global flag.

- `/subscribe/check-email`, only meaningful straight after a signup
- `/ask/sent`, only meaningful straight after sending a question
- The 404 page

## Social accounts to confirm

Added 17 October 2026 on `feat/come-alive`. The links live in
`siteConfig.links.social` (`lib/site-config.ts`), plain profile URLs with no
tracking parameters. Each carries an owner. **The ministry must confirm which
accounts are official** and whether the pastor's personal accounts should be
shown as the ministry's. Every link's accessible name reads "House of Bread
on {platform}", as briefed, which is not accurate for the pastor's accounts
until confirmed.

| Platform | URL | Owner |
|---|---|---|
| YouTube | https://www.youtube.com/channel/UCGkSJEWgmpHK7eR1ysKZZgA | ministry |
| YouTube | https://www.youtube.com/@TheBrotherOla | pastor |
| Instagram | https://www.instagram.com/brother0la/ | pastor |
| Facebook | https://www.facebook.com/brother0la | pastor |
| TikTok | https://www.tiktok.com/@brotherola | pastor |
| X | https://x.com/brotherola | pastor |
| Linktree | https://linktr.ee/brotherola | pastor |

No email address is published anywhere on the site.

## Bracketed copy from the content pack (revision 2)

| Where | Placeholder |
|---|---|
| `/media`, Social | [CONFIRM CONTENT] after the intro line. The links are filled, see "Social accounts to confirm" |
| `/media`, Audio | Retired with the audio section in the reset; `siteConfig.links.audio` removed (29 October 2026) |
| `/media`, Video | Set `YOUTUBE_CHANNEL_ID=UCGkSJEWgmpHK7eR1ysKZZgA` in Vercel (all environments) and redeploy. Until then Vercel builds show "Videos will appear here soon" |
| Every AppBand (Home, `/new-testament`, book pages, `/plans`, journey pages, `/subscribe`) | [GOOGLE PLAY LINK] |
| Same places | [APP STORE LINK OR "COMING SOON", CONFIRM WITH APP DEVELOPER] |
| `/app` header | [GOOGLE PLAY LINK], [APP STORE LINK OR "COMING SOON", CONFIRM] (shortened as written in the pack) |
| `/about`, Mission | [MISSION STATEMENT TO BE SUPPLIED BY THE MINISTRY]. The pack's interim wording is shown beside it with an "Interim wording" badge |
| `/about`, Leadership | [TEACHER NAME, PHOTO AND SHORT BIOGRAPHY TO BE SUPPLIED] |
| `/about`, Doctrinal position | [DOCTRINAL STATEMENT TO BE SUPPLIED BY THE MINISTRY] |
| `/events`, Weekly rhythm | [WEEKLY SCHEDULE AND MINISTRY TIME ZONE TO BE SUPPLIED] |
| `/academy`, Why learn here | [TEACHER NAME AND A SHORT INTRODUCTION TO BE SUPPLIED] |
| `/academy`, Questions | [CONFIRM] on every answer: free or paid, device needed, how long access lasts, live attendance. See "House of Bread Academy, open questions" |
| `/academy/[slug]`, all five sections | [COURSE DETAILS TO BE SUPPLIED] |
| `/plans/[slug]`, closing band | [APP DEEP LINK TO BE CONFIRMED] |
| `/contact`, side panel | [RESPONSE TIME, EMAIL ADDRESS AND SOCIAL LINKS TO BE SUPPLIED] |
| `/privacy`, section 1 | [LEGAL NAME, ADDRESS AND CONTACT EMAIL OF THE MINISTRY] |
| `/privacy`, section 6 | [RETENTION PERIODS TO BE SUPPLIED] |
| `/privacy`, section 7 | [TO BE CONFIRMED FOR EACH PROCESSOR] |
| `/privacy`, section 10 | [DATE OF LAST UPDATE] |

## Placeholders added where the pack names a field but supplies no fact

| Where | Placeholder |
|---|---|
| Home, Start here; Library, Video; `/events`, Watch | Fallback title [VIDEO TITLE TO BE SUPPLIED]. `siteConfig.startHereVideoId` and `siteConfig.links.featuredVideoId` are both `wpNuDtvzMzs`. The video is on the pastor's channel (@TheBrotherOla), not in the ministry feed, so its title comes from YouTube oEmbed on the server (cached for days): "Christianity is the slave master's tool?" on 19 October 2026. If oEmbed is unreachable the placeholder shows and retries within the hour. Thumbnail `i.ytimg.com/vi/wpNuDtvzMzs/hqdefault.jpg`. On `/events` it shows as "Latest session" until a session is live or a dated replay exists |
| Home hero visual, floating session card | None. It shows the next weekly session from `siteConfig.liveSession`, the same occurrence as the Next live session card |
| Event cards, featured session card and `/events/[slug]` header | [DATE, TIME AND MINISTRY TIME ZONE TO BE SUPPLIED], [DURATION TO BE SUPPLIED] |
| Featured session card and `/events/[slug]` | [YOUTUBE LINK TO BE SUPPLIED], [CALENDAR FILE AVAILABLE ONCE A DATE IS SUPPLIED] |
| `/events/[slug]` | [SESSION DESCRIPTION TO BE SUPPLIED], [PASSAGES TO BE SUPPLIED, LINKED THROUGH /lib/scripture] |
| Course cards and `/academy/[slug]` header | Titles [COURSE TITLE 1] to [COURSE TITLE 4], a placeholder summary and a "Coming soon" badge. No lesson counts, durations, prices or certificates until the ministry supplies them |
| Teaching cards and `/teachings/[slug]` | [SUMMARY TO BE SUPPLIED], [READING TIME], [PASSAGES], [DATE], [PASSAGES AS LINKED CHIPS], [TEACHING BODY TO BE SUPPLIED] |
| `/new-testament/[book]`, all five sections | [BODY TEXT FOR THIS SECTION TO BE SUPPLIED] |
| `/plans/[slug]` for the 60 and 90 day journeys | [DAY ONE READING TO BE CONFIRMED AGAINST THE APP] |
| `/plans/[slug]`, Frequently asked | [FREQUENTLY ASKED QUESTIONS TO BE SUPPLIED] |
| `/privacy`, section 8 | [HOW TO EXERCISE THESE RIGHTS TO BE SUPPLIED] |
| `/contact`, under the form | [CONTACT FORM PRIVACY WORDING TO BE SUPPLIED] |
| Home, Next live session, and `/events`, Next up | [DURATION TO BE SUPPLIED] and [CALENDAR FILE TO COME] on the weekly session card. Set `siteConfig.liveSession.durationMinutes` once confirmed; until then a session counts as current for 60 minutes after it starts. A weekly `.ics` is a follow up |

## Image slots

`ImageSlot` (`components/shared/ImageSlot.tsx`) stands wherever a photo,
video or screenshot belongs. Each slot has an id in
`lib/media/image-slots.ts`, which holds its ratio, brief, alt text and
status. Stock photos may fill a slot with no people since 29 October 2026
(the ministry's request): CC0 or public domain only, each credited in the
registry (see "Stock photos" below).

- **With an image.** When `public/images/slots/<id>.webp` has been built,
  the slot shows it through `next/image` with a blur placeholder, in the
  same fixed ratio box, so nothing shifts. The "Photo:" caption is gone.
- **Without one.** It shows the designed placeholder: a soft green tinted
  gradient, a faint pinstripe and a caption naming the intended image
  ("Photo: the teacher in a live session"), with `data-placeholder` and the
  caption as its accessible name.
- **Building.** Put `<id>.png` or `<id>.jpg` in
  `C:\Users\USER\house-of-bread-assets\slot-images-raw` (outside the repo)
  and run `npm run images:build`. It crops to the slot's ratio from the
  centre, resizes to 1600 wide at most and writes WebP at 150 KB or less. It
  fails, writing nothing, on a name that matches no slot, a slot marked
  real photo needed, or an image it cannot fit in budget. `-- --prune`
  drops built images whose raw file is gone. Check the alt text in the
  registry against each image when it lands.

### Interim images are AI generated

Logged 20 October 2026. Any image in `public/images/slots` for a slot with
status `interim` is an AI generated placeholder, not a photo of the
ministry. Each still carries `data-placeholder="interim-image"`, so the
built HTML can be searched for them. Replace every one with a real photo
before launch, then set the slot's status to `final`. As of this date no
interim image has been built.

### Stock photos (29 October 2026)

Asked for by the ministry: related photos found online in every image
section, until its own arrive. Only slots with no people take one; the
teacher, community and app screenshot slots keep the designed placeholder
(Isaac Ola's portrait is coming from the ministry). Every photo is CC0 or
public domain from Wikimedia Commons, so no on-page credit is owed; the
credit lives in each slot's `credit` field (`slot-images.test.ts` checks).
Each image carries `data-placeholder="stock-image"`. Raw crops sit in
`house-of-bread-assets/slot-images-raw`. The 1611 title page is supplied at
1000 wide: at 1600 its engraving cannot fit 150 KB, and cards show it at
320px at most.

| Slot | Photo | Author | Licence |
|---|---|---|---|
| `home-start-here` | Open Bible on a dark desk | John-Mark Kuznietsov (Unsplash) | CC0 |
| `home-start-new` | Bible in sunlight, autumn leaves | Aaron Burden (Unsplash) | CC0 |
| `home-start-connect` | Open Bible on a table | Aaron Burden (Unsplash) | CC0 |
| `home-start-question` | Pen on a closed notebook | Thomas Martinsen (Unsplash) | CC0 |
| `about-belief-context` | Hebrew scrolls laid open | Pete Unseth | CC0 |
| `about-belief-scripture` | Open Bible, close view | John-Mark Kuznietsov (Unsplash) | CC0 |
| `about-belief-text` | 1611 King James Bible title page | Church of England (UPenn scan) | Public domain |
| `about-belief-plain` | Open Bible, soft daylight | Ben White (Unsplash) | CC0 |

Source links are in `lib/media/image-slots.ts`.

### Every slot

Status `real needed` means the slot shows people or the app's own screens:
it keeps the designed placeholder, and the build script refuses any file
for it. Real photo needed, do not use generated people. For the app slots,
real app screenshot needed, do not use generated screens. When the real
image arrives, set the status to `final` and build it.

| Id | Page | Ratio | Brief for the photo | Status |
|---|---|---|---|---|
| `home-teacher` | Home, The teacher | 4:5 | Isaac Ola teaching, Bible open, warm natural light. Portrait crop with space above the head. Also wanted: a photo of him teaching for the hero, which the ambient loop stands in for | Real needed (person) |
| `home-start-here` | Home, Teachings (only if no video) | 16:9 | Stands in for the latest teaching when neither the feed nor `featuredVideoId` gives a video, so today it does not show | Stock (CC0) |
| `home-start-new` | Home, Where are you starting from? card 01 (New to the Bible) | 3:2 | A Bible opened for the first time on a table, soft morning light. No people. Decorative (alt=""): the card's title carries the meaning | Stock (CC0) |
| `home-start-connect` | Home, Where are you starting from? card 02 (How the stories connect) | 3:2 | An open Bible beside handwritten notes linking one book to another. No people. Decorative | Stock (CC0) |
| `home-start-question` | Home, Where are you starting from? card 03 (Carrying a question) | 3:2 | A notebook with a question written in it, beside an open Bible. No people. Decorative | Stock (CC0) |
| `about-belief-context` | `/about`, What we believe card 01 (Context first) | 3:2 | The Scriptures as first written, on scrolls. No people. Decorative | Stock (CC0) |
| `about-belief-scripture` | `/about`, What we believe card 02 (Scripture in full) | 3:2 | An open Bible, whole pages of text. No people. Decorative | Stock (CC0) |
| `about-belief-text` | `/about`, What we believe card 03 (A clear text) | 3:2 | The 1611 King James Bible title page. Decorative | Stock (public domain) |
| `about-belief-plain` | `/about`, What we believe card 04 (Plain English) | 3:2 | An open Bible on a table in soft daylight. No people. Decorative | Stock (CC0) |
| `about-mission` | `/about`, Mission | 16:9 | Believers following a live teaching online, with open Bibles: a laptop or phone showing the stream, hands on an open Bible | Real needed (community) |
| `about-leadership` | `/about`, Leadership | 4:5 | A portrait of the teacher: head and shoulders, plain or softly blurred background, looking just off camera | Real needed (person) |
| `academy-teacher` | `/academy`, Why learn here | 4:5 | The teacher leading an online class: on camera or at a desk, Bible open, warm natural light. Real photo needed, do not use generated people | Real needed (person) |
| `events-how-it-works` | `/events`, How it works | 4:5 | A session streaming live, the teacher on camera, seen from behind the camera or as the stream itself | Real needed (person) |
| `app-journeys` | `/app`, New Testament journeys | 16:9 | Real app screen: a journey's daily reading and progress | Real needed (screenshot) |
| `app-books` | `/app`, Every book introduced | 16:9 | Real app screen: a book introduction | Real needed (screenshot) |
| `app-translations` | `/app`, Six translations | 16:9 | Real app screen: switching between translations | Real needed (screenshot) |
| `app-teaching` | `/app`, The ministry's teaching | 16:9 | Real app screen: the teaching library | Real needed (screenshot) |

The `/academy` hero visual is the open Bible loop in a framed panel (see
"Motion loops" below), not an image slot.

Assets to request from the ministry (CONTENT-PACK 1.7): a portrait of the
teacher, 10 to 15 stills from live sessions and online classes, real app
screenshots, the logo SVG (mark and wordmark), and a social share image.

## Copy to confirm

Small pieces of copy the pack does not supply, written to fill a layout slot.
None states a fact. Confirm or replace.

- **House of Bread Academy copy.** The Home bento tile reads "Equipped in the
  truth. Bible classes that give believers a structured place to study the
  Word, taught with care for context and doctrine." The About card reads
  "Bible classes that equip believers with knowledge of the truth, for those
  who want to go further than reading alone." Both are built from the
  approved tagline and description.
- **`/academy`, written 21 October 2026.** All in `academyCopy`
  (`lib/content/copy.ts`). It describes what the Academy will offer, not
  what exists. Confirm each:
  - Lead: "House of Bread Academy will give believers a structured place to
    study the Bible, one course at a time and at their own pace."
  - How the Academy will work: "Create an account. One account opens every
    course." "Choose a course. Start with the one that meets you where you
    are." "Learn at your own pace. Work through each lesson when it suits
    you, and see your progress as you go." No certificates or live Q and A
    are claimed.
  - Why learn here: who it is for ("Believers who want to go further than
    reading alone, from new believers to those who already teach others"),
    who teaches (placeholder), how it teaches ("From the King James Version,
    in plain contemporary English, with Scripture always read in its
    context").
  - Questions: the device answer ("A phone, tablet or computer with an
    internet connection") and the live answer ("Courses are planned to be
    self paced, so nothing needs to be attended live") are working
    assumptions, each marked [CONFIRM].
  - Closing card: "Hear when the Academy opens. Be among the first to know
    when the first courses open, with reminders before live sessions and
    new teaching from House of Bread Global." The signup joins the general
    newsletter with the academy-waitlist tag, so the wording says so.

## House of Bread Academy, open questions

Logged 21 October 2026. The Academy is planned as a custom built course
platform, deferred (SPEC-v3, stage three). `/academy` is its front door
only: no accounts, sign in, database or lesson progress exist. Answers
needed from the ministry before an Academy spec is written:

- **Free or paid?** All free, all paid, or some of each. Paid brings a
  payment provider, refunds and tax into scope.
- **Who uploads courses?** Who writes and records lessons, and who puts them
  on the platform: the teacher, a ministry volunteer, or the developer.
  This decides how much admin tooling the platform needs.
- **How do people join?** Open sign up, an application, or an invitation.
  And whether existing class members move across.
- **What is `biblecourse.hobglobal.online`?** Whether it is live, what runs
  on it, who controls it, and whether the Academy should live there or at
  `/academy`.
- **How long does access last, and is anything live?** The `/academy`
  answers carry [CONFIRM] until these are known.

- **Announcement bar, session within 24 hours.** The pack gives only "Live
  now: {title}. Watch on YouTube". The upcoming case reads "Coming up:
  {title}, {local time}. Watch on YouTube".
- **About, closing band heading.** Reuses the Home H1, "Come and be fed by the
  Word.", with the "Study . Pray . Grow" eyebrow.
- **Region cards on About.** The ministry is online only
  (18 October 2026), so the [LOCAL DETAILS] placeholder is gone. Each card
  reads "Join live sessions and classes online. Session times are shown in
  {zone}." The region band is gone (19 October 2026): its times sit in the
  session card as "Session times by region". The cards are built from the online only fact and the zone labels. Confirm the
  wording, and that Academy classes run online.
- **UI headings.** "Subscribe" above the `/subscribe` form, "Send a message"
  and "Other ways to reach the ministry" on `/contact`, "Classes" and "Choose a
  pace" as section headings, "Next up" empty state reused on Upcoming.

## Values to confirm

- **Weekly live session.** Every Monday at 8:00 pm in Lagos (Africa/Lagos,
  19:00 UTC), set 19 October 2026 in `siteConfig.liveSession`. Every time on
  the site is worked out from this one rule through Intl and IANA zones
  (`lib/schedule`), revalidated at most hourly and corrected by the
  visitor's clock. Confirm the duration.
- **Session times by region.** Nigeria, Ghana, United Kingdom, South Africa,
  Kenya and United States (Eastern). Confirm the list, and whether the US
  row should stay Eastern (America/New_York) or show more than one US zone.
- **Day one sample.** `/plans/30-day-plan` shows Day 1, James 1-5 and
  Galatians 1-3, theme "Living faith and justification by faith." It is
  labelled as a sample. Confirm against the app.
- **Journey pace labels.** Focused, Steady and Unhurried are drawn from the
  approved one line descriptions. Confirm with the ministry.
- **Journey slugs.** `30-day-plan`, `60-day-plan`, `90-day-plan` are kept from
  the previous pass and are temporary. The display names are now "30 Day NT
  Journey" and so on. Confirm slugs against the app's plan identifiers before
  they become permanent URLs.
- **Detail page meta descriptions.** Sample event, class and teaching pages
  carry a generic description noting they are samples.
- **"Get the app" and "Start a journey in the app" go to `/app`.** No store
  link or deep link exists yet, so every app call to action lands on the app
  page, where the store buttons will be.

## Placeholder data

Events, classes, teachings and books come from MDX in `/content`, through
`lib/content`. Each sample file has `placeholder: true` in its frontmatter,
a bracketed `[PLACEHOLDER ...]` body, and renders a "Sample" badge. Nothing
is copied from the app. Replace or delete each one when real content arrives.

| Route | Source | Sample |
|---|---|---|
| `/events/[slug]` | `content/events` | `sample-live-session` |
| `/academy/[slug]` | `content/classes`, read through `lib/academy` | `sample-class`, `sample-class-2`, `sample-class-3`, `sample-class-4` (shown as "Coming soon") |
| `/teachings/[slug]` | `content/teachings` | `sample-teaching` (marked draft) |
| `/new-testament/[book]` | `content/books` | `matthew` |
| `/plans/[slug]` | `lib/content/placeholder-data.ts` | `30-day-plan`, `60-day-plan`, `90-day-plan` |

- Plans stay in `placeholder-data.ts` until their identifiers are confirmed
  against the app (SPEC-v3 section 13). The `plan` schema already exists.
- The sample event has no date, time zone, duration or YouTube link. The
  schema allows those as null only on a placeholder event. The home page and
  `/events` show their empty states. Which events count as upcoming or replay
  comes from the event `status` field, not the build time clock.
- Book slugs are canonical ids from `/lib/scripture`. A book links from the
  index only when `content/books/<id>.mdx` exists. Mark no longer has a
  sample page.
- `<Scripture>` resolves `passage` through `/lib/scripture` and puts the
  canonical reference and deep link on data attributes. The deep links stay
  data only until the Scripture Index pages exist (stage two).
- `/lib/scripture` covers all 66 books with chapter counts. Verse counts
  per chapter are not checked yet, so `John 6:99` passes. Book pages
  (`content/books`) accept New Testament ids only.
- Reading time on teachings is still a bracketed placeholder.

## Brand

- **Colour values.** The brand primitives in `app/globals.css` (`--brand-*`)
  come from the palette revision of 17 October 2026 and are not yet
  confirmed against official brand files. Replace them with official hex
  values, then rerun the contrast checks below.
- **Logo.** `public/house-of-bread-logo.png` is the supplied source: a
  1254px square RGB PNG, no transparency, an off white background with
  noise, about 23% padding, 1.1 MB, and the mark only (no name). It reads
  well on white once trimmed. `public/logo-mark.png` (214x256, 13KB) is
  trimmed with near white lifted to pure white, shown beside the text
  wordmark. On the deep green footer it sits in a white tile, because the
  source has no alpha. **Ask the ministry for an SVG with a transparent
  background**: the rays blur below 32px, and a cut out cannot be made
  cleanly from this PNG (the cross is near white too).
- **Typefaces.** Literata at 600 for display and headings, and for reading.
  Geist for UI, nav, buttons and labels. Replace or confirm once brand
  typefaces are known.
- **App screenshots.** The hero visual, `/app` and the app band use a CSS
  phone frame with illustrative floating cards, marked as illustrative in
  code. Swap in real screenshots when supplied.
- **Favicon and share image.** `app/icon.png` (192px), `app/apple-icon.png`
  (180px) and `app/opengraph-image.png` (1200x630, mark and name on white)
  come from the same PNG. The Next.js default favicon is removed. Regenerate
  all three when the SVG arrives.
- **Reversed logo for dark.** In the dark theme the green mark reads poorly
  on night, so the header mark sits in a white tile (`.logo-mark` in
  `app/globals.css`), as it does in the footer. **Ask the ministry for a
  reversed (light) mark, ideally SVG,** so the dark header can show the
  mark without a tile.

## Design work deferred

From the design upgrade of 17 October 2026. Each waits on something the
site does not have yet.

- **Duration badges on video cards.** The channel feed carries no duration.
  Needs the YouTube Data API, which needs a key and a quota decision.
- **Teacher panel.** The one deep feature panel on Home or About, with the
  teacher's portrait beside a ScriptureBlock. Needs the portrait and an
  approved bio.
- **Numbered FAQ.** A native details and summary list with Literata numbers.
  Needs the questions and answers.
- **Store badges.** Official App Store and Google Play badges in the footer.
  Needs the store links (`siteConfig.links.appStore` and `googlePlay`).
- **Copy buttons.** Copy a session link or calendar link from a session card.
  Needs real session links and calendar files first.
- **Topic chips in the Library.** Left out: videos carry no topics.
  Add a sideways scroll-snap chip row, CSS only, once videos are tagged.

## Known behaviour to revisit

- **Unknown slugs.** With Cache Components on, `dynamicParams = false` is not
  available. Each dynamic page exports `ensureStatic = "navigation"`, so an
  unknown slug returns a real 404 rather than a soft 404. Checked on this
  branch: `/events/nope`, `/teachings/x`, `/new-testament/luke` and `/nope`
  all return 404. Keep this export when the MDX pipeline replaces the data.
- **`.ics` files.** "Add to calendar" is disabled until events carry real
  dates.
- **Announcement bar.** Pages are static, so the bar renders in the server
  HTML only for an event whose `status` is `live`. For "starts within 24
  hours", a small client script compares the visitor's clock with dated
  sessions. With no dated session, nothing renders and no script runs. A
  scheduled session already under way counts as live. Logic and tests:
  `lib/content/announcement.ts`.
- **Footer closing strip.** "Stay close to the ministry" shows only on pages
  that do not already offer signup: `/about`, `/new-testament`, book pages,
  `/plans`, journey pages and the 404 page. `[data-newsletter]` marks the
  newsletter card, the `/subscribe` form and the check-email page, and a CSS
  `:has` rule in `globals.css` hides the strip wherever it appears. Browsers
  without `:has` show it on every page, which is harmless.
- **Lighthouse.** The 95 target is measured on a Vercel preview (pack section
  15). It has not been measured on this branch.

---

## Colour token migration (palette revision 3)

Branch `feat/palette-nav-media`, 17 October 2026. Dark green had spread to
almost every surface. The palette now has cream, mint and gold light
surfaces, an emerald primary, and deep green kept for the footer and one
feature panel per page. Old names were removed or remapped, and every use
was rewritten. Tailwind's default palette stays switched off, so only these
tokens exist as colour utilities.

| Old token | Old value | Now |
|---|---|---|
| `surface-tint` | `#f3f8ec` | Removed. Use `surface-mint` `#eef6e8`, or `surface-warm` (cream) `#fbf8f1` |
| `green` | `#0a3616` | Removed. Fills on light are `emerald` `#1b6b33`, text on light is `emerald-deep` `#14602f`, dark fills are `green-deep` (same `#0a3616`) |
| `green-deep` | `#04290e` | Name kept, value now `#0a3616`. The old value is now `green-night` |
| `green-night` | `#011f0b` | Name kept, value now `#04290e`. `#011f0b` is retired |
| `green-rich` | `#0f4a22` | Unchanged |
| `success-on-white` | `#0b7a45` | Removed. Use `emerald` |
| `on-lime` | `#0a3616` | Removed. Text on lime, gold and mint fills is `ink` |
| `on-green-muted` | 80% white over green | Kept, deep surfaces only (`.tone-deep`). It fails on emerald and the light gradient ends |
| `border` | 12% green | 14% `emerald` (decorative) |
| `border-strong` | 55% green | 80% `emerald`, 4.19:1 on white |
| Headings on white | `green` | `ink` (contextual `fg-heading`) |
| Links, eyebrows, focus on white | `green` | `emerald-deep` (contextual `fg-link`, `fg-accent`, `ring`) |
| Accents on green | `lime` | White on every green surface. Lime only on deep surfaces (`.tone-deep`) and at the dark top left of the hero and page header |
| Icon tiles | rich green to night, lime glyph | `leaf` to `emerald`, white glyph |
| Badges, "opens soon" notes | `lime` | `gold-soft` with ink text |
| Announcement bar | `lime` | `gold` while live, `gold-soft` when a session is within 24 hours |
| `NewsletterBand` (green band) | | `NewsletterCard`: a light card on `surface-gold` with an emerald button |
| `Button` variant `ghost` | | Removed (its hover underline broke the no underline rule). Variant `live` added: gold fill, ink text |

New tokens: `surface-warm`, `surface-mint`, `surface-gold`, `emerald`,
`emerald-deep`, `leaf`, `lime-bright`, `gold`, `gold-soft`, and the brand
primitive `--brand-green-glow` `#1e7b3a`, the light end of the hero and app
band gradients, used in gradients only.

New gradients: `bg-green-header` (100deg, green-rich to emerald),
`bg-green-hero` (135deg, `#0f4a22`, `#14602f` at 50%, `#1e7b3a`),
`bg-green-band` (135deg, `#14602f` to `#1e7b3a`, the app band),
`bg-green-feature` (green-deep to green-night, one feature panel per page)
and `bg-green-tile` (leaf to emerald).

New contextual sets: `.tone-green` makes text, accents, links, rings and
the TextCTA white on any green surface. `.tone-deep` adds lime accents and
muted text where the surface is green-deep or darker. `.tone-light` resets
a light card inside a green surface.

### Surface rhythm

Pages run hero, then white, cream and mint sections in turn, the app band
(the one lighter green feature band), cream, the newsletter card, then the
dark footer. Apart from the footer, no page has more than one deep green
element: the dark scripture panel on Home and About. Gold appears only for
live states, badges and small highlights.

## White and green redesign (palette revision 4)

Branch `feat/white-glass-redesign`, 17 October 2026. The site is now mostly
white with green built around it. This supersedes the green surfaces in
revision 3 below, which stays as a record.

- Removed: `green-rich`, `lime-bright`, `mint` (`#05d47c`), the glow
  primitive, `bg-green-header`, `bg-green-hero`, `bg-green-band`,
  `bg-green-feature`, `bg-green-tile`, `hero-glow`, `grain`, `drift`,
  `eyebrow-pill`, `.tone-green`, `.tone-light`, `.tone-mint`, and the
  `Grain`, `CrossWatermark`, `Leaves` and `CurveEdge` decor.
- Added: `tint` `#edf3ef` (emerald 8% over white), `bg-hero-tint`,
  `bg-page-tint`, `bg-panel-tint` (radial gradients only), `glass-bar`,
  `glass-card`, `eyebrow-dot`, `.skeleton`.
- Kept: `bg-green-footer` and `.tone-deep`, now the footer's only set.
- Borders: hairline 12% emerald, hover edge 35%. Keyboard focus carries its
  own ring, so the hover edge no longer needs 3:1.
- No deep green section or panel apart from the footer. The scripture
  feature panel on Home and About is mint with an emerald rule.

### Redesign pairings

Measured with `npm run contrast`. All pass.

| Element | Pairing | Ratio |
|---|---|---|
| Body and muted text | ink, ink-muted on white | 16.47, 7.64 |
| | ink-muted on cream, mint | 7.20, 6.90 |
| Accents (links, eyebrows, H1 phrase) | emerald-deep on white, cream, mint | 7.65, 7.22, 6.92 |
| Hero tint at its 10% peak | ink, ink-muted, emerald-deep | 14.21, 6.59, 6.60 |
| Primary button | white on emerald, on emerald-deep (hover) | 6.57, 7.65 |
| Secondary button | emerald-deep on white, on tint (hover) | 7.65, 6.80 |
| Footer buttons | green-deep on white, on mint (hover); white on 12% white over green-deep | 13.53, 12.23, 9.43 |
| Icon glyph (UI, 3:1) | emerald on tint | 5.84 |
| Header, transparent over the hero tint peak (revision 5) | ink nav | 14.21 |
| Nav current pill | emerald-deep on tint over the hero tint peak | 5.91 |
| Hero floating cards, white at 84%, worst case | ink-muted, emerald-deep over the green-night phone frame | 5.53, 5.54 |
| | ink-muted over the hero tint | 7.43 |
| Newsletter card, white at 84% | ink-muted over gold, mint; emerald-deep over gold | 7.51, 7.52, 7.53 |
| Footer | off-white on green-night, green-deep; 80% muted; current pill | 14.98, 12.82, 8.73, 8.12 |
| Live and badges | ink on gold, gold-soft | 9.02, 11.85 |
| Play chip | white on 85% green-night over white, black images | 10.01, 16.82 |
| Focus rings (3:1) | emerald-deep on white, mint, the header over the hero tint; white on green-deep | 7.65, 6.92, 6.60, 13.53 |
| Never used | lime on white | **1.90**, so lime is a decorative dot halo only |

### Glass and scroll performance

Brief: backdrop-filter on the header, the hero floating cards and the
newsletter card only, dropped from any surface that costs more than a few
fps. Tested 17 October 2026 on a production build, headless Chromium,
4x CPU slowdown, a 6 second scripted scroll, Home and Media at 1280 and 375.

- Sequential runs showed blur costing 10 to 25 fps at 1280.
- A paired rerun (blur and no blur interleaved, 6 pairs each) showed no
  consistent difference: no blur was faster in 3 of 6, 3 of 6 and 2 of 6
  pairs, and the baseline itself swung from 7 to 45 fps between runs.
- Headless Chromium on this machine rasterises in software, so the test
  cannot resolve a few fps either way.

Decision: blur ships off. The three surfaces keep translucent white (header
96%, cards 84%), which passes AA without blur. Over the smooth radial tints
behind the cards and the newsletter, blur is close to invisible anyway.
**Open item:** scroll Home and the Library on a real mid range Android
phone with blur on the header only (`backdrop-filter: blur(10px)`, header at
88%, contrast already measured at 12.52 and 5.82). Keep it if the loss is a
few fps or less.

### Motion and contrast (revision 4)

The scroll reveal now starts at 0.85 opacity and 10px. At 0.85 every text
pairing passes: ink 10.38, ink-muted 5.18 on white and 4.80 on mint,
emerald-deep on cream 5.08. The 0.7 notes below no longer apply.

## Colour contrast, WCAG 2.2 AA

Measured on 17 October 2026 against the approximate brand values. Normal
text needs 4.5:1. Large text and non-text UI need 3:1. Rerun when official
hex values arrive.

### Gradient stops

| Surface and stops | White text | lime-bright `#b7d86a` | lime `#a6c859` | Other |
|---|---|---|---|---|
| Header: green-rich `#0f4a22` | 10.38 | 6.45 | 5.45 | |
| Header: emerald `#1b6b33` | 6.57 | 4.08 (fill, non-text) | 3.45, not used | |
| Hero and page header: green-rich `#0f4a22` | 10.38 | 6.45 | 5.45 | |
| Hero: emerald-deep `#14602f` (50%) | 7.65 | 4.75 | **4.02, fails** | |
| Hero and app band: glow `#1e7b3a` | 5.32 | **3.30, fails** | **2.79, fails** | |
| App band start: emerald-deep `#14602f` | 7.65 | 4.75 | **4.02, fails** | |
| Deep: green-deep `#0a3616` | 13.53 | 8.40 | 7.10 | on-green-muted 8.72 |
| Deep: green-night `#04290e` | 15.81 | 9.82 | 8.30 | on-green-muted 10.19 |
| Hero glow, 18% lime over the glow end `#368940` | 4.37 | | | Behind the phone only, no text over it |

Result: white text passes on every stop. Lime text is used only where it
passes: the eyebrow at the dark top left of the hero and page header
(lime-bright, 6.45:1), and the footer and dark scripture panel (lime, 7.10:1
or more). Lime text on emerald-deep measures 4.02:1, so the brief's "lime
text only on `#14602f` or darker" is tightened to green-rich or darker. The
app band carries no lime text at all. Muted text on green is white except on
deep surfaces.

### Fills on green

| Element | Pairing | Ratio | Result |
|---|---|---|---|
| Primary on green | ink on lime-bright | 10.23 | Pass |
| Secondary on green | white on 12% white over emerald | 5.01 | Pass |
| | over emerald-deep | 5.72 | Pass |
| | over the glow end `#1e7b3a` | **4.21** | **Fails.** Never placed there: the app band has no secondary button, and the About closing band uses the hero gradient so its centred buttons sit on emerald-deep |
| Nav hover pill, 8% white | white text over emerald | 5.48 | Pass |
| Nav current pill, 15% white | white text over emerald | 4.71 | Pass |
| Region and anchor chips, 10% white | white text over the glow end | 4.39 | Large or bold text only: chips sit near the top of the band, over 7.85 or more |
| TextCTA chip on green, 15% white | white arrow over the glow end | 3.97 | Pass (non-text, 3:1) |
| TextCTA hover on green | ink arrow on lime-bright | 10.23 | Pass |
| Live button | ink on gold | 9.02 | Pass |

### Light surfaces

| Text | White `#ffffff` | Cream `#fbf8f1` | Mint `#eef6e8` | surface-gold `#fdf3d6` | gold-soft `#f3d98b` | gold `#e9b949` |
|---|---|---|---|---|---|---|
| ink `#0b2412` | 16.47 | 15.52 | 14.88 | 14.87 | 11.85 | 9.02 |
| ink-muted `#3d5a46` | 7.64 | 7.20 | 6.90 | 6.90 | 5.50 | **4.18, not used** |
| emerald `#1b6b33` | 6.57 | 6.19 | 5.94 | 5.93 | 4.73 | **3.60, not used** |
| emerald-deep `#14602f` | 7.65 | 7.22 | 6.92 | 6.91 | 5.51 | 4.19 (large only) |

### Buttons, links and details on light

| Element | Pairing | Ratio | Result |
|---|---|---|---|
| Primary on light | white on emerald, hover emerald-deep | 6.57, 7.65 | Pass |
| Secondary on light | emerald text and 2px border on white, hover on mint | 6.57, 5.94 | Pass |
| Disabled primary | white on ink-muted | 7.64 | Pass |
| TextCTA label | emerald-deep on white, cream, mint, gold-soft | 7.65 to 5.51 | Pass |
| TextCTA arrow | emerald on white, white on emerald (hover) | 6.57 | Pass |
| TextCTA chip ring, emerald at 25% | on white | 1.47 | Decorative. The arrow carries the 3:1 |
| Body link underline, emerald at 50% | on white | 2.28 | Decorative. The link text is emerald-deep (7.65:1) and the underline marks it as a link. Solid emerald on hover |
| Card hover edge, `border-strong` | on white, cream | 4.19, 3.95 | Pass |
| Card edge, `border` | on white | 1.23 | Decorative only |
| Input border, ink-muted | on white | 7.64 | Pass |
| Icon tile glyph | white on leaf, on emerald | 3.43, 6.57 | Pass (non-text) |
| Text in tiles (plan days, step numbers) | white on solid emerald | 6.57 | Pass. These tiles do not use the leaf gradient |
| Badges and notes | ink on gold-soft | 11.85 | Pass |

### Focus rings

| Ring | Against | Ratio | Result |
|---|---|---|---|
| emerald-deep, 3px, on light surfaces | white, cream, mint, gold | 7.65 to 6.91 | Pass |
| White, 3px, on green surfaces | green-rich to the glow end | 10.38 to 5.32 | Pass |
| lime, 3px, on deep surfaces | green-deep, green-night | 7.10, 8.30 | Pass |

### Failing pairings, never used

| Pairing | Ratio |
|---|---|
| lime text on emerald-deep, emerald or the glow end | 4.02, 3.45, 2.79 |
| lime-bright text on the glow end | 3.30 |
| on-green-muted on emerald, on the glow end | 4.23, 3.43 |
| White text on leaf | 3.43 (glyphs only) |
| White on 12% white over the glow end (secondary on green) | 4.21 |
| mint on the glow end, gold on the glow end | 2.71, 2.91 |
| ink-muted or emerald text on gold | 4.18, 3.60 |
| lime, mint or gold on white, either way round | 1.90, 1.96, 1.83 |

Mint `#05d47c` is kept as a token for progress accents on green. It passes
on green-rich (5.30) and emerald (3.35, non-text) but not on the glow end,
so progress marks on green sit on the dark start of a gradient.

### Design upgrade pairings (17 October 2026)

Measured with `npm run contrast` (`scripts/check-contrast.mjs`), which
composites alpha layers and fails any pairing in use below its threshold.
Rerun it for every new pairing and add the row here.

| Element | Pairing | Ratio | Result |
|---|---|---|---|
| Eyebrow pill on light | emerald-deep on a mint pill over white or cream | 6.92 | Pass |
| Eyebrow pill in mint sections | emerald-deep on a white pill over mint | 7.65 | Pass |
| Eyebrow pill on green | white on 12% white over green-rich, emerald-deep, green-deep | 7.41, 5.71, 9.43 | Pass |
| | over the glow end `#1e7b3a` | **4.22** | **Fails.** Never placed there: section headers sit at the emerald-deep start of the band |
| Hero emphasis | lime-bright on green-rich | 6.45 | Pass. The hero gradient holds green-rich to 30%, then emerald-deep at 65%, so the phrase's far corner measured on green-rich at 375 and at the green-rich side of the blend at 1280 (rerun the screenshot gate after any copy change) |
| Play chip on thumbnails | white on 85% green-night over a white or black image | 10.01, 16.82 | Pass |
| Region band frames | ink, ink-muted on mint; emerald-deep on cream | 14.88, 6.90, 7.22 | Pass |
| Nav labels | off-white on the header's emerald end, full opacity | 6.22 | Pass |

### Motion and contrast

The scroll reveal fades sections from 0.7 opacity and moves them up 16px.
At 0.7, ink stays at 6.15:1 on white, but emerald-deep (3.73), ink-muted
(3.62) and white on the glow end (3.46) dip below 4.5:1. The dip is
transient: the reveal's range is `entry 0% entry 120px`, so a section is
fully opaque once 120px of it is on screen, and a section straddling the fold
at load never rests part faded. The hero entrance is time based and finishes
within 1 second of load. The H1 rises without fading.

## Dark theme, WCAG 2.2 AA (21 October 2026)

Measured by `npm run contrast`, which now runs every role pairing in both
themes, then the light only rows (loops), the dark only rows (glows, glass,
logo tile) and the theme invariant rows (footer, gold, brand marks). The
light results are unchanged. Values are the dark tokens in
`app/globals.css`; rerun when official brand values arrive.

### Dark tokens

| Token | Value | Role |
|---|---|---|
| surface | night `#0a1510` | Page base, deep green black |
| surface-raised | `#111e17` | Inputs, pills, secondary buttons, cards' raised parts |
| surface-mint, surface-warm, surface-gold | `#10211a`, `#16170f`, `#1c1a10` | Alternating bands, newsletter tints |
| tint | `#163122` | Nav pill, icon wells, skeletons |
| ink, ink-muted | mist `#e9f0ea`, `#a8bcae` | Text |
| emerald-deep (accent) | spring `#8fd3a5` | Links, H1 phrase, TextCTA, focus ring |
| glyph | sprout `#6dbf88` | Icons, rules, progress fills, card glow ring |
| emerald (fill) | `#1e7438` | Primary fill with white text; hover `#1b6b33` |
| eyebrow | lime `#a6c859` | Eyebrow text, dark only |
| glass-card | `#111e17` at 88% | Hero floating cards, newsletter card |

### Text and UI

| Pairing | Surface, raised, warm, mint | Result |
|---|---|---|
| ink | 16.07, 14.83, 15.57, 14.44 | Pass |
| ink-muted | 9.28, 8.57, 9.00, 8.35 | Pass |
| accent (spring) | 10.67, 9.84, 10.34, 9.59 | Pass |
| eyebrow (lime) | 9.78, 9.02, 9.48, 8.79 | Pass. Lime is text in dark only, never a fill |
| glyph (sprout), non-text | 8.39 on surface, 7.54 on mint, 6.32 on tint | Pass |
| focus ring (spring, 3px) | 10.67, 9.84, 10.34, 9.59; 8.04 on tint | Pass |
| White on emerald fill, hover | 5.82, 6.57 | Pass |
| White on emerald fill at the 0.85 reveal start | 4.70 | Pass. `#237f3e` gave 4.11, so the fill was deepened |
| Accent on tint (secondary hover, nav and theme choice current) | 8.04 | Pass |
| Input text on raised, input border | 14.83, 8.57 | Pass |
| Reveal 0.85: muted on mint | 6.40 | Pass (lowest reveal row) |

### Glows, glass and logo

| Pairing | Ratio | Result |
|---|---|---|
| Hero tint peak (16% leaf over night): ink, muted, accent, eyebrow | 13.12, 7.58, 8.71, 7.99 | Pass |
| Hero swirl at its brightest overlap (22% leaf, 6% lime, 28% emerald): ink, muted, accent, lime | 8.91, 5.15, 5.92, 5.42 | Pass. Stronger glows took muted text under 4.5, so these alphas are the ceiling |
| Glass over white, the lightest thing that can sit behind it: ink, muted, accent, lime | 10.37, 5.99, 6.89, 6.31 | Pass |
| Glass over the hero swirl peak: muted | 8.16 | Pass |
| Newsletter glass over the gold glow: muted | 8.40 | Pass |
| Logo tile (white) on night; lid edge on the tile | 18.62, 5.44 | Pass |
| Disabled primary: white on `#3d5a46` | 7.64 | Exempt, recorded |

The footer, gold fills, play chips and the social marks on their white
tiles are the same in both themes; their rows are in the light tables above.

### Header theme switch (21 October 2026)

The switch shows at every width and is styled like the Menu button: an
accent glyph on raised, tint on hover, a glyph border at 55%.

| Pairing (UI, 3:1) | Light | Dark | Result |
|---|---|---|---|
| Accent glyph on raised | 7.65 | 9.84 | Pass |
| Accent glyph on tint (hover) | 6.80 | 8.04 | Pass |

### Academy questions accordion (21 October 2026)

Native `details` and `summary`, each a raised card on the mint band. The
chevron and the open state are carried by the element itself, never by
colour alone.

| Pairing | Light | Dark | Result |
|---|---|---|---|
| Question: ink on surface (text) | 16.47 | 16.07 | Pass |
| Answer: muted on surface (text) | 7.64 | 9.28 | Pass |
| Chevron: glyph on surface (UI, 3:1) | 6.57 | 8.39 | Pass |

The course cards' "Coming soon" badge is the existing ink on gold-soft badge
(theme invariant), and the focus ring rows cover the summary.
| Glyph border at 55% over the hero tint peak | 2.37 | 3.10 | Light below 3, as on the Menu button. Not required: the glyph identifies the control |

## Come alive (revision 5)

Branch `feat/come-alive`, 17 October 2026. Measured with `npm run contrast`.

- The header is no longer sticky or translucent. It floats over the hero
  and page header tints, so its pairings are now ink and emerald-deep over
  the 10% tint peak. The header blur open item above no longer applies.
- Social brand marks sit on 44px white round tiles. Non-text, so 3:1.

| Element | Pairing | Ratio |
|---|---|---|
| Header nav | ink over the hero tint peak | 14.21 |
| Nav current pill | emerald-deep on tint over the hero tint peak | 5.91 |
| Header focus ring (3:1) | emerald-deep over the hero tint peak | 6.60 |
| YouTube mark | #ff0000 on white | 4.00 |
| Facebook mark | #0866ff on white | 4.82 |
| Instagram mark | gradient stops #d62976, #962fbf on white | 4.73, 6.08 |
| | lightest stop #fdbb2d, one corner of the gradient only | **1.70** |
| TikTok and X marks | black on white | 21.00 |
| Linktree mark | darkened Linktree green #1e7a35 on white | 5.40 |
| Not used | Linktree brand green #43e55e on white | **1.67**, so the mark uses the darker green |

## Motion loops (revision 6)

Branch `feat/motion-loops`, 19 October 2026. Short silent decorative loops,
built by `npm run loops:build` from raw clips kept outside the repo in
`house-of-bread-assets/animations-raw`.

### For the ministry to confirm

- **AI generated visuals.** Every loop was generated with Google Flow, an AI
  video tool. The ministry should confirm it is happy to use AI generated
  imagery, and whether and where to say so (for example a line on the About
  page or in the footer).
- **The open Bible loop shows pseudo text.** Its pages carry blurred lines
  that look like print but are not real words. Kept by decision on 18
  October 2026. Regenerate with blank or out of focus pages if anyone reads
  it as garbled Scripture.
- **The Bible loaf loop is not shipped.** The loop point shows a rotation
  jump, and the paper mat under the loaf survived the white key as a hard
  edged grey shape. Regenerate it in Flow on a seamless pure white
  background with one full, even turn, then run `npm run loops:build
  bible-loaf` and `npm run loops:verify bible-loaf`. On the first attempt
  the frame edge decoded to 248 to 252, short of the 253 the check needs, so
  the white may need lifting slightly above video white before encoding.

### Where they play

Phones play no loop and show posters only. The hero's 640 wide version was
dropped after Lighthouse mobile showed it cost Home about 10 points (1 s of
blocking time), so the first video weight on phones is 0. On desktop each
page loads at most one loop first; the rest load as they near the viewport
and pause offscreen. Sizes in KB of 1000 bytes.

| Loop | Where | Loads first | WebM | MP4 | Poster |
|---|---|---|---|---|---|
| ambient-light | Home hero, under an 80% white scrim | Desktop Home | 152 | 550 | 7 |
| dust-light | Inner page headers without a visual, lg and up | Desktop inner pages | 746 | 766 | 18 |
| wheat-field | `/about`, The name | No | 748 | 740 | 50 |
| bread-steam | Behind the newsletter card (11 pages) | No | 576 | 751 | 49 |
| open-bible | `/academy` hero, framed panel beside the text (replaces dust-light there) | Desktop `/academy` | 346 | 744 | 23 |
| water-light | Behind the phone in the app band (6 pages) | No | 743 | 776 | 28 |
| green-mesh | `/about` closing band, lg and up | No | 750 | 757 | 29 |

### Quality given up to meet 800 KB

Each file was first encoded at a quality target. These went over budget and
were re-encoded at the budget bitrate. SSIM compares the shipped file with
the quality target encode (1 is identical). No denoise was needed: the
shipped files are slightly softer, with no blocking, and play in panels
about 40% of the screen wide.

| File | Quality target | Shipped | SSIM |
|---|---|---|---|
| dust-light.webm | 1988 KB | 746 KB | 0.975 |
| dust-light.mp4 | 3366 KB | 766 KB | 0.965 |
| wheat-field.webm | 1937 KB | 748 KB | 0.976 |
| wheat-field.mp4 | 2391 KB | 740 KB | 0.963 |
| water-light.webm | 1335 KB | 743 KB | 0.980 |
| water-light.mp4 | 2937 KB | 776 KB | 0.959 |
| green-mesh.webm | 870 KB | 750 KB | 0.989 |
| green-mesh.mp4 | 1683 KB | 757 KB | 0.980 |
| bread-steam.mp4 | 867 KB | 751 KB | 0.993 |
| open-bible.mp4 | 803 KB | 744 KB | 0.992 |

### Contrast over video, WCAG 2.2 AA

Measured with `npm run contrast` against each loop's darkest single pixel
across every frame of the final WebM (`npm run loops:sample`), since dark
text is at its worst there. The brightest pixel was checked too.

| Element | Pairing | Ratio |
|---|---|---|
| Hero heading | ink, darkest pixel, 80% scrim | 11.31 |
| Hero lead and eyebrow | ink-muted, emerald-deep, darkest pixel, 80% scrim | 5.25, 5.26 |
| Hero heading | ink, brightest pixel, 80% scrim | 16.47 |
| Header nav current pill | emerald-deep on tint, darkest pixel, 80% scrim | 4.75 (4.31 at 75%, so the scrim is 80%) |
| Focus ring over the hero (3:1) | emerald-deep, darkest pixel, 80% scrim | 5.26 |
| Hero floating cards | ink-muted, emerald-deep on 84% white, 20% scrim | 6.04, 6.06 |
| App band card over water | ink-muted, emerald-deep on 84% white | 5.83, 5.84 |
| Newsletter card over steam | ink, ink-muted, emerald-deep on 84% white over black | 11.35, 5.27, 5.28 |
| Newsletter card over steam | ink-muted, brightest pixel | 7.64 |
| Pause/Play control (3:1) | emerald-deep glyph on 90% white over black | 6.10 |

### Lighthouse mobile on this machine

Interleaved runs against a build of `main`, three each. Home: `main` 61 to
74, branch 66 to 76. About: `main` 69 to 72, branch 70 to 76. Accessibility
100 and CLS 0 throughout. `main` itself misses 95 here, so the absolute
score needs a rerun on CI or a real mid range Android phone.

## Home revisions (revision 7, 19 October 2026)

Branch `feat/simplify-flow`. Transparent logo, start here video, 3D card
icons, the weekly live session with times by region, and image slots.
Third party artwork is credited in `docs/CREDITS.md`.

### Contrast, WCAG 2.2 AA

Measured with `npm run contrast`. Text 4.5:1, non-text 3:1.

| Element | Pairing | Ratio |
|---|---|---|
| Session times by region | ink, ink-muted, emerald-deep ("Your time") on white | 16.47, 7.64, 7.65 |
| Session times clock glyph (3:1) | emerald on white | 6.57 |
| Weekly card date panel | ink on mint | 14.88 |
| Image slot caption | ink on a solid white pill | 16.47 |
| Card glow ring (3:1) | emerald on white, mint, cream | 6.57, 5.94, 6.19 |
| Card reveal start, 0.85 opacity | ink, ink-muted on cream; emerald-deep on mint; white on emerald | 9.94, 4.96, 4.91, 5.25 |
| Logo lid edge (3:1) | on white; over the hero tint peak | 5.44, 4.69 |
| Footer logo tile (3:1) | white tile on green-deep | 13.53 |
| Logo lid edge on green-deep, no tile | not used: the reason the footer keeps its tile | 2.49 |

The 3D icon wells (tint on white) and the flag outlines are decorative and
carry no meaning, so they have no threshold.

### Lighthouse mobile and no script (19 October 2026)

- Home, production build, two runs on this machine: performance 58 and 64,
  accessibility 100 both times, CLS 0, LCP 3.9 to 4.2 s, TBT 920 to 1,290
  ms. `main` scored 61 to 74 here earlier, so this machine cannot show 95
  either way; rerun on CI or a mid range Android phone.
- Without script, the server HTML carries all six region times and no "Your
  time" row, as designed. But every page under `app/(marketing)` (Home,
  Events, About, Privacy, and the base commit before this branch) sends its
  `<main>` inside the `(marketing)/loading.tsx` Suspense boundary as a
  hidden streamed chunk that only script reveals, so a visitor without
  script sees the loading skeleton. A test build without that file put
  `<main>` inline on every page. To decide: remove or narrow `loading.tsx`.

### No script check after removing loading.tsx (20 October 2026)

- `(marketing)/loading.tsx` is removed. `node scripts/check-html.mjs <base>`
  passes on all 20 routes: each sends its `<main>`, h1 and key sentence in
  the first HTML. `scripts/check-noscript.mjs` confirms the same in
  Chromium with JavaScript off for Home, About, Academy, Media, Events, App,
  Contact and Subscribe.
- Three local Suspense boundaries remain: the Start here video, the Media
  Library video grid, and the Events latest session player and title. Each
  fallback measures the same height as its content at 375, 768 and 1280px.
  Video titles there are clamped to two lines with two lines reserved.
- React still streams those three boundaries as hidden chunks, even though
  the pages are static, so without script their skeleton stays. Each
  fallback now carries a plain "Watch on YouTube" link, reachable by Tab.
- An unknown slug (for example `/teachings/xyz`) returns 404, but Next sends
  it as a script only payload, so without script the page is blank.
  `dynamicParams` is not available with Cache Components.

## Hero revamp amendments (23 October 2026)

Branch `feat/hero-revamp`. Dark loops, a new green mesh clip, and one
Motion control in place of every Pause/Play button.

### Dark clips: mapping and checks

Supplied in `house-of-bread-assets/animations-dark` (not `animation-dark`,
and already outside the repo), moved into `animations-raw` and renamed by
content. Every frame was measured for flicker (none in any clip) and
contact sheets were checked for faces and readable text.

| Raw file | Clip | Content | Verdict |
|---|---|---|---|
| Light_drifting_in_dark_void | 1, ambient light | Green and amber light through smoke on near black | Used from 4.2 s only: until about 3.75 s the smoke edge reads as a face in profile. Ping-pong over the last 3.8 s |
| Golden_dust_floating_in_light | 2, dust | A river of gold dust over soft green | Used whole, 2 s crossfade |
| Wheat_stalks_swaying_in_field | 3, wheat | Wheat at dusk, camera dollies | Ping-pong, as the light clip |
| Open_book_on_table | 5, Bible | Open book under a lamp | Used for the first 2.75 s only: the push in then sharpens the page into letter shaped glyphs |
| Emerald_light_on_dark_water | 6, water | Gold and emerald caustics | Used whole, 1 s crossfade |
| Artisan_bread_loaf_shaped_like | 8, loaf | A Bible shaped loaf tumbling on black | Not shipped: mid turn its ridges turn mould green and a full turn cannot loop. The last 2 s rock cleanly, so the config keeps that entry with `ship: false`, as the light loaf is not shipped either |

No dark clip was supplied for 4 (bread steam) or 7 (green mesh), so those
kept their still glows in dark until the clips below arrived ("Dark clips
4 and 7").

### Clip 7 replaced

`Green_gradient_mesh_abstract_shot_20261022232009.mp4`: teal to green satin
with soft folds and a fine glitter, rolling slowly under a diagonal
highlight. It replaces `clip-7.mp4` as `green-mesh`, the About closing band,
with a 2 s crossfade.

### Files, KB of 1000 bytes

| Loop | WebM | MP4 | Poster | Loop length | Budget encode (SSIM vs quality target) |
|---|---|---|---|---|---|
| green-mesh | 515 | 745 | 19 | 5.46 s | MP4 0.986 |
| ambient-light-dark | 263 | 739 | 7 | 7.58 s | MP4 0.994 |
| dust-light-dark | 747 | 795 | 44 | 4.71 s | WebM 0.940, MP4 0.930 |
| wheat-field-dark | 748 | 743 | 59 | 6.00 s | WebM 0.973, MP4 0.961 |
| open-bible-dark | 281 | 570 | 20 | 5.00 s | none |
| water-light-dark | 747 | 767 | 35 | 5.75 s | WebM 0.961, MP4 0.943 |

Dust in dark lost the most to the budget. At 1:1 it shows no blocking, and
it plays in a panel about 40% of the screen wide.

### Contrast over the dark hero loop

The hero scrim in dark is night at 80% (20% behind the phone), where it was
transparent over the still glow. Measured against the dark loop's brightest
pixel (#aece9b, `npm run loops:sample`).

| Element | Pairing | Ratio |
|---|---|---|
| Hero heading | mist, 80% night scrim | 10.39 |
| Hero lead | mist-muted, 80% night scrim | 6.01 |
| H1 phrase, TextCTA, focus ring | spring, 80% night scrim | 6.90 |
| Eyebrow | lime, 80% night scrim | 6.33 |
| Header nav current pill | spring on night tint | 8.04 |
| Hero floating cards | mist-muted, spring on dark glass, 20% scrim | 7.04, 8.09 |
| App band card over dark water | mist-muted, spring on dark glass over white | 5.99, 6.89 |

The Pause/Play control row above (6.10) is retired with the control. The
Motion control reuses the theme choice's pill pairings.

### Motion control and the loop check

`node scripts/check-loops.mjs <base>` in Chromium at 1280px: every loop
starts by itself, muted and inline; plays through its restarts; pauses
offscreen and resumes on return; keeps playing across a theme change; and
stops only for Motion Off, Save-Data or prefers-reduced-motion (an explicit
Motion On wins over reduced motion). With Motion Off no loop video plays or
shows on Home, About or Academy, after a reload too. The footer control is
reached by Tab with a 3px ring; the menu control is 46px tall at 375px.

Restart gap, VP9 WebM, final run. A frame at 24 fps is 41.7 ms; on a 60 Hz
screen it shows for 33 or 50 ms. No restart skipped a frame or showed a
blank frame, and no clip needed fixing.

| Loop | Light gap ms | Dark gap ms | Picture change at the restart (light, dark) |
|---|---|---|---|
| ambient-light (Home hero) | 64, 69 | 47, 63 | 1.18x, 1.09x a frame step |
| dust-light (page headers) | 76, 72 | 72, 66 | 1.05x, 1.15x |
| open-bible (Academy hero) | 71, 48 | 70, 55 | 1.22x, 1.30x |
| water-light | 66 | 69 | 1.16x, 0.99x |
| wheat-field | 69 | 72 | 1.20x, 1.00x |
| green-mesh | 55 | poster only | 1.07x |
| bread-steam | 57 | poster only | 1.59x |

A separate timing only run of 30 restarts (dark ambient light, green mesh)
gave 36 to 73 ms and no skipped frame. Earlier runs that read pixels back on
every frame showed stalls up to 333 ms; that was the check itself, so pixels
are now read only around the restart, in a pass of their own.
`npm run loops:seams` decodes every WebM and MP4: each wrap is within 2.1x
an ordinary frame step (most near 1x) and no file has flicker.


## Phone loops (23 October 2026)

Branch `fix/phone-loops`, off `feat/hero-revamp`. Not merged; waiting for
review.

### What changed

- Only the Home hero (ambient light) and the Academy hero (open Bible) play
  on phones, 767px and below. Every other loop stays a poster there.
- Each has a phone rendition in light and dark: a centred crop of the 1280 x
  720 master, 12 fps (every second source frame), a 4 s loop that opens on
  the poster's frame, no audio. Home is 2:3 (480 x 720), so it covers the
  hero at every phone width (0.26 at 375px up to 0.63 at 767px) while
  scaling exactly like the 16:9 poster. Academy is 4:3 (536 x 402), the
  panel's shape.
- Academy now shows its framed loop panel on phones, below the text, 448px
  wide at most, with its poster loaded first. Tablets (768 to 1023px) still
  show no panel.
- No loop video exists until window load, an idle moment and then
  `LOOP_START_DELAY_MS` (3 s, in `lib/media/loops.ts`) have passed, on every
  screen. Until then the poster stands alone, and the video fades in over it
  from the same frame. Sources are added only as a loop nears the viewport,
  phone files first with `<source media="(max-width: 767px)">`, WebM before
  MP4.
- A slow connection (effectiveType slow-2g, 2g or 3g) keeps every loop a
  poster, as Save-Data and Motion Off do.

### Files, KB of 1000 bytes (budget 200)

| Loop | WebM | MP4 | Size, fps, length |
|---|---|---|---|
| ambient-light-phone | 29.6 | 151.2 | 480 x 720, 12 fps, 4.00 s |
| ambient-light-dark-phone | 40.0 | 165.2 | 480 x 720, 12 fps, 4.00 s |
| open-bible-phone | 41.3 | 70.4 | 536 x 402, 12 fps, 4.00 s |
| open-bible-dark-phone | 56.5 | 86.4 | 536 x 402, 12 fps, 4.00 s |

All met the quality target with no budget re-encode. Each first frame
matches its poster's crop (SSIM 0.980 to 0.996). `npm run loops:seams`:
every wrap is 0.65x to 0.85x an ordinary frame step, no flicker.

### Contrast

`npm run loops:sample`: the light phone crop's darkest pixel (#1c7034) is
lighter than the full loop's (#00402b), and the dark crop's brightest
(#94b981) is darker than the full loop's (#aece9b), so the logged hero
pairings are the worst case on phones too. The Academy panel carries no
text.

### Loop check, final run

`node scripts/check-loops.mjs` runs at 1280px and 375px in light and dark
(`ONLY=phone` or `ONLY=desktop` runs one half). It reads
`LOOP_START_DELAY_MS` from `lib/media/loops.ts`, and watches a loop that
should stay still for the delay plus 3 s, so a broken stopper cannot pass
by not having started yet. All checks passed.

- At 375px only the two heroes play, from their phone file, in light and
  dark; every other loop shows its poster.
- At 375 and 767px the poster shows alone and fully opaque halfway through
  the delay, the video is created 3.11 to 3.16 s after window load, covers
  exactly its poster's box, and nothing shifts (CLS 0).
- Offscreen pause, a theme switch, the footer and menu Motion control,
  reduced motion, Save-Data, 2g and 3g all behave on both screens.

| Loop | View | Light gap ms | Dark gap ms | Picture change at the restart (light, dark) |
|---|---|---|---|---|
| ambient-light | phone | 61, 82 | 20, 119 | 0.60x, 0.59x a frame step |
| open-bible | phone | 69, 119 | 81, 106 | 0.66x, 0.80x |
| ambient-light | desktop | 72, 36 | 70, 53 | 1.18x, 1.09x |
| open-bible | desktop | 52, 61 | 49, 57 | 1.22x, 1.30x |

A frame lasts 83.3 ms at 12 fps (freeze limit 167 ms) and 41.7 ms at 24
fps (limit 84 ms). No skipped or blank frame. Three stalls mid loop (216 to
552 ms) remeasured clean (84 to 86 ms worst gap): the machine, not the
files.

### Lighthouse mobile, Home

Interleaved runs on this machine, `feat/hero-revamp` (before) against this
branch (after), production builds side by side.

Without the start delay (loop at load plus idle), light, 5 runs each:

| | Before | After |
|---|---|---|
| Scores | 69, 91, 84, 79, 91 | 86, 76, 73, 89, 76 |
| Median | 84 | 76 |

The loss was almost all Speed Index (1.3 to 2.7 s before, 2.7 to 3.3 s
after in every pair): the loop started about 1 s into the trace and the
moving background kept the page from reading as visually complete.

Final, with the 3 s start delay:

| | Before | After |
|---|---|---|
| Light, 5 runs | 72, 78, 94, 92, 90 | 88, 81, 93, 90, 84 |
| Median, light | 90 | 88 |
| Dark, 3 runs | 60, 84, 70 | 91, 82, 84 |
| Median, dark | 70 | 84 |

- Light is 2 points down at the median, inside the 2 point limit and
  inside this machine's noise (pairs differ by up to 16 points).
- Dark favours the branch only because two baseline runs had 1.8 and 2.4 s
  of blocking time; that is the machine, not the branch.
- No trace contains a loop request: Lighthouse has stopped recording before
  the 3 s are up. Phones still download the loop, only later. CLS is 0 and
  LCP is the hero heading in every run (the 7 KB poster is too plain for
  Chrome to count), so the poster is never the LCP and never delayed.
- These scores are from a busy desktop. Rerun on CI or a mid range Android
  phone before trusting the absolute numbers.

## Dark clips 4 and 7 (23 October 2026)

Branch `feat/dark-clips-4-7`. `clip-4-dark.mp4.mp4` (bread steam) and
`clip-7-dark.mp4.mp4` (green satin) in `animations-raw`, used as named (the
doubled extension came with them). Every loop now has a dark rendition, so
no loop falls back to its still glow in dark. The glows stay in
`app/globals.css` beneath the dark posters.

### Checks and seconds used

Every frame was measured at 320 x 180 (mean brightness, black level,
flicker, green on the crust) and contact sheets were read for faces, letter
shapes and seams. Neither clip flickers (largest brightness jump against
both neighbours: 0.91 and 0.92 levels of 255).

| Clip | Slot | Used | Rejected, and why |
|---|---|---|---|
| 4, bread steam | Newsletter card | 1.50 to 7.17 s (frames 36 to 171), 2 s crossfade, 3.67 s loop | 0 to 1.5 s: the steam builds from nothing, and at 0.8 to 1 s parts into twin curls. 7.33 s on: two mirrored scroll curls round a central column read as a horned head |
| 7, green satin | About, closing band | 2.67 to 7.96 s (frames 64 to 190), 0.67 s crossfade, 4.63 s loop | 0 to 2.67 s: the satin slides in from the left and brightens |

- No frame pair in the steam matches closely (every pair is about five
  times an ordinary frame step), so its loop point is fixed at the ends of
  the clean span for length, and the plumes dissolve. Steam run backwards
  sinks, so no ping-pong.
- The satin's edges match at frames 64 and 191 but drift apart either
  side. A 2 s dissolve showed two top edges at once (up to 26 of 180 rows
  apart); 0.67 s keeps them within 11 rows. Two longer dissolves were built
  and rejected for this.
- Mould green: no pixel on the crust (hue 70 to 170 degrees) in any frame.
- Black level: the steam's background was RGB 18, 13, 7 and the satin's 9,
  9, 9. Both are pulled to near black in processing (`blacks` in
  `scripts/loops/config.mjs`): now 3, 1, 1 and 1, 1, 1. Dark loops are not
  blended with the page (no `mix-blend-mode`); they draw opaque in their
  frames.
- Phones: neither slot is a hero, so both stay a poster on phones
  (`WITH_PHONE`). No phone rendition was built.

### Files, KB of 1000 bytes (budget 800)

| Loop | WebM | MP4 | Poster | Loop length | Budget encode (SSIM vs quality target) |
|---|---|---|---|---|---|
| bread-steam-dark | 266 | 497 | 39 | 3.67 s | none |
| green-mesh-dark | 667 | 742 | 19 | 4.63 s | MP4 0.983 (quality target 1350 KB) |

### Contrast in dark

Text over either clip sits only in the newsletter card: dark glass
(night raised at 88%) over the steam. Measured against the steam's brightest
pixel over every frame (#fffad9, a crust highlight, `npm run loops:sample`;
brightest frame #22, mean luminance 0.093).

| Element | Pairing | Ratio |
|---|---|---|
| Heading, labels | mist on dark glass over #fffad9 | 10.49 |
| Lead, consent text | mist-muted on dark glass over #fffad9 | 6.06 |
| Privacy policy link | spring on dark glass over #fffad9 | 6.96 |

The About closing band carries no text over its loop (a framed panel
beside the text). The satin's brightest pixel is #e2ffe9.

### Loop check

`npm run loops:seams`: wrap 1.15x (WebM) and 1.19x (MP4) an ordinary frame
step for the steam, 0.98x and 0.99x for the satin, no flicker.
`node scripts/check-loops.mjs` at 1280px and 375px, light and dark: all
checks passed. No restart skipped or blanked a frame.

| Loop | Light gap ms | Dark gap ms | Picture change at the restart (light, dark) |
|---|---|---|---|
| bread-steam | 60 | 65 | 1.59x, 1.32x a frame step |
| green-mesh | 71 | 67 | 1.07x, 1.08x |

Motion Off, reduced motion, Save-Data, 2g and 3g keep every loop still in
both themes, as before.

## Copy and design reset, phase 1 (27 October 2026)

Branch `feat/reset`, from `docs/RESET-BRIEF.md`. Design system, header,
footer and Home only. This section supersedes the glass, gradient, card
motion and header rules in the White and green redesign, Come alive and
Dark theme sections above wherever they disagree.

### What changed in the tokens

- `--brand-cream` is now `#f7f3ec` (warm cream band). Pale green stays `surface-mint`.
- New `--fill-primary`: `green-deep` (#0a3616) in light, `emerald-night` (#1e7438) in dark. `--fill-hover` is emerald in light.
- New `--header-glass`: white at 94% in light, night at 94% in dark. The header is the only translucent surface. No backdrop-filter.
- New `--text-statement`: clamp(2.5rem, 6vw, 5rem), line height 1.04. The Home hero and mission only.
- Buttons are pills (`--radius-button` 9999px). The secondary is an outline with a full strength glyph border.
- Removed: `glass-card`, the hero, page and panel radial gradients (the utilities are now flat), the halo, card glow, card motion, lift, rise animations and the footer signup strip.

### For the ministry to confirm

| Item | Where | Shown as |
|---|---|---|
| Full ministry name | Footer, Home teacher line | [House of Bread Ministries International] |
| Lessons per course and minutes per lesson | Home course cards | [6] lessons, about [20] minutes each, until `lessons` and `minutesPerLesson` are set in each class file |
| The foundations course and the book by book course | Home rows 01 and 02 | Link to the first and second courses in the catalogue until named |
| A beliefs page or section | Footer and Home "What we believe" | Links to /about#handled (How Scripture is handled) |
| Photo of Isaac Ola teaching (hero) and a portrait (teacher section) | Home | Hero loop; `home-teacher` slot |

### Reset pairings, WCAG 2.2 AA (npm run contrast)

| Pairing | Light | Dark |
|---|---|---|
| Primary pill: white on fill-primary | 13.53 | 5.82 |
| Primary pill hover: white on fill-hover | 6.57 | 6.57 |
| Secondary outline: accent on surface, warm, mint | 7.65, 6.92, 6.92 | 10.67, 10.34, 9.59 |
| Secondary outline border: glyph on surface, warm, mint | 6.57, 5.94, 5.94 | 8.39, 8.13, 7.54 |
| Secondary outline border over the hero loop (light darkest pixel, dark brightest) | 4.51 | 5.43 |
| Ink, muted, accent and eyebrow on the new cream | 14.89, 6.91, 6.92, 6.92 | 15.57, 9.00, 10.34, 9.48 |
| Header glass over its worst background (black in light, white in dark): ink | 14.41 | 13.93 |
| Header glass: accent (Menu label) and focus ring | 6.70 | 9.25 |
| Header glass: Menu border, glyph | 5.75 | 7.27 |
| Numbered rows: number (accent) and arrow (glyph) on mint | 6.92, 5.94 | 9.59, 7.54 |
| Phone menu: ink links on surface | 16.47 | 16.07 |
| Footer store badge: green-deep on white | 13.53 | same |

Numbered row dividers are decorative hairlines (1.19 and 1.25), as before.

### Home height (Playwright, production build)

| Width | main | Whole page (header, main, footer) |
|---|---|---|
| 375px | 4,969px | 5,943px |
| 1280px | 4,986px | 5,477px |

The Academy cards carry three line placeholder summaries; real one line promises will shorten the phone page by about 150px.

## Phase 1 corrections (28 October 2026)

Branch `feat/reset`, after the Phase 1 review. Supersedes Phase 1 above on
the nav, buttons, loops and motion.

- Nav back to main's five links (Home, Academy, Teachings at `/media`, About, Contact), Browse free courses as the header button, the theme icon switch in the header at every width.
- Buttons only: `TextCTA` is gone. Primary, secondary and a new tertiary (soft fill for cards and rows), sizes md (48/52px) and sm (44px), no arrows. Press states by colour.
- Every page has an animated hero (`HeroBackdrop`). No loop sits in a lower panel any more (About wheat, App band water, newsletter steam, closing band mesh removed).
- Text motion: the Home mission types itself out once; section headings reveal line by line once. The scroll linked `.reveal` fade is removed.
- Dark cream band: `--brand-night-warm` from `#16170f` (brown olive) to `#112018` (dark green tint).
- Footer socials: the icon row shows the ministry YouTube channel only (six tiles, one row at 375px). Both channels stay labelled on `/media`.
- Motion showed "Off" in the Phase 1 screenshots because that screenshot script set `reducedMotion: "reduce"`. The site default was and is On (no saved choice and no reduced motion gives On; `motion.test.ts`).

### Hero loop per page

| Page | Loop | Phones |
|---|---|---|
| Home | ambient-light | phone loop (2:3 crop) |
| Academy | open-bible | phone loop (4:3 crop) |
| Academy course page | open-bible | poster |
| Teachings (`/media`), series and teaching pages | none: a plain hero, after BibleProject (29 October 2026). water-light is now in no hero; its files stay until the ministry decides | none |
| Teachings articles (`/teachings`, `/teachings/[slug]`) | dust-light | poster |
| Events, event page | dust-light | poster |
| About | wheat-field, under the night overlay (29 October 2026) | poster |
| New Testament, book pages | open-bible | poster |
| Plans, plan page | wheat-field | poster |
| App | green-mesh | poster |
| Ask, Ask sent | dust-light | poster |
| Contact | bread-steam | poster |
| Subscribe, check email, Academy waitlist | bread-steam | poster |
| Privacy | green-mesh | poster |
| 404 | green-mesh | poster |

On phones the Home and Academy loop frame keeps its crop's shape, covers
the hero and is clipped (`PHONE_FRAME` in `HeroBackdrop.tsx`), so poster
and video line up at any hero height. Inner pages now load their hero
poster on phones too (7 to 59 KB webp each).

### Scrim over every loop (npm run loops:sample, 27 October 2026)

The darkest pixel across all seven light loops is pure black, and the
brightest across the dark loops is pure white, so one 80% scrim per theme
is checked against those.

| Pairing | Light (white 80% over black) | Dark (night 80% over white) |
|---|---|---|
| Heading, ink | 10.25 | 8.70 |
| Lead, muted | 4.76 | 5.03 |
| Eyebrow (emerald-deep; lime in dark) | 4.77 | 5.30 |
| Accent and focus ring | 4.77 | 5.78 |
| Secondary outline border (3:1) | 4.09 | 4.54 |
| Secondary hover, accent on the solid tint | 6.80 | 8.04 |

### Night hero, About (29 October 2026)

The ministry asked for the wheat field under a dark overlay, with the
title and lead bold, centred and smoothing in. `PageHeader tone="night"`
holds night at 80% across the whole width (`hold={100}`) in both themes,
and the hero and the header over it take the dark roles (`.tone-night`).
`npm run loops:sample`: the light wheat loop's brightest pixel is
`#ffffd2` (L 0.974), the dark one's `#fffff1`, so the overlay cannot be
lighter than 80% and is checked over pure white, the same in both themes
(`npm run contrast`, role pairings "Night hero" and "Night header").

| Pairing | Ratio |
|---|---|
| Title and lead, mist | 8.70 |
| Muted, mist muted | 5.03 |
| Eyebrow, lime | 5.30 |
| Menu label and focus ring, spring | 5.78 |
| Current nav pill, spring on night tint | 8.04 |
| Menu border, sprout (3:1) | 4.54 |

The header mark takes the dark theme's white tile over it.

### New pairings, WCAG 2.2 AA (npm run contrast)

| Pairing | Light | Dark |
|---|---|---|
| Primary press: white on fill-press (green-night; `#175a2b` in dark) | 15.81 | 8.29 |
| Secondary press: accent on tint-strong | 6.01 | 6.68 |
| Tertiary: accent on tint-strong | 6.01 | 6.68 |
| Tertiary hover and press: accent on tint-press | 5.28 | 5.27 |
| Tertiary press ring: glyph on tint-press (3:1) | 4.53 | 4.14 |
| Typewriter cursor: glyph on the warm band (3:1) | 5.94 | 7.61 |
| Ink, muted, accent, eyebrow on the dark warm band (`#112018`) | | 14.57, 8.42, 9.67, 8.87 |
| Free badge: ink on gold-soft | 11.85 | same |
| Announcement button: ink outline on gold | 9.02 | same |
| Footer secondary press: white on 25% white over green-deep | 6.22 | same |

The 0.85 reveal pairings are removed with the reveal.

### Text motion and layout shift

The typewriter first moved its cursor inside the text. Generated content
at the split point breaks text shaping, so a half typed word grew by
about 1.7px and could drop to a new line for a frame (a 0.0018 layout
shift at 767px). The text now holds only an empty marker span, the cursor
is a separate bar moved by transform, and the heading uses plain wrapping
rather than balance. Measured after: no layout shift at 375 or 767px.

### Home height (Playwright, production build, 28 October 2026)

| Width | Whole page (header, main, footer) |
|---|---|
| 375px | 6,419px (5,943px after Phase 1) |
| 1280px | 5,443px (5,477px after Phase 1) |

The phone page grew by the full width teacher photo (4:5 at 343px wide)
and the buttons that replaced text links. Real one line course promises
would take about 150px off.

## Reset fixes 3 (28 October 2026)

### Hero scrim

From lg the scrim holds 80% over the text column and then eases to 6%
over the next 20% of the width (`hero-scrim` in app/globals.css), where
it used to fall in a straight line from 80% at 60% to 20% at the right
edge. The hold is 60% on inner pages and 70% on Home, whose heading ran
to 67% at 1024, past the old 60% hold. Below lg the text spans the hero,
so the scrim stays 80% there. `scripts/check-noscript.mjs` now fails if
hero text crosses the hold (measured at 1024, 1280 and 1920 on ten pages;
the closest is Home at 1024, 67.0% against 70%).

Text inside the hold sits on the same 80% scrim as before, so its
contrast is unchanged. `npm run loops:sample` on 28 October 2026 gave the
same worst pixels: pure black across the light loops, pure white across
the dark ones. Dark text in light is worst over the darkest pixel; light
text in dark is worst over the brightest.

| Pairing (minimum 4.5, borders 3) | Light | Dark |
|---|---|---|
| Heading, any loop | 10.25 | 8.68 |
| Lead, muted, any loop | 4.76 | 5.02 |
| Eyebrow and accent, any loop | 4.77 | 5.28 (lime), 5.76 (spring) |
| Secondary outline border, any loop | 4.09 | 4.53 |
| Lead over the Home loop's own worst pixel (`#00402b` light, `#aece9b` dark) | 5.26 | 6.00 |

### Home teaching block with a short feed

It lays out only the videos it has (`components/shared/home-teachings-layout.ts`):
the lead alone full width (the featured video when the feed fails), two
side by side from sm, the lead with two stacked cards from lg, and the
full layout with three. Checked by screenshot with 0 to 4 videos at 375,
768 and 1280. The skeleton draws the full layout, so with a short feed the
block changes height when it arrives (below the fold, by about 230px at
1280 for a lone video).

### Home height (Playwright, production build, 28 October 2026)

Two course cards below 768px, three from 768. Section padding 40px on
phones (was 48), hero bottom 48px on phones (was 80), numbered rows 20px
(was 28), the teacher photo 144px wide on phones (was full width), and a
few inner gaps 32px (were 40).

| Width | Whole page, full feed |
|---|---|
| 375px | 5,681px (6,475px before) |
| 1280px | 5,439px (5,443px before) |

The footer is 855px of the 375 figure.

## Carry-over fixes (28 October 2026)

### Hero scrim, light

The light loops are pale (the Home loop's average luma runs 189 to 197 of
255), so from lg the light scrim now clears to nothing past the text
column (`--scrim-tail: 0%`) and eases out over 15 points of the width
instead of 20. Dark keeps its 6% trace. The text column keeps the full
80% scrim, so every pairing in "Reset fixes 3" is unchanged.

If the Home loop still reads too faint, the next step is a stronger light
clip: re-grade `clip-1.mp4` in `npm run loops:build` (a gentle contrast
and saturation lift so the ribbon reaches about luma 150 at its deepest
green), or replace it with a clip whose colour fills the right half. Both
need `npm run loops:sample` and the contrast check again.

### Motion default in screenshots

Motion defaults to On for a visitor with no saved choice and no reduced
motion setting (`themeScript`, `resolveMotion`). The Phase 1 screenshots
showed Off because the throwaway screenshot script emulated
prefers-reduced-motion. `scripts/screenshots.mjs` now takes every
screenshot with no reduced motion (REDUCED=1 to emulate it), after
scrolling the page so reveals and the typewriter have run.

### Teacher photo on phones

Back to full width above the text, as the brief says (screen 6). Home at
375 is 5,910px with the full feed (5,681px with the 144px photo).

## Phase 2 reset (28 October 2026)

Every page now follows docs/RESET-BRIEF.md section 5, in Home's rhythm,
ending with a `NextStep`. Launch inputs are gathered in
`docs/LAUNCH-CHECKLIST.md`.

### Decisions

- Where the brief gives a heading but no line, or a section with no copy,
  existing approved lines are reused (Home's "Our free courses take you
  through it, one lesson at a time." and "Sit under the teaching of the
  Word, wherever you are.") and new section headings are question led:
  "Which course will you start with?", "Ready for the next course?",
  "Ready to go deeper?", "Ready to start?", "Want a guide through it?",
  "Want to talk to someone?", "Who teaches?", "What's in the app?",
  "Which pace suits you?", "How does a journey work?", "Why does the order
  matter?", "What does each introduction cover?", "Which book will you
  read?", "What would you like to read?", "What else is coming up?".
- About's story (96 words) is written from the brief's three points; the
  John 6:33-35 block beside it carries the full quotation, and Strong's
  H1035 (Beyth Lechem) is woven in.
- Academy: the status line and Notify me button stay in the hero; the
  steps, why, questions (FAQ) and inline waitlist card are gone. The FAQ's
  open questions (free or paid, access length) are in the checklist.
- Course pages gain optional `outcomes`, `outline` and `teacher` in the
  class schema and the academy seam; until supplied they show marked
  placeholders. A course without a join link keeps the waitlist button.
- Section headings lose the short emerald rule, so inner pages match Home.
- Teachings (/media): audio, social, read and study and the live card are
  gone; both YouTube channels, written teaching, the New Testament and the
  plans stay one link away in a sentence (links in sentences are allowed).
- Events: only the session times block and any dated event stay; the
  player went, so /events no longer frames YouTube.
- Newsletter cards and app bands are gone from every page; signup lives on
  /subscribe and the footer link, the app on Home and /app.
- The Subscribe page drops its "What to expect" panel, which promised
  reminders and news the brief's "Nothing else." rules out; the form and
  its optional live reminder box are unchanged.
- The share image carried "Come and be fed by the Word."; it is rebuilt
  with the Home headline by `scripts/og/build-og.mjs`.
- Unused image slots stay in the registry for later: about-mission,
  academy-teacher, events-how-it-works and the four app slots.

### Retired button labels

Mapped to the brief's table where one fits, otherwise to a plain verb.
`lib/content/reset-copy.test.ts` fails if an old label returns.

| Old | Now |
|---|---|
| Join a live session, Contact the ministry (About closing band) | Removed with the band; About ends with Browse free courses, and Send a message (plain verb) in its contact section |
| See the course (Academy cards) | Start this course |
| Join this course, See how to join (course page) | Start this course (to the join link), or Notify me when the Academy opens until a course opens |
| Set a reminder | Removed with the session cards; reminders live on /subscribe |
| Watch on YouTube, Watch live on YouTube, Play here | Watch now |
| Add to calendar (always disabled) | Removed; the calendar placeholder note stays until dates exist |
| Listen on ... | Removed with the audio section |
| See what is inside (App hero) | Removed; the list follows the hero |
| Subscribe for new teaching | Get new teaching by email (plain verb, empty states only) |
| Stay close to the ministry (Subscribe H1) | New teaching in your inbox (brief) |
| Browse all 27 books | See all 27 books (plain verb) |
| Read this book in the app, Start a journey in the app | Get the app |
| Compare the three paces | See all three journeys (plain verb) |
| View journey | See this journey (plain verb) |
| Details (event cards) | See the details (plain verb) |
| Back to the home page | Go home (brief, 404) |
| Ask another question (sent page) | Ask a question; the in-form reset after sending keeps Ask another question, as a form verb |

### Performance and launch readiness (28 October 2026)

Mobile Lighthouse 13.4.1, production build on this machine, medians of
three interleaved runs. The machine was busy (another dev server running),
and blocking time swung from 0.5 to 3.9 s between identical runs, so only
the relative picture holds. Windows is in dark mode, so default headless
runs measured the dark theme; light runs set preferredColorScheme.

| Page | Theme | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| Home | light | 68 | 100 | 100 | 63 | 3.73 s | 0 | 860 ms |
| Home | dark | 58 | 100 | 100 | 63 | 4.15 s | 0 | 1,766 ms |
| Academy | light | 70 | 100 | 100 | 63 | 3.79 s | 0 | 761 ms |
| Academy | dark | 53 | 100 | 100 | 63 | 4.72 s | 0 | 1,259 ms |
| Teachings | light | 66 | 100 | 100 | 63 | 4.14 s | 0 | 805 ms |
| Teachings | dark | 62 | 100 | 100 | 63 | 4.28 s | 0 | 845 ms |
| About | light | 71 | 100 | 100 | 63 | 3.55 s | 0 | 801 ms |
| About | dark | 64 | 100 | 100 | 63 | 4.09 s | 0 | 940 ms |

- SEO 63 is the global noindex flag alone (`is-crawlable`); every other
  SEO audit passes. It clears when noindex is turned off at launch.
- LCP is the hero poster. Observed LCP on Home is 0.74 s; the simulated
  3.5 to 4.7 s is Lighthouse's slow 4G model applied to 166 KB of
  framework script (React DOM 73 KB, the Next runtime 48 KB) and 70 KB of
  fonts, plus main thread time on this machine.
- Fixed: in dark the hero's dark poster loaded lazily, after layout, and
  was the LCP with a 300 to 500 ms load delay. `LoopVideo` now preloads
  it for prefers-color-scheme: dark only; the delay fell to 30 to 100 ms.
  Light visitors do not fetch it.
- Rerun on the Vercel preview before trusting absolute numbers.

Page weight at 375, everything transferred after load, a full scroll and
7 s (loops included, cache off):

| Page | Light KB (loop) | Dark KB (loop) |
|---|---|---|
| Home | 418 (30) | 433 (41) |
| Academy | 408 (42) | 432 (57) |
| Course page | 369 | 379 |
| Teachings | 457 | 473 |
| About | 369 | 396 |
| Ask | 361 | 383 |
| App | 364 | 372 |
| Events | 360 | 382 |
| Subscribe | 370 | 386 |
| Contact | 362 | 379 |
| New Testament | 365 | 375 |
| Matthew | 364 | 373 |
| Plans | 381 | 406 |
| 30 day plan | 377 | 404 |
| Privacy | 353 | 361 |
| Written teachings | 362 | 384 |

Dark weighs a little more because the light poster keeps its preload for
everyone (it is the default theme) and dark adds its own.

## Home corrections (28 October 2026)

Branch `feat/reset`. Items 2, 3 and 7 apply site wide.

### Decisions

- Light by default. A first visit, no saved choice and no JavaScript all
  paint light. `hob:theme` saves light, dark or system; only system follows
  the OS. People who chose System before this change had nothing saved,
  so they now land on light once and can choose System again.
- The dark hero poster's preload limited to prefers-color-scheme: dark
  (logged above, 23 October) is removed: the OS setting no longer says
  which theme shows, so it would fetch for visitors who see light. The
  dark poster now loads at high priority once laid out. A saved dark
  choice may see a slower hero LCP than before; Lighthouse (no saved
  choice) now always measures light.
- Header: not sticky, transparent, no border or blur, pulled over the hero
  by a negative margin. From 1024 to 1279 the hero scrim holds full
  strength to 70% at least, because the header nav ends at 68.4% there.
  While the phone menu is open the page holds still beneath it.
- Every hero fills the first screen (100svh, header included).
- Glass: only the two floating cards over Home's app mockup.
- "Free" removed while pricing is open (see the list below).
- Buttons: three options at `/dev/buttons`, awaiting a choice. The pills
  stand until then.

### "Free" removed

| Where | Was | Now |
|---|---|---|
| Header pill, phone menu, 404, every NextStep button | Browse free courses | Browse courses |
| Home Academy band, course page | Browse all free courses | Browse all courses |
| Home Academy line, every NextStep line | Our free courses take you through it... | Our courses take you through it... |
| Home hero subline, site description (metadata) | Free courses and teaching... | Courses and teaching... |
| Course cards | "Free" badge | removed |
| Course page eyebrow, lessons line, title | Free course; "· Free"; "a free course" | Course; removed; "a Bible course" |
| Academy title, heading and lead | Free Bible courses; "Free, always." | Bible courses; removed |
| About, story | The teaching is free, online, and verse by verse. | The teaching is online and verse by verse. |
| Share image line and alt text | Free Bible courses and teaching | Bible courses and teaching |
| Check scripts (check-html, check-noscript, build-og) | the old lines | the new lines |

Left as is: "Listen free" in the brief (another ministry's button, quoted
as an example) and `cost: "Free"` in `lib/academy/static-catalog.test.ts`
(test data for a field nothing renders). `reset-copy.test.ts` now fails
on any line calling a course free.

### Contrast, WCAG 2.2 AA (npm run contrast)

| Pairing | Light | Dark |
|---|---|---|
| Header over hero: ink nav, worst loop pixel, 80% scrim | 10.25 | 8.70 |
| Header over hero: accent (Menu label) | 4.77 | 5.78 |
| Header over hero: current pill, accent on tint | 6.80 | 8.04 |
| Header over hero: Menu border, glyph (UI) | 4.09 | 4.54 |
| Header over hero: focus ring (UI) | 4.77 | 5.78 |
| Logo lid edge over the hero scrim (UI) | 3.39 | in its white tile |
| App mockup glass: ink | 11.92 | 10.37 |
| App mockup glass: muted | 5.53 | 5.99 |
| App mockup glass: accent | 5.54 | 6.89 |
| App mockup glass: eyebrow | 5.54 | 6.31 |
| Starting card: number, accent on raised | 7.65 | 9.84 |
| Starting card: line, muted on raised | 7.64 | 8.57 |
| Mission pull quote: ink on warm | 14.89 | 14.57 |

The button options reuse the current buttons' text pairings; their
hairlines are decorative.

### Checks (scripts/check-noscript.mjs, production build)

- Every hero fills the screen at 375x812, 768x1024 and 1280x800 on all
  ten checked pages: the next section starts at the fold, the hero text
  sits centred below the header (space above and below within 1px).
- Layout shift with script and Motion On, 4.5 s after load: 0.007 at
  most (30 page and width pairs).
- Hero text and header nav inside the scrim hold at 1024, 1280 and 1920.
- Home height at 375: 7,428px (light and dark), over the brief's 5,000px.
  The full screen hero (812px), the stacked starting cards with their
  images and the app mockup account for most of it.

### Responsive pass (29 October 2026)

Audited at 320x568, 360x740, 390x844, 640x900, 740x360 (phone held
sideways), 768x1024, 1024x768 and 1440x900 on Home, Academy, About and
`/dev/buttons`.

- 320 (and 360) overflowed by 50px: the header's logo name, theme switch
  and Menu button need 370px. Below 375 the header now shows the mark
  only (`Logo compact`); the link keeps the full name as its label. No
  page scrolls sideways at any audited width.
- Starting cards: at 1024 three 20rem cards did not fit and squeezed; the
  fan is now 14rem from md, 18rem from lg and 20rem from xl. Stacked
  cards (below md) are capped at 28rem, so they do not stretch across a
  large phone or small tablet.
- App mockup: below sm the floating cards use tighter padding and the
  "Next live session" eyebrow stays on one line.
- Heroes on a short screen (32rem tall or less): the clear space above and
  below drops from 4rem to 2rem, so the headline sits at 96px, not 144px.

### Button style chosen (29 October 2026)

Engraved, with a touch of Ruled (options C and B from the preview, which
is now deleted). Geist small caps at 0.16em tracking, a 6px radius, a 1px
edge and on outlines a hairline 4px inside it. Hover: the deeper fill
sweeps in from the left and a fine rule (current colour at 55%) draws out
beneath the label; keyboard focus draws the rule too. Both move only with
Motion On and no reduced motion. `.btn` in `app/globals.css`, colours per
variant as custom properties in `Button.tsx`. The text pairings are the
same as the pills'; two new ones:

| Pairing | Ratio |
|---|---|
| Footer secondary hover sweep: white on 20% white over green-deep | 7.29 |
| Live hover sweep: ink on gold-soft | 11.85 |

Edges and hairlines on fills are decorative; the secondary's 1px glyph
edge holds 3:1 on every band, as the 1.5px border did. `--radius-button`
is 6px, so the Menu button, store badges and other button shaped
elements follow.

## Post-reset cleanup (29 October 2026)

Code and tokens the reset left with no user, removed on
`chore/post-reset-cleanup`. Nothing on screen changes.

- `/dev/buttons` was already deleted with the button style (8521c39); it
  never had a sitemap, robots, header or test entry.
- `replayEvents()` (the Events replays list). The event `replay` status
  stays: `upcomingEvents` and the announcement still skip replays.
- The `labelled` variant of `SocialLinks` (the old Teachings social
  section). The footer row is the only use; `/media` names both channels.
- `siteConfig.links.audio` (the old Teachings audio section).
- Tokens: `surface-gold` with `brand-gold-50` and `brand-night-gold` (the
  retired newsletter card), `chip-fill`, `facade-bar`, and the unused
  `fg-accent` utility mapping (the `--fg-accent` variable stays). The
  contrast script drops its unused `gold50` constant; no pairing changes.

Kept on purpose: the calendar placeholder note on event pages (until
dates exist), the unused image slots, the Plans FAQ, and
`public/house-of-bread-logo.png` (the source for
`scripts/logo/make-transparent.mjs`).

## Teachings rebuild (29 October 2026)

`/media` rebuilt in the shape of BibleProject's Videos page, on
`feat/teachings`. Details and data paths: `docs/MEDIA-FEED.md`.

### Removed from /media

- The lead player with six cards under it (`VideoGrid`, `VideoLibrary`,
  `VideoGridSkeleton`), which played every video in place.
- The sentence naming both YouTube channels and linking written
  teachings, the New Testament and the reading plans. Both channels now
  feed the page instead; the pastor's channel is no longer named on it.
- The hero heading "Need a word for this season?": it stays only as the
  hero's fallback when no featured teaching resolves.
- (The Live and replays chips, Video, Audio, Social and Read and study
  sections were already gone in the reset.)

### To confirm

- The featured teaching's line under its title comes from the first
  sentence of its YouTube description. Override in
  `content/videos/dC-2yHdPyGo.mdx` if the ministry wants other words.
- Two ministry uploads repeat pastor episodes under other titles
  (`73oQ32ebppE` and `4dydp8uGr0I`; `Ga_ihzd3mTE` and `GsLhhf79Q2E`), so the same teaching can show twice in
  "Latest teachings" and "More teachings". The ministry should pick one.
- Durations stay hidden until `YOUTUBE_API_KEY` is set.

### Contrast

Duration badge and series name band: white on green-night at 85%, 10.01:1
over a white image, 16.82:1 over black. Series count pill: accent on
raised, 7.65:1 light, 9.84:1 dark. Breadcrumb links: accent on surface,
7.65:1 and 10.67:1.

### Closer to BibleProject (29 October 2026, second pass)

The ministry asked for BibleProject's Videos page pattern exactly: a plain
hero and smaller spaces between sections. The three Teachings pages now
share `TeachingsLayout.tsx`: a plain hero on the surface (no loop, no
scrim, not full screen), every section on the one surface (no cream or
mint band but the closing next step), 24px and 40px per section instead
of 40px and 112px, headings at 24 to 28px instead of the house h2, five
cards in "Latest teachings" and four series tiles across, as BibleProject.
