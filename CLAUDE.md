# CLAUDE.md

Operating instructions for Claude Code on the House of Bread Global website.
Read this file at the start of every session. Follow it over general defaults.

Last updated: 27 October 2026

---

## 1. What this project is

House of Bread Global is a Christian teaching ministry serving the UK, Africa
(Nigeria especially) and the United States. This repository is the ministry
website, built from scratch.

A separate House of Bread mobile app already exists. It is a shipped React
Native product with its own repository, its own release cycle and its own
developer. It carries 30, 60 and 90 day New Testament reading plans,
explanations of every New Testament book, articles, and six translations.
This repository does not build, modify or deploy the app.

The website does five jobs:

- Be found: search ranking and AI citation for the teaching
- Explain the ministry: who it is, what it believes, what it offers
- Show what is happening and when: live sessions run on YouTube, trainings
  and classes are announced here
- Promote the app
- Collect newsletter signups

Launch scope is a content website plus newsletter signup. No user accounts, no
payments and no database at launch.

Planned for later: the website will link to the app, including reading a
user's reading plan progress through an API. This is not built at launch.
Section 5, "App integration seam", keeps the door open without building it.

Primary domain: `hobglobal.online`
Audience: UK, Africa (Nigeria especially), United States

Full specification lives in `docs/SPEC-v3.md`. Read it before any
architectural work. Versions 1.0 and 2.0 are superseded and must not be
followed.

---

## 2. Stack

- Next.js (App Router), TypeScript, React Server Components by default
- Tailwind CSS with shadcn/ui, only the components actually used
- MDX for all teaching and event content, stored in the repo under `/content`
- Zod for frontmatter schemas and form input validation, one validation
  library for everything
- Vercel for hosting, with preview deployments on every branch
- Kit for the newsletter, called from the server only
- Resend for the contact form email
- Plausible for analytics, cookieless by design

Not in the stack at launch: Supabase, Stripe, Paystack, any auth provider. Add
one only when the spec stage calls for it, and say why first.

Do not introduce a new dependency without saying why an existing one does not
cover it. Prefer the platform primitive over the package.

---

## 3. Commands

```
npm run dev              # local development
npm run build            # production build
npm run lint             # eslint
npm run typecheck        # tsc --noEmit
npm run test             # vitest
npm run content:validate # validate all MDX frontmatter against schema
```

Run `npm run typecheck`, `npm run content:validate` and `npm run build` before
declaring any task complete.

---

## 4. Folder structure

```
/app                    Next.js App Router routes
  /(marketing)          all public pages, statically generated
  /api/subscribe        newsletter route handler
  /api/contact          contact form route handler
/components
  /ui                   shadcn primitives, do not hand edit
  /shared               project components
/content                single source of truth for the website
  /teachings            MDX articles and doctrine deep dives
  /books                New Testament book explanations
  /plans                reading plan landing content
  /answers              apologetics Q and A
  /events               live sessions, trainings, meetings
  /classes              class and training descriptions
  /transcripts          video transcripts
/lib
  /content              MDX loading, parsing, schemas
  /scripture            canonical reference module, framework free
  /newsletter           Kit client and subscribe logic
  /media                YouTube feed parser and the cached video fetch
  /app-integration      future app link, interface and no-op provider only
/docs                   SPEC-v3.md and supporting design notes
/public
```

---

## 5. Hard rules

### Content architecture

- MDX in `/content` is the single source of truth for the website.
- Every content type has a Zod frontmatter schema, validated in CI. A file that
  fails validation does not build.
- Much of the teaching currently lives inside the app. Before copying any of
  it into this repository, confirm with the CEO and the app developer that
  the copy is permitted and which side is the source of truth from then on.
  Never hand maintain the same article in two places without a recorded
  decision. Two copies drift, and reconciling them by hand does not scale.
- Keep content portable. Structured data stays in frontmatter and in the
  `<Scripture>` component, not in layout, so the content could be exported to
  another client later without rewriting it.

### Scripture references

- All scripture references resolve through `/lib/scripture`. Never parse
  references inline.
