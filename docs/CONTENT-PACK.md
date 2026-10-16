# House of Bread Global: Content Pack and Layout Brief

Date: 16 October 2026
Use with: CLAUDE.md and docs/SPEC-v3.md
Purpose: real copy and layout direction for all 17 stage-one routes, replacing the placeholder pages.
Revision: light theme. White is the base, and green blends are used for the header, hero, bands, buttons and icons.

Rules for using this file:
- Copy below is final unless it contains [SQUARE BRACKETS]. Brackets mark facts nobody has supplied yet. Render them as clearly marked placeholders and list each in docs/PLACEHOLDERS.md.
- Do not invent facts to fill brackets: no teacher name, event times, class details, social links, store links, contact details or doctrinal statements.
- Copy follows CLAUDE.md section 6: no em or en dashes, hyphen bullets, no first person in marketing copy.
- All scripture is KJV, quoted in full with surrounding verses, through the Scripture component.

---

## 1. Design direction

The site must feel like a serious, warm teaching ministry, not a template. Calm, confident, generous with space, and fast on a mid range Android phone.

### Look and feel
- White is the base. Page backgrounds, reading areas and most sections are white or a very light green tint. This is a light site by default.
- Green carries the brand. The header and nav bar, the hero, the inner page header bands, the app band, the newsletter band, the footer, buttons and icons use green blends (gradients between the deep greens). Lime and mint are accents on those green surfaces.
- Lime and mint do not work as text or thin lines on white (about 2:1 contrast). On white, use deep green for text, links and rules. Lime and mint appear on white only as decorative fills or as icon fills behind dark or white glyphs.
- Large, confident headings. Generous vertical rhythm: 96px between major sections on desktop, 64px on mobile.
- Depth without images: green gradient surfaces with subtle radial lime glow at low opacity, a faint oversized cross watermark and leaf shapes drawn as inline SVG. No stock photos. No decorative JavaScript.
- Cards on white: white surface, 1px border at 15% deep green, soft shadow, 16px radius. On hover and focus the border becomes deep green at 60% and the shadow deepens slightly.
- Icons: each sits inside a rounded square filled with a green gradient, with the glyph in white or lime.
- A short lime rule above each section heading is the recurring motif. Because lime fails on white, the rule is decorative only and the heading itself is deep green.

### Colour tokens (light first)
Approximate values from the brand banner, all marked TODO until official hex values arrive. Keep names semantic so a dark theme can be added later, but ship light only.

| Token | Value | Use |
|---|---|---|
| surface | #ffffff | page background |
| surface-tint | #f3f8ec | alternate sections, scripture panels, input backgrounds |
| ink | #0b2412 | body text on white |
| ink-muted | #3d5a46 | secondary text on white |
| green | #0a3616 | headings on white, links, primary button fill on white, icon fills |
| green-deep | #04290e | gradient end, footer, header |
| green-night | #011f0b | darkest gradient stop |
| lime | #a6c859 | accent on green surfaces, button fill on green surfaces |
| mint | #05d47c | progress and success accents on green surfaces |
| success-on-white | #0b7a45 | success text on white |
| on-green | #f8f9f8 | text on green surfaces |
| on-lime | #0a3616 | text on lime or mint |

The existing dark tokens (background, background-deep, foreground and so on) change meaning, so rename or remap them rather than leaving old names with flipped values. Record the migration in docs/PLACEHOLDERS.md.

### Buttons and links
- Primary on white: deep green fill, white text.
- Primary on green surfaces: lime fill, deep green text.
- Secondary on white: transparent, deep green 2px border, deep green text.
- Secondary on green surfaces: transparent, lime 2px border, white text.
- Links on white: deep green, underlined. Links on green surfaces: lime, underlined.
- Never white text on lime or mint. Never lime or mint text on white.
- Visible focus ring on every interactive element: 3px, deep green on white and lime on green surfaces, with 3:1 contrast against its surroundings.

### Surface map (page rhythm)
Alternate surfaces so long pages have a clear rhythm.

