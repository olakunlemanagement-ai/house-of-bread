# House of Bread Global: Content Pack and Layout Brief

Date: 16 October 2026
Revision: 2 (ministry first, premium UI). Replaces docs/CONTENT-PACK.md.
Use with: CLAUDE.md and docs/SPEC-v3.md
Purpose: real copy and layout direction for all 17 stage-one routes.

Rules for using this file:
- Copy below is final unless it contains [SQUARE BRACKETS]. Brackets mark facts nobody has supplied yet. Render them as clearly marked placeholders and list each in docs/PLACEHOLDERS.md.
- Do not invent facts to fill brackets: no founding story, attendance figures, teacher name, event times, class details, social links, store links, contact details or doctrinal statements.
- Copy follows CLAUDE.md section 6: no em or en dashes, hyphen bullets, no first person in marketing copy.
- All scripture is KJV, quoted in full with surrounding verses, through the Scripture component.

---

## 0. Positioning (read first)

### What the site is
The home of House of Bread Global, a teaching ministry serving believers across the United Kingdom, Africa and the United States. It is not a Bible study website and not an app landing page.

### The app
The House of Bread app is the official app of the ministry. It carries the ministry's New Testament journeys, book introductions, teaching and six translations. It is one of the ways the ministry reaches people, and one of the main calls to action. It is never the whole story.

### Order of importance on the site
1. Live teaching (YouTube sessions)
2. Classes and training
3. The official app, including the New Testament journeys
4. Written teaching and New Testament study
5. Connecting: social pages and the newsletter

### Voice
- The ministry is spoken about in the third person: "House of Bread Global teaches..." The reader is "you". Never "we", "our" or "us".
- Warm, direct, pastoral and rigorous. Plain contemporary English.
- Use: the ministry, teaching, the Word, believers, sessions, the official app, be fed, grow.
- Avoid: Bible study app, platform, content, users, resources, solution.
- Every page answers two questions: what does the ministry offer here, and what is the next step?

---

## 1. Design direction (premium)

The site must feel like a confident, modern global ministry. Alive, warm and polished, never a template. Fast on a mid range Android phone.

### 1.1 Feel
- White is the base. Page backgrounds and reading areas are white or a very light green tint.
- Green carries the brand: the header, hero, inner page headers, bands, footer, buttons and icon tiles use green blends. Lime and mint are accents on green surfaces only.
- Lime and mint have about 1.9:1 contrast on white, so they are never used as text or thin lines on white. On white use deep green.
- Premium comes from scale, spacing, depth and detail: large type, generous space, layered surfaces, consistent radii, soft layered shadows, and small hover and focus moments.

### 1.2 Colour tokens (light first)
Approximate values from the brand banner, all marked TODO until official hex values arrive. Keep names semantic so a dark theme can be added later, but ship light only.

| Token | Value | Use |
|---|---|---|
| surface | #ffffff | page background |
| surface-tint | #f3f8ec | alternate sections, scripture panels, input backgrounds |
| ink | #0b2412 | body text on white |
| ink-muted | #3d5a46 | secondary text on white |
| green | #0a3616 | headings on white, links, primary button fill on white, icon tiles |
| green-rich | #0f4a22 | lightest gradient stop on green surfaces |
| green-deep | #04290e | gradient end, header, footer |
| green-night | #011f0b | darkest gradient stop |
| lime | #a6c859 | accent on green surfaces, button fill on green surfaces |
| mint | #05d47c | progress and success accents on green surfaces |
| success-on-white | #0b7a45 | success text on white |
| on-green | #f8f9f8 | text on green surfaces |
| on-lime | #0a3616 | text on lime or mint |

Gradients:
- Hero and bands: linear-gradient(135deg, green-rich 0%, green 45%, green-deep 100%), plus a radial lime glow at no more than 18% opacity placed away from body text.
- Footer: green-deep to green-night.
Check every text pairing against every gradient stop. Log results in docs/PLACEHOLDERS.md.

