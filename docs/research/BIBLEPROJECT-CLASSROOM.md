# BibleProject Classroom: LMS Research for House of Bread Academy

Source: bibleproject.com/classroom, studied live on 29 Oct 2026. I clicked through the catalogue, a class page, all its tabs, a session player and its menus.

## 1. Structure (the content model)

```
Classroom (catalogue page)
└── Category (3): Old Testament · New Testament · Bible Reading Skills
    └── Class (course), e.g. "Rise of the Messiah"
        └── Module (3 per class), e.g. "Introducing Matthew"
            └── Session (lesson, 16 per class), e.g. "What Does 'Gospel' Mean?"
                └── Tabs: Slides · Teacher Notes · Transcript · Reflection
```

What each level carries:

| Level | Fields |
|---|---|
| Category | Name, anchor (#old-testament) |
| Class | Scripture range ("Matthew 1-4"), title, teacher, illustration, description (one question, then 2 to 3 sentences), total time ("10 hr 44 min"), sessions count, modules count, tags ("Guest Teacher", "Newest Class", "Facilitator's Guide Available"), trailer, learning objectives (about 9 bullets), instructor bio, downloads |
| Module | Number, session range ("Sessions 1-4"), title, one-paragraph description, total time, round illustration with a progress ring |
| Session | Number, title, one-sentence description, length ("34 min" / "34:10"), video, slides, teacher notes, transcript, reflection question with a hidden "BibleProject Response" |

Scale: classes run 4 to 16 hours. Rise of the Messiah has 3 modules and 16 sessions (28 to 53 minutes each).

## 2. Catalogue page (/classroom)

Top to bottom:

1. **Hero:** "BibleProject Classroom" (eyebrow), "Study the Bible with a Scholar", one line, two buttons: **See All Classes** (jumps to the catalogue) and **Preview Sample Session**.
2. A large photo of the teacher teaching, with a hand-drawn notes overlay.
3. **Two value blocks:** "Every Class Is Free" (classes run 4 to 16 hours and include student resources) and "Dive Deep Into Scripture".
4. A green notice bar: "New: Facilitator guides are here…"
5. **Find a Class** (the main LMS view):
   - **Left column, sticky:** "Class Categories" list (Old Testament, New Testament, Bible Reading Skills). Clicking scrolls to that group (anchor `#new-testament`) and highlights the active category. Below it is a featured **"Start Here"** card: illustration, title, short paragraph, **View Class** button.
   - **Right column:** every category in turn, each with a heading and a list of class rows. Each row has a wide illustration thumbnail on the left, and on the right the Scripture range (small grey), the class title (bold) and a 3-line clamped description. Tags sit beside some rows ("Guest Teacher", "Newest Class", "Facilitator's Guide Available").
   - **Phones:** the category list collapses into a "Class Categories" dropdown, the Start Here card comes next, then the rows stacked.
6. **Testimonials:** "What Students Are Saying", 9 quotes, each with a first name and "Completed [class]".
7. **App promo:** "Go to Class on the BibleProject App" (audio-only, store badges).

## 3. Class page (/classroom/rise-of-the-messiah)

- **Notice bar:** "Want to invite others… Download our facilitator's guide."
- **Header (two columns):**
  - **Left column:**
    - The title, then "Matthew 1-4 • Dr. Tim Mackie", then a **Share** button.
    - The description.
    - A stats row: 10 hr 44 min · 16 Sessions · 3 Modules.
    - A **progress bar** labelled "Not Started".
    - Buttons: **Begin Class** (primary) and **Watch Class Trailer**.
  - **Right column:** a large illustration in a rounded card.
- **Tabs** (shareable in the URL, `?tab=overview`):
  - **Modules (default):** each module is an **accordion**. On the left is a round module illustration with a **progress ring** and "Not Started" under it. On the right are "Module 1 • Sessions 1-4", the title, the description and the total time. Expanded, it shows a **vertical timeline** of sessions (circle markers on a dotted line), each with the session number, title, one-line description and minutes. Module 1 is open by default; the rest are collapsed with a chevron.
  - **Overview:** class trailer video, **Learning Objectives** ("After you complete this full class, you will be able to…", 9 bullets), **Meet Your Instructor** (bio), "More About Classroom".
  - **Downloads:** Teacher Notes (PDF), Facilitator's Guide (PDF, tagged New).
- **Footer of the class:** "Keep Going! Complete all sessions to earn your certificate."

## 4. Session player (/classroom/rise-of-the-messiah/sessions/1/)

- **Full-width app-style layout:** no site nav.
  - **Top bar:** a back arrow, then the centred "Session 1 · What Does 'Gospel' Mean?", then a **⋮** menu.
  - **Below the bar:** a full-width video with a speed control (1x). Under it, tabs:
    - **Slides:** slides synced to the video.
    - **Teacher Notes:** written notes for the session.
    - **Transcript.**
    - **Reflection:** one question to think about, plus a **"Reveal Response"** button that shows BibleProject's answer.
- **Tapping the title** opens a **session list** panel grouped by module (module title and illustration), each session with its length. That's how you jump between lessons.
- **The ⋮ menu:** Share Class, **Mark Session as Complete**, Report an Issue, Download Teacher Notes, Download Facilitator Guide, and an **Audio Only** toggle.
- **Sign-in is optional.** A "Welcome to Classroom" modal offers **Sign In Now** or **Sign In Later**. Guests can watch everything, and signing in saves progress and earns the certificate.

## 5. What makes it work

1. **Three clear levels** (class, module, session) with time shown at every level, so people know the commitment before starting.
2. **Progress is visible everywhere:** the class bar, the module rings and the session markers.
3. **Watching needs no account.** Sign-in is offered, not forced, so there's no barrier to starting.
4. **A single "Start Here" class** is always pinned beside the catalogue, so newcomers know where to begin.
5. **Questions lead every class description** ("Who is this man, Jesus…?").
6. **Each lesson has more than a video:** slides, notes, transcript and a reflection with a model answer. Low-data users can turn on audio only.
7. **Groups are supported** through downloadable facilitator guides.
8. **A certificate on completion** motivates people to finish.
9. **Consistent illustrations** on every class and module give it a premium, unified look.

## 6. Weak points (avoid these)

- The old /classes URL returns a 404. Keep redirects when URLs change.
- The sign-in modal pops up on top of the video when the session opens.
- The player has no visible "Next session" button. You have to open the title panel or the ⋮ menu to move on.
- Catalogue rows show no time or session count. That only appears on the class page.
- The scroll-spy highlight lags when a category is clicked.

## 7. How this maps to House of Bread Academy

| BibleProject | House of Bread equivalent |
|---|---|
| Classroom page | `/academy` |
| Categories | e.g. Foundations · Old Testament · New Testament · Doctrine · Christian Living [ministry to confirm] |
| Start Here card | The foundations course |
| Class | Course (`/academy/[course]`) |
| Module | Section |
| Session | Lesson (`/academy/[course]/lessons/[n]`) |
| Slides / Notes / Transcript / Reflection | Notes · Transcript · Reflection (slides later) |
| Facilitator guide | Small-group guide (later) |
| Certificate | Completion certificate (later, needs accounts) |

Suggested build for the placeholder phase (no accounts, no database):

1. **`/academy` catalogue:**
   - **Left, sticky:** category list and the Start Here card.
   - **Right:** category groups with course rows. Each row shows a thumbnail, Scripture range, title, 2-line description, and "[N] sections · [N] lessons · [N] hr".
   - **Phones:** the categories become a dropdown or a horizontal chip row.
2. **Course page:**
   - **Header:** title, Scripture range, teacher, description, stats, Start course button, trailer.
   - **Tabs:** Sections (accordion timeline), Overview (what you'll learn, teacher bio), Resources (downloads).
3. **Lesson page:**
   - The video (YouTube embed, privacy-enhanced).
   - **Tabs:** Notes, Transcript, Reflection (question plus a "Reveal response" button).
   - A session list drawer, and visible **Previous / Next lesson** buttons (which fixes BibleProject's gap).
4. **Data:**
   - Courses, sections and lessons as MDX or JSON in `/content/academy`, read through the existing `lib/academy` CourseCatalog seam.
   - Progress through the `ProgressProvider` seam: localStorage first (no sign-in), then accounts and certificates later.
5. **Progress UI:**
   - "Not started / In progress / Completed" on the course card and header.
   - "Mark lesson complete" on each lesson.
   - Rings on the sections.
   - These work from local storage now and switch to the account later.