| Element | Surface |
|---|---|
| Header and nav bar | green gradient (green to green-deep), white wordmark, lime primary button |
| Home hero | rich green gradient with lime glow and cross watermark, white text, lime accents |
| Inner page header band | shorter green gradient with white text and lime eyebrow |
| Feature cards, plan cards, book grid, event cards | white cards on white or surface-tint sections |
| Context split section, FAQ, steps | surface-tint |
| Scripture panel on home and about | green gradient panel, serif white text, lime reference label |
| ScriptureBlock inside teaching text | surface-tint panel, deep green left rule, serif ink text |
| App band | green gradient with lime accents and the CSS phone frame |
| Newsletter band | green gradient, white inputs, lime button |
| Teaching and book body text | white, serif, ink |
| Footer | green-deep to green-night gradient, white text, lime links |
| 404, error, check-email | white page with a green icon tile and deep green heading |

Text contrast on every gradient stop must meet 4.5:1, so keep the lime glow at low opacity and away from body text.

### Typography
- Headings and UI: a clean geometric sans (keep the existing Next.js font if it fits).
- Long reading and scripture: add one serif family through next/font, subset to Latin, two weights only, for teaching body text and scripture blocks. Justify the choice in the commit message.
- Wordmark: HOUSE OF in regular weight, BREAD in bold, wide letter spacing, uppercase. Use text until the real logo SVG is supplied, with a TODO to replace it.
- Body size 18px minimum on content pages, line height 1.7, line length capped near 68 characters.

### Shared components to build
- PageHeader: a green gradient band with a lime eyebrow, white h1, white lead paragraph and optional actions. Used by every inner page.
- Section: lime rule, h2, optional intro, content area.
- Card, PlanCard, BookGrid, FeatureList, LiveSessionCard, StepList.
- ScriptureBlock: wraps the Scripture component. Serif text, reference label and "KJV" label. Two variants: light (surface-tint panel, deep green left rule, ink text) for teaching text, and dark (green gradient panel, white text, lime label) for feature moments on Home and About.
- NewsletterBand: full width green gradient band with white inputs, a lime button and the signup form (form wiring comes in the newsletter slice, so render the real form UI now with the action disabled and a visible "Signup opens soon" note).
- AppBand: app promotion with feature list and store button placeholders.
- EmptyState: icon, one line, one action.
- Prose: styled wrapper for MDX body content.

### Per page, every page needs
- A PageHeader, at least three distinct sections, a closing call to action (newsletter or app), unique metadata, and loading and empty states where lists appear.

---

## 2. Global elements

### Header
- Green gradient bar, sticky on scroll, with a subtle bottom edge. White wordmark on the left. Nav links in white, with a lime underline on the current page.
- Nav: Teachings, New Testament, Plans, Live, Classes, About.
- Right: primary button "Get the app" (links to /app). Secondary text link "Subscribe".
- Mobile: details and summary menu, full width, large tap targets.

### Footer
Four columns on desktop, stacked on mobile.
- Brand: wordmark and "A teaching ministry committed to doctrinal clarity and careful handling of Scripture, serving readers across the United Kingdom, Africa and the United States."
- Learn: Teachings, New Testament, Reading plans
- Ministry: About, Live sessions, Classes and training, Contact
- Connect: Subscribe, Get the app, [SOCIAL LINKS: YouTube, and other pages to be supplied]
- Bottom line: "© 2026 House of Bread Global" and a Privacy link.

---

## 3. Home (/)

Metadata title: House of Bread Global
Metadata description: Understand the Bible through the New Testament. Structured reading plans, every book explained, and careful teaching on doctrine, in the app and on the web.

### Hero
- Eyebrow: A TEACHING MINISTRY
- H1: Understand the Bible through the New Testament, not just read past it.
- Lead: Structured reading plans, a clear explanation of every book, and careful teaching on doctrine. Scripture in context, with the background that makes it land.
- Primary button: Start a reading plan (to /plans)
- Secondary button: Get the app (to /app)
- Text link: Join the newsletter (to /subscribe)
- Tagline strip under the buttons: STUDY . PRAY . GROW
- Visual: a rich green gradient hero with a soft lime glow, a large cross watermark and leaf shapes in SVG at low opacity, behind the text on the right on desktop and below on mobile. The hero ends with a gentle curved or faded edge into the white page below, not a hard line. White text, lime eyebrow and tagline.

