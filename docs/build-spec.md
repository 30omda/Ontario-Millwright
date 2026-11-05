# Ontario Millwright — Build Spec (Design B · Blueprint → Production)

> Source of truth for turning the approved **Direction B · Blueprint** canvas into a production Next.js site.
> Design canvas: https://claude.ai/artifact/MGHh8xJtKFzKKabdFFEqzv (artboards: `Blueprint`, `Blueprint-Laptop` 1280, `Blueprint-Tablet` 768, `Blueprint-Mobile` 390)
> Master plan doc: "Ontario Millwright — Master Plan (Direction B)" · https://claude.ai/artifact/AxX4WXzoN1ht6sKDHbux7J
> Kickoff: **08:00 (Cairo time)** · Owner: Mohamed Shamseldeen (30omda)

---

## 0. Kickoff checklist (first 90 minutes)

1. `pnpm create next-app@latest ontario-millwright --ts --tailwind --app --src-dir --eslint --import-alias "@/*"`
2. `pnpm dlx shadcn@latest init` → confirm `components.json` points `ui` to `src/components/ui`.
3. Install the libraries in §2 (one command per group, so failures are easy to read).
4. Add design tokens (§3) to `src/app/globals.css` (`@theme`), load Geist + Geist Mono via `next/font`.
5. Create the Sanity project + embedded Studio at `/studio` (§6), add the schemas, seed the 5 services + 8 industries + 3 projects from the canvas copy.
6. Download the assets from the canvas (§4) into `public/media/` and run them through `next/image` / the video pipeline.
7. Build in this order: tokens → layout shell (Navbar, Footer) → Hero → Services → Industries → Process → Recent work → Safety → About → Quote → motion pass → responsive QA → a11y/perf QA.
8. Deploy a preview on Vercel at the end of day 1 (even if sections are stubbed).

**Rule for the whole build:** every number, label and string in this file comes from the approved canvas. If a fact is missing (WhatsApp number, certifications, stats), use a visible `[TBC]` placeholder, never invented content.

---

## 1. Locked decisions

| Area | Decision |
|---|---|
| Design | Direction **B · Blueprint** only. Navy `#0B2239` + Safety Yellow `#FFB81C` on light steel `#EEF2F5`. |
| Typography | **Geist** for everything (headings 600–800, body 400–500). No serif, no monospace labels in UI copy. |
| Copy rules | No `—` em dashes, no AI-style code labels (`SVC-01`, `CAP-01`, `IND-01`, `PRJ-01`, `§01`), no "annotation" tags on media. |
| Accent style | Emphasis inside headings = same font/weight, color `#7C8B9A` (steel) on light, `#FFB81C` on dark. |
| Hero | Full-screen gears video (Pexels 10040029) with white bold copy on top + **scroll-expand** (rounded frame → full-bleed). |
| CTA | "Book a free consultation" (Cal.com) is primary everywhere; "Request a Quote" secondary. |
| Quote form | Single **creatable combobox** for service (pick one or type a custom service). |
| Navbar / Footer | White "taped" cards (yellow zig-zag tape on top corners, hidden < 768px). |
| Responsive | Container-query driven: 1280 / 1024 / 900 / 640 breakpoints (§3.6). |
| CMS | Sanity for **all** content (pages, services, industries, projects, settings). |
| Contact | WhatsApp click-to-chat + phone + email + Cal.com. |

---

## 2. Libraries

Install the **latest stable** of each at kickoff and commit the lockfile (versions get pinned by `pnpm-lock.yaml`, not by this doc). Minimums are listed where an API we rely on needs them.

### 2.1 Core
| Package | Purpose | Notes |
|---|---|---|
| `next` (App Router, ≥15) | Framework | RSC by default, `"use client"` only on interactive leaves. |
| `react`, `react-dom` (19) | UI | |
| `typescript` (strict) | Types | `strict: true`, `noUncheckedIndexedAccess: true`. |
| `tailwindcss` (v4) + `@tailwindcss/postcss` | Styling | Tokens via `@theme` in `globals.css`. Container queries are built in (`@container`, `@md:` etc.). |
| `shadcn` CLI | UI primitives | Button, Input, Textarea, Label, Checkbox, Select, Popover, Command, Dialog, Sheet, Sonner. |
| `clsx` + `tailwind-merge` | `cn()` helper | `src/lib/utils.ts` |
| `class-variance-authority` | Variants for Button/Card | |
| `lucide-react` | Icons | Stroke icons only; match 2px stroke used in the canvas. |
| `geist` (or `next/font/google` Geist) | Fonts | Weights 400/500/600/700/800. |

