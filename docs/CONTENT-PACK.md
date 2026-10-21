# House of Bread Global: Content Pack and Layout Brief

Date: 17 October 2026
Revision: 5, 21 October 2026 (navigation: Home, Academy, Library, About, Contact, and one Explore Teachings button in the header; the Media Library is renamed the Library; the Home figures strip is removed). Revision 4 (white and green redesign: mostly white, green as structure and accent, calmer type, scoped translucent surfaces, skeleton loading, the logo). Revision 3 was the lighter palette, buttons and TextCTA, navigation, House of Bread Academy and the Media Library.
Use with: CLAUDE.md and docs/SPEC-v3.md
Purpose: real copy and layout direction for all stage-one routes.

Rules for using this file:
- Copy below is final unless it contains [SQUARE BRACKETS]. Brackets mark facts nobody has supplied yet. Render them as clearly marked placeholders and list each in docs/PLACEHOLDERS.md.
- Do not invent facts to fill brackets: no founding story, attendance figures, teacher name, event times, class details, social links, store links, contact details or doctrinal statements.
- Copy follows CLAUDE.md section 6: no em or en dashes, hyphen bullets, no first person in marketing copy.
- All scripture is KJV, quoted in full with surrounding verses, through the Scripture component.
- The ministry is online only at launch. It has no local centres, campuses, branches or venues. Copy never implies a physical location: no addresses, maps, "visit us", "in person", "find a location" or "near you". Believers join online, watch live and learn online. The United Kingdom, Nigeria and United States appear only as the regions the ministry serves and the time zones sessions are shown in.

### Online only changes (18 October 2026)

- Region band (Home, `/events`): heading "Session times by region" became "Session times for joining online", with the line "Every session is online. These are the times for believers joining from the United Kingdom, Nigeria and the United States."
- `/about`, Where the ministry serves: the lead line now opens "The ministry is online". Each region card's [LOCAL DETAILS TO BE SUPPLIED] became "Join live sessions and classes online. Session times are shown in {UK time, Lagos time, Eastern time}."
- Photo frame subjects: Home "the teacher and those gathered" became "The teacher leading a live session online"; `/about` Mission "Believers gathered for teaching" became "Believers following a live teaching online, with open Bibles"; `/events` "seen from the room" became "the teacher on camera"; `/academy` "A class in progress" became "An online class in progress".
- Assets to request: "photos of sessions and gatherings" became "stills from live sessions and online classes".
- Checked and kept: the hero line "serving believers across the United Kingdom, Africa and the United States" and the region chips name regions served, not places. `/privacy` keeps [LEGAL NAME, ADDRESS AND CONTACT EMAIL OF THE MINISTRY], because the privacy notice must name the data controller; it is not shown as a place to visit.

---

## 0. Positioning (read first)

### What the site is
The home of House of Bread Global, a teaching ministry serving believers across the United Kingdom, Africa and the United States. It is not a Bible study website and not an app landing page.

### The app
The House of Bread app is the official app of the ministry. It carries the ministry's New Testament journeys, book introductions, teaching and six translations. It is one of the ways the ministry reaches people, and one of the main calls to action. It is never the whole story.

### Order of importance on the site
1. Live teaching (YouTube sessions)
2. House of Bread Academy (the training classes)
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

## 1. Design direction (premium, demure)

The site must feel like a confident, calm global ministry. Mostly white, with green built around it. Premium through restraint: quiet type, generous space, hairlines and soft depth. Fast on a mid range Android phone.

### 1.1 Feel
- White is the base. Cream (surface-warm) and mint bands give rhythm. There is no full bleed green hero and no deep green section.
- Green is structure and accent: the short rule above headings, heading accents, links, icons, primary buttons, soft tinted panels and radial tints behind the hero.
- Deep green is the footer and small elements only (the phone frame).
- Lime is a tiny accent at most: the halo on a 6px eyebrow dot. Never a button fill, text or headline colour. Gold only for live states, badges and small highlights, always with ink text.
- Nothing shouts: smaller display type, calm scale, more whitespace, hairline borders, soft low opacity shadows, short gentle motion.

### 1.2 Colour tokens (light first)
Values from the palette revision of 17 October 2026, not yet confirmed against official brand files. Every pairing is logged in docs/PLACEHOLDERS.md and checked with npm run contrast.