### Next live session
- Heading: Next live session
- Card shows the next event from content, or the empty state.
- Empty state: Live sessions stream on YouTube. The next date will appear here. Ask to be notified and it will arrive in your inbox.
- Buttons: Notify me (to /subscribe), See all sessions (to /events)

### What you will find here (four feature cards)
- In-depth Bible study: Every New Testament book explained. Who wrote it, who received it, and what it was written to settle.
- Guided study plans: Three routes from Matthew to Revelation, in the order the books were written.
- Trusted teaching: Written teaching on doctrine, interpretation and the questions believers actually ask.
- A global ministry: Serving readers across the United Kingdom, Africa and the United States.

### Why context matters (split section, large text left, scripture right)
- H2: Context is not decoration
- Text: A letter read without knowing what prompted it will be misread, and most misreadings of the New Testament begin exactly there. Each book here starts with the situation behind it, so the argument makes sense before the verses are lifted out.
- Link: See how the books are explained (to /new-testament)

### Reading plans (three PlanCards)
- H2: Choose a pace that fits real life
- 30 day plan: A focused, fast-moving read.
- 60 day plan: A steady, balanced pace.
- 90 day plan: Unhurried reading with room to think.
- Under the cards: Progress is tracked automatically in the app. Open it and continue exactly where the last session ended.

### Books teaser
- H2: Twenty-seven books, each with a written introduction
- Show the five introduction headings as a compact list: Who wrote it and when. The audience and the situation behind the letter. The central argument and how it unfolds. The themes that run through it. Where it sits in the wider story of Scripture.
- Button: Browse the books

### App band
- H2: Take the reading with you
- Text: Clean, distraction-free reading with six translations and the King James Version as the default. Switch versions without losing your place.
- FeatureList: Six translations throughout. Swipe between chapters. Readable typography for long sessions. Works on modest devices and modest data.
- Buttons: [GOOGLE PLAY LINK] and [APP STORE LINK OR "COMING SOON", CONFIRM WITH APP DEVELOPER]

### Scripture
ScriptureBlock, John 6:33-35, KJV, label "The name behind the ministry":
For the bread of God is he which cometh down from heaven, and giveth life unto the world.
Then said they unto him, Lord, evermore give us this bread.
And Jesus said unto them, I am the bread of life: he that cometh to me shall never hunger; and he that believeth on me shall never thirst.

### Newsletter band
- H2: Never miss a session
- Text: Teaching, new reading plans and live session reminders, sent to your inbox.
- Form: first name (optional), email, button "Subscribe"
- Consent line: By subscribing you agree to receive emails from House of Bread Global. You will be asked to confirm your address, and you can unsubscribe at any time. Read the privacy policy.

---

## 4. About (/about)

Metadata title: About
Metadata description: House of Bread Global is a teaching ministry committed to doctrinal clarity and careful handling of Scripture, serving readers across the United Kingdom, Africa and the United States.

### PageHeader
- Eyebrow: ABOUT
- H1: A teaching ministry built on the bread of life
- Lead: House of Bread Global is committed to doctrinal clarity and careful handling of Scripture, serving readers across the United Kingdom, Africa and the United States.

### The name
- Text: The name comes from Bethlehem, the house of bread, and from the One who claimed the title for himself. The aim is not information for its own sake, but Scripture read well, understood clearly, and allowed to feed.
- ScriptureBlock: John 6:33-35 KJV (same as home)

### What the ministry does (five cards)
- Teaching: Written teaching on doctrine, interpretation and the questions believers actually ask.
- Reading plans: Guided routes through the New Testament in the order the books were written.
- Live sessions: Teaching streamed on YouTube, with reminders by email.
- Classes and training: Structured learning for those who want to go further than reading alone.
- The app: Daily reading, six translations and progress tracking, on a phone.

### How Scripture is handled (numbered, four items)
1. Context first. Who wrote it, who received it, and what prompted it, before any verse is applied.
2. Scripture in full. Passages are quoted whole, with the verses either side where the argument depends on them.
3. A clear text. The King James Version is the primary text. Any other translation is labelled.
4. Plain English. Rigorous without being academic, and warm without being vague.

### Who teaches
- [TEACHER NAME, PHOTO AND SHORT BIOGRAPHY TO BE SUPPLIED]