- The module has no Next.js or React imports, so it can be extracted into a
  shared package if the app ever needs the same logic.
- It owns canonical book identifiers, verse range notation, a parser that
  accepts common human spellings, and the deep link builder.
- It has a golden test file of `input string -> canonical reference` pairs. A
  change to book naming or range notation is a breaking change for deep links.
  Treat it as one.

### Translation licensing

- Only public domain translations may be served in full from the public web:
  King James Version, American Standard Version, Young's Literal, Darby,
  World English Bible.
- Licensed translations (NIV, ESV, NLT, NASB, CSB, NKJV and others) may appear
  only as quotation within teaching content, never as full text.
- The app's licences do not extend to the website. If a task would publish
  full text of a translation not on the public domain list, stop and raise it
  rather than shipping it.

### Newsletter and privacy

- Subscription goes through the `/api/subscribe` route handler only. The Kit
  API key is server side, never in a `NEXT_PUBLIC_` variable or client bundle.
- Validate input with Zod. Add a honeypot field and a rate limit. Double
  opt-in stays on in Kit.
- Collect the email address and an optional first name. Nothing else.
- Show consent wording next to every form, with a link to the privacy policy.
- Return the same success message whether or not the address already exists,
  so the form cannot be used to check who is subscribed.
- Never log full email addresses.
- Plausible is the only analytics. Do not add a script that sets tracking
  cookies. Do not add any third party script without raising it first.

### Security

- Never commit secrets. `.env.local` stays in `.gitignore`.
- Only variables that are public by design may carry the `NEXT_PUBLIC_` prefix.
- Security headers are set in `next.config`: Content-Security-Policy,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy and
  frame-ancestors. Only `youtube-nocookie.com` may be framed, and only on pages
  with an embed.
- Every route handler validates input, handles errors, and returns no
  internals. Treat all form input as hostile.

### Live sessions

- Live streaming runs on YouTube. No hosted long form video. Short silent
  decorative loops are allowed: 800 KB each or less, with a poster, lazy
  loaded, paused offscreen, never with sound, and off with Motion Off
  (which follows reduced motion until the visitor chooses), Save-Data and
  a slow connection (effectiveType slow-2g, 2g or 3g).
- Embeds use `youtube-nocookie.com` behind a click to load facade, so no
  YouTube code loads until the visitor asks for it.
- Event times are stored as UTC plus an IANA time zone in frontmatter, and
  shown in the visitor's local time with the ministry's time zone beside it.
  The audience spans UK, Nigerian and US time.
- Calendar files (`.ics`) are generated at build time with no package.

### App integration seam

Not built at launch. These rules keep it cheap later.

- All calls to the app live behind `/lib/app-integration`. At launch it holds
  a `ProgressProvider` interface and a `NoopProgressProvider`. No component
  imports an app API directly.
- App API calls happen on the server. No app credential or token reaches the
  browser.
- Any future sign in uses a standard such as OAuth or OIDC against whatever
  the app already uses. No custom auth scheme.
- Scope is read only, and the user consents explicitly.
- Do not create user tables, sessions or auth routes until the spec stage
  calls for them. Raise it first.
- Do not invent the app's URL scheme or API shape. Both are open items in the
  spec.

### Code

- Server Components by default. Add `"use client"` only when the component
  needs state, effects or browser APIs.
- Co-locate. A feature's components, queries and types live together.
- No `any`. If the type is genuinely unknown, use `unknown` and narrow it.
- Loading and error states are part of the feature, not a later pass.

---

## 6. Writing and content rules

These apply to every line of user facing copy, UI text, content, email and
documentation. They are not stylistic suggestions.

- Never use the em dash or en dash character. Use ellipses, commas or full
  stops instead.
- Use the hyphen `-` for bullet points. Never the bullet symbol.
- Scripture is quoted in full and in context. Never a fragment of a verse
  pulled out of its surrounding sense. Include the verses either side where
  the argument depends on them.
- King James Version is the primary text throughout. NASB may be referenced as
  an exegetical control, NKJV as a bridge for younger readers. Label any
  non-KJV quotation explicitly.
- Strong's numbers are woven into the explanation naturally, not appended as
  footnotes.