| Token | Value | Use |
|---|---|---|
| surface | #ffffff | page background |
| surface-warm | #fbf8f1 | cream bands |
| surface-mint | #eef6e8 | mint bands, scripture panels, the app band |
| surface-gold | #fdf3d6 | the tint behind the newsletter card, live highlights |
| tint | #edf3ef | current nav pill, icon tiles, skeletons |
| ink | #0b2412 | body text and headings |
| ink-muted | #3d5a46 | secondary text |
| emerald | #1b6b33 | primary fill, icon glyphs, heading rules |
| emerald-deep | #14602f | links, eyebrows, TextCTA labels, heading accents, focus rings |
| green-deep | #0a3616 | the footer |
| green-night | #04290e | the footer, the phone frame |
| lime | #a6c859 | the eyebrow dot halo only |
| gold | #e9b949 | live fills and badges, with ink text |
| gold-soft | #f3d98b | badges and soft highlights, with ink text |

Backgrounds:
- Hero: white with two soft emerald radial gradients (10% at the peak).
- Inner page headers: white with one emerald radial at the top right and a hairline below.
- App band and closing bands: mint with a white and an emerald radial.
- Newsletter: soft gold and mint radials behind a translucent white card.
- Footer: green-deep to green-night.
Radial gradients only. No blur filters, grain, watermarks or curved edges.

### 1.2a Rhythm
Hero, the stat row, white, cream, white, mint, white, the app panel, cream, white, the newsletter card, then the dark footer. No deep green section or panel apart from the footer.

### 1.3 Typography
- Display and headings: Literata. H1 clamp(2.25rem, 1.6rem + 2.4vw, 3.5rem), 36 to 56px, weight 500, line height 1.1, letter spacing -0.015em. H2 clamp(1.75rem, 1.35rem + 1.2vw, 2.25rem), weight 500. h3 and smaller at 600.
- UI, nav, buttons, labels, eyebrows: Geist.
- Lead 1.125rem. Body 18px minimum, line height 1.7, line length near 68 characters.
- Eyebrows: 0.75rem, uppercase, letter spacing 0.14em, semi bold, emerald-deep, no pill. The hero and page header eyebrows lead with a 6px emerald dot.
- Logo: the supplied mark beside the text wordmark (HOUSE OF in regular, BREAD in bold). The mark is a trimmed PNG until an SVG is supplied.

### 1.4 Layout and composition
- Container 1152px, with 24px gutters on mobile. Section spacing 120px on desktop, 80px on mobile.
- The hero and page headers keep at least 64px between the header and the eyebrow.
- A bento grid on Home for "ways to be fed": one large tile, two medium, one small, white and mint.
- Asymmetric splits (7/5 columns) instead of centred stacks. Align text left; centre only short closing bands.

### 1.5 Depth, shape and detail
- Radii: cards 20px, buttons 12px, inputs 10px, icon tiles 14px.
- Shadows: soft = 0 1px 2px rgba(11,36,18,0.04), 0 8px 24px rgba(11,36,18,0.05). Raised = 0 2px 6px rgba(11,36,18,0.05), 0 16px 40px rgba(11,36,18,0.08).
- Cards: white, 1px hairline at 12% emerald, soft shadow. Hover and focus: lift 2px, raised shadow, edge at 35% emerald.
- Icon tiles: tint fill, emerald glyph, a faint inner emerald ring. Tiles holding text (plan days, step numbers) use solid emerald with white text.
- A short emerald rule above section headings.
- Translucent white surfaces, scoped: the hero floating cards and the newsletter card (white at 84%). The header has no surface. Never on full width sections or long lists. Solid white under prefers-reduced-transparency. Backdrop blur is allowed on these surfaces only, at 12px or less with a near solid fallback, but ships off until a real device check shows it costs no more than a few fps.

### 1.6 Motion (CSS only)
- No JavaScript for decoration. Transitions and keyframes on transform and opacity only.
- Entrance: hero text rises 8px over 500ms, staggered by 60ms. Sections reveal on scroll from 0.85 opacity and 10px, through CSS scroll driven animation where supported.
- Hover: buttons lift 2px and the arrow nudges 4px. Cards lift 2px. The mobile menu fades in over 180ms.
- Skeletons shimmer by transform only, and only where content really loads.
- Respect prefers-reduced-motion: none of the above runs.