### 1.3 Typography
- Display and headings: the serif already installed (Literata) at weight 600, used large. This gives the site gravitas that a plain sans cannot.
- UI, nav, buttons, labels, eyebrows: the existing sans.
- Scale (use clamp): H1 clamp(2.75rem, 6vw, 5rem) with line height 1.05 and letter spacing -0.02em. H2 clamp(2rem, 4vw, 3rem). Lead paragraph 1.25rem. Body 18px minimum, line height 1.7, line length near 68 characters.
- Eyebrows: 0.8rem, uppercase, letter spacing 0.18em, semi bold. Lime on green surfaces, deep green on white.
- Wordmark: HOUSE OF in regular weight, BREAD in bold, wide letter spacing, uppercase. Text until the real logo SVG is supplied, with a TODO.

### 1.4 Layout and composition
- Container 1200px, with 24px gutters on mobile. Section spacing 112px on desktop, 72px on mobile.
- Break the repeated row of cards. Use a bento grid on Home for "ways to be fed": one large tile, two medium, one small, different surfaces.
- Overlap and depth: hero visuals overlap the hero edge into the white page. Floating cards sit partly outside their parent.
- Alternate section surfaces: white, tint, green band, white.
- Asymmetric splits (7/5 columns) instead of centred stacks. Align text left on content, centre only on short closing bands.

### 1.5 Depth, shape and detail
- Radii: cards 24px, buttons 14px, inputs 12px, icon tiles 16px.
- Shadows, two layers: soft = 0 1px 2px rgba(10,54,22,0.06), 0 12px 32px rgba(10,54,22,0.08). Raised = 0 2px 4px rgba(10,54,22,0.08), 0 24px 48px rgba(10,54,22,0.14).
- Cards on white: white surface, 1px border at 12% deep green, soft shadow. Hover and focus: lift 4px, raised shadow, border at 50%.
- Icon tiles: rounded square, green gradient fill, white or lime glyph, subtle inner highlight.
- Texture: a very faint inline SVG grain on green surfaces (under 2KB), a large cross watermark and leaf shapes at low opacity. No stock photos.
- A short lime rule above section headings on green surfaces, deep green on white.

### 1.6 Motion (CSS only)
- No JavaScript for decoration. Use CSS transitions and keyframes on transform and opacity only.
- Entrance: hero text and visuals fade and rise 16px over 600ms, staggered by 80ms. Section reveal on scroll using CSS scroll driven animation where supported, with no animation as the fallback.
- Hover: buttons lift 2px, the arrow icon in a button nudges 4px right. Cards lift 4px.
- A slow, subtle drift on the hero glow (30s loop) on desktop only.
- Respect prefers-reduced-motion: disable all of the above.
- No backdrop-filter, large blurs or full-screen animated gradients. They cost frames on mid range Android.

### 1.7 Imagery
- Real photography is the biggest single lift for "alive". Until it arrives, use art directed placeholder frames (gradient, subtle pattern, a small "Photo to come" label, 4:5 and 16:9 ratios).
- Ask the ministry for: a portrait of the teacher, 10 to 15 photos of sessions and gatherings, a 60 to 90 second welcome video, real app screenshots, the logo SVG (mark and wordmark), and a social share image.
- The welcome video loads behind a click to load facade (youtube-nocookie.com).
- Use next/image with explicit dimensions and modern formats when photos arrive.

### 1.8 Components to build
- AnnouncementBar: appears only when a session is live or starts within 24 hours. Lime background, deep green text, "Live now: {title}. Watch on YouTube". Hidden otherwise.
- SiteHeader: green gradient bar, sticky.
- Hero with HeroVisual: phone mock in CSS plus two floating cards.
- Button (primary, secondary, ghost, on-white, on-green) with an optional arrow icon.
- BentoGrid and BentoTile, FeatureCard, IconTile.
- StatStrip, RegionChips, SocialLinks.
- Section, SectionHeader, PageHeader (green gradient band), StepList.
- ScriptureBlock, light and dark variants.
- PlanCard, BookGrid, LiveSessionCard, EventCard.
- NewsletterBand, AppBand, StoreButtons, EmptyState.
- Prose for MDX body text.