- Avoid first person voice in product descriptions, marketing copy and
  business facing content.
- Register is warm, direct, pastoral and rigorous. Plain contemporary English.
  Not archaic, not academic, not detached.
- Keep technical explanations short and reduced to their essence.
- Documents generate with the actual current date. Run `date` to confirm it.
  Never guess.

### Scripture component usage

Always render scripture through the `<Scripture>` component rather than raw
blockquote markdown, so that references stay machine readable, feed the
Scripture Index, and resolve through `/lib/scripture`. The prop is `passage`,
not `ref`, because `ref` is reserved in React.

```mdx
<Scripture passage="John 6:35" version="KJV">
And Jesus said unto them, I am the bread of life: he that cometh to me shall
never hunger; and he that believeth on me shall never thirst.
</Scripture>
```

### Content portability

Teaching content is also read on a phone, and may one day be consumed by the
app. Write accordingly:

- No reliance on layout, columns or hover for meaning
- Headings every few hundred words
- Tables kept narrow or avoided
- Links to other pages use content slugs, so they can be remapped

---

## 7. Design system

Tokens live in `app/globals.css`. Every value and every contrast pairing is
logged in `docs/PLACEHOLDERS.md`. Add any new pairing to
`scripts/check-contrast.mjs` (as a role pairing, so it runs in both
themes), run `npm run contrast`, and log it before it ships.

### Themes

- The site has a light and a dark theme. Tokens only: no hex, `rgb()`,
  `color-mix()` or literal `white`/`black` utility in a component. Every
  new component must work in both themes. Colours are defined in
  `app/globals.css` and nowhere else, and
  `components/shared/theme/colour-tokens.test.ts` fails the build on a
  literal colour outside its short list of theme invariant uses (the deep
  green footer, brand marks on white tiles, white text on fills).
- Dark tokens are written once, inside `:root { @variant dark { ... } }`.
  The `dark` variant matches the system preference when no theme is saved
  (this is also the no JavaScript case), or `data-theme="dark"`;
  `data-theme="light"` opts out. Use `dark:` utilities for dark only
  additions.
- A colour that is both a fill and text gets two tokens. `emerald` is a
  fill that carries white text; `emerald-deep` is text and links; `glyph`
  is icons, rules, progress fills and outline borders; `fill-primary`,
  `fill-hover` and `fill-disabled` are button fills; `on-gold` is text on gold, brand ink
  in both themes; `surface-raised` replaces white for inputs, cards and
  pills.
- Dark is deep green black (`#0a1510`), never pure black, with raised
  surfaces a step lighter. The footer stays deep green in both themes.
- The head script in `app/layout.tsx` sets `data-theme` from the saved
  choice before first paint, so the wrong theme never flashes. Do not move
  theme logic into a component that runs after hydration. Theme controls
  carry `data-theme-control` and stay hidden without JavaScript.

### Simplicity first (the reset)

`docs/RESET-BRIEF.md` sets the direction since 27 October 2026. The site
has one job: get people into free courses (Academy) and teaching videos
(Teachings). Where an older rule below or in `docs/PLACEHOLDERS.md`
disagrees with the brief, the brief wins.

- One idea and one primary button per screen. Lots of white space.
- Question-led section headings. Lists of options are big numbered rows.
- No sliders, carousels with dots, pop-ups or countdowns.
- Live sessions, events and the newsletter are supporting detail: small
  lines or the footer, never a main section. Every page ends with a next
  step towards a course, a teaching or a question.

### Palette

- The site is mostly white, with green built around it. Calm: nothing
  shouts.
- Surfaces: white carries the page. `surface-warm` (cream, `#f7f3ec`) and
  `surface-mint` (pale green) alternate as section bands, one tint per
  section. `tint` (emerald at 8%) is for the current nav pill, icon tiles
  and skeletons. No decorative gradients anywhere: `bg-hero-tint`,
  `bg-page-tint` and `bg-panel-tint` are flat.