### 1.7 Imagery
- Real photography is the biggest single lift for "alive". Until it arrives, use art directed placeholder frames (a light mint to cream wash, a subtle emerald pattern, a small "Photo to come" label, 4:5 and 16:9 ratios). The welcome video frame reads "Photo and video to come".
- Ask the ministry for: a portrait of the teacher, 10 to 15 stills from live sessions and online classes, a 60 to 90 second welcome video, real app screenshots, the logo SVG (mark and wordmark), and a social share image.
- The welcome video loads behind a click to load facade (youtube-nocookie.com).
- Use next/image with explicit dimensions and modern formats when photos arrive.

### 1.8 Components to build
- AnnouncementBar: appears only when a session is live or starts within 24 hours. Gold while live, gold-soft when coming up, ink text, "Live now: {title}." and a "Watch on YouTube" TextCTA. Hidden otherwise.
- SiteHeader: 72px, not sticky, transparent over the hero or page header tint, no border, logo left.
- Hero with HeroVisual: phone mock in CSS plus two floating cards.
- Button (primary, secondary, live; light and green tones) with an optional arrow icon.
- TextCTA: label and arrow chip, the text form of a call to action.
- BentoGrid and BentoTile, FeatureCard, CTACard, IconTile.
- RegionChips, SocialLinks.
- Section, SectionHeader, PageHeader (white with a radial tint), StepList.
- ScriptureBlock, light and feature variants. Both are mint with an emerald rule; feature is larger, beside a split section.
- PlanCard, BookGrid, LiveSessionCard, EventCard, VideoGrid.
- NewsletterCard, AppBand, StoreButtons, EmptyState, YouTubeFacade.
- Prose for MDX body text.
- Skeleton and LoadingRegion for content that really loads.

### 1.9 Buttons and links
- Every call to action is a real button or a TextCTA. No call to action is underlined.
- Buttons: minimum height 52px desktop and 48px mobile, horizontal padding 24px, font weight 600, radius 12px. Hover lifts 2px and the arrow nudges 4px.
- Primary: emerald fill, white text, soft shadow. Hover darkens to emerald-deep.
- Secondary: white fill, 1.5px emerald border at 55%, emerald-deep text. Hover fills tint with a full emerald border.
- In the footer: primary is white with green-deep text; secondary is white at 12% with a 1.5px white border.
- Live emphasis: gold fill, ink text, only while a session is live.
- TextCTA: label weight 600, then a 28px circular arrow chip, no underline. On light: label emerald-deep, chip with a 1px emerald border at 25% and an emerald arrow; hover fills the chip emerald, the arrow turns white and slides 3px. In the footer: white label, chip white at 15%; hover fills white with a green-deep arrow.
- Links inside paragraphs and teaching body text keep a thin underline: offset 3px, skip-ink, emerald at 50% opacity, solid on hover. This is required for accessibility.
- Nav and footer link lists have no underline. Hover is a pill background. The current page uses aria-current plus a stronger pill, not colour alone.
- Focus ring 3px: emerald-deep on light, white in the footer, each with 3:1 contrast against its surroundings.
- On mobile, hero and band buttons are full width and stacked.

### 1.10 CTA system
One primary action per section, written as a verb that says what happens next. Never "Click here" or "Learn more" alone.

| Page | Primary CTA | Secondary CTA |
|---|---|---|
| Header | Explore Teachings (to /academy) | none |
| Home hero | Join the next live session | Get the official app, then TextCTA "Explore the Academy" |
| Home, Start here | Open the Library, Choose a journey, Explore the Academy (TextCTAs) | none |
| Home bento | See upcoming sessions, Explore the Academy, Get the app, Read the teachings | none |
| About | Join a live session | Contact the ministry |
| Live | Set a reminder | Subscribe on YouTube |
| Academy | See how to join | Hear when enrolment opens |
| Library | Set a reminder, or Watch live on YouTube while live | TextCTA "See the full schedule" |
| Teachings | Subscribe for new teaching | none |
| Study | Read this book in the app | Browse all 27 books |
| Journeys | Start a journey in the app | Compare the three paces |
| App | Get the app | See what is inside |
| Closing newsletter card | Subscribe | none |

### 1.11 Surface map

