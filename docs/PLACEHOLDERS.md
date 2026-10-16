# Placeholders register

Date: 16 October 2026
Branch: `feat/page-content`

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
- **Forms are not wired up.** The newsletter and contact forms render real
  fields with the submit button disabled and an "opens soon" note. Loading,
  success and error states arrive with the newsletter and contact slices. The
  approved error copy is already in `newsletterMessages` in
  `components/shared/NewsletterForm.tsx`.

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