### 2.2 Motion & 3D
| Package | Purpose | Notes |
|---|---|---|
| `gsap` + `@gsap/react` | Scroll timelines, ScrollTrigger, SplitText | All GSAP plugins are free now; register once in `src/lib/gsap.ts`. Use `useGSAP()` for cleanup. |
| `lenis` | Smooth scroll | Drive ScrollTrigger from Lenis' RAF (`lenis.on('scroll', ScrollTrigger.update)`). Disabled for reduced motion. |
| `motion` (Framer Motion) | Small UI motion | Navbar menu, combobox popover, cards hover, form states. Use `motion/react`. |
| `three` + `@react-three/fiber` + `@react-three/drei` | 3D gear train in Process | Lazy-loaded with `next/dynamic({ ssr: false })`. |
| `@react-three/postprocessing` (optional) | Subtle bloom on yellow gear | Only if perf budget allows (§9). |

### 2.3 CMS & data
| Package | Purpose |
|---|---|
| `sanity`, `next-sanity`, `@sanity/image-url`, `@sanity/vision` | Studio at `/studio`, GROQ queries, image URLs |
| `@portabletext/react` | Rich text (About, service pages) |

### 2.4 Forms, booking, email, anti-spam
| Package | Purpose |
|---|---|
| `react-hook-form` + `@hookform/resolvers` + `zod` | Quote form state + validation (shared schema client/server) |
| `cmdk` (via shadcn Command) | Creatable service combobox |
| `@calcom/embed-react` | "Book a free consultation" modal (namespace `consultation`) |
| `resend` + `@react-email/components` | Quote email to the client inbox + auto-reply |
| `@marsidev/react-turnstile` | Cloudflare Turnstile on the quote form |
| `react-dropzone` | Attachments (photos / drawings / PDF) |

### 2.5 Quality
| Package | Purpose |
|---|---|
| `eslint` + `eslint-config-next`, `prettier` + `prettier-plugin-tailwindcss` | Lint/format |
| `vitest` + `@testing-library/react` | Unit tests (schema, utils, combobox) |
| `@playwright/test` + `@axe-core/playwright` | E2E + a11y checks on 390/768/1280/1440 |
| `@vercel/analytics`, `@vercel/speed-insights` | RUM |

---

## 3. Design tokens

### 3.1 Color
```css
@theme {
  --color-navy-950: #071627;   /* deepest overlays, footer CTA text on yellow */
  --color-navy-900: #0B2239;   /* primary ink + dark blocks */
  --color-navy-800: #13304F;
  --color-navy-700: #23415F;   /* borders on navy */
  --color-steel-500: #7C8B9A;  /* heading accent words on light */
  --color-steel-400: #9AA8B5;
  --color-steel-300: #C9D3DC;
  --color-steel-200: #D5DDE4;  /* card borders */
  --color-steel-100: #E2E8ED;
  --color-steel-50:  #F1F4F7;  /* input/tile fills */
  --color-page:      #EEF2F5;  /* page background + 32px grid */
  --color-ink-muted: #3B4A58;  /* body copy */
  --color-ink-soft:  #4A5A6A;
  --color-yellow-500:#FFB81C;  /* Safety Yellow: primary CTA, accents */
  --color-yellow-700:#8A5A00;  /* yellow text on light (passes AA) */
  --color-blue-50:   #E2EEFB;  /* "Free consultation" pill */
  --color-blue-200:  #B9D3F0;
  --color-blue-800:  #0E4A86;
  --color-cream:     #F0E7CD;  /* Safety panel */
  --color-danger:    #B4232A;  /* required asterisks, errors */
}
```

### 3.2 Type scale (Geist)
| Token | Desktop | Tablet (≤1024) | Mobile (≤640) | Weight / tracking |
|---|---|---|---|---|
| Hero H1 | `clamp(56px, 7.6vw, 112px)` / 0.92 | inherits clamp | 44px / 0.95 | 800 / -0.055em |
| Section H2 | `clamp(40px, 5vw, 72px)` / 0.98 | 48px | 36px / 1.02 | 600 / -0.05em |
| Card H3 | 22–28px | 22–28px | 21px | 600 / -0.03em |
| Body L | 18–19px / 1.6 | 18px | 15px | 400–500 |
| Body | 15–16px / 1.6 | 15px | 15px | 400 |
| Eyebrow / meta | 12–13px, UPPERCASE | same | same | 700 / 0.08em |