### Doctrinal position
- [DOCTRINAL STATEMENT TO BE SUPPLIED BY THE MINISTRY. Layout: a short list of headed statements, each with supporting Scripture.]

### Closing call to action
- Two buttons: Join the newsletter, Contact the ministry

---

## 5. Live sessions and events (/events)

Metadata title: Live sessions and events
Metadata description: Live teaching sessions stream on YouTube. See what is coming, in your local time, and ask to be notified.

### PageHeader
- Eyebrow: LIVE
- H1: Live sessions and events
- Lead: Live sessions stream on YouTube. This page shows what is coming, in your local time.

### How it works (StepList, four steps)
1. Find a session below.
2. Add it to your calendar, or ask to be notified by email.
3. Join on YouTube when it starts.
4. Watch the replay afterwards if you miss it.

### Upcoming
- List of LiveSessionCards from content, each showing title, date, local time with the ministry time zone beside it, duration and a "Details" link.
- Empty state: No sessions are scheduled yet. Subscribe and the next date will arrive in your inbox.

### Weekly rhythm
- [WEEKLY SCHEDULE AND MINISTRY TIME ZONE TO BE SUPPLIED]

### Replays
- Empty state: Replays will appear here after each session.

### Closing band
- Newsletter band with tag live-notify and heading "Get a reminder before each session".

### Event detail (/events/[slug])
- Header: kind label (Live, Training or Meeting), title, date and time in local time plus ministry zone, duration.
- Buttons: Watch on YouTube (disabled with a note until a link exists), Add to calendar
- Sections: About this session, Passages (linked references), Notify me band
- Footer links: Back to all sessions

---

## 6. Classes and training (/classes)

Metadata title: Classes and training
Metadata description: Structured teaching for those who want to go further than reading alone. See what each class covers, who it is for and how to join.

### PageHeader
- Eyebrow: CLASSES AND TRAINING
- H1: Go further than reading alone
- Lead: Structured teaching, taught with the same care for context and doctrine as everything else here.

### Class list
- Cards from content: title, one line summary, who it is for, when it runs.
- Empty state: Class details are being prepared. Subscribe to hear when enrolment opens.

### How to join
- [JOINING METHOD TO BE SUPPLIED: form, WhatsApp link or email]

### Who classes are for (four items)
- New believers who want a structured way into the New Testament
- Readers who have started Bible plans before and stalled
- Students and teachers who want to handle Scripture with more care
- Anyone who wants to know the Scriptures rather than simply own one

### Class detail (/classes/[slug])
- Sections: What it covers, Who it is for, When it runs, How to join, Cost, [CLASS DETAILS TO BE SUPPLIED]
- Closing band: newsletter

---

## 7. Teachings (/teachings)

Metadata title: Teachings
Metadata description: Written teaching on doctrine, interpretation and the questions believers actually ask. Rigorous without being academic.

### PageHeader
- Eyebrow: TEACHINGS
- H1: Teaching written to be understood
- Lead: A growing library on doctrine, interpretation and the questions believers actually ask. Rigorous without being academic.

### Topics (three cards, visual only until filtering is built)
- Doctrine: What Scripture teaches, and how the argument is built.
- Interpretation: How to read a passage the way its first readers did.
- Questions believers ask: Clear answers, grounded in the text.

### Latest teachings
- Article cards: title, summary, reading time, passages.
- Empty state: The first teachings are being prepared. Subscribe to be told when they are published.

### Closing band
- Newsletter

### Teaching detail (/teachings/[slug])
- Header: title, date, reading time, passages as linked chips
- Body in Prose with serif text, ScriptureBlocks for all quotations
- Footer: Related teachings (empty state allowed), newsletter band
- Sample content must be marked draft and placeholder.

---

## 8. New Testament (/new-testament)

Metadata title: Every New Testament book, explained
Metadata description: Twenty-seven books, each with a written introduction: who wrote it, who received it, the central argument, the themes, and where it sits in the story of Scripture.

### PageHeader
- Eyebrow: THE NEW TESTAMENT
- H1: Every book, explained
- Lead: Twenty-seven books, each with a written introduction. Context is not decoration. A letter read without knowing what prompted it will be misread, and most misreadings of the New Testament begin exactly there.