| Element | Surface |
|---|---|
| Announcement bar | gold (live) or gold-soft (within 24 hours), ink text |
| Header and nav | transparent over the hero tint, no border, scrolls away, ink nav, tint pill for the current page, emerald primary button |
| Home hero | white with soft emerald radials, ink type, emerald-deep accent phrase, translucent floating cards |
| Inner page header | white with one emerald radial, hairline below, ink type |
| Bento tiles | white and mint, hairline borders |
| Feature and plan cards | white on white, cream or mint sections |
| Split text sections, steps, FAQ | cream or mint, alternating with white |
| Feature scripture panel (Home, About) | mint, emerald left rule, serif ink text, emerald reference label |
| Scripture inside teaching text | mint panel, emerald left rule, serif ink text |
| App band | mint panel with soft radials, phone frame |
| Newsletter | translucent white card over gold or mint radials, emerald button |
| Teaching and book body | white, serif, ink |
| Footer | green-deep to green-night, white text and links, logo in a white tile |
| 404, error, check-email | white page with an icon tile and ink heading |

---

## 2. Global elements

### Announcement bar
- Content driven from event data. Hidden when no session is live or within 24 hours.

### Header
- 72px, not sticky: it scrolls away with the page. Transparent over the hero or page header tint, with no bar or border.
- Left: logo, then Home, Academy, Library, About, Contact. Library goes to /media and is also the current item on /events.
- Right: one button, Explore Teachings (primary, emerald), to /academy, then the theme switch (a 44px icon button). Subscribe and the app are not in the header: they are reached from the Home hero, the footer and the closing newsletter card.
- Current page: aria-current and a stronger pill, not colour alone.
- Mobile: logo left (the name hides below 480px), a compact "Explore Teachings" button (48px tall, "Explore" below 640px), the theme switch (a 44px icon button) and a "Menu" button on the right, all always visible. The menu is a details element and works without JavaScript. It lists Home, Academy, Library, About, Contact as large tap targets, then the Light, Dark or System theme choice (shown only with JavaScript).

### Footer
- Top strip: "Stay close to the ministry" and a Subscribe button, only on pages that do not already offer signup (pages without the newsletter card, plus /subscribe and check-email are excluded).
- Columns:
  - Brand: logo and "A teaching ministry committed to doctrinal clarity and careful handling of Scripture, serving believers across the United Kingdom, Africa and the United States." Region chips: United Kingdom, Africa, United States.
  - Ministry, in the header order: Academy, Library, Live sessions, About, Contact, Subscribe
  - Learn: Teachings, Study the New Testament, New Testament journeys, Get the official app
  - Follow: YouTube [CHANNEL LINK], [OTHER SOCIAL PLATFORMS AND LINKS TO BE SUPPLIED]
- Link lists have no underline: hover pill, current page pill.
- Bottom line: "© 2026 House of Bread Global", a Privacy link, and "Study . Pray . Grow".

---

## 3. Home (/)

Metadata title: House of Bread Global | A teaching ministry
Metadata description: A global teaching ministry serving believers across the UK, Africa and the United States. Live teaching, House of Bread Academy, written teaching, and the official House of Bread app.

### Hero
- Eyebrow: HOUSE OF BREAD GLOBAL
- H1: Come and be fed by the Word.
- Lead: A global teaching ministry serving believers across the United Kingdom, Africa and the United States, through live teaching, House of Bread Academy, written teaching and the official House of Bread app.
- Primary button: Join the next live session (to /events), with arrow
- Secondary button: Get the official app (to /app)
- TextCTA: Explore the Academy (to /academy). Two buttons and one TextCTA, no more.
- Under the buttons: RegionChips (United Kingdom, Africa, United States) and the line STUDY . PRAY . GROW
- HeroVisual (right on desktop, below on mobile): a CSS phone showing the app reading screen, a floating LiveSessionCard ("Next live session", time placeholder or empty state) overlapping the phone's left edge, and a floating progress card ("30 Day NT Journey, Day 1 of 30") overlapping its lower right. Illustrative, marked as such in code comments.
- Background: white with two soft emerald radial gradients. Generous top padding keeps the eyebrow clear of the header.

### Start here (directly under the hero, white)
- No figures strip between the hero and this section (removed in revision 5). The hero fades to white at its base and runs straight into it, with the same 80px (mobile) and 120px (from md) step used between the sections that follow.
- H2: New here? Start here.
- Welcome video slot beside the heading: a click to load YouTube facade (youtube-nocookie.com). Until the video is supplied, a "Photo and video to come" frame.
- Three cards, each with a TextCTA:
  - Hear the teaching: "Watch live sessions and replays, or listen on audio." TextCTA "Open the Library" (to /media)
  - Read with guidance: "Follow a 30, 60 or 90 day journey through the New Testament in the official app." TextCTA "Choose a journey" (to /plans)
  - Go deeper: "Join House of Bread Academy, Bible classes for believers taught by the ministry." TextCTA "Explore the Academy" (to /academy)