### 3.3 Radius · spacing · elevation
- Radius: pills `999px`, buttons 999px, cards `24px`, large panels `28–32px`, inputs/tiles `16px`, image insets `16–18px`.
- Section rhythm: `padding-top: 104px` desktop, `64px` mobile. Container `max-width: 1240px`, gutter `16px`.
- Card border `1px solid steel-200`; elevated (taped cards) `0 24px 50px -30px rgb(11 34 57 / .35)`.

### 3.4 Buttons
| Variant | Style |
|---|---|
| `primary` | yellow-500 bg, navy-950 text, 600–700, h 52–56 |
| `secondary` | white bg, navy text, 1px steel-300 border |
| `dark` | navy-900 bg, white text, yellow arrow |
| `ghost-on-dark` | white 8% bg, 1.5px white/70 border, white text (hero) |
| `pill-info` | blue-50 bg, blue-800 text, blue-200 border (Free consultation in nav/footer) |
All ≥ 44px tall, visible `focus-visible` ring (2px yellow-500 + 2px offset).

### 3.5 Motion tokens
```ts
export const motion = {
  ease: { out: 'power3.out', inOut: 'power2.inOut', expo: 'expo.out', css: 'cubic-bezier(.22,1,.36,1)' },
  dur:  { xs: 0.15, sm: 0.3, md: 0.6, lg: 0.9, xl: 1.2 },
  stagger: { tight: 0.04, base: 0.08, loose: 0.12 },
  distance: { sm: 16, md: 32, lg: 64 },
};
```

### 3.6 Breakpoints (container queries)
The page root is `@container/page`. Rules key off **content width**, not the window, so embeds and previews behave identically.
| Name | Max width | What changes |
|---|---|---|
| `lg` | 1280 | Navbar phone number hidden, nav gaps tighter |
| `md` | 1024 | Bento → 2 cols (service cards span 6), safety image centred max 460px, footer 3 cols, H2 48px, marquee 64px |
| `nav` | 900 | Nav links + pills hidden → hamburger (Sheet) |
| `sm` | 640 | Single column, section padding 64, H1 44 / H2 36, marquee 44px, form tiles stacked, footer 2 cols, tape hidden, nav = logo + menu only |

---

## 4. Assets

Download from the canvas asset store into `public/media/` (or upload to Sanity and reference from documents).

| File | Canvas asset | Used in |
|---|---|---|
| `hero-gears.mp4` (1920×1080, 8.7s, muted, faststart) | `/_blob/ad9b83778cc26d91b1ea885e1c2c968d` | Hero background video |
| `hero-gears-poster.jpg` | `/_blob/03029483c2b0d59f7054415ec9912fab` | Hero poster / LCP image |
| `conveyor-system.jpg` (999×750) | `/_blob/1e8930bbb797eaa717a148b3ea236f07` | Services · Installation; About |
| `motor-rotor-flange.jpg` (605×520) | `/_blob/850af7dd962a87706721e4d417fbd461` | Services · Alignment; Quote panel |
| `machine-shaft.jpg` (1128×750) | `/_blob/c0ff9e19b175968cb85f09c1f6660f0e` | Services · Maintenance |
| `grinder-sparks.jpg` (477×570) | `/_blob/a7d5937603c159c84daf3f0c3cd547d3` | Services · Welding; Safety |
| `disassembled-engine.jpg` (1000×750) | `/_blob/26c399b118709257100d291aaa31ac62` | Services · Rebuilds; Recent work PRJ-03 |
| `motor-rotor.jpg` (1125×750) | `/_blob/6040a9b95f18694951d8707707a45b55` | Recent work · Pressure vessel |

**Video pipeline:** encode `hero-gears-1080.mp4` (H.264, CRF 26, no audio), `hero-gears-720.mp4` for ≤768px, and a WebM/AV1 variant; `<video muted playsInline autoPlay loop preload="metadata" poster=…>` with `<source media>` per size. Pause when off-screen (IntersectionObserver) and on `prefers-reduced-motion`.

