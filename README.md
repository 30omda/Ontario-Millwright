# Ontario Millwright: website

Production build of the approved **Direction B · Blueprint** design.
Spec: `docs/build-spec.md` (same as the project doc *05-build-spec*).

## Stack
Next.js 16 (App Router, Cache Components, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
Radix + cmdk (shadcn-style primitives) · GSAP 3 (ScrollTrigger, SplitText) + Lenis · Motion · React Three Fiber/drei ·
Sanity (embedded Studio at `/studio`) · React Hook Form + Zod · Server Actions + Resend · Cal.com embed · Cloudflare Turnstile.

## Getting started
```bash
pnpm install
cp .env.example .env.local   # every variable is optional for local dev
pnpm dev                     # http://localhost:3000
```
Without Sanity env vars the site renders the approved canvas copy from `src/content/seed.ts`.
Without `RESEND_API_KEY` quote requests are validated and logged on the server instead of emailed.

## Connect the client's services
| Service | What to do |
|---|---|
| Sanity | `pnpm dlx sanity@latest init --env` (or create a project at sanity.io/manage), set `NEXT_PUBLIC_SANITY_PROJECT_ID`, add `http://localhost:3000` + the prod URL as CORS origins, open `/studio`, fill *Site settings*, *Home page*, services, industries, projects. Add a webhook → `POST /api/revalidate` with `SANITY_REVALIDATE_SECRET`. |
| Cal.com | Put the event link (e.g. `ontario-millwright/free-consultation`) in *Site settings → Cal.com link*. Every "Book a free consultation" CTA then opens the booking modal. |
| Resend | Verify the client's domain, set `RESEND_API_KEY`, `QUOTE_TO_EMAIL`, `QUOTE_FROM_EMAIL`. |
| Turnstile | Create a widget, set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`. |
| WhatsApp | *Site settings → WhatsApp number* (E.164 digits). Until then the UI shows a placeholder. |

## Structure
```
src/app/(site)/          layout (Navbar, Footer, Lenis, Cal) + home page
src/app/studio/          embedded Sanity Studio
src/app/actions/quote.ts quote Server Action (zod → Turnstile → Resend)
src/components/sections  hero-video, services, industries, process, recent-work, safety, about, quote/*
src/components/motion    reveal, scroll-reveal-text, velocity-marquee, cursor-grid, spotlight-card, mini-gears, footer-reveal
src/components/three     gear-train-canvas (WebGL, lazy) + gear-train-svg (fallback)
src/lib                  gears (involute math), gsap, scroll-motion store, schemas, env
src/sanity               client, queries, schemaTypes
src/content              types, seed (canvas copy), get-content ("use cache" + fallback)
```

## Motion map (spec §8)
A1 hero intro · A2 hero scroll-expand (clip-path, pinned 60%) · A3 navbar hide/compact · A4 velocity marquee ·
A5 services reveal + mini gears · A6 cursor grid · A7 pinned process + 3D gear train (scroll direction drives rotation) ·
A8 spotlight cards · A9/A10 scroll-reveal text · A11 creatable combobox + form states · A12 footer tape reveal.
Every animation has a `prefers-reduced-motion` path; WebGL only runs on desktops with ≥4 cores and no Save-Data.

## Scripts
`pnpm dev` · `pnpm build` · `pnpm start` · `pnpm lint`
