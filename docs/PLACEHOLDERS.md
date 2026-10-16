# Placeholders register

Date: 17 October 2026
Branch: `feat/ministry-redesign`

Everything listed here is temporary. Each item must be replaced or confirmed
before launch. Remove a line once its item is done.

Every bracketed placeholder renders through the `Placeholder` component (or
`StoreButtons`, `SocialLinks`, `YouTubeSubscribeButton`, `PhotoFrame`) with a
dashed outline or a "Placeholder" badge, and carries a `data-placeholder`
attribute, so the built HTML can be searched for any that remain.

External links live in one place, `siteConfig.links` in `lib/site-config.ts`.
Filling in a value there turns every matching placeholder into a real link.

---

## Launch blockers

- **Global noindex flag.** `lib/site-config.ts` sets `noindex: true`, so every
  page sends `noindex, nofollow`. Flip it to `false` at launch, once
  placeholder copy is replaced.
- **`npm run content:validate` does not exist yet.** It arrives with the MDX
  pipeline. Until then no task can meet that line of the definition of done.
- **Privacy policy.** `/privacy` is a draft structure, not legal advice, and
  shows a "Draft, under review" badge. A qualified person must review it.
- **Newsletter needs Kit set up.** The signup code is built. Until the steps
  in "Newsletter setup" below are done, every newsletter form shows a disabled
  button and "Signup opens soon".
- **Contact form is not wired up.** It renders real fields with the submit
  button disabled and a "Messaging opens soon" note until the contact slice.

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

## Pages that stay noindex permanently

These set their own robots metadata and ignore the global flag.

- `/subscribe/check-email`, only meaningful straight after a signup
- The 404 page

## Bracketed copy from the content pack (revision 2)

| Where | Placeholder |
|---|---|
| Footer, Follow column; Home, Follow the ministry; `/subscribe` and `/contact`, Follow the ministry | YouTube [CHANNEL LINK] |
| Same places | [OTHER SOCIAL PLATFORMS AND LINKS TO BE SUPPLIED] |
| Home, Next live session; `/events` header | Subscribe on YouTube [CHANNEL LINK] |
| Every AppBand (Home, `/new-testament`, book pages, `/plans`, journey pages, `/subscribe`) | [GOOGLE PLAY LINK] |
| Same places | [APP STORE LINK OR "COMING SOON", CONFIRM WITH APP DEVELOPER] |
| `/app` header | [GOOGLE PLAY LINK], [APP STORE LINK OR "COMING SOON", CONFIRM] (shortened as written in the pack) |
| `/about`, Mission | [MISSION STATEMENT TO BE SUPPLIED BY THE MINISTRY]. The pack's interim wording is shown beside it with an "Interim wording" badge |
| `/about`, Where the ministry serves, all three region cards | [LOCAL DETAILS TO BE SUPPLIED] |
| `/about`, Leadership | [TEACHER NAME, PHOTO AND SHORT BIOGRAPHY TO BE SUPPLIED] |
| `/about`, Doctrinal position | [DOCTRINAL STATEMENT TO BE SUPPLIED BY THE MINISTRY] |
| `/events`, Weekly rhythm | [WEEKLY SCHEDULE AND MINISTRY TIME ZONE TO BE SUPPLIED] |
| `/classes`, How to join | [JOINING METHOD TO BE SUPPLIED: form, WhatsApp link or email] |
| `/classes/[slug]`, all five sections | [CLASS DETAILS TO BE SUPPLIED] |
| `/plans/[slug]`, closing band | [APP DEEP LINK TO BE CONFIRMED] |
| `/contact`, side panel | [RESPONSE TIME, EMAIL ADDRESS AND SOCIAL LINKS TO BE SUPPLIED] |
| `/privacy`, section 1 | [LEGAL NAME, ADDRESS AND CONTACT EMAIL OF THE MINISTRY] |
| `/privacy`, section 6 | [RETENTION PERIODS TO BE SUPPLIED] |
| `/privacy`, section 7 | [TO BE CONFIRMED FOR EACH PROCESSOR] |
| `/privacy`, section 10 | [DATE OF LAST UPDATE] |

## Placeholders added where the pack names a field but supplies no fact

