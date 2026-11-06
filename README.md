# Prana Risk — Homepage

A single-page homepage for Prana Risk, an independent insurance broker on Wall Street. It is a static site, built with Vite and deployed to Vercel.

**Status:** production-ready demo. The quote form is visual only (see "Before going live").

## Stack

- Vite 5 + TypeScript (no framework), static output in `dist/`
- Lenis for smooth wheel scrolling on desktop (touch keeps native scrolling)
- Self-hosted fonts (Jost, Inter) and AVIF/WebP photos; no third-party requests at all

## Run it on your laptop (Windows)

1. Install Node.js LTS from https://nodejs.org (one time).
2. Double-click `start-site.bat`. The first run installs packages (about a minute), then the browser opens at http://localhost:5173.
   - Or in a terminal inside this folder: `npm install`, then `npm run dev`.
3. Stop it with Ctrl+C in the window.

Opening `index.html` directly (file://) will not work: the site needs a local server.

To test the production build: `npm run build`, then `npm run preview` (http://localhost:4173).

## Deploy to Vercel

1. Push this folder to a GitHub repository (or use `npx vercel` from this folder).
2. In Vercel, "Add New Project" → import the repository. Vercel reads `vercel.json`: framework Vite, build `npm run build`, output `dist`.
3. Deploy. No environment variables are needed.

`vercel.json` also sets security headers (CSP, HSTS, nosniff, frame protection, referrer and permissions policies) and long-term caching for the hashed `/assets/` files and fonts.

## Before going live

- **Quote form:** it validates and shows a demo message, but sends nothing. Connect it to a backend (for example a Vercel function, Formspree or a CRM) and replace the demo message in `src/ui/contact.ts`. Without JavaScript, it posts to the page itself, so there is no form data in the URL.
- **Domain:** once the domain is known, make `og:image` an absolute URL (`https://<domain>/images/photos/hero-wide-1600.webp`), add `<link rel="canonical" href="https://<domain>/">`, and add a `Sitemap:` line to `public/robots.txt`.
- **Reviews:** the review cards show the opening lines of the Google reviews. Replace them with the full texts if wanted.

## Structure

```
index.html              all markup (logo and US map SVGs are inlined at build time)
src/main.ts             boot: preloader, smooth scroll, header, section modules
src/ui/preloader.ts     loading screen (waits for fonts + hero photo, 1.2 s minimum, 7 s cap)
src/ui/header.ts        header states, mobile menu (focus trap, Esc to close)
src/ui/hero.ts          hero photo switcher (circle reveal, 2 s hold, pause on hover / off screen)
src/ui/scroll-fx.ts     scroll effects: photo wipes, coverage stacking, product gallery, map routes, card tilt
src/ui/reveal.ts        fade + slide reveals, headings rising word by word
src/ui/proof.ts         reviews coverflow (arrows, swipe, keyboard, autoplay)
src/ui/extras.ts        split-flap stats
src/ui/contact.ts       demo quote form (validation, file names, demo message)
src/styles/base.css     tokens, reset, buttons
src/styles/site.css     section layouts and motion
src/styles/fixes.css    founder / reviews / contact / footer overrides
public/                 fonts, photos, favicon, robots.txt (copied as-is)
raw/                    original photos (not deployed)
scripts/                one-off maintenance scripts
```

## Quality checks (last run: see STATUS.md)

- TypeScript strict, HTML validation (html-validate, recommended rules): no errors
- Lighthouse: mobile and desktop 97–98 performance, 100 accessibility, 100 best practices, 100 SEO
- axe-core (WCAG 2.2 AA + best practices): 0 violations
- Functional suite: 36/36 (hero switcher, autoplay and pause, navigation offsets, reviews, form, back to top, pinned effects, resize)
- No horizontal scroll at 320–2560 px; reduced-motion and no-JavaScript versions show all content

## Credits

- US map: US Census Bureau state boundaries (public domain), via PublicaMundi.
- Photos: generated with Higgsfield (GPT Image 2.6) for Prana Risk; originals in `raw/` (not deployed), optimized AVIF/WebP in `public/images/photos/`.
