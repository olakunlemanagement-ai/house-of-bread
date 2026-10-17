# Placeholders register

Date: 17 October 2026
Branch: `feat/palette-nav-media` (from `feat/ministry-redesign`)

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
- **Security headers are not set.** CLAUDE.md requires a
  Content-Security-Policy and the other headers in `next.config`. None exist
  yet. When added, `img-src` must allow `https://i.ytimg.com` (Media Library
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
| `/media`, Live and replays | Watch live on YouTube [CHANNEL LINK] |
| `/media`, Social | Follow [CHANNEL LINK] on the YouTube card, [OTHER PLATFORMS AND LINKS TO BE SUPPLIED], and [CONFIRM CONTENT] after the intro line |
| `/media`, Audio | [AUDIO PLATFORMS AND LINKS TO BE SUPPLIED]. Fill `siteConfig.links.audio` |
| `/media`, Video | `YOUTUBE_CHANNEL_ID` is not set, so the page shows "Videos will appear here soon". Set it in Vercel (all environments) and redeploy |
| Home, Next live session; `/events` header | Subscribe on YouTube [CHANNEL LINK] |
| Every AppBand (Home, `/new-testament`, book pages, `/plans`, journey pages, `/subscribe`) | [GOOGLE PLAY LINK] |
| Same places | [APP STORE LINK OR "COMING SOON", CONFIRM WITH APP DEVELOPER] |
| `/app` header | [GOOGLE PLAY LINK], [APP STORE LINK OR "COMING SOON", CONFIRM] (shortened as written in the pack) |
| `/about`, Mission | [MISSION STATEMENT TO BE SUPPLIED BY THE MINISTRY]. The pack's interim wording is shown beside it with an "Interim wording" badge |
| `/about`, Where the ministry serves, all three region cards | [LOCAL DETAILS TO BE SUPPLIED] |
| `/about`, Leadership | [TEACHER NAME, PHOTO AND SHORT BIOGRAPHY TO BE SUPPLIED] |
| `/about`, Doctrinal position | [DOCTRINAL STATEMENT TO BE SUPPLIED BY THE MINISTRY] |
| `/events`, Weekly rhythm | [WEEKLY SCHEDULE AND MINISTRY TIME ZONE TO BE SUPPLIED] |
| `/academy`, How to join | [JOINING METHOD TO BE SUPPLIED: form, WhatsApp link or email] |
| `/academy/[slug]`, all five sections | [CLASS DETAILS TO BE SUPPLIED] |
| `/plans/[slug]`, closing band | [APP DEEP LINK TO BE CONFIRMED] |
| `/contact`, side panel | [RESPONSE TIME, EMAIL ADDRESS AND SOCIAL LINKS TO BE SUPPLIED] |
| `/privacy`, section 1 | [LEGAL NAME, ADDRESS AND CONTACT EMAIL OF THE MINISTRY] |
| `/privacy`, section 6 | [RETENTION PERIODS TO BE SUPPLIED] |
| `/privacy`, section 7 | [TO BE CONFIRMED FOR EACH PROCESSOR] |
| `/privacy`, section 10 | [DATE OF LAST UPDATE] |

## Placeholders added where the pack names a field but supplies no fact

| Where | Placeholder |
|---|---|
| Home, Start here | Welcome video. `siteConfig.links.welcomeVideoId` is null, so a "Photo and video to come" frame shows. Supply a YouTube id and it loads behind the click to load facade |
| Home hero visual, floating session card | [DATE AND TIME TO BE SUPPLIED] (until a session is dated) |
| Event cards, featured session card and `/events/[slug]` header | [DATE, TIME AND MINISTRY TIME ZONE TO BE SUPPLIED], [DURATION TO BE SUPPLIED] |
| Featured session card and `/events/[slug]` | [YOUTUBE LINK TO BE SUPPLIED], [CALENDAR FILE AVAILABLE ONCE A DATE IS SUPPLIED] |
| `/events/[slug]` | [SESSION DESCRIPTION TO BE SUPPLIED], [PASSAGES TO BE SUPPLIED, LINKED THROUGH /lib/scripture] |
| Class cards and `/academy/[slug]` header | [ONE LINE SUMMARY], [AUDIENCE], [DATES] |
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
| `/academy`, Who the Academy is for | 4:5 | A class in progress, believers with open Bibles |
| `/app`, four feature sections | 16:9 | "Screenshot to come": a journey, a book introduction, switching translations, the teaching library |

Assets to request from the ministry (CONTENT-PACK 1.7): a portrait of the
teacher, 10 to 15 photos of sessions and gatherings, a 60 to 90 second
welcome video (to load behind a click to load `youtube-nocookie.com` facade),
real app screenshots, the logo SVG (mark and wordmark), and a social share
image. Swap each frame for `next/image` with explicit dimensions.

## Copy to confirm

Small pieces of copy the pack does not supply, written to fill a layout slot.
None states a fact. Confirm or replace.

- **House of Bread Academy copy.** The Home bento tile reads "Equipped in the
  truth. Bible classes that give believers a structured place to study the
  Word, taught with care for context and doctrine." The About card reads
  "Bible classes that equip believers with knowledge of the truth, for those
  who want to go further than reading alone." Both are built from the
  approved tagline and description.

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
| `/academy/[slug]` | `sample-class-one`, `sample-class-two` |
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
  come from the palette revision of 17 October 2026 and are not yet
  confirmed against official brand files. Replace them with official hex
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

### Motion and contrast

The scroll reveal moves sections up 32px without fading them. A fade would
leave any section straddling the fold partly transparent at load, which would
lower its measured contrast. The hero entrance does fade, but it is time based
and finishes within 1 second of load. The H1 rises without fading.