- Text on light is `ink` and `ink-muted`. Links, eyebrows, TextCTA labels,
  heading accents and focus rings are `emerald-deep`. `fill-primary` (deep
  green in light, emerald-night in dark) is the primary button. `emerald`
  is icon glyphs, the primary hover and the short rule above section
  headings.
- Deep green (`green-deep`, `green-night`) is the footer, the primary
  pill and small elements only. No deep green section or panel anywhere
  else, and no full bleed green hero.
- `lime` is a decorative 6px dot at most on light. Never a fill, a
  headline colour or a carrier of meaning. Lime text only on `#0f4a22` or
  darker: in dark, lime is the eyebrow text colour.
- `gold` and `gold-soft` are fills for live states, badges and small
  highlights, always with ink text. Use them sparingly.
- Borders are hairlines (emerald at 12%), deepening to 35% on hover.
  Shadows are soft and low opacity (`shadow-soft`, `shadow-raised`).

### Type and shape

- Literata for display and headings, Geist for UI, nav, buttons and
  labels. Body 18px, line height 1.7.
- `text-statement` (clamp 2.5rem to 5rem, line height 1.04) is huge
  display type for statements only: the Home hero and mission. Inner page
  H1 is `text-display` (36 to 56px), H2 `text-h2` (28 to 36px), both at
  weight 500; h3 and smaller at 600.
- Eyebrows: 0.75rem, uppercase, 0.14em tracking, emerald-deep, no pill.
- Radii: buttons are pills, inputs 10px, icon tiles 14px, cards 20px.
- Motion is CSS only and minimal: the hero loop, one subtle fade as a
  section enters (`.reveal`, from 0.85 opacity, no movement), the 4px
  arrow nudge on buttons and TextCTAs, the menu fade (180ms) and the
  skeleton shimmer. No card moves on hover (a linked card only deepens its
  edge), no floating or 3D icons, no entrance animations. Nothing runs
  under reduced motion.
- Hero and page headers sit below the sticky header with at least 64px of
  clear space above their first line.

### Translucent surfaces and glass

- The sticky header is the only translucent surface (`glass-header`:
  white at 94%, night at 94% in dark), so its text keeps AA over anything
  that scrolls beneath, checked against black in light and white in dark.
  Under `prefers-reduced-transparency` it turns solid. Cards, panels and
  sections are always solid.
- `backdrop-filter` ships off: a 4x CPU slowdown test on 17 October 2026
  could not show it was cheap. Turn it on for the header only after a
  scroll check on a real mid range Android phone shows no more than a few
  fps lost, at 12px blur or less, with the current colour as fallback.

### Loading states

- Skeletons only where content really loads: the Library video grid and
  Home's teaching block (Suspense fallbacks), route segments that await
  data (`loading.tsx`), and a still tint behind `next/image` thumbnails.
  Never on static content.
- Use `components/shared/Skeleton.tsx`: `Skeleton` blocks inside a
  `LoadingRegion` (aria-busy plus a visually hidden "Loading"). The shimmer
  moves by transform only and stays still under reduced motion. Size every
  skeleton like the real content, so nothing shifts
  (`scripts/check-noscript.mjs` measures it).

### Decorative motion loops

- Every loop renders through `components/shared/LoopVideo.tsx` and is listed
  in `lib/media/loops.ts`. Files in `public/media/loops` are built by
  `npm run loops:build` from raw clips kept outside the repo, never by hand.
- Only hero loops move: the Home hero and the one loop in a page's top
  header (`PageHeader`). Every other `LoopVideo` passes `still` and shows
  its poster only. `motion.test.ts` guards this.
- At most one loop above the fold per page. Loops sit in framed panels
  (20px radius), never behind text, except the Home hero, which has a
  white scrim checked against the darkest frame (in dark, a night scrim
  checked against the brightest frame of the dark loop).
- A loop with a dark rendition (`WITH_DARK`) shows its dark poster and
  plays its dark video in dark. A loop without one is light only: in dark,
  `LoopVideoClient` loads no video and `[data-loop]` shows its still glow
  in `app/globals.css`.