| Where | Placeholder |
|---|---|
| Home hero visual, floating session card | [DATE AND TIME TO BE SUPPLIED] (until a session is dated) |
| Event cards, featured session card and `/events/[slug]` header | [DATE, TIME AND MINISTRY TIME ZONE TO BE SUPPLIED], [DURATION TO BE SUPPLIED] |
| Featured session card and `/events/[slug]` | [YOUTUBE LINK TO BE SUPPLIED], [CALENDAR FILE AVAILABLE ONCE A DATE IS SUPPLIED] |
| `/events/[slug]` | [SESSION DESCRIPTION TO BE SUPPLIED], [PASSAGES TO BE SUPPLIED, LINKED THROUGH /lib/scripture] |
| Class cards and `/classes/[slug]` header | [ONE LINE SUMMARY], [AUDIENCE], [DATES] |
| Teaching cards and `/teachings/[slug]` | [SUMMARY TO BE SUPPLIED], [READING TIME], [PASSAGES], [DATE], [PASSAGES AS LINKED CHIPS], [TEACHING BODY TO BE SUPPLIED] |
| `/new-testament/[book]`, all five sections | [BODY TEXT FOR THIS SECTION TO BE SUPPLIED] |
| `/plans/[slug]` for the 60 and 90 day journeys | [DAY ONE READING TO BE CONFIRMED AGAINST THE APP] |
| `/plans/[slug]`, Frequently asked | [FREQUENTLY ASKED QUESTIONS TO BE SUPPLIED] |
| `/privacy`, section 8 | [HOW TO EXERCISE THESE RIGHTS TO BE SUPPLIED] |
| `/contact`, under the form | [CONTACT FORM PRIVACY WORDING TO BE SUPPLIED] |

## Photo frames

Art directed "Photo to come" frames (`PhotoFrame`) stand where photography
belongs. No stock photos. Each carries `data-placeholder` and an accessible
label naming what the photo will show.

| Where | Ratio | Subject |
|---|---|---|
| Home, Next live session | 4:5 | A live teaching session, the teacher and those gathered |
| `/about`, Mission | 16:9 | Believers gathered for teaching |
| `/about`, Leadership | 4:5 | Portrait of the teacher |
| `/events`, How it works | 4:5 | A session streaming live, seen from the room |
| `/classes`, Who classes are for | 4:5 | A class in progress, believers with open Bibles |
| `/app`, four feature sections | 16:9 | "Screenshot to come": a journey, a book introduction, switching translations, the teaching library |

Assets to request from the ministry (CONTENT-PACK 1.7): a portrait of the
teacher, 10 to 15 photos of sessions and gatherings, a 60 to 90 second
welcome video (to load behind a click to load `youtube-nocookie.com` facade),
real app screenshots, the logo SVG (mark and wordmark), and a social share
image. Swap each frame for `next/image` with explicit dimensions.

## Copy to confirm

Small pieces of copy the pack does not supply, written to fill a layout slot.
None states a fact. Confirm or replace.

- **Announcement bar, session within 24 hours.** The pack gives only "Live
  now: {title}. Watch on YouTube". The upcoming case reads "Coming up:
  {title}, {local time}. Watch on YouTube".
- **About, closing band heading.** Reuses the Home H1, "Come and be fed by the
  Word.", with the "Study . Pray . Grow" eyebrow.
- **Region cards on About.** The pack asks for "one line plus [LOCAL DETAILS]".
  The one line was not supplied, so each card shows the region name and the
  placeholder only.
- **UI headings.** "Subscribe" above the `/subscribe` form, "Send a message"
  and "Other ways to reach the ministry" on `/contact`, "Classes" and "Choose a
  pace" as section headings, "Next up" empty state reused on Upcoming.

## Values to confirm

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

`lib/content/placeholder-data.ts` is marked `TODO: replace with MDX content
pipeline`. Sample entries carry `sample: true` and render a "Sample" badge.

| Route | Sample slugs |
|---|---|
| `/events/[slug]` | `sample-event-one`, `sample-event-two` |
| `/classes/[slug]` | `sample-class-one`, `sample-class-two` |
| `/teachings/[slug]` | `sample-teaching-one`, `sample-teaching-two` (marked draft) |
| `/new-testament/[book]` | `matthew`, `mark` |
| `/plans/[slug]` | `30-day-plan`, `60-day-plan`, `90-day-plan` |