### 1.9 Buttons and links
- Minimum height 52px desktop and 48px mobile, horizontal padding 24px, font weight 600, radius 14px.
- Primary on white: deep green fill, white text.
- Primary on green: lime fill, deep green text.
- Secondary on white: transparent, 2px deep green border, deep green text.
- Secondary on green: transparent, 2px lime border, white text.
- Text links: deep green underlined on white, lime underlined on green, with an arrow for "go to" links.
- Never white text on lime or mint. Never lime or mint text on white.
- Focus ring 3px, deep green on white and lime on green, with 3:1 contrast against its surroundings.
- On mobile, hero and band buttons are full width and stacked.

### 1.10 CTA system
One primary action per section, written as a verb that says what happens next. Never "Click here" or "Learn more" alone.

| Page | Primary CTA | Secondary CTA |
|---|---|---|
| Home hero | Join the next live session | Get the official app |
| Home bento | See upcoming sessions, Explore classes, Get the app, Read the teachings | none |
| About | Join a live session | Contact the ministry |
| Live | Set a reminder | Subscribe on YouTube |
| Classes | See how to join | Hear when enrolment opens |
| Teachings | Subscribe for new teaching | none |
| Study | Read this book in the app | Browse all 27 books |
| Journeys | Start a journey in the app | Compare the three paces |
| App | Get the app | See what is inside |
| Closing bands | Subscribe | none |

### 1.11 Surface map

| Element | Surface |
|---|---|
| Announcement bar | lime, deep green text |
| Header and nav | green gradient, white wordmark, lime primary button |
| Home hero | rich green gradient with glow, grain and watermark, white text, lime accents |
| Inner page header | shorter green gradient band, white text, lime eyebrow |
| Stat strip | white, overlapping the hero edge, soft shadow |
| Bento tiles | one deep green gradient tile, others white or surface-tint |
| Feature and plan cards | white on white or tint sections |
| Split text sections, steps, FAQ | surface-tint |
| Feature scripture panel (Home, About) | green gradient, serif white text, lime reference label |
| Scripture inside teaching text | surface-tint panel, deep green left rule, serif ink text |
| App band | green gradient with phone frame |
| Newsletter band | green gradient, white inputs, lime button |
| Teaching and book body | white, serif, ink |
| Footer | green-deep to green-night, white text, lime links |
| 404, error, check-email | white page with a green icon tile and deep green heading |

---

## 2. Global elements

### Announcement bar
- Content driven from event data. Hidden when no session is live or within 24 hours.

### Header
- Wordmark left. Nav: Live, Classes, Teachings, Study, The App, About.
- Right: primary button "Get the app" and a text link "Subscribe".
- Current page has a lime underline. Mobile: details and summary menu, full width, large tap targets, the app button pinned at the bottom of the menu.

### Footer
- Top strip: a closing CTA row with the headline "Stay close to the ministry" and a Subscribe button.
- Columns:
  - Brand: wordmark and "A teaching ministry committed to doctrinal clarity and careful handling of Scripture, serving believers across the United Kingdom, Africa and the United States." Region chips: United Kingdom, Africa, United States.
  - Ministry: About, Live sessions, Classes and training, Contact
  - Learn: Teachings, Study the New Testament, New Testament journeys, The official app
  - Follow: YouTube [CHANNEL LINK], [OTHER SOCIAL PLATFORMS AND LINKS TO BE SUPPLIED]
- Bottom line: "© 2026 House of Bread Global", a Privacy link, and "Study . Pray . Grow".

---

## 3. Home (/)

Metadata title: House of Bread Global | A teaching ministry
Metadata description: A global teaching ministry serving believers across the UK, Africa and the United States. Live teaching, classes and training, written teaching, and the official House of Bread app.