- Phones (767px and below) play only the Home and Academy hero loops, from
  their phone rendition (`WITH_PHONE`): a centred crop to the hero's phone
  aspect, 540px wide at most, 12 fps, a 4 s loop opening on the poster's
  frame, 200 KB or less, light and dark, served by `<source media>`. Every
  other loop is a poster on phones. Add a phone loop only with an
  interleaved mobile Lighthouse A/B on Home (docs/PLACEHOLDERS.md).
- No loop video exists until window load, an idle moment
  (requestIdleCallback, or a timeout) and then `LOOP_START_DELAY_MS` (3 s,
  `lib/media/loops.ts`) have passed, and every loop has preload="none".
  Until then the poster stands alone and holds the space; the video fades
  in over it from the same frame. Why: started at load plus idle, the Home
  phone loop cost mobile Lighthouse 8 points (median 84 to 76), all Speed
  Index; with the delay the median was 88 against 90 in light (23 October
  2026). Lower it only with that A/B.
- Nothing stops a loop but Motion Off, Save-Data, a slow connection
  (slow-2g, 2g, 3g) or prefers-reduced-motion (through the Motion
  default). Offscreen it pauses and resumes on return.
- Every loop is seamless: `npm run loops:seams` checks the wrap of every
  file, and `scripts/check-loops.mjs` measures the restart in a browser.

### Motion

- No loop, hero or panel carries a Pause/Play button. One "Motion" control
  (On or Off) sits beside the theme choice in the footer, and nowhere else
  (`components/shared/theme/MotionToggle.tsx`). Why: WCAG 2.2.2 needs a
  way to stop motion that lasts over five seconds, and one site wide
  control does the job once, where the theme choice already lives. The
  header and phone menu carry links only.
- Off stops and hides every loop video: posters only, nothing moves. With
  no saved choice it follows prefers-reduced-motion. A choice is saved in
  localStorage (`hob:motion`, inside try/catch) and wins over the system
  setting.
- The head script sets `data-motion` on the html element before first
  paint, so a loop never flashes and the current On or Off pill is right
  before hydration. CSS hides `[data-loop] video` under
  `data-motion="off"`, and `LoopVideoClient` unmounts the videos.
- The control is a button named "Motion" by its visible label, with
  `aria-pressed`, a 3px focus ring and a 44px target, and stays hidden
  without JavaScript (`data-theme-control`), when no loop moves anyway.
  `components/shared/theme/motion.test.ts` guards all of this.
- A loop blended with `multiply` must be keyed to pure white and pass
  `npm run loops:verify`.

### Logo

- `public/logo-mark.png` is the mark with alpha, cut from the supplied PNG
  by `node scripts/logo/make-transparent.mjs` (edge connected fill, so the
  white cross stays; 1px feathered and defringed), shown with `next/image`
  beside the text wordmark (`Logo.tsx`), with `priority` in the header,
  straight on the header glass with no tile. On the footer it sits in a
  white tile, because the lid edge falls to 2.49:1 on green-deep, and in
  dark the header mark gets the same tile (`.logo-mark`) until the ministry
  supplies a reversed mark. `app/icon.png`, `app/apple-icon.png` and
  `app/opengraph-image.png` come from the same source. Replace all of them
  when the SVG arrives.

### Buttons and calls to action

- Every call to action is a `Button`, a `ButtonLink` or a `TextCTA`. No
  call to action is underlined.
- Button labels say exactly what happens. Use only the labels in the
  table in `docs/RESET-BRIEF.md` section 2 (Start this course, Continue
  learning, Browse free courses, Watch now, See all teachings, Ask a
  question, Get the app, Read our story, What we believe), plus any label
  the brief names for a specific page.
- Buttons are pills with an arrow (`ButtonLink` shows it by default), at
  least 48px tall on mobile and 52px from `sm`, full width and stacked in
  heroes and bands on mobile. Nothing lifts; the arrow nudges 4px.
  - Primary: solid deep green (`fill-primary`), white text, emerald on
    hover.
  - Secondary: an outline, a 1.5px `glyph` border, emerald-deep text, tint
    on hover.
  - Footer (`tone="green"`): primary is white with green-deep text;
    secondary is white at 12% with a 1.5px white border.
  - Live: gold fill, ink text, only while a session is live.