### Ways to be fed (bento, four tiles, cream)
- Heading H2: Four ways to be fed
- Large tile, mint, icon: Live teaching. "House of Bread Global teaches live on YouTube, with reminders so no session is missed." CTA: See upcoming sessions (to /events)
- Medium tile, white: House of Bread Academy. "Equipped in the truth. Bible classes that give believers a structured place to study the Word, taught with care for context and doctrine." CTA: Explore the Academy (to /academy)
- Medium tile, mint: The official app. "Daily reading, New Testament journeys, six translations and the ministry's teaching, in your pocket." CTA: Get the app (to /app)
- Small tile, white: Written teaching. "Doctrine, interpretation and the questions believers actually ask." CTA: Read the teachings (to /teachings)

### Next live session
- Heading: Next live session
- LiveSessionCard from content, or empty state: Sessions are announced here and by email. Ask for a reminder and the next date arrives in your inbox.
- Buttons: Set a reminder (to /subscribe), Subscribe on YouTube [CHANNEL LINK]

### What the ministry stands for (three FeatureCards on mint)
- Doctrinal clarity: Teaching that says plainly what Scripture says, and shows how the argument is built.
- Scripture in context: Passages are read with the background that makes them land, and quoted in full with the verses either side.
- Plain, warm and rigorous: Written to be understood. Rigorous without being academic.

### Why the name (split section, 7/5)
- H2: Why House of Bread?
- Text: The name comes from Bethlehem, the house of bread, and from the One who claimed the title for himself. The aim is not information for its own sake, but Scripture read well, understood clearly, and allowed to feed.
- Link: About the ministry (to /about), with arrow
- Right: feature ScriptureBlock, John 6:33-35 KJV

### The official app (the mint app panel, phone frame)
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

### Newsletter card
- A light rounded card on surface-gold with an emerald button.
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
- Feature ScriptureBlock: John 6:33-35 KJV

### What the ministry offers (five cards with icon tiles)
- Live teaching: Sessions streamed on YouTube, with reminders by email.
- House of Bread Academy: Bible classes that equip believers with knowledge of the truth, for those who want to go further than reading alone.
- Written teaching: Doctrine, interpretation and the questions believers actually ask.
- New Testament study: An introduction to every New Testament book, and three guided journeys through the whole.
- The official app: The ministry's teaching, journeys and six translations on your phone.

### Where the ministry serves
- Three region cards: United Kingdom, Nigeria, United States, each with its flag. Each: "Join live sessions and classes online. Session times are shown in {UK time, Lagos time, Eastern time}." No local details: the ministry is online only.
- Lead line: The ministry is online, serving believers across three regions, with sessions and teaching open to all.

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
- Newsletter card with tag live-notify and the heading "Get a reminder before each session".

### Event detail (/events/[slug])
- Header band: kind label (Live, Training or Meeting), title, date and time in local time plus ministry zone, duration.
- Buttons: Watch on YouTube, Add to calendar
- Sections: About this session, Passages (linked references), Set a reminder band
- Link: Back to all sessions

---

## 5A. Library (/media)

Metadata title: Library | House of Bread Global
Metadata description: Live sessions, replays, audio and the ministry's social pages, all in one place.

### Header band
- Eyebrow: LIBRARY
- H1: Everything the ministry shares, in one place
- Lead: Live sessions, replays, audio teaching and social pages. Watch, listen and follow wherever you are.
- Anchor chips: Live and replays, Video, Audio, Social, Read and study

### Live and replays (#live)
- The next session card from event data, or the empty state: The next session will be announced here and by email.
- Buttons: Watch live on YouTube [CHANNEL LINK] (gold only while live), Set a reminder
- TextCTA: See the full schedule (to /events)

### Video (#video)
- H2: Watch on YouTube
- Text: Teaching videos from House of Bread Global, on YouTube.
- Grid of the latest 6 videos: thumbnail, title, date, Watch button that opens YouTube. From the channel's public feed, fetched on the server at build and revalidated hourly (YOUTUBE_CHANNEL_ID).
- Fallback when the variable is missing or the fetch fails: "Videos will appear here soon" with the Subscribe on YouTube button.