- The sample events have no date, so the home page and `/events` show their
  empty states. Which events count as upcoming or replay comes from the
  event `status` field, not the build time clock, because pages are static.
  The event pages exist for layout review and are reachable by URL only.
- The 27 book slugs are generated from book names and are temporary.
  Canonical identifiers must come from `/lib/scripture`, because they become
  part of deep links. Books other than Matthew and Mark show "Coming soon"
  and are not links.
- `Scripture` passes the `passage` string through unparsed, with a TODO to
  resolve it through `/lib/scripture` once that module exists.

## Brand

- **Colour values.** The brand primitives in `app/globals.css` (`--brand-*`)
  are approximate values from the banner. Replace them with official hex
  values, then rerun the contrast checks below.
- **Logo.** The header and footer show a text wordmark (`Wordmark.tsx`),
  marked TODO until the logo SVG arrives.
- **Typefaces.** Literata at 600 for display and headings, and for reading.
  Geist for UI, nav, buttons and labels. Replace or confirm once brand
  typefaces are known.
- **App screenshots.** The hero visual, `/app` and the app band use a CSS
  phone frame with illustrative floating cards, marked as illustrative in
  code. Swap in real screenshots when supplied.
- **Favicon.** `app/favicon.ico` is the Next.js default.

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
- **Footer closing strip repeats the newsletter band.** The pack puts "Stay
  close to the ministry" with a Subscribe button at the top of the footer,
  and most pages close with a newsletter band of the same heading directly
  above it. Built as written. Consider hiding the strip on pages that end with
  the band.
- **Lighthouse.** The 95 target is measured on a Vercel preview (pack section
  15). It has not been measured on this branch.

---

## Colour token migration

The site moved from dark first to light first. The old names described the
dark theme, so they were removed rather than given flipped values. Every use
was rewritten. Only `surface` survives as a name, deliberately reassigned to
white because the content pack's token table uses it that way.

| Old token | Old value | Replacement |
|---|---|---|
| `surface` | `#0a3616` dark green page background | `surface` is now `#ffffff`. Dark green is `green` |
| `surface-deep` | `#011f0b` | Removed. Use `green-deep` or `green-night` |
| `text` | `#f8f9f8` | `ink` on white, `on-green` on green. Contextual `fg` picks the right one |
| `text-muted` | 80% white mix | `ink-muted` on white, `on-green-muted` on green. Contextual `fg-muted` |
| `heading` | lime | `green` on white, `on-green` on green. Contextual `fg-heading` |
| `link` | lime | `green` on white, `lime` on green. Contextual `fg-link` |
| `accent` | lime | `lime`, only on green surfaces or as a fill |
| `on-accent` | `#011f0b` | `on-lime` (`#0a3616`) |
| `success` | mint | `success-on-white` on white, `mint` on green |
| `progress` | mint | `mint` on green surfaces |
| `border` | 60% lime mix | `border`, 15% green (decorative card edges). `border-strong`, 60% green (hover, focus). `input-border`, ink-muted |
| `focus-ring` | lime | Contextual `ring`: `green` on white, `lime` on green |

Contextual tokens (`fg`, `fg-muted`, `fg-heading`, `fg-link`, `ring`) default
to the white surface and are redefined by the `.tone-green` class, which every
green gradient surface carries. Tailwind's default palette is switched off
(`--color-*: initial`), so only brand tokens exist as colour utilities.

## Colour contrast, WCAG 2.2 AA

Measured on 17 October 2026 against the approximate brand values, for the
revision 2 palette. Normal text needs 4.5:1. Large text and non-text UI need
3:1. Rerun when official hex values arrive.

### Gradient stops and decorative layers

Green surfaces use four stops: `green-rich` `#0f4a22` (the lightest, top left
of the hero and band gradient), `green` `#0a3616`, `green-deep` `#04290e` and
`green-night` `#011f0b` (footer). Interpolated colours lie between stops, so
the lightest stop is the worst case. Decorative layers are checked at their
strongest point over `green-rich`, which is worse than over any other stop.