### Hero
- Eyebrow: HOUSE OF BREAD GLOBAL
- H1: Come and be fed by the Word.
- Lead: A global teaching ministry serving believers across the United Kingdom, Africa and the United States, through live teaching, classes and training, written teaching and the official House of Bread app.
- Primary button: Join the next live session (to /events), with arrow
- Secondary button: Get the official app (to /app)
- Text link: Explore classes and training (to /classes)
- Under the buttons: RegionChips (United Kingdom, Africa, United States) and the line STUDY . PRAY . GROW
- HeroVisual (right on desktop, below on mobile): a CSS phone showing the app reading screen, a floating LiveSessionCard ("Next live session", time placeholder or empty state) overlapping the phone's left edge, and a floating progress card ("30 Day NT Journey, Day 1 of 30") overlapping its lower right. Illustrative, marked as such in code comments.
- Background: rich green gradient, lime glow, grain, cross watermark, leaf shapes. The hero ends with a curved edge into white.

### Stat strip (overlaps the hero edge)
- 3 regions served: the United Kingdom, Africa and the United States
- 27 New Testament books introduced
- 6 translations in the app
- 3 New Testament journeys: 30, 60 and 90 days

### Ways to be fed (bento, four tiles)
- Heading H2: Four ways to be fed
- Large tile, deep green gradient, icon: Live teaching. "House of Bread Global teaches live on YouTube, with reminders so no session is missed." CTA: See upcoming sessions (to /events)
- Medium tile, white: Classes and training. "Structured teaching for believers who want to go deeper, taught with care for context and doctrine." CTA: Explore classes (to /classes)
- Medium tile, tint: The official app. "Daily reading, New Testament journeys, six translations and the ministry's teaching, in your pocket." CTA: Get the app (to /app)
- Small tile, white: Written teaching. "Doctrine, interpretation and the questions believers actually ask." CTA: Read the teachings (to /teachings)

### Next live session
- Heading: Next live session
- LiveSessionCard from content, or empty state: Sessions are announced here and by email. Ask for a reminder and the next date arrives in your inbox.
- Buttons: Set a reminder (to /subscribe), Subscribe on YouTube [CHANNEL LINK]

### What the ministry stands for (three FeatureCards on surface-tint)
- Doctrinal clarity: Teaching that says plainly what Scripture says, and shows how the argument is built.
- Scripture in context: Passages are read with the background that makes them land, and quoted in full with the verses either side.
- Plain, warm and rigorous: Written to be understood. Rigorous without being academic.

### Why the name (split section, 7/5)
- H2: Why House of Bread?
- Text: The name comes from Bethlehem, the house of bread, and from the One who claimed the title for himself. The aim is not information for its own sake, but Scripture read well, understood clearly, and allowed to feed.
- Link: About the ministry (to /about), with arrow
- Right: dark ScriptureBlock, John 6:33-35 KJV

### The official app (green band, phone frame)
- Eyebrow: THE OFFICIAL APP
- H2: The ministry in your pocket
- Text: The official House of Bread app brings the ministry's teaching and study tools together on your phone, so the Word goes where you go.
- FeatureList (icons): New Testament journeys of 30, 60 and 90 days. A written introduction to every New Testament book. Six translations, with the King James Version as the default. Articles and teaching. Progress tracked automatically. Works on modest devices and modest data.
- StoreButtons: [GOOGLE PLAY LINK], [APP STORE LINK OR "COMING SOON", CONFIRM WITH APP DEVELOPER]

### New Testament journeys
- Heading: A journey through the New Testament
- Text: Three guided routes from Matthew to Revelation, in the order the books were written.
- PlanCards: 30 Day NT Journey (focused and fast moving), 60 Day NT Journey (steady and balanced), 90 Day NT Journey (unhurried, with room to think)
- CTA: Start a journey in the app (to /plans)

### Stay connected
- Heading: Follow the ministry
- Text: Live sessions stream on YouTube, and the ministry shares teaching on its social pages.
- SocialLinks: YouTube [CHANNEL LINK], [OTHER PLATFORMS AND LINKS TO BE SUPPLIED]

### Newsletter band
- H2: Stay close to the ministry
- Text: Reminders before each live session, new teaching, and news from House of Bread Global, sent to your inbox.
- Form: first name (optional), email, button "Subscribe"
- Consent line: By subscribing you agree to receive emails from House of Bread Global. You will be asked to confirm your address, and you can unsubscribe at any time. Read the privacy policy.

