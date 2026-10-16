# Placeholders register

Date: 16 October 2026
Branch: `feat/newsletter`

Everything listed here is temporary. Each item must be replaced or confirmed
before launch. Remove a line once its item is done.

Every bracketed placeholder renders through the `Placeholder` component (or
`StoreButtons`) with a dashed outline and a "Placeholder" badge, and carries a
`data-placeholder` attribute, so the built HTML can be searched for any that
remain.

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

## Bracketed copy from the content pack

| Where | Placeholder |
|---|---|
| Footer, Connect column | [SOCIAL LINKS: YouTube, and other pages to be supplied] |
| Home, Plans, New Testament, plan and book pages, `/app` (AppBand and header) | [GOOGLE PLAY LINK] |
| Same places | [APP STORE LINK OR "COMING SOON", CONFIRM WITH APP DEVELOPER] (shortened to "CONFIRM" on `/app`, as written in the pack) |
| `/about`, Who teaches | [TEACHER NAME, PHOTO AND SHORT BIOGRAPHY TO BE SUPPLIED] |
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
| Event cards and `/events/[slug]` header | [DATE, TIME AND MINISTRY TIME ZONE TO BE SUPPLIED], [DURATION TO BE SUPPLIED] |
| `/events/[slug]` | [YOUTUBE LINK TO BE SUPPLIED], [CALENDAR FILE AVAILABLE ONCE A DATE IS SUPPLIED], [SESSION DESCRIPTION TO BE SUPPLIED], [PASSAGES TO BE SUPPLIED, LINKED THROUGH /lib/scripture] |
| Class cards and `/classes/[slug]` header | [ONE LINE SUMMARY], [AUDIENCE], [DATES] |
| Teaching cards and `/teachings/[slug]` | [SUMMARY TO BE SUPPLIED], [READING TIME], [PASSAGES], [DATE], [PASSAGES AS LINKED CHIPS], [TEACHING BODY TO BE SUPPLIED] |
| `/new-testament/[book]`, all five sections | [BODY TEXT FOR THIS SECTION TO BE SUPPLIED] |
| `/plans/[slug]` for the 60 and 90 day plans | [DAY ONE READING TO BE CONFIRMED AGAINST THE APP] |
| `/plans/[slug]`, Frequently asked | [FREQUENTLY ASKED QUESTIONS TO BE SUPPLIED] |
| `/privacy`, section 8 | [HOW TO EXERCISE THESE RIGHTS TO BE SUPPLIED] |
| `/contact`, under the form | [CONTACT FORM PRIVACY WORDING TO BE SUPPLIED] |

## Values to confirm

- **Day one sample.** `/plans/30-day-plan` shows Day 1, James 1-5 and
  Galatians 1-3, theme "Living faith and justification by faith." It is
  labelled as a sample. Confirm against the app.
- **Plan pace labels.** Focused, Steady and Unhurried are drawn from the
  approved one line descriptions. Confirm with the ministry.
- **Plan slugs.** `30-day-plan`, `60-day-plan`, `90-day-plan` are temporary.
  Confirm against the app's plan identifiers before they become permanent URLs.
- **Detail page meta descriptions.** Sample event, class and teaching pages
  carry a generic description noting they are samples.

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
- **Typefaces.** Geist (sans, from the scaffold) and Literata (serif, added
  for reading). Replace or confirm once brand typefaces are known.
- **App screenshots.** `/app` and the app band use a CSS phone frame. Swap in
  real screenshots when supplied.
- **Favicon.** `app/favicon.ico` is the Next.js default.

## Known behaviour to revisit

- **Unknown slugs.** With Cache Components on, `dynamicParams = false` is not
  available. Each dynamic page exports `ensureStatic = "navigation"`, so an
  unknown slug returns a real 404 rather than a soft 404. Checked on this
  branch: `/events/nope`, `/teachings/x`, `/new-testament/luke` and `/nope`
  all return 404. Keep this export when the MDX pipeline replaces the data.
- **`.ics` files.** "Add to calendar" is disabled until events carry real
  dates.

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

Measured on 16 October 2026 against the approximate brand values. Normal text
needs 4.5:1. Large text and non-text UI need 3:1.

### Gradient stops

Every green gradient uses only `green` `#0a3616`, `green-deep` `#04290e` and
`green-night` `#011f0b`. Each pairing below is checked at all three stops.
Interpolated colours between stops are darker than `green`, so they pass if
`green` passes. The lime glow is capped at 18% opacity (blended `#265022` at
its brightest point) and is also checked.

| Text or element | green | green-deep | green-night | Glow peak `#265022` | Result |
|---|---|---|---|---|---|
| on-green `#f8f9f8` (headings, body, labels) | 12.82 | 14.98 | 16.55 | 8.83 | Pass |
| on-green-muted `#c8d2cb` (secondary text) | 8.72 | 10.19 | 11.26 | | Pass |
| lime `#a6c859` (eyebrows, links, focus ring) | 7.10 | 8.30 | 9.17 | 4.89 | Pass |
| mint `#05d47c` (progress, success) | 6.90 | 8.06 | 8.91 | | Pass |

### White and tint surfaces

| Text or element | White `#ffffff` | Tint `#f3f8ec` | Result |
|---|---|---|---|
| ink `#0b2412` (body text) | 16.47 | 15.25 | Pass |
| ink-muted `#3d5a46` (secondary text, input borders) | 7.64 | 7.07 | Pass |
| green `#0a3616` (headings, links, focus ring, button fill) | 13.53 | 12.53 | Pass |
| success-on-white `#0b7a45` | 5.41 | 5.01 | Pass |
| border-strong `#6c8673` (non-text, hover and focus edge) | 3.97 | | Pass |
| border `#dae1dc` (decorative card edge only) | 1.33 | | Decorative, not relied on |

### Fills

| Text | Fill | Ratio | Result |
|---|---|---|---|
| on-lime `#0a3616` | lime `#a6c859` (green surface buttons, badges) | 7.10 | Pass |
| on-lime `#0a3616` | mint `#05d47c` | 6.90 | Pass |
| White | green `#0a3616` (primary button on white) | 13.53 | Pass |
| White | ink-muted `#3d5a46` (disabled primary button) | 7.64 | Pass |
| on-lime `#0a3616` | on-green-muted `#c8d2cb` (disabled lime button) | 8.72 | Pass |
| ink `#0b2412` | white input on a green band | 16.47 | Pass |

### Failing pairings, never used

| Text | Background | Ratio |
|---|---|---|
| lime `#a6c859` | White | 1.90 |
| mint `#05d47c` | White | 1.96 |
| White | lime `#a6c859` | 1.90 |
| White | mint `#05d47c` | 1.96 |
| lime | glow at 25% (`#315b27`) | 4.15, which is why the glow is capped at 18% |

The lime rule above each section heading sits on white at 1.90:1. It is
decorative only, and the heading beside it is deep green.