**Images:** always render at native aspect ratio (the client asked that images are never cropped): pass `width`/`height` from Sanity metadata and use `object-fit: cover` only inside a box with the same aspect ratio.

---

## 5. File structure (agreed)

```
ontario-millwright/
├─ src/
│  ├─ app/
│  │  ├─ (site)/
│  │  │  ├─ layout.tsx               # Navbar, Footer, Lenis provider, Cal.com provider
│  │  │  ├─ page.tsx                 # Home (sections composed from Sanity "homePage")
│  │  │  ├─ services/
│  │  │  │  ├─ page.tsx              # Services hub
│  │  │  │  └─ [slug]/page.tsx       # Service detail
│  │  │  ├─ industries/page.tsx
│  │  │  ├─ projects/[slug]/page.tsx
│  │  │  ├─ about/page.tsx
│  │  │  ├─ contact/page.tsx         # Quote form full page
│  │  │  └─ legal/[slug]/page.tsx    # privacy, accessibility
│  │  ├─ studio/[[...tool]]/page.tsx # Embedded Sanity Studio
│  │  ├─ api/
│  │  │  ├─ revalidate/route.ts      # Sanity webhook → revalidateTag
│  │  │  └─ draft-mode/{enable,disable}/route.ts
│  │  ├─ actions/quote.ts            # "use server" — validate, Turnstile verify, Resend
│  │  ├─ sitemap.ts · robots.ts · opengraph-image.tsx
│  │  ├─ globals.css                 # @theme tokens, base, container queries
│  │  └─ layout.tsx                  # <html>, fonts, metadata, analytics
│  ├─ components/
│  │  ├─ ui/                         # shadcn primitives (button, input, command, sheet…)
│  │  │  ├─ footer-taped-design.tsx  # adapted from the 21st.dev component (our tokens)
│  │  │  └─ tape.tsx                 # yellow zig-zag tape SVG
│  │  ├─ layout/
│  │  │  ├─ navbar.tsx · mobile-menu.tsx · footer.tsx
│  │  ├─ sections/
│  │  │  ├─ hero-video.tsx           # full-screen video + scroll-expand
│  │  │  ├─ velocity-marquee.tsx
│  │  │  ├─ services-grid.tsx · service-card.tsx · service-help-card.tsx
│  │  │  ├─ industries.tsx           # navy block + cursor grid
│  │  │  ├─ process.tsx              # steps + tracing beam + 3D slot
│  │  │  ├─ recent-work.tsx · project-card.tsx
│  │  │  ├─ safety.tsx · about.tsx
│  │  │  └─ quote/
│  │  │     ├─ quote-section.tsx · quote-form.tsx
│  │  │     ├─ service-combobox.tsx  # creatable combobox
│  │  │     └─ consult-card.tsx
│  │  ├─ motion/
│  │  │  ├─ scroll-expand.tsx        # generic clip-path expander
│  │  │  ├─ scroll-reveal.tsx        # word-by-word reveal
│  │  │  ├─ cursor-grid.tsx          # canvas grid that lights up under the cursor
│  │  │  ├─ tracing-beam.tsx
│  │  │  ├─ spotlight-card.tsx
│  │  │  ├─ count-up.tsx
│  │  │  └─ mini-gears.tsx           # CSS-animated 3-gear train (SVG)
│  │  ├─ three/
│  │  │  ├─ gear-train-canvas.tsx    # dynamic(ssr:false)
│  │  │  ├─ gear.tsx                 # involute gear mesh (ExtrudeGeometry)
│  │  │  └─ use-scroll-direction.ts
│  │  └─ providers/
│  │     ├─ lenis-provider.tsx · cal-provider.tsx
│  ├─ lib/
│  │  ├─ gsap.ts                     # registerPlugin(ScrollTrigger, SplitText) once
│  │  ├─ gears.ts                    # involute gear math (shared by SVG + 3D)
│  │  ├─ motion-tokens.ts · utils.ts · env.ts (zod-validated env)
│  │  └─ schemas/quote.ts            # zod schema shared by form + server action
│  ├─ sanity/
│  │  ├─ env.ts · client.ts · image.ts · live.ts
│  │  ├─ queries.ts                  # GROQ, typed with sanity typegen
│  │  └─ schemaTypes/
│  │     ├─ documents/ siteSettings.ts · homePage.ts · service.ts · industry.ts · project.ts · page.ts
│  │     └─ objects/ seo.ts · cta.ts · scopeItem.ts · stat.ts
│  ├─ emails/ quote-request.tsx · quote-autoreply.tsx
│  └─ types/
├─ public/media/                     # video + posters
├─ tests/ e2e/ · unit/
├─ sanity.config.ts · sanity.cli.ts · components.json · next.config.ts
└─ .env.example
```