---

## 4. About (/about)

Metadata title: About the ministry
Metadata description: House of Bread Global is a teaching ministry committed to doctrinal clarity and careful handling of Scripture, serving believers across the United Kingdom, Africa and the United States.

### PageHeader
- Eyebrow: ABOUT THE MINISTRY
- H1: A teaching ministry for believers who want to be fed
- Lead: House of Bread Global is committed to doctrinal clarity and careful handling of Scripture, serving believers across the United Kingdom, Africa and the United States.

### Mission
- Text: [MISSION STATEMENT TO BE SUPPLIED BY THE MINISTRY. INTERIM: House of Bread Global teaches the Scriptures with doctrinal clarity and care, so that believers are fed, grounded and equipped for a stronger walk with God.]

### The name
- Text: The name comes from Bethlehem, the house of bread, and from the One who claimed the title for himself. The aim is not information for its own sake, but Scripture read well, understood clearly, and allowed to feed.
- Dark ScriptureBlock: John 6:33-35 KJV

### What the ministry offers (five cards with icon tiles)
- Live teaching: Sessions streamed on YouTube, with reminders by email.
- Classes and training: Structured learning for those who want to go further than reading alone.
- Written teaching: Doctrine, interpretation and the questions believers actually ask.
- New Testament study: An introduction to every New Testament book, and three guided journeys through the whole.
- The official app: The ministry's teaching, journeys and six translations on your phone.

### Where the ministry serves
- Three region cards: United Kingdom, Africa, United States. Each: one line plus [LOCAL DETAILS TO BE SUPPLIED].
- Lead line: Serving believers across three regions, with sessions and teaching open to all.

### How Scripture is handled (numbered, four items)
1. Context first. Who wrote it, who received it, and what prompted it, before any verse is applied.
2. Scripture in full. Passages are quoted whole, with the verses either side where the argument depends on them.
3. A clear text. The King James Version is the primary text. Any other translation is labelled.
4. Plain English. Rigorous without being academic, and warm without being vague.

### Leadership
- [TEACHER NAME, PHOTO AND SHORT BIOGRAPHY TO BE SUPPLIED. Layout: large portrait left, text right.]

### Doctrinal position
- [DOCTRINAL STATEMENT TO BE SUPPLIED BY THE MINISTRY. Layout: a short list of headed statements, each with supporting Scripture.]

### Closing call to action
- Primary: Join a live session. Secondary: Contact the ministry.

---

## 5. Live sessions and events (/events)

Metadata title: Live sessions and events
Metadata description: House of Bread Global teaches live on YouTube. See what is coming, in your local time, and set a reminder.

### PageHeader
- Eyebrow: LIVE
- H1: Live teaching, wherever you are
- Lead: House of Bread Global teaches live on YouTube. See what is coming in your local time, and never miss a session.
- Buttons: Set a reminder, Subscribe on YouTube [CHANNEL LINK]

### Next up
- Large featured LiveSessionCard: title, date, local time with the ministry time zone beside it, duration, Add to calendar, Watch on YouTube (disabled with a note until a link exists), Set a reminder.
- Empty state: The next session will be announced here and by email. Subscribe and the date arrives in your inbox.

### How it works (StepList)
1. Find a session.
2. Add it to your calendar or ask for an email reminder.
3. Join on YouTube when it starts.
4. Watch the replay if you miss it.

### Upcoming
- EventCards from content.

### Weekly rhythm
- [WEEKLY SCHEDULE AND MINISTRY TIME ZONE TO BE SUPPLIED]

### Replays
- Empty state: Replays will appear here after each session.

### Closing band
- Newsletter band with tag live-notify and the heading "Get a reminder before each session".

### Event detail (/events/[slug])
- Header band: kind label (Live, Training or Meeting), title, date and time in local time plus ministry zone, duration.
- Buttons: Watch on YouTube, Add to calendar
- Sections: About this session, Passages (linked references), Set a reminder band
- Link: Back to all sessions

---

## 6. Classes and training (/classes)

