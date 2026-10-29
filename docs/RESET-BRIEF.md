# House of Bread: Copy and Design Reset

Status: approved direction, to be implemented page by page. Home first.
Amended 28 October 2026 after the Phase 1 review: navigation, buttons only,
text motion and an animated hero on every page (marked "Amended").
Amended again 28 October 2026 after the Home corrections: light by default,
a transparent header that scrolls away, full screen heroes, no "free" until
pricing is decided, the starting cards, the app mockup and a button review
(marked "Amended, Home corrections").

## 1. What the website is for

The website has one job: get people into the Word, through **courses** (Academy) and **teaching videos** (Teachings).

| Priority | Action we want | Where |
|---|---|---|
| 1 | Start a course | Academy |
| 2 | Watch a teaching | Teachings |
| 3 | Ask a question | Ask |
| 4 | Get the app | One section before the footer only |

Everything else (live sessions, events, newsletter) is supporting detail. It appears as small lines or in the footer, never as a main section.

Every page ends with a **next step** that moves the visitor to the action above it. No page is a dead end.

## 2. Copy rules

Based on the teaching ministries studied: BibleProject, Andrew Wommack (AWMI), Joseph Prince, Derek Prince, Ligonier, Desiring God, John Bevere and Joyce Meyer.

What teaching ministries do that we copy:

- Lead with the teaching itself, not a slogan. AWMI leads with "Gospel Truth", Joseph Prince with the latest sermon, BibleProject with the newest video.
- Use specific, outcome-led titles ("How to Read the Bible", "Feeling lost in the Bible?").
- State the time cost plainly ("6-lesson course", "3 min", "28 min"). (Amended, Home corrections: do not say "free" about courses until pricing is decided.)
- Name the teacher in a human role ("Ask Pastor John").
- Use verb buttons ("Watch now", "Listen free").

Rules:

1. Write to one person ("you"), the way a pastor speaks after service. Short sentences.
2. Name the need, then offer the step. Never announce the product.
3. One promise per heading.
4. No selling words. Say the time cost, and nothing more. Never call a course free until pricing is decided (Amended, Home corrections: the purpose is to equip believers).
5. No church jargon or insider words. If a word needs explaining, replace it.
6. Never use these phrases or anything like them:
   - "Come and be fed"
   - "Be fed by the Word"
   - "Transform your life"
   - "Unforgettable"
   - "Journey of faith"
   - "Learn more"
7. Buttons say exactly what happens. Anything that asks the visitor to act is a button, never a text link (Amended). Use only these labels:

| Use | Button label |
|---|---|
| Course list | Start this course |
| Course in progress | Continue learning |
| Academy entry | Browse courses |
| Video | Watch now |
| All videos | See all teachings |
| Ask | Ask a question |
| App | Get the app |
| About | Read our story |
| Beliefs | What we believe |
| Academy, after the course cards | Browse all courses |
| Live line, to the session times | See the session times |
| Teachings: share a teaching or series (amended 29 October 2026) | Share |
| Teachings: close the Shorts player | Close |
| Teachings: a section whose YouTube data failed, only there | Watch on YouTube |

Square brackets mark facts the ministry must confirm. Keep them visible until confirmed.

## 3. Design rules

Simplicity first, in the spirit of Fyreworks, in our own white and green.

| Rule | Taken from |
|---|---|
| One idea and one primary button per screen. Lots of white space. | Fyreworks |
| Huge display type for statements only (clamp about 2.5rem to 5rem, tight leading). Readable body type everywhere else. | Fyreworks |
| Big numbered rows (01, 02, 03) with thin dividers for lists of options | Fyreworks |
| Buttons, label only, no arrow (Amended). Style (Amended, Home corrections, chosen 29 October 2026): Engraved with a touch of Ruled, Geist small caps with wide tracking, 6px corners and a fine inset hairline; on hover a deeper fill sweeps in and a fine rule draws under the label. Primary: solid deep green. Secondary: outline. Tertiary: soft tinted fill, for cards and rows. Sizes md and sm, 44px tap height or more. | Fyreworks, Bevere |
| Full-screen menu on phones: large items, nothing else | Fyreworks |
| Question-led section headings | BibleProject |
| Soft tinted section backgrounds (white, then warm cream `#F7F3EC`, then pale green) alternating, never more than one per section | BibleProject, Bevere |
| Real photos of real people, rounded corners, never stock | Bevere |
| Trust in the footer: what we believe, contact, policies, socials | AWMI |
| Course cards show lessons and time on one line ("6 lessons · 20 min each"). No "Free" badge until pricing is decided (Amended, Home corrections) | Ligonier, Bevere |
| A dark footer with app badges | BibleProject |