**Server vs client:** sections are Server Components that fetch from Sanity and pass plain props to small `"use client"` motion leaves (`components/motion/*`, `three/*`, the form, the navbar menu).

---

## 6. Sanity content model

| Document | Key fields |
|---|---|
| `siteSettings` (singleton) | name, phone, email, whatsappNumber `[TBC]`, serviceArea, calLink, emergencyAvailable (bool, `[TBC]` 24/7?), social, defaultSeo |
| `homePage` (singleton) | hero {headline, accentWords, subcopy, primaryCta, secondaryCta, video (file), poster (image), capabilities[4]}, marquee {rowA[], rowB[]}, section intros (services, industries, process, work, safety, about, quote), safetyChecklist[] |
| `service` | title, slug, order, image (with hotspot), summary, scope[] (strings), body (portable text), seo |
| `industry` | title, description, order |
| `project` | title, slug, category, image, summary, details[{label, value}], body, seo |
| `page` | title, slug, body, seo (legal/about/extra) |

Rules: every image keeps its original aspect ratio (store `metadata.dimensions`); copy fields have length validation matching the design (e.g. hero headline ≤ 40 chars).

---

## 7. Page layout (Home, top → bottom)

1. **Navbar** — taped white card, sticky `top:16px`. Logo · Services · Industries · Process · Work · Safety · About · [Free consultation pill] · phone · [Request a Quote]. ≤900: logo + hamburger (Sheet). ≤640: "Request a Quote" moves into the menu.
2. **Hero** — full-screen gears video, white bold H1 "Industrial, **kept running.**" (accent yellow), subcopy, CTAs (primary yellow / ghost white), 4 glass capability cards (last one yellow), pause/play button.
3. **Velocity marquee** — row A services (navy), row B industries (steel), yellow gear separators.
4. **Services** — "Millwright services" + intro; 3×2 grid: 5 service cards (full-ratio image, title, summary, scope chips, "Request this service →" + "View service") + navy help card ("Not sure which service you need?" + mini gears + consult CTA + phone).
5. **Industries** — navy rounded block with live cursor grid; 8 industry tiles.
6. **Process** — "From survey to start-up"; left: 4 steps with tracing beam; right: gear train (3D in prod).
7. **Recent work** — 3 project cards (category label, title, summary, 2 detail tiles).
8. **Safety** — cream panel "No job is worth an injury." + full-ratio photo + pre-job checklist (4 items).
9. **About** — "Millwrights by trade. Partners by practice." + quote + image + paragraph + "Work with us →".
10. **Quote** — two-column panel: form (contact group with dashed connector + icons, creatable service combobox, urgency + location tiles, details + attachments, CASL consent, submit + "Prefer to talk?") | image + consult card + email/WhatsApp chips.
11. **Footer** — taped white card: brand + emergency line, Services, Company, Get in touch; bottom bar © · Privacy · Accessibility · Back to top.

---

## 8. Animation scenarios (the important part)

Global rules:
- All scroll animations run through **GSAP ScrollTrigger + Lenis**. One `ScrollTrigger.refresh()` after fonts/images load.
- Every animation has a **reduced-motion** path (`gsap.matchMedia()` with `(prefers-reduced-motion: reduce)`): content is shown in its final state, video paused on poster, 3D renders one static frame.
- Animate only `transform`, `opacity`, `clip-path`, `filter` (blur ≤ 6px). Never animate layout properties.
- Mobile (`(hover: none)`) disables cursor-driven effects and halves distances.
- Nothing hides content from crawlers: text is in the DOM from SSR, animations start from CSS `opacity:1` and GSAP sets the "from" state on the client (`gsap.set` inside `useGSAP`), so no-JS users see everything.

