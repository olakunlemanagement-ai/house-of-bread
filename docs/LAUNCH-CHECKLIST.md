# Launch checklist

Date: 28 October 2026
Branch: `feat/reset`

Everything that stands between this branch and a public launch on
`hobglobal.online`, grouped by who must supply it. Every bracketed item on
the site renders through `Placeholder` (or `ImageSlot`, `StoreButtons`,
`SocialLinks`) with a `data-placeholder` attribute, so a search of the built
HTML for `data-placeholder` finds any that remain. `docs/PLACEHOLDERS.md`
holds the detail behind each line.

## 1. Launch blockers

Decisions or work without which the site should not go live.

- [ ] **Switch the Academy status to open when real courses are loaded.**
  Since 29 October 2026 the Academy is a placeholder LMS in preview
  (`siteConfig.academy.status: "preview"`): every course and lesson page
  is browsable, so Home's "Start this course" buttons lead to real course
  pages, and a lesson without a video shows "This lesson is being
  prepared" with "Notify me when the Academy opens". Set `"open"` once the
  real courses, lessons and videos are in `content/academy`. Owner:
  ministry supplies, developer switches.
- [ ] **Real courses.** All six courses, their sections and 32 lessons are
  placeholders in [brackets] (`content/academy`), and lesson 1 of the
  Start Here course and its trailer use a stand-in video
  (`siteConfig.startHereVideoId`). Owner: ministry.
- [ ] **Privacy policy reviewed** by a qualified person; remove the "Draft,
  under review" badge after. Owner: ministry.
- [ ] **Newsletter (Kit) set up.** Until then every signup form is disabled
  with "Signup opens soon". Owner: ministry creates the Kit account and
  form; developer sets the variables.
- [ ] **Anonymous questions (Resend) set up.** Until then `/ask` is disabled
  with "Questions open soon". Owner: ministry verifies the sending domain;
  developer sets the variables.
- [ ] **Contact form wired up.** It renders with the submit button disabled
  ("Messaging opens soon") until the contact slice is built. Owner:
  developer.
- [ ] **Placeholder copy replaced**, then the global `noindex` flag turned
  off (go-live steps below). Owner: both.

## 2. From the ministry

### Decisions

- [ ] Full ministry name: House of Bread Ministries International, or House
  of Bread Global (footer, Home teacher line, About; shown in brackets).
- [ ] Hero headline: A (in use), B or C (docs/RESET-BRIEF.md section 6).
- [ ] Which course is the Start Here course (`startHere: true`) and which the
  [book-by-book course] (Home and Academy starting cards 01 and 02).
- [ ] How questions are answered (`/ask`, "[CONFIRM HOW QUESTIONS ARE
  ANSWERED]"), and that "We read every question, and some are answered in
  our teaching" is true.
- [ ] The US time zone and the region list under the session times.
- [ ] Session length (`liveSession.durationMinutes`, "[DURATION TO BE
  SUPPLIED]").

### Content

- [ ] Per course: title, one line promise, lesson count, minutes per lesson,
  three to five "What you'll learn" lines, lesson titles, teacher, and a
  join link when it opens (`content/classes/*.mdx`: `lessons`,
  `minutesPerLesson`, `outcomes`, `outline`, `teacher`, `joinUrl`).
- [ ] Teacher: confirm "Isaac Ola" on course pages, and a short biography
  for About.
- [ ] Doctrinal statement for About ("What we believe").
- [ ] New Testament book introductions (only Matthew exists, as a sample).
- [ ] Written teachings (one sample exists), with reading times.
- [ ] Reading plan detail: day one readings confirmed against the app, and
  frequently asked questions.
- [ ] Event details for any dated session: date, time, time zone, YouTube
  link, passages and description (one sample event exists).
- [ ] Contact page: response time, email address and other ways to reach
  the ministry; contact form privacy wording.
- [ ] Privacy policy facts: legal name, address and contact email,
  retention periods (questions included), international transfers per
  processor, how to exercise rights, date of last update.

### Photos and brand

- [ ] Photo of Isaac Ola teaching (Home hero, to replace the loop) and a
  portrait (Home teacher section, About).
- [ ] Logo as SVG, and a reversed (light) mark for the dark theme. Then
  rebuild the favicon, Apple icon and share image
  (`node scripts/og/build-og.mjs`).
- [ ] Replace the interim (AI generated) `home-start-here` image, shown only
  when the video feed is down.

### Links

- [ ] Google Play and App Store links (store badges appear when set;
  `siteConfig.links.googlePlay`, `appStore`).
- [ ] Confirm the social accounts in `siteConfig.links.social`.
- [ ] Audio platforms, if any (Teachings once had a Listen section; add a
  line back when links exist).

## 3. From the developer

- [ ] Switch `siteConfig.academy.status` to `"open"` once real courses are loaded.
- [ ] Build the contact form slice (route handler, Zod, honeypot, rate limit,
  Resend).
- [ ] Calendar files: an "Add to calendar" button and build time `.ics` once
  events carry real dates (the placeholder note stays until then).
- [ ] App deep link on plan pages, once the app developer confirms the URL
  scheme ("[APP DEEP LINK TO BE CONFIRMED]"). Do not invent it.
- [ ] Rename the Teachings route from `/media` to `/teachings` (and move
  written teaching), with redirects, once agreed.
- [ ] Rerun mobile Lighthouse on the Vercel preview (this machine's numbers
  are noisy; see docs/PLACEHOLDERS.md).
- [ ] Optional: a stronger light Home loop if the ribbon still reads faint
  (docs/PLACEHOLDERS.md, "Carry-over fixes").

## 4. Go-live steps

1. **Environment variables** in Vercel (Production and Preview), all
   server only, none with `NEXT_PUBLIC_` (names in `.env.example`):
   `KIT_API_KEY`, `KIT_FORM_ID`, the `KIT_TAG_*` ids, `YOUTUBE_CHANNEL_ID`,
   `RESEND_API_KEY`, `RESEND_FROM`, `QUESTIONS_TO_EMAIL`.
2. **Connect the domain.** Add `hobglobal.online` (and `www`, redirecting to
   the apex) in Vercel, set the DNS records it lists, and wait for the
   certificate. `siteConfig.url` is already `https://hobglobal.online`.
3. **Verify the sending domain** in Resend (SPF and DKIM) for
   `RESEND_FROM`.
4. **Remove noindex.** Set `noindex: false` in `lib/site-config.ts` once no
   placeholder copy remains (search the built HTML for `data-placeholder`).
5. **Deploy** `main` after merging this branch.
6. **Re-run every check on the live URL:**
   - `node scripts/check-html.mjs https://hobglobal.online`
   - `node scripts/check-headers.mjs https://hobglobal.online` (expect
     strict-transport-security on Vercel)
   - `PLAYWRIGHT=<path> node scripts/check-noscript.mjs https://hobglobal.online`
   - `PLAYWRIGHT=<path> node scripts/check-loops.mjs https://hobglobal.online`
   - Mobile Lighthouse, median of three, on Home, Academy, Teachings and About
7. **Test the forms end to end**: a newsletter signup (confirm the double
   opt-in email arrives), an anonymous question, and a contact message.
8. **Submit the sitemap** (`/sitemap.xml`) in Google Search Console and
   Bing Webmaster Tools, and add the site in Plausible.