Metadata title: Classes and training
Metadata description: Structured teaching from House of Bread Global for believers who want to go deeper. See what each class covers, who it is for and how to join.

### PageHeader
- Eyebrow: CLASSES AND TRAINING
- H1: Go deeper in the Word
- Lead: Structured teaching from the ministry, taught with the same care for context and doctrine as everything else here.

### Class list
- Cards from content: title, one line summary, who it is for, when it runs, a "View class" link.
- Empty state: Class details are being prepared. Subscribe to hear when enrolment opens.

### Who classes are for (four icon items)
- New believers who want a structured way into the New Testament
- Readers who have started and stalled before
- Students and teachers who want to handle Scripture with more care
- Anyone who wants to know the Scriptures rather than simply own one

### How to join
- [JOINING METHOD TO BE SUPPLIED: form, WhatsApp link or email]

### Class detail (/classes/[slug])
- Sections: What it covers, Who it is for, When it runs, How to join, Cost, [CLASS DETAILS TO BE SUPPLIED]
- Closing band: newsletter

---

## 7. Teachings (/teachings)

Metadata title: Teachings
Metadata description: Written teaching from House of Bread Global on doctrine, interpretation and the questions believers actually ask.

### PageHeader
- Eyebrow: TEACHINGS
- H1: Teaching written to be understood
- Lead: A growing library from the ministry on doctrine, interpretation and the questions believers actually ask. Rigorous without being academic.

### Topics (three cards with icon tiles, visual only until filtering is built)
- Doctrine: What Scripture teaches, and how the argument is built.
- Interpretation: How to read a passage the way its first readers did.
- Questions believers ask: Clear answers, grounded in the text.

### Latest teachings
- Article cards: title, summary, reading time, passages.
- Empty state: The first teachings are being prepared. Subscribe to be told when they are published.

### Closing band
- Newsletter

### Teaching detail (/teachings/[slug])
- Header band: title, date, reading time, passages as linked chips
- Body in Prose with serif text and light ScriptureBlocks for every quotation
- Footer: Related teachings (empty state allowed), newsletter band
- Sample content is marked draft and placeholder.

---

## 8. Study the New Testament (/new-testament)

Metadata title: Study the New Testament, book by book
Metadata description: The ministry's written introduction to all 27 New Testament books: who wrote each one, who received it, the central argument, the themes, and where it sits in the story of Scripture.

### PageHeader
- Eyebrow: NEW TESTAMENT STUDY
- H1: Study the New Testament, book by book
- Lead: House of Bread Global introduces every New Testament book before the verses are lifted out. Context is not decoration. A letter read without knowing what prompted it will be misread, and most misreadings of the New Testament begin exactly there.

### What each introduction covers (five numbered items with icon tiles)
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
- App band: Read each book alongside the text in the official app.

### Book detail (/new-testament/[book])
- Header band: {Book}: an introduction
- Five sections using the five headings above, with placeholder body text marked as such
- Previous and next book links
- Band: Read {Book} in the app

---

## 9. New Testament journeys (/plans)

Metadata title: New Testament journeys (reading plans)
Metadata description: Three guided reading plans through the New Testament, in the order the books were written. 30, 60 and 90 day journeys in the official House of Bread app.

### PageHeader
- Eyebrow: NEW TESTAMENT JOURNEYS
- H1: Three journeys through the New Testament
- Lead: Each journey follows the order the books were written, as events developed in the early Church, so the story reads in order. Available in the official House of Bread app.

### Journey cards (three large PlanCards, the middle one slightly raised)
- 30 Day NT Journey: Focused and fast moving.
- 60 Day NT Journey: Steady and balanced.
- 90 Day NT Journey: Unhurried, with room to think.
- Each card: days, pace, one line, a "View journey" button.

### How a journey works (StepList)
1. Choose the pace that fits your week.
2. Open the official app and start day one.
3. Read each day. Progress is tracked automatically.
4. Come back any time and continue exactly where the last session ended.

### Why the order matters
- Text: Reading the books in the order they were written lets each letter be heard against the events that prompted it. The same passage reads differently once the situation behind it is known.

### Closing band
- App band