Strip back:

- Glass effects (Amended, Home corrections): none on the header, which is transparent. The one exception is the two floating cards over the app mockup on Home. Remove glass from every other card and section.
- Card hover animations, floating icons and decorative gradients: remove.
- Motion (Amended): every page has an animated hero, its loop full bleed behind the text under a scrim (existing loop rules stand; phone loops on Home and Academy only). The Home mission types itself out once, and its cursor keeps blinking after (Amended, Home corrections). Section headings reveal line by line once. Home's starting cards fan out once and lift a little on hover. Nothing else moves, and Motion Off or reduced motion stills all of it.
- No sliders, carousels with dots, pop-ups or countdowns.
- Phones: Home should be about 5,000px or less. (Since the full screen hero and the starting cards, Home runs longer: see docs/PLACEHOLDERS.md for the measured height.)
- Light by default (Amended, Home corrections): a first visit lands on light whatever the system setting. Dark and System stay in the header switch and the footer, and a choice is remembered.
- Full screen heroes (Amended, Home corrections): every hero fills the first screen, header included (100svh). The next section shows only once the visitor scrolls, at 375, 768 and 1280. Content sits centred below the header, with no layout shift.

Keep:

- Existing tokens, both themes (light and dark), the contrast rules, the Motion control, the loop pipeline, the seams (`lib/academy`, `lib/app-integration`), and the anonymous questions flow.

Header (Amended): logo, then Home, Academy, Teachings, About and Contact, then one primary button, "Browse courses", and the theme icon switch at every width. On phones: logo, theme switch and menu button; the full-screen menu holds the five links and the button. Ask lives in the footer and in Home card 03. (Amended, Home corrections:) the header is not sticky. It sits transparent on top of the hero, with no background, border or blur, and scrolls away with the page. Its text is checked over every hero loop in both themes.

Footer:

- **Columns:** Teachings, Academy, About, What we believe, Ask, Events, App, Subscribe, Contact and Privacy.
- **Also in the footer:** socials, the Motion and theme controls, and the full ministry name.

## 4. Home page

Seven screens, in this order.

### Screen 1: Hero

Headline options (recommended first):

- **A. Understand the Bible you've been reading.**
- B. Scripture, taught in context.
- C. Know what the Word says, and what it means.

Subline: "Courses and teaching that bring you into an accurate understanding of God's Word, and a real encounter with Him."

Buttons: **Browse courses** (primary), **Watch the latest teaching** (secondary, outline).

Visual: [photo of Isaac Ola teaching, to be supplied]. Until then, the current hero loop.

### Screen 2: Mission statement

Large display text, one sentence:

"We teach believers to read God's Word accurately, understand it deeply, and live it fully, wherever they are."

Below it, centred as a pull quote in quotation marks (Amended, Home corrections): "The name comes from Bethlehem, the house of bread, where the Bread of Life was born." Button, centred under it: **Read our story**

### Screen 3: Academy (main action)

Eyebrow: "The Academy"

Heading: "Read the Bible for years and still feel you only know it in parts?"

Text: "Our courses take you through it, one lesson at a time."

Show three course cards from the catalogue (two on phones, below 768px: amended 28 October 2026), each with a title, one-line promise, "[6] lessons · [20] min each" on one line and the button **Start this course**.

Button under the cards: **Browse all courses**

### Screen 4: Where are you starting from?

Three cards in a fan (Amended, Home corrections), in the style of BibleProject's "Follow your curiosity": one soft tinted rounded panel, the heading centred, the middle card in front and raised, the side cards slightly turned behind it. Each card has an image slot (placeholder for now), its number, title, line and a button (Start this course, Start this course, Ask a question). On scroll in, the cards fan out from a stack once; a hovered card lifts slightly. Phones stack the cards vertically, same style, no fan. Motion Off or reduced motion: a still fan. The Academy keeps the same three as numbered rows. The cards:

- **01. New to the Bible.** "Start with the foundations: what the Bible is and how to read it." Links to [foundations course].
- **02. You know the stories, but not how they connect.** "Go book by book and see the whole picture." Links to [book-by-book course].
- **03. You're carrying a question.** "Ask it. You don't need to give your name." Links to Ask.

### Screen 5: Teachings

Heading: "Need a word for this season?"

Text: "Sit under the teaching of the Word, wherever you are."

One large video (the latest from the ministry channel), title and date. Then three smaller videos.

Button: **See all teachings**

Small line: "New teaching live every Monday at 8 pm Lagos time." with a small button, **See the session times**. That is the only mention of live meetings on Home.

### Screen 6: The teacher

[Photo of Isaac Ola]

"Taught by Isaac Ola, team leader of House of Bread Ministries International. He teaches Scripture verse by verse, with care for what the text actually says."

Buttons: **Read our story** and **What we believe**. On phones the photo sits full width above the text.

### Screen 7: App (before the footer)

Heading: "Take the Word with you."

Text: "Daily reading and journeys through the New Testament, in your pocket."

Button: **Get the app**, with store badges when the links exist.

Visual (Amended, Home corrections): the phone mockup from before the reset, showing John 6 (KJV) with verse 35 highlighted, a floating "Next live session" card with the real next session from the schedule, and a floating "30 Day NT Journey, Day 1 of 30" progress card. The two floating cards keep a glass look. Text and button on one side, mockup on the other; on phones the mockup sits below the button.

## 5. Other pages (apply the same rules)

**Academy**

- Heading: "Bible courses" (Amended, Home corrections)
- Text: "Self-paced video lessons that take you through Scripture in context."
- Below the text: "Where are you starting from?" rows (as on Home), then all courses as cards.
- Next step: "Not sure where to begin? Start with [foundations course]."

**Course page**

- Title, then a one-line promise, then "[N] lessons · about [N] min each".
- **Start this course** button.
- "What you'll learn" (3 to 5 bullets).
- "Lessons" (a numbered outline).
- "Taught by [Isaac Ola]".
- Next step: the next course.

**Teachings** (amended 29 October 2026, in the shape of BibleProject's Videos page)

- Hero: the featured teaching. Eyebrow "Featured teaching", its title, one or two lines, **Watch now**, and its thumbnail on the right (below on phones).
- "Latest teachings": the four newest long-form teachings, from both channels.
- "Bible nuggets": the latest Shorts, played in place.
- "Explore series": the playlists, each opening a series page.
- The live line, then next step: **Browse courses**.
- A teaching page (video, title, date, **Share**, description, "More teachings") and a series page (cover, name, **Share**, every episode) both end with **Browse courses**.

**About**

- Heading: "A teaching ministry"
- Our story: the Bethlehem and Bread of Life revelation, the purpose (accurate understanding and revelation of God's Word, beyond four walls), and the global reach. Keep it under 150 words.
- The teacher, what we believe, then contact.
- Next step: **Browse courses**.

**Ask**

- Heading: "Ask a question about the Bible"
- Text: "No name or email needed. We read every question, and some are answered in our teaching."
- Keep the existing form and safety notice.
- Next step: **Watch the latest teaching**.

**App page**

- Heading: "Take the Word with you."
- Features as a short numbered list.
- Next step: **Browse courses**.

**Events page**

- Heading: "Live every Monday"
- The session-times block, unchanged.
- Next step: **Watch the latest teaching**.

**Subscribe**

- Heading: "New teaching in your inbox"
- Text: "One email when something new is ready. Nothing else."

**404 page**

- Heading: "This page isn't here."
- Buttons: **Browse courses** and **Go home**.

## 6. To confirm with the ministry

- The full name in the footer and About: House of Bread Ministries International, or House of Bread Global.
- A photo of Isaac Ola teaching (hero) and a portrait (teacher section).
- The first three courses: titles, lesson counts and lengths.
- The hero headline choice: A, B or C.
- Pricing for the courses (until then, nothing calls them free).
- Photos for the three starting cards, or approval for interim images.
