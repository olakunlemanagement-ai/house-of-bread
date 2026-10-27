# House of Bread: Copy and Design Reset

Status: approved direction, to be implemented page by page. Home first.

## 1. What the website is for

The website has one job: get people into the Word, through **free courses** (Academy) and **teaching videos** (Teachings).

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
- State "free" and the time cost plainly ("6-lesson course", "3 min", "28 min").
- Name the teacher in a human role ("Ask Pastor John").
- Use verb buttons ("Watch now", "Listen free").

Rules:

1. Write to one person ("you"), the way a pastor speaks after service. Short sentences.
2. Name the need, then offer the step. Never announce the product.
3. One promise per heading.
4. No selling words. Say "free" and the time cost, and nothing more.
5. No church jargon or insider words. If a word needs explaining, replace it.
6. Never use these phrases or anything like them:
   - "Come and be fed"
   - "Be fed by the Word"
   - "Transform your life"
   - "Unforgettable"
   - "Journey of faith"
   - "Learn more"
7. Buttons say exactly what happens. Use only these labels:

| Use | Button label |
|---|---|
| Course list | Start this course |
| Course in progress | Continue learning |
| Academy entry | Browse free courses |
| Video | Watch now |
| All videos | See all teachings |
| Ask | Ask a question |
| App | Get the app |
| About | Read our story |
| Beliefs | What we believe |

Square brackets mark facts the ministry must confirm. Keep them visible until confirmed.

## 3. Design rules

Simplicity first, in the spirit of Fyreworks, in our own white and green.

| Rule | Taken from |
|---|---|
| One idea and one primary button per screen. Lots of white space. | Fyreworks |
| Huge display type for statements only (clamp about 2.5rem to 5rem, tight leading). Readable body type everywhere else. | Fyreworks |
| Big numbered rows (01, 02, 03) with thin dividers for lists of options | Fyreworks |
| Pill buttons with an arrow (→). Primary: solid deep green. Secondary: outline. | Fyreworks, Bevere |
| Full-screen menu on phones: large items, nothing else | Fyreworks |
| Question-led section headings | BibleProject |
| Soft tinted section backgrounds (white, then warm cream `#F7F3EC`, then pale green) alternating, never more than one per section | BibleProject, Bevere |
| Real photos of real people, rounded corners, never stock | Bevere |
| Trust in the footer: what we believe, contact, policies, socials | AWMI |
| Course cards show lessons, time and "Free" | Ligonier, Bevere |
| A dark footer with app badges | BibleProject |

Strip back:

- Glass effects: keep only on the header. Remove them from cards and sections.
- Card hover animations, floating icons and decorative gradients: remove.
- Motion: keep the hero loop only (existing loop rules stand). Section reveals: a single subtle fade at most.
- No sliders, carousels with dots, pop-ups or countdowns.
- Phones: Home should be about 5,000px or less.

Keep:

- Existing tokens, both themes (light and dark), the contrast rules, the Motion control, the loop pipeline, the seams (`lib/academy`, `lib/app-integration`), and the anonymous questions flow.

Header: logo, then Teachings, Academy, About and Ask, then one primary pill button, "Browse free courses". On phones: logo and menu button. The header stays small and visible on scroll.

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

Subline: "Free courses and teaching that bring you into an accurate understanding of God's Word, and a real encounter with Him."

Buttons: **Browse free courses** (primary), **Watch the latest teaching** (secondary, outline).

Visual: [photo of Isaac Ola teaching, to be supplied]. Until then, the current hero loop.

### Screen 2: Mission statement

Large display text, one sentence:

"We teach believers to read God's Word accurately, understand it deeply, and live it fully, wherever they are."

Small line under it: "The name comes from Bethlehem, the house of bread, where the Bread of Life was born." Link: **Read our story →**

### Screen 3: Academy (main action)

Eyebrow: "The Academy"

Heading: "Read the Bible for years and still feel you only know it in parts?"

Text: "Our free courses take you through it, one lesson at a time."

Show three course cards from the catalogue, each with title, one-line promise, "[6] lessons · about [20] minutes each · Free" and the button **Start this course**.

Link under the cards: **Browse all free courses →**

### Screen 4: Where are you starting from?

Big numbered rows:

- **01. New to the Bible.** "Start with the foundations: what the Bible is and how to read it." Links to [foundations course].
- **02. You know the stories, but not how they connect.** "Go book by book and see the whole picture." Links to [book-by-book course].
- **03. You're carrying a question.** "Ask it. You don't need to give your name." Links to Ask.

### Screen 5: Teachings

Heading: "Need a word for this season?"

Text: "Sit under the teaching of the Word, wherever you are."

One large video (the latest from the ministry channel), title and date. Then three smaller videos.

Button: **See all teachings**

Small line: "New teaching live every Monday at 8 pm Lagos time." Link to the session times. That is the only mention of live meetings on Home.

### Screen 6: The teacher

[Photo of Isaac Ola]

"Taught by Isaac Ola, team leader of House of Bread Ministries International. He teaches Scripture verse by verse, with care for what the text actually says."

Links: **Read our story →** and **What we believe →**

### Screen 7: App (before the footer)

Heading: "Take the Word with you."

Text: "Daily reading and journeys through the New Testament, in your pocket."

Button: **Get the app**, with store badges when the links exist.

## 5. Other pages (apply the same rules)

**Academy**

- Heading: "Free Bible courses"
- Text: "Self-paced video lessons that take you through Scripture in context. Free, always."
- Below the text: "Where are you starting from?" rows (as on Home), then all courses as cards.
- Next step: "Not sure where to begin? Start with [foundations course]."

**Course page**

- Title, then a one-line promise, then "[N] lessons · about [N] min each · Free".
- **Start this course** button.
- "What you'll learn" (3 to 5 bullets).
- "Lessons" (a numbered outline).
- "Taught by [Isaac Ola]".
- Next step: the next course.

**Teachings**

- Heading: "Need a word for this season?"
- Text: "Every message, in one place. Watch, then go deeper in the Academy."
- Latest teaching large, then a grid of the rest, then the live line (as on Home).
- Next step: **Browse free courses**.

**About**

- Heading: "A teaching ministry"
- Our story: the Bethlehem and Bread of Life revelation, the purpose (accurate understanding and revelation of God's Word, beyond four walls), and the global reach. Keep it under 150 words.
- The teacher, what we believe, then contact.
- Next step: **Browse free courses**.

**Ask**

- Heading: "Ask a question about the Bible"
- Text: "No name or email needed. We read every question, and some are answered in our teaching."
- Keep the existing form and safety notice.
- Next step: **Watch the latest teaching**.

**App page**

- Heading: "Take the Word with you."
- Features as a short numbered list.
- Next step: **Browse free courses**.

**Events page**

- Heading: "Live every Monday"
- The session-times block, unchanged.
- Next step: **Watch the latest teaching**.

**Subscribe**

- Heading: "New teaching in your inbox"
- Text: "One email when something new is ready. Nothing else."

**404 page**

- Heading: "This page isn't here."
- Buttons: **Browse free courses** and **Go home**.

## 6. To confirm with the ministry

- The full name in the footer and About: House of Bread Ministries International, or House of Bread Global.
- A photo of Isaac Ola teaching (hero) and a portrait (teacher section).
- The first three courses: titles, lesson counts and lengths.
- The hero headline choice: A, B or C.