### What each introduction covers (five numbered items)
1. Who wrote it and when
2. The audience and the situation behind the letter
3. The central argument and how it unfolds
4. The themes that run through it
5. Where it sits in the wider story of Scripture

### Book index (BookGrid, grouped, 27 items)
- The Gospels and Acts: Matthew, Mark, Luke, John, Acts
- Paul's letters: Romans, 1 Corinthians, 2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1 Thessalonians, 2 Thessalonians, 1 Timothy, 2 Timothy, Titus, Philemon
- Hebrews and the general letters: Hebrews, James, 1 Peter, 2 Peter, 1 John, 2 John, 3 John, Jude
- Prophecy: Revelation
- Books without published content show a "Coming soon" label and are not links. Slugs come from /lib/scripture when it exists, so use the temporary placeholder data until then.

### Closing band
- App band: Read each book alongside the text in the app.

### Book detail (/new-testament/[book])
- H1: {Book}: an introduction
- Five sections using the five headings above, with placeholder body text marked as such
- Previous and next book links
- Band: Read {Book} in the app

---

## 9. Reading plans (/plans)

Metadata title: Reading plans
Metadata description: Three guided routes through the New Testament, following the order the books were written. 30, 60 and 90 day plans.

### PageHeader
- Eyebrow: READING PLANS
- H1: Three routes through the New Testament
- Lead: Each plan follows the actual timeline the books were written, as events developed in the early Church, so the story reads in order.

### Plan cards
- 30 day plan: A focused, fast-moving read.
- 60 day plan: A steady, balanced pace.
- 90 day plan: Unhurried reading with room to think.
- Each card: days, pace, one line, button "View plan"

### How the plans work (StepList)
1. Choose the pace that fits your week.
2. Open the app and start day one.
3. Read each day. Progress is tracked automatically.
4. Come back any time and continue exactly where the last session ended.

### Why the order matters
- Text: Reading the books in the order they were written lets each letter be heard against the events that prompted it. The same passage reads differently once the situation behind it is known.

### Closing band
- App band

### Plan detail (/plans/[slug])
- Header: plan name, days, pace
- Sections: About this plan, A look at day one, How to follow it in the app, Frequently asked
- Day one sample for the 30 day plan, taken from the app: Day 1, James 1-5 and Galatians 1-3, theme "Living faith and justification by faith." Mark as sample, confirm against the app.
- Band: Open this plan in the app [APP DEEP LINK TO BE CONFIRMED]

---

## 10. App (/app)

Metadata title: The House of Bread app
Metadata description: Bible study, trusted teaching and practical guidance all in one place. Reading plans, every New Testament book explained, and six translations.

### PageHeader
- Eyebrow: THE APP
- H1: The House of Bread app
- Lead: Bible study, trusted teaching and practical guidance all in one place. Equipping you for a deeper understanding of God's Word and a stronger walk with Him.
- Buttons: [GOOGLE PLAY LINK], [APP STORE LINK OR "COMING SOON", CONFIRM]

### Feature sections (alternating layout)
- Study plans: Three guided routes through the New Testament, following the order the books were written. Progress is tracked automatically. Open the app and continue exactly where the last session ended.
- Six translations: Comparing translations is one of the simplest ways to see what a passage is actually saying. Where one rendering is familiar, another often makes the meaning plain. The King James Version is the default text, and versions switch without losing your place.
- Every book explained: Twenty-seven books, each with a written introduction covering who wrote it, who received it, the central argument, the themes and where it sits in Scripture.
- Articles and teaching: A growing library of written teaching on doctrine, interpretation and the questions believers actually ask.

### Built for daily use (four items)
- Clean, distraction-free reading
- Swipe navigation between chapters
- Readable typography for long sessions
- Works on modest devices and modest data

### Who it is for (four items)
- New believers who want a structured way into the New Testament
- Readers who have started Bible plans before and stalled
- Students and teachers who want translation comparison without a desk full of books
- Anyone who wants to know the Scriptures rather than simply own one

### Visual
- A phone frame built in CSS showing a simple mock of the reading screen. No screenshot is required, and any real screenshots are added when supplied.