- `TextCTA`: a weight 600 label and a 28px circular arrow chip, for
  secondary links such as "Read our story". On light the label is
  emerald-deep and the chip has an emerald border at 25%; on hover the chip
  fills emerald and the arrow turns white and slides 3px. In the footer
  the label is white, the chip white at 15%, and hover fills it white with
  a green-deep arrow. A card that stretches a TextCTA over itself carries
  `.cta-host`.
- Never use "Learn more", "Come and be fed", "Be fed by the Word",
  "Transform your life", "Unforgettable" or "Journey of faith"
  (`lib/content/reset-copy.test.ts` checks the pages reset so far).
- Every interactive element has a visible focus ring: emerald-deep on
  light, white in the footer.

### Links

- Links inside paragraphs and teaching body text keep a thin underline:
  offset 3px, skip-ink, emerald at 50% opacity, solid on hover. Use
  `.link-inline`, or `.prose a` in body text. This is required for
  accessibility.
- Nav and footer link lists have no underline. Hover is a pill background.
  The current page has `aria-current="page"` plus a stronger pill with an
  inset ring and heavier type, never colour alone.

### Navigation

- Header: 64px, sticky, so it stays small and visible on scroll, on the
  header glass with a hairline below. From `lg`: logo, then Teachings,
  Academy, About and Ask in ink, the current page in a tint pill with an
  inset emerald ring, then one primary pill, "Browse free courses", to
  `/academy`. Teachings points at `/media` until the routes are renamed.
- Below `lg`: the logo and a "Menu" button only. The menu is a `details`
  element and works without JavaScript. Its panel fills the screen below
  the header, solid surface: the four links as large serif items, then
  the "Browse free courses" pill, and nothing else.
- Footer: deep green in both themes, the site's trust block. The full
  ministry name (in brackets until confirmed), socials, store badges once
  the store links exist, one list of links (Teachings, Academy, About,
  What we believe, Ask, Events, App, Subscribe, Contact, Privacy), and the
  Light, Dark or System theme choice beside the Motion control.
- The app has one section, just before the footer, on Home. Newsletter
  signup lives on `/subscribe` and in the footer link, not in a closing
  card on every page.

---

## 8. Accessibility and performance

- Semantic HTML first. Reach for ARIA only when semantics cannot express it.
- All interactive elements reachable and operable by keyboard.
- Colour contrast meets WCAG 2.2 AA.
- Every video has a transcript page. This is an access commitment and the SEO
  engine. Transcripts arrive in stage two.
- Target Lighthouse 95 or above on performance and accessibility for public
  pages.
- Significant portions of the audience are on mid range Android over mobile
  data. Budget accordingly. Images optimised, fonts subset, no decorative
  JavaScript on content pages, no third party embed loaded before it is asked
  for.

---

## 9. Git

- Branch per feature, named `feat/`, `fix/` or `content/`.
- Small commits with clear messages. One logical change per commit.
- The `main` branch is always deployable.
- Never force push to `main`.
- Typecheck and lint run on commit. The full build runs on push and in CI.

---

## 10. How to work with me

- Use plan mode for anything larger than a small fix. Present the plan, wait
  for approval, then build.
- Build in vertical slices. One working feature end to end beats four half
  finished ones.
- Ask when a requirement is ambiguous. Guessing wastes more time than asking.
- Flag honestly when an approach has a weakness, a security gap or a simpler
  alternative. Agreeable but wrong is the expensive outcome.
- Say when a change would affect the app or depend on the app developer.
- Keep narration short. Deliver the work, then summarise briefly.

---

## 11. Definition of done

A task is complete when all of the following hold:

- `npm run typecheck` passes
- `npm run content:validate` passes
- `npm run build` passes
- `npm run lint` passes
- New content types have a Zod frontmatter schema
- New forms validate input, rate limit, and show loading, success and error
  states
- The page works on a 375px viewport and with keyboard only
- Copy follows section 6 without exception
- Any dependency added is justified in the commit message
- Anything touching the app integration seam is called out explicitly
- Changes are committed on a feature branch