| Surface | on-green `#f8f9f8` | on-green-muted `#c8d2cb` | lime `#a6c859` | mint `#05d47c` |
|---|---|---|---|---|
| green-rich `#0f4a22` | 9.84 | 6.69 | 5.45 | 5.30 |
| green `#0a3616` | 12.82 | 8.72 | 7.10 | 6.90 |
| green-deep `#04290e` | 14.98 | 10.19 | 8.30 | 8.06 |
| green-night `#011f0b` | 16.55 | 11.26 | 9.17 | 8.91 |
| Band glow, 8% lime over rich `#1b5426` | 8.49 | 5.78 | 4.71 | 4.57 |
| Watermark, 7% lime over rich `#1a5326` | 8.62 | 5.86 | 4.78 | 4.64 |
| Chip fill, 10% white over rich `#265c37` | 7.46 | 5.07 | 4.13 (icon only, 3:1 needed) | not used |
| Newsletter form panel, deep at 60% over rich `#083616` | 12.84 | 8.74 | 7.12 | 6.91 |
| Hero glow, 18% lime over rich `#2a612c` | 6.99 | 4.76 | **3.88, fails** | **3.77, fails** |

Result: every text pairing passes on all four stops and on every decorative
layer except the hero glow, where lime and mint text fail. The hero glow
(`.hero-glow`) is therefore placed only behind the phone in `HeroVisual`, on
Home, `/app` and every AppBand, and is sized so its visible edge stays clear of
the text column on desktop and of the text above it on mobile. Its 30 second
drift moves it at most 3rem. No lime or mint text sits over it: the floating
cards on the phone are white with ink text.

Grain (`.grain`) is white noise at 5% opacity, too fine to change any measured
pairing.

### White and tint surfaces

| Text or element | White `#ffffff` | Tint `#f3f8ec` | Result |
|---|---|---|---|
| ink `#0b2412` (body text) | 16.47 | 15.25 | Pass |
| ink-muted `#3d5a46` (secondary text, input borders) | 7.64 | 7.07 | Pass |
| green `#0a3616` (headings, links, eyebrows, focus ring, button fill) | 13.53 | 12.53 | Pass |
| success-on-white `#0b7a45` | 5.41 | 5.01 | Pass |
| border-strong, 55% green `#78907f` (hover and focus edge, non-text) | 3.45 | 3.19 | Pass |
| border, 12% green `#e2e7e3` (decorative card edge only) | 1.25 | | Decorative, not relied on |

The pack asks for a 50% hover border. That measures 2.98:1 on white, just
under 3:1, so the token is 55%.

### Fills

| Text | Fill | Ratio | Result |
|---|---|---|---|
| on-lime `#0a3616` | lime `#a6c859` (green surface buttons, badges, announcement bar) | 7.10 | Pass |
| on-lime `#0a3616` | mint `#05d47c` | 6.90 | Pass |
| White | green `#0a3616` (primary button on white) | 13.53 | Pass |
| White | ink-muted `#3d5a46` (disabled primary button) | 7.64 | Pass |
| ink-muted `#3d5a46` | White (disabled secondary and ghost buttons) | 7.64 | Pass |
| on-lime `#0a3616` | on-green-muted `#c8d2cb` (disabled lime button) | 8.72 | Pass |
| ink `#0b2412` | white input on a green band | 16.47 | Pass |

### Focus rings

| Ring | Against | Ratio | Result |
|---|---|---|---|
| green, 3px, on white surfaces | White, tint | 13.53, 12.53 | Pass |
| lime, 3px, on green surfaces | green-rich, the lightest stop | 5.45 | Pass |
| lime ring around a white input on a green band | the green surface outside the 3px offset | 5.45 or more | Pass. The ring sits outside the input, not on it |
| green ring on the lime announcement bar | lime | 7.10 | Pass |

### Failing pairings, never used

| Text | Background | Ratio |
|---|---|---|
| lime `#a6c859` | White | 1.90 |
| mint `#05d47c` | White | 1.96 |
| White | lime `#a6c859` | 1.90 |
| White | mint `#05d47c` | 1.96 |
| ink-muted `#3d5a46` | lime | 4.01. The announcement bar pins its muted text to deep green for this reason |
| lime or mint | hero glow peak | 3.88 and 3.77. See above |

The rule above each section heading is lime on green surfaces (5.45:1 or
more) and deep green on white. It is decorative only.

### Motion and contrast

The scroll reveal moves sections up 32px without fading them. A fade would
leave any section straddling the fold partly transparent at load, which would
lower its measured contrast. The hero entrance does fade, but it is time based
and finishes within 1 second of load. The H1 rises without fading.