### Journey detail (/plans/[slug])
- Header band: journey name, days, pace
- Sections: About this journey, A look at day one, How to follow it in the app, Frequently asked
- Day one sample for the 30 day journey, taken from the app: Day 1, James 1-5 and Galatians 1-3, theme "Living faith and justification by faith." Mark as sample, confirm against the app.
- Band: Open this journey in the app [APP DEEP LINK TO BE CONFIRMED]

---

## 10. The official app (/app)

Metadata title: The official House of Bread app
Metadata description: The official app of House of Bread Global. New Testament journeys, every book introduced, six translations and the ministry's teaching, on your phone.

### PageHeader
- Eyebrow: THE OFFICIAL APP
- H1: The official House of Bread app
- Lead: Bible study, trusted teaching and practical guidance all in one place. Equipping you for a deeper understanding of God's Word and a stronger walk with Him.
- Buttons: StoreButtons [GOOGLE PLAY LINK], [APP STORE LINK OR "COMING SOON", CONFIRM]
- Visual: CSS phone frame with floating progress card, as on Home.

### Feature sections (alternating split layout, each with an IconTile)
- New Testament journeys: Three guided routes through the New Testament, in the order the books were written. Progress is tracked automatically. Open the app and continue exactly where the last session ended.
- Every book introduced: Twenty-seven books, each with a written introduction covering who wrote it, who received it, the central argument, the themes and where it sits in Scripture.
- Six translations: Comparing translations is one of the simplest ways to see what a passage is actually saying. The King James Version is the default text, and versions switch without losing your place.
- The ministry's teaching: A growing library of written teaching on doctrine, interpretation and the questions believers actually ask.

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

### Closing band
- Newsletter band, heading "Hear about new features and sessions".

---

## 11. Subscribe (/subscribe)

Metadata title: Join the newsletter
Metadata description: Live session reminders, new teaching and news from House of Bread Global, sent to your inbox.

- Eyebrow: NEWSLETTER
- H1: Stay close to the ministry
- Lead: Reminders before each live session, new teaching and news from House of Bread Global, sent to your inbox. No spam, and you can leave at any time.
- Form: first name (optional), email, checkbox "Remind me before each live session" (tag live-notify), button "Subscribe"
- Consent line: By subscribing you agree to receive emails from House of Bread Global. You will be asked to confirm your address. Read the privacy policy.
- Side panel, What to expect: Reminders before live sessions. New teaching and journeys. Occasional news from the ministry.
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
- Lead: Questions about the ministry, live sessions, classes or the app are welcome.
- Form: name, email, topic (General question, Live sessions, Classes and training, The app, Something else), message, honeypot field, button "Send message". Form UI is real, action disabled with note "Messaging opens soon" until the contact slice.
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
- Links: Home, Live sessions, Classes, Teachings, The official app
- Permanent noindex.

### Error
- H1: Something went wrong
- Text: The page could not load. Try again, and if the problem continues, contact the ministry.
- Buttons: Try again, Go home

### Loading
- Skeleton blocks shaped like a PageHeader and three cards. No spinner.

---

## 15. Acceptance checks for this pass

- No page reads as a Bible study website. Live teaching, classes and the ministry lead on Home, About and the header. The New Testament material sits under Study and the app.
- Home has a hero with a visual, a stat strip, a bento grid, at least one dark scripture panel, an app band, a social row and a newsletter band.
- Every page has a header band, at least three sections and a closing call to action, and each section has one clear primary CTA from the CTA system.
- White is the page background except for the green surfaces in the surface map.
- Every text and background pairing, including each gradient stop, passes WCAG 2.2 AA and is logged in docs/PLACEHOLDERS.md. Lime or mint text never appears on white.
- Motion is CSS only, respects prefers-reduced-motion, and adds no backdrop-filter.
- Works at 375px with no horizontal scroll, keyboard only, and with JavaScript disabled for navigation.
- Lighthouse 95 or above on performance and accessibility for Home, About, Live and the app page, measured on a Vercel preview.
- No new dependency except the icon approach, which uses inline SVG or the icon package already installed.