---

## 11. Subscribe (/subscribe)

Metadata title: Join the newsletter
Metadata description: Teaching, new reading plans and live session reminders from House of Bread Global, sent to your inbox.

- Eyebrow: NEWSLETTER
- H1: Stay close to the teaching
- Lead: Teaching, new reading plans and reminders for live sessions, sent to your inbox. No spam, and you can leave at any time.
- Form: first name (optional), email, checkbox "Remind me before each live session" (tag live-notify), button "Subscribe"
- Consent line: By subscribing you agree to receive emails from House of Bread Global. You will be asked to confirm your address. Read the privacy policy.
- Side panel: What to expect: New teaching and reading plans. Reminders before live sessions. Occasional news from the ministry.
- Error and success copy: "Enter a valid email address." "Something went wrong. Please try again in a moment."

### Check your email (/subscribe/check-email)
- H1: Check your email
- Text: A confirmation email is on its way. Click the link inside to finish subscribing. If it does not arrive within a few minutes, check the spam or promotions folder.
- Link: Back to the home page
- Permanent noindex.

---

## 12. Contact (/contact)

Metadata title: Contact
Metadata description: Get in touch with House of Bread Global.

- Eyebrow: CONTACT
- H1: Get in touch
- Lead: Questions about the teaching, classes or the app are welcome.
- Form: name, email, topic (General question, Classes and training, The app, Something else), message, honeypot field, button "Send message". Form UI is real, action disabled with note "Messaging opens soon" until the contact slice.
- Side panel: [RESPONSE TIME, EMAIL ADDRESS AND SOCIAL LINKS TO BE SUPPLIED]

---

## 13. Privacy (/privacy)

Metadata title: Privacy policy
Metadata description: How House of Bread Global collects, uses and protects personal data.

This is a draft structure for review by a qualified person before launch. It is not legal advice. Mark the page with a visible "Draft, under review" badge until approved.

Sections:
1. Who is responsible: [LEGAL NAME, ADDRESS AND CONTACT EMAIL OF THE MINISTRY]
2. What is collected: email address and optional first name when subscribing, and name, email and message when using the contact form. Basic anonymous visit statistics.
3. Why and on what basis: to send the newsletter, with consent, and to reply to messages, as a legitimate interest.
4. Who processes the data: Kit (newsletter), Resend (contact form email), Vercel (hosting), Plausible (cookieless analytics). Add any others before launch.
5. Cookies: no tracking cookies are used, so no cookie banner is shown. Embedded YouTube video loads only after a visitor chooses to play it.
6. Retention: [RETENTION PERIODS TO BE SUPPLIED]
7. International transfers: [TO BE CONFIRMED FOR EACH PROCESSOR]
8. Your rights: under UK GDPR and the Nigeria Data Protection Act, including access, correction, deletion and withdrawing consent, and how to exercise them.
9. Unsubscribing: every email has an unsubscribe link.
10. Changes and date: [DATE OF LAST UPDATE]

---

## 14. System pages

### 404
- H1: This page could not be found
- Text: The link may be old, or the address may have been typed differently. Try one of these instead.
- Links: Home, Teachings, Reading plans, New Testament, Live sessions
- Permanent noindex.

### Error
- H1: Something went wrong
- Text: The page could not load. Try again, and if the problem continues, contact the ministry.
- Buttons: Try again, Go home

### Loading
- Skeleton blocks shaped like a PageHeader and three cards. No spinner.

---

## 15. Acceptance checks for this pass

- Every page has a PageHeader, at least three sections and a closing call to action.
- No page is just an h1 and a paragraph.
- All copy matches this file exactly, with brackets rendered as marked placeholders and logged in docs/PLACEHOLDERS.md.
- White is the page background everywhere except the green surfaces listed in the surface map. No page renders as mostly dark.
- Every text and background pairing, including each gradient stop, is checked against WCAG 2.2 AA and the results logged in docs/PLACEHOLDERS.md. Lime or mint text never appears on white.
- Works at 375px with no horizontal scroll, keyboard only, and with JavaScript disabled for navigation.
- Lighthouse 95 or above on performance and accessibility for Home, About, Plans and the New Testament index.
- No new dependency except the serif font via next/font.
