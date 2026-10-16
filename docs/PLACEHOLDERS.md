# Placeholders register

Date: 16 October 2026
Branch: `feat/page-skeletons`

Everything listed here is temporary. Each item must be replaced or confirmed
before launch. Remove a line once its item is done.

---

## Launch blockers

- **Global noindex flag.** `lib/site-config.ts` sets `noindex: true`, so every
  page sends `noindex, nofollow`. Flip it to `false` at launch, once
  placeholder copy is replaced.
- **`npm run content:validate` does not exist yet.** CLAUDE.md lists it as a
  command and in the definition of done, but it arrives with the MDX pipeline
  task. Until then, no task can meet that line of the definition of done.

## Pages that stay noindex permanently

These set their own robots metadata and ignore the global flag.

- `/subscribe/check-email`, only meaningful straight after a signup
- The 404 page

## Brand

- **Colour values.** The brand primitives in `app/globals.css` (`--brand-*`)
  are approximate. Replace them with official brand hex values, then rerun the
  contrast checks below.
- **Typeface.** Geist, from the Next.js scaffold. Replace once brand
  typefaces are confirmed (spec section 13).
- **Logo.** The header shows the ministry name as text. No logo yet.
- **Favicon.** `app/favicon.ico` is the Next.js default.

## Placeholder data

`lib/content/placeholder-data.ts` holds two sample entries per dynamic route,
marked `TODO: replace with MDX content pipeline`.

| Route | Sample slugs |
|---|---|
| `/events/[slug]` | `sample-event-one`, `sample-event-two` |
| `/classes/[slug]` | `sample-class-one`, `sample-class-two` |
| `/teachings/[slug]` | `sample-teaching-one`, `sample-teaching-two` |
| `/new-testament/[book]` | `matthew`, `mark` |
| `/plans/[slug]` | `sample-plan-one`, `sample-plan-two` |

The book slugs are temporary. Canonical book identifiers must come from
`/lib/scripture` once it exists, because they become part of deep links.

## Placeholder page copy

Every page below renders `PlaceholderPage` with a visible "Placeholder" label.
All of its copy is placeholder.

- `/` home. Waits on: the next live session, newsletter form, app call to action
- `/about`. Waits on: ministry, teacher and doctrinal position copy from the CEO
- `/events`. Waits on: event MDX, the weekly rhythm, ministry time zone (spec section 13)
- `/events/[slug]`. Waits on: YouTube link, `.ics` file, notify me form
- `/classes`. Waits on: class MDX
- `/classes/[slug]`. Waits on: how people join (spec section 13)
- `/teachings`, `/teachings/[slug]`. Waits on: the content provenance decision (spec section 4)
- `/new-testament`, `/new-testament/[book]`. Waits on: book MDX and `/lib/scripture`
- `/plans`, `/plans/[slug]`. Waits on: plan landing copy and app store links
- `/app`. Waits on: app details and store links from the app developer. No links are invented
- `/subscribe`. Waits on: the newsletter flow and consent wording
- `/subscribe/check-email`. Waits on: final confirmation wording
- `/contact`. Waits on: the contact form (Resend)
- `/privacy`. Waits on: the final policy, covering UK GDPR and the NDPA

Other placeholder text:

- Root metadata description in `app/layout.tsx`
- Footer line in `components/shared/SiteFooter.tsx`

## Known behaviour to revisit

- **Unknown slugs.** With Cache Components on, `dynamicParams = false` is not
  available. Each dynamic page exports `ensureStatic = "navigation"`, so the
  full page renders before the response is sent and an unknown slug returns a
  real 404. Without it, the response is a 200 shell with not found content
  streamed in, which is a soft 404. Keep this export when the MDX pipeline
  replaces the placeholder data.

## Colour contrast, WCAG 2.2 AA

Measured against the approximate brand values. Normal text needs 4.5:1. Large
text and non-text UI need 3:1.

### Passing pairings in use

| Text or element | Background | Ratio | Result |
|---|---|---|---|
| Foreground `#f8f9f8` | Background `#0a3616` | 12.82 | Pass |
| Foreground `#f8f9f8` | Background deep `#011f0b` | 16.55 | Pass |
| Muted text `#c8d2cb` | Background `#0a3616` | 8.72 | Pass |
| Muted text `#c8d2cb` | Background deep `#011f0b` | 11.26 | Pass |
| Lime `#a6c859` (headings, links) | Background `#0a3616` | 7.10 | Pass |
| Lime `#a6c859` (headings, links) | Background deep `#011f0b` | 9.17 | Pass |
| Mint `#05d47c` (progress, success) | Background `#0a3616` | 6.90 | Pass |
| Mint `#05d47c` (progress, success) | Background deep `#011f0b` | 8.91 | Pass |
| Deep green `#011f0b` on a lime button | Lime `#a6c859` | 9.17 | Pass |
| Deep green `#011f0b` on a mint button | Mint `#05d47c` | 8.91 | Pass |
| Border `#688e3e` (non-text) | Background `#0a3616` | 3.56 | Pass |
| Border `#688e3e` (non-text) | Background deep `#011f0b` | 4.60 | Pass |
| Focus ring, lime (non-text) | Either background | 7.10 or higher | Pass |

### Failing pairings, do not use

| Text | Background | Ratio | Result |
|---|---|---|---|
| Foreground `#f8f9f8` | Lime `#a6c859` | 1.80 | Fail |
| Foreground `#f8f9f8` | Mint `#05d47c` | 1.86 | Fail |
| Lime `#a6c859` | Mint `#05d47c` | 1.03 | Fail |
| Background `#0a3616` | Background deep `#011f0b` | 1.29 | Fail |

The first two are why buttons on lime or mint use `text-on-accent` and never
white. Lime and mint must never be paired with each other as text and
background. The two greens are surfaces only and must never be used as text on
each other.

The border token was first set at a 35% lime mix, which measured 2.12:1. It
was raised to 60% to pass the non-text threshold.