### Audio (#audio)
- H2: Listen on the go
- Text: Audio teaching for the car, the walk or low data.
- A card per platform with a "Listen on {platform}" button. [AUDIO PLATFORMS AND LINKS TO BE SUPPLIED]

### Social (#social)
- H2: Follow the ministry
- Text: Teaching clips, announcements and updates from the ministry. [CONFIRM CONTENT]
- Cards for YouTube [CHANNEL LINK] and [OTHER PLATFORMS AND LINKS TO BE SUPPLIED], each with a Follow button.

### Read and study (#written)
- H2: Read and study
- Three cards, each with a TextCTA: Teachings (to /teachings), Study the New Testament (to /new-testament), New Testament journeys (to /plans).

### Closing
- Newsletter card.

---

## 6. House of Bread Academy (/academy)

The training classes are named House of Bread Academy ("Academy" in the nav), tagline "Equipped in the truth.": the believers' Bible classes that equip believers with knowledge of the truth. /classes and /classes/[slug] redirect permanently to /academy and /academy/[slug].

Metadata title: House of Bread Academy
Metadata description: House of Bread Academy: the believers' Bible classes of House of Bread Global, equipping believers with knowledge of the truth. See what each class covers, who it is for and how to join.

### PageHeader
- Eyebrow: HOUSE OF BREAD ACADEMY
- H1: Be equipped in the truth.
- Lead: House of Bread Academy gives believers a structured place to study the Bible, so they are equipped with knowledge of the truth and ready to stand in it.

### Class list
- Cards from content: title, one line summary, who it is for, when it runs, a "View class" link.
- Empty state: Class details are being prepared. Subscribe to hear when enrolment opens.

### Who the Academy is for (four icon items)
- New believers who want a structured way into the New Testament
- Readers who have started and stalled before
- Students and teachers who want to handle Scripture with more care
- Anyone who wants to know the Scriptures rather than simply own one

### How to join
- [JOINING METHOD TO BE SUPPLIED: form, WhatsApp link or email]

### Class detail (/academy/[slug])
- Sections: What it covers, Who it is for, When it runs, How to join, Cost, [CLASS DETAILS TO BE SUPPLIED]
- Closing: newsletter card

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
- Newsletter card

### Teaching detail (/teachings/[slug])
- Header band: title, date, reading time, passages as linked chips
- Body in Prose with serif text and light ScriptureBlocks for every quotation
- Footer: Related teachings (empty state allowed), newsletter card
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
- Newsletter card, heading "Hear about new features and sessions".

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
- Lead: Questions about the ministry, live sessions, the Academy or the app are welcome.
- Form: name, email, topic (General question, Live sessions, Academy, The app, Something else), message, honeypot field, button "Send message". Form UI is real, action disabled with note "Messaging opens soon" until the contact slice.
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
- Links: Home, Academy, Library, Live sessions, Teachings, The official app
- Permanent noindex.

### Error
- H1: Something went wrong
- Text: The page could not load. Try again, and if the problem continues, contact the ministry.
- Buttons: Try again, Go home

### Loading
- Skeleton blocks shaped like a PageHeader and three cards. No spinner.

---

## 15. Acceptance checks for this pass

- No page reads as a Bible study website. Live teaching, the Academy and the ministry lead on Home, About and the header. The New Testament material sits under Study and the app.
- Home has a hero with a visual, a Start here section, a bento grid, a feature scripture panel, an app band, a social row and a newsletter card.
- Every page has a header band, at least three sections and a closing call to action, and each section has one clear primary CTA from the CTA system.
- Light surfaces carry every page. No deep green section or panel apart from the footer. No call to action is underlined.
- Every text and background pairing, including each gradient stop, passes WCAG 2.2 AA and is logged in docs/PLACEHOLDERS.md. Lime never appears as text.
- Motion is CSS only and respects prefers-reduced-motion. Translucent surfaces stay within the scope in 1.5.
- Works at 375px with no horizontal scroll, keyboard only, and with JavaScript disabled for navigation.
- Lighthouse 95 or above on performance and accessibility for Home, About, Live and the app page, measured on a Vercel preview.
- No new dependency except the icon approach, which uses inline SVG or the icon package already installed.