### A1 · Page load (0 → 1.2s)
| Step | Target | From → To | Timing |
|---|---|---|---|
| 1 | Navbar card | y −24, opacity 0 → 0, 1 | 0.6s `power3.out`, delay 0.1 |
| 2 | Tape pieces | scale 0.6 rotate ±40° → 1, ±32° | 0.4s `back.out(2)`, stagger 0.08, after 1 |
| 3 | Hero H1 | SplitText **words**: yPercent 110, opacity 0 → 0, 1 (masked lines) | 0.9s `expo.out`, stagger 0.06 |
| 4 | "kept running." | color white → yellow-500 | 0.4s, after last word |
| 5 | Subcopy, CTAs | y 16, opacity 0 → 0, 1 | 0.6s, stagger 0.08 |
| 6 | Capability cards | y 32, opacity 0, blur 6 → 0, 1, 0 | 0.7s, stagger 0.08 |
Video starts playing as soon as `canplay` fires; poster is the LCP element (preload it).

### A2 · Hero scroll-expand (ReactBits "Scroll Expand", adapted)
- **Structure:** `<section>` 100svh tall + `pin: true` for `+=60%` of viewport, `scrub: 0.6`.
- **Start state:** media frame `clip-path: inset(16px calc((100% - min(100% - 32px, 1180px)) / 2) 0 round 28px)`, i.e. a centred rounded frame about 1180px wide (same as the canvas at progress 0). Yellow corner marks visible.
- **End state:** `clip-path: inset(0 0 0 0 round 0px)`, full-bleed edge to edge, height 100svh.
- **Mapped values** (progress 0 → 1): inset → 0; radius 28 → 0; video `scale` 1.08 → 1 (slight dolly-out); dark gradient overlay opacity 1 → 0.85; corner marks opacity 1 → 0 by p=0.4.
- **Copy:** stays readable the whole time; at p > 0.7 the capability cards rise 24px and fade to 1 (if not already visible).
- **Unpin:** after expansion, the next section (marquee) scrolls over normally.
- **Why clip-path:** avoids layout/reflow (canvas used width/height only because the static tool can't pin).
- **Mobile:** no pin; frame starts inset 12px/radius 22 and expands over the first 40% of hero height.
- **Reduced motion:** render end state (full-bleed), video paused on poster with Play button.
- **Pause button:** toggles `video.play()/pause()`, `aria-pressed`, label switches Pause/Play background video.

### A3 · Navbar on scroll
- After 80px: card shadow increases, background stays solid white, height 72 → 64 (padding), tape pieces rotate a further 4° (tiny "settle").
- Scrolling **down** fast (> 800 px/s) hides the navbar (yPercent −120); any upward scroll shows it. Never hide while the mobile menu or Cal modal is open.
- Mobile menu (Sheet from top): links stagger in y 12 → 0 (0.04s), focus trapped, `Esc` closes.

### A4 · Velocity marquee (ReactBits "Scroll Velocity")
- Two rows, each content duplicated once; base loop `xPercent` 0 → −50 (row A left, row B right), 40s per loop at rest.
- `ScrollTrigger.onUpdate`: `boost = clamp(-6, 6, velocity / 300)`; `timeScale = direction × (1 + |boost|)`, eases back to `direction × 1` over 0.8s.
- Scrolling **up reverses** both rows (same metaphor as the gears).
- Hover (desktop): row slows to 0.3× over 0.4s.
- Reduced motion: static rows, no loop. Row B is `aria-hidden`.

### A5 · Services
- Heading: masked line reveal (same as A1-3, 0.7s) at `top 80%`.
- Cards: batch reveal (`ScrollTrigger.batch`) y 40, opacity 0 → 0, 1, stagger 0.08, `power3.out` 0.7s.
- Image inside card: scale 1.06 → 1 on reveal; on hover scale 1.03 (0.5s css ease) + card border turns yellow + `0 18px 40px -20px rgb(255 184 28 / .6)` glow (this is the state drawn on the Installation card).
- Scope chips: stagger in (0.03s) 120ms after the card.
- **Help card mini gears:** pure CSS/SVG (no JS): big yellow gear 14s/rev; each gear's duration ∝ its tooth count, direction alternates, so teeth stay meshed. On card hover the train speeds up ×2 (CSS var `--speed`). Paused offscreen (`animation-play-state` via IntersectionObserver class).

### A6 · Industries (navy block)
- Block reveal: `clip-path: inset(10% 10% 10% 10% round 28px)` → `inset(0 round 28px)` scrubbed over its first 40% in view.
- **Cursor grid (ReactBits "Cursor Grid", dark variant):** one `<canvas>` behind content; 32px cells, 1px lines at white/7%. Each cell stores `lastHit`; cells under the pointer light up yellow at 55% and fade over ~600ms (trail). A soft radial yellow glow (16%) follows the pointer. Click spawns a square pulse ring that expands 1 cell → 3 cells and fades (400ms).
- Renders via rAF only while the block is intersecting; `devicePixelRatio` capped at 2.
- Touch / reduced motion: static grid + static glow, no trail.
- Tiles: stagger in y 24 (0.05s). Hover: border yellow, title shifts x 4px.

### A7 · Process + 3D gear train (signature moment)
- Section **pinned** for ~3 viewports (`end: "+=300%"`), `scrub: 1`.
- **Left:** 4 step cards. A **tracing beam** (2px line, yellow fill + glow) grows from 0 → 100% across the pin. Each step activates at 0/25/50/75%: card gets navy border + white bg, its diamond fills yellow, the previous ones stay "done" (yellow diamond, muted card).
- **Right (R3F canvas, lazy):** 5–7 involute gears (module 6, same tooth counts as the canvas: 40/18/30/14/36 + extras), MeshStandardMaterial: navy/steel metal (metalness 0.8, roughness 0.35), last gear yellow; studio environment (drei `<Environment preset="warehouse">` or a baked PMREM), ACES tone mapping, soft contact shadows.
  - **Rotation is driven by scroll velocity and direction:** `ω_driver = base(0.2 rad/s) + k × scrollVelocity`; scrolling **down turns the train forward, scrolling up reverses it**; inertia decays with `damp(ω, 0, 4, dt)` when scrolling stops. Every other gear: `ω_i = −ω_{i−1} × z_{i−1} / z_i` (exact meshing).
  - **Camera story per step:** Survey (camera wide, slow orbit) → Move & Position (shaft slides in on z) → Set & Align (dashed yellow laser line draws from the left to the coupling, gear train snaps 2° to "aligned") → Commission (train runs up to speed ×3, then eases to idle).
- **Mobile:** no pin; the 3D canvas is replaced by the 2D SVG gear train (same math from `lib/gears.ts`) rotating via CSS at a speed set by scroll direction; steps reveal one by one.
- **Reduced motion / low-power (`navigator.hardwareConcurrency < 4` or `saveData`):** static SVG, no WebGL.
- Background behind the gears: light cursor grid (A6 light variant) masked with a radial fade.

### A8 · Recent work
- Cards: batch reveal y 40 → 0, stagger 0.1.
- **Spotlight hover (Aceternity-style):** radial yellow gradient (260px) follows the pointer inside the card (`--x/--y` CSS vars, no re-render) + border yellow (state drawn on the Conveyors card).
- Image parallax: yPercent −6 → 6 scrubbed while the card crosses the viewport.

### A9 · Safety
- Cream panel slides up 48px + fades; heading masked reveal.
- Body sentence uses **Scroll Reveal** (ReactBits): words from opacity 0.1 + blur 4px → 1 + 0, container rotate 3° → 0, scrubbed `top bottom-=20%` → `bottom center`.
- Checklist: each check box draws (SVG stroke-dashoffset) then its row fades in, stagger 0.12.
- Photo: plain reveal (scale 1.04 → 1); no overlays on the image (client wants it shown in full).

### A10 · About
- Heading: two-tone reveal; "Partners by practice." fades from steel to steel (no colour animation), words stagger.
- Quote: **Scroll Reveal** word by word (same settings as A9) with the yellow left rule growing scaleY 0 → 1.
- Image: clip-path reveal from bottom (`inset(100% 0 0 0)` → `inset(0)`), 0.9s.

### A11 · Quote section
- Panel reveal y 40 → 0.
- Contact group: the dashed connector line draws top → bottom (stroke-dashoffset), icons pop in (scale 0.6 → 1, stagger 0.06).
- **Service combobox:** Popover opens with opacity/scale 0.98 → 1 (0.15s); matched text highlighted in yellow-tint; the "+ Add "…" as a custom service" row is always last; selecting a custom value shows the yellow "Custom service" tag (spring in).
- Field focus: border navy 2px + subtle lift; errors shake x ±4px (3 cycles, 0.3s) + red helper text (role="alert").
- Submit: button → loading spinner → success state morph (width animates to a pill "Request sent ✓"), toast via Sonner; form resets after 4s.
- Consult card: hover lifts 4px; "Book a time" opens Cal.com modal (scale 0.98 → 1 backdrop fade).

### A12 · Footer
- Taped card rises y 40 → 0 when 20% in view; tapes "stick" (scale 1.2 → 1, rotation overshoot then settle, 0.5s `back.out`).
- Columns stagger (0.06s). "Back to top" uses `lenis.scrollTo(0, { duration: 1.4 })`.

### Motion QA checklist
- [ ] 60fps on a mid-range Android (Moto G Power class) for A2, A4, A7 (Chrome Performance panel, no long tasks > 50ms during scroll).
- [ ] `prefers-reduced-motion` path verified for every scenario.
- [ ] No CLS from animations (all "from" states set before first paint on the client, SSR shows final state).
- [ ] Pins refresh correctly after the hero video and fonts load, and on orientation change.

---

## 9. Performance, accessibility, SEO budgets

| Metric | Target |
|---|---|
| Lighthouse (mobile) | Performance ≥ 90, Accessibility 100, Best Practices 100, SEO 100 |
| LCP | < 2.5s on 4G (hero poster preloaded, video lazy-starts) |
| CLS | < 0.05 |
| INP | < 200ms |
| JS on Home (gz) | ≤ 180KB initial; three.js chunk loaded only when Process is near (rootMargin 600px) |
| Video | ≤ 4MB 1080p, ≤ 2MB 720p |

Accessibility: WCAG 2.2 AA; contrast pairs already checked in the canvas (yellow text only as `#8A5A00` on light); 44px targets; real `<button>`/`<a>`/`<label>`; combobox follows WAI-ARIA combobox pattern; video has pause control; skip-link; focus visible; motion respects user setting.

SEO: per-page metadata from Sanity, `LocalBusiness` + `Service` JSON-LD, `sitemap.ts`, OG image, canonical URLs, service pages for each service (long-tail "millwright services Ontario").

---

## 10. Integrations

- **Cal.com:** `@calcom/embed-react` modal, namespace `consultation`, event "Free 30-minute consultation", timezone America/Toronto. Listen to `bookingSuccessfulV2` → toast + analytics event. Every "Book a free consultation" / "Book a time" / "Free consultation" CTA opens it.
- **Quote form → Server Action:** zod validate → Turnstile verify → upload attachments (Vercel Blob or Sanity assets, ≤5 × 10MB, PDF/JPG/PNG) → Resend email to client inbox + auto-reply to the requester → store a `quoteRequest` document in Sanity (optional, for history). Rate limit by IP.
- **Schema (shared):** name*, company, email*, phone, service* `{ serviceId?: string; customService?: string }` (exactly one), urgency* `emergency | planned | flexible`, location, details* (≥ 20 chars), attachments[], consent* (CASL).
- **WhatsApp:** `https://wa.me/<number>?text=<prefilled>`; number from `siteSettings` (`[TBC]`).

---

## 11. Open items (confirm with the client)

- [ ] Final logo + exact brand hex values
- [ ] WhatsApp number
- [ ] Domain + domain email (currently `ontariomillwright@gmail.com`)
- [ ] Is emergency service 24/7? (affects hero card + footer copy)
- [ ] Cal.com account/event link
- [ ] Certifications / insurance / safety stats for the Safety section (no invented numbers)
- [ ] Real project photos to replace stock images in Recent work
- [ ] A Pulp & Paper image

---

## 12. Day-1 acceptance criteria

- [ ] Home renders all 11 sections from Sanity data at 390 / 768 / 1280 / 1440 with no horizontal scroll.
- [ ] Hero video plays muted inline on iOS/Android, pause button works, scroll-expand matches A2.
- [ ] Navbar + footer match the taped design; mobile menu works with keyboard.
- [ ] Quote form validates client + server, combobox accepts custom services, email arrives via Resend (test inbox).
- [ ] Cal.com modal opens from every consultation CTA.
- [ ] Reduced-motion path verified; Lighthouse mobile ≥ 90 on the Vercel preview.
