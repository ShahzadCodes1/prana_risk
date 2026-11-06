# Prana Risk homepage: build status

## Decisions (approved by Shahzad)

- **Direction:** "From fog to clarity". A light theme with a Wall Street skyline above the clouds. The approved palette only; no dark theme.
- **Logo:** keep the original charcoal #2A2A2A. Navy is for typography and UI only.
- **Hero copy:** keeps the first sentence of the original paragraph. The second sentence ("As an independent insurance broker, we help you evaluate the right protection for your assets with clarity and expertise.") moves into the next section.
- **Removed:** the FAQ section, for now. Also "Why Choose Prana Risk" and "Learn More About Insurance" (Shahzad: skip both).
- **Quote form:** visually functional, with no backend and no real submission.
- **Links:** nothing links to the live prana-risk.com. All navigation uses homepage anchors. Features that aren't implemented get no links.
- **Content:** fix obvious spelling and grammar while preserving meaning.
- **Seth's portrait:** reserved for the "Meet Seth Patel" section.
- **Location:** final files go into the folder Shahzad attaches later. Don't touch local folders before then.

## Section progress

| # | Section | Status |
|---|---|---|
| 1 | Navigation + hero | Approved |
| 2 | Carrier partners (fog corridor) + moved sentence | Approved (carrier list confirmed) |
| 3 | The Insurance Problem / mission | Approved |
| 4 | Coverage (4 pillars) | Approved |
| 5 | Featured Products | Approved |
| 6 | Meet Seth Patel | Approved |
| 7 | Wall Street → across the USA | Approved |
| 8 | Proof: stats + Google reviews + CTA band | Approved |
| 9 | Why Choose Prana Risk | Removed at Shahzad's request (built, then reverted) |
| 10 | Learn More About Insurance (articles) | Skipped at Shahzad's request; "Insights" removed from both menus |
| 11 | Contact for a Quote (demo form) | Approved |
| 13 | Footer | Built, awaiting review |
| — | Final integration: Vercel deploy + copy into Shahzad's folder | Next (after approval) |
| 9 | Why Choose Prana Risk | Next |
| 3–13 | See `homepage-direction.md` (minus FAQ) | Pending |

## Hero implementation notes

- **Skyline:** real Lower Manhattan footprints and heights (795 buildings, deck.gl-data, derived from NYC open data).
  - One WTC is built as its real chamfered form with a spire.
  - Procedural glass and stone facades with floor/mullion detail, PBR reflections of the sky environment, sun shadows, and bases dissolving into mist.
- **Camera rigs:** landscape (skyline right of the copy, with a view offset) and portrait (skyline on top). The hotspot sits on the tower nearest 75 Wall St.
- **Performance:**
  - Initial JS 6.5 KB gzipped, CSS 3.4 KB, fonts 75 KB, poster 14 KB.
  - Three.js (120 KB) + scene (6 KB) + data (42 KB) load lazily after first paint.
  - Rendering pauses when off-screen or when the tab is hidden.
  - Low-power mode on touch and small devices: DPR 1.5, smaller shadow map, fewer clouds.
- **Fallbacks:** without WebGL, the poster stays visible. With reduced motion, a static frame with no intro or camera move.
- **Verified:**
  - No horizontal overflow and no console errors at 1920, 1440, 1280, 1024, 768, 430, 390, 375 and 320px, plus 844×390 landscape.

## Section 2 implementation notes

- **Shared world:** one WebGL world serves the whole journey. `src/scene/world.ts` holds the chapters, and `src/ui/stage.ts` runs boot, the render loop and the veil.
- **Carrier names:** 25 names come from the original site's partner logos, using the alt text plus the names visible in the logos. They're drawn into a single canvas atlas in Jost Light with wide tracking.
  - The camera flies down a corridor inside the cloud layer while the names fade in from the fog, drift, and dissolve before the lens.
  - Names are laid out in lanes above, below and beside the statement, and are masked out of the statement's rectangle.
- **Statement:** the second sentence moved from the hero, revealed word by word and scrubbed to scroll.
- **Accessibility:** a semantic `<ul>` of names serves screen readers and SEO. Without WebGL it becomes a visible drifting marquee over a white mist.
- **Pending confirmation:** the carrier list. The alt text on the old site was unreliable, so these names need confirming: MedPro Group and The Hanover (seen in the logos), and "Insurance Group" (left out as unclear).

## Skyline realism (approved and applied)

- **Natural materials:** limestone, buff and red-brown brick, granite and precast concrete.
- **Glass:** coated bronze, blue-green, silver or smoked glass, with aluminium or black-steel mullions.
- **Windows:** each pane varies (dark interiors, blinds, a few warm-lit rooms) and sits in a recess.
- **Massing:** setback tiers on stone towers, parapets, and tar/gravel roofs.
- **Lighting:** warm late-afternoon sun, AgX tone mapping, natural aerial haze, and a telephoto lens with the same framing.
- **Palette rule:** the brand palette applies to the UI only. The buildings use natural architectural colours.
- **Posters:** regenerated (wide 21 KB, tall 18 KB). The world chunk is 8.8 KB gzipped.
- **Next:** section 3, The Insurance Problem.

## Section 3 implementation notes

- **Concept:** the original Venn diagram (Lack of Awareness × Importance of Asset → The Insurance Problem) rebuilt as two frosted-glass discs floating above the cloud sea.
  - Each disc is an analytic shader quad with a rim, frosted body, light sweep and grain. The overlap lens is computed from both disc centres and condenses into a navy-tinted core.
  - Labels are DOM elements projected from 3D anchors. On phones they sit diagonally so they never collide.
- **Three steps of clarity**, scrubbed to scroll, using the original FAQ's unknown-unknown → known-unknown → known-known wording:
  - **Mission:** dense fog, discs apart.
  - **Problem named:** discs overlap and the fog thins.
  - **"We Solve":** the fog clears and the CTA goes to #contact.
- **Copy:** original. "kick the tyres" is now "kick the tires", and "goods & services" is now "goods and services".
- **Fallbacks:** without WebGL, an SVG Venn with the same labels. With reduced motion, panels cross-fade with no movement.
- **Verified:** the solve panel never overlaps the header or the step indicator at any tested width, including the compact-landscape layout added for 1024×768.

## Section 4 implementation notes

- **Scene:** below the cloud ceiling, a seamless white studio floor holds four frosted-glass monoliths. Each holds a porcelain sculpture of what it protects: a townhouse (Personal), a setback tower (Business), a sphere held in a ring (Life & Disability) and a cross on a plinth (Health). Under each sits a soft contact shadow.
- **Camera:** opens on a wide establishing shot of all four with the section title, then tracks pillar by pillar. A dwell curve holds each pillar in focus, and the cards follow the same curve.
- **Content:** the original titles, coverage tags, paragraphs and CTAs.
  - Corrections: "client-centred insurance broker NYC" is now "client-centered insurance broker in NYC", "customisation" is now "customization", "Collectables" is now "Collectibles", and "Mass Mutual" is now "MassMutual".
  - The original Business CTA was "Learn More", which linked to the external business page. It's now "Contact Us" (#contact), since the demo is self-contained.
- **Tab index** (01–04) jumps to each coverage line. On phones, the tags become a single swipeable row.
- **Section 3 ending:** now fades to white over its last 10% so section 4 can take over.
- **Verified:** coverage cards never overlap the header or tab index at any tested width.

## Section 5 implementation notes

- **Scene:** a porcelain miniature of an NYC block on a round plinth.
  - The four lots are a condo tower with balcony plates, a pre-war co-op with setback penthouse and rooftop water tank, a brownstone row with stoops, and a gabled single-family home. Windows are drawn in the shader as soft-blue recesses.
  - The camera orbits so the property in focus faces it, and a glass "protection" shell grows over that lot.
  - A frontal fill light is active only in this chapter.
- **Cards:** the four NYC property cards (original copy), then Cyber, E&O and Life & Disability as glass cards with a 3D tilt on hover (a swipe carousel on phones), then the original CTA band copy with a Contact Us button.
- **Links:** all CTAs are "Get a Quote" or "Contact Us" → #contact. The original "See More" links pointed to live pages, which the self-contained demo can't use.
- **Copy fixes:**
  - "unique from the rest of the country" → "unique compared with the rest of the country"
  - "trusted insurance agent NYC" → "trusted NYC insurance agent"
  - "to ensure these valuable assets" → "to insure these valuable assets"
  - "specialised" → "specialized"
  - "life & disability can bring" → "life & disability insurance can bring"
  - Heading: "Featured Products by Your Insurance Broker in New York"
- **Tab index:** 01–05 with click-to-jump.
- **Transitions:** the coverage index now fades out with its last card, so it doesn't linger during the hand-off.
- **Verified:** cards never overlap the header or index at any tested width.

## Section 6 implementation notes

- **Layout:** a normal-flow section (not pinned) over a softened 3D backdrop. The backdrop is a frosted-glass colonnade evoking the columns along Wall Street, and the camera trucks past it with scroll.
  - The veil keeps it calm: a 0.32 floor on desktop and 0.62 on phones, where the copy runs over the columns.
- **Portrait:** Shahzad's supplied image, cropped 4:5 (1:1 on phones) and served as AVIF/WebP at 560 and 880 px (14–26 KB), lazy-loaded with explicit dimensions.
  - Glass frame layers, a one-time light sheen, and a slight scale-in on reveal.
  - Gentle 3D tilt with scroll, plus pointer tilt on desktop. On desktop the portrait stays sticky while the copy scrolls past it.
  - Floating "25+ years of insurance experience" badge and the "Seth Patel · Founder & CEO, Prana Risk" caption (both from the original site).
- **Copy:** original paragraph and all 8 accomplishments, numbered, in two columns (one on phones), with staggered reveals.
  - Fixes: "recognised" → "recognized"; "bringing in 25+ years" → "bringing 25+ years"; "7-time graduate from University of Illinois" → "a 7-time graduate of the University of Illinois"; "in USA" → "in the USA".
- **Badge images not used:** Harvard, Cornerstone, SIAA and Google. These assets weren't supplied; the accomplishments carry the same facts in text.
- **Verified:** no horizontal overflow at any width. Soft glows are clipped with `overflow-x: clip` so the sticky portrait still works.

## Section 7 implementation notes

- **Scene:** the contiguous US as a porcelain relief. Each state is extruded to a slightly different height, so the borders read as fine steps. New York is in soft blue, and a soft silhouette shadow sits underneath.
  - A beacon on Wall Street has a light column and a pulsing ring, with a projected "Wall Street, New York" tag.
  - As you scroll, ten arcs draw out from NYC to regions across the country (West Coast, Northwest, Southwest, Mountain, Midwest, South, Southeast). Each has a travelling glint. The arcs illustrate "anywhere in the USA"; they are not claims about specific clients.
- **Data:** US Census state boundaries (public domain, via PublicaMundi), Albers projection, simplified. 15 KB (5.4 KB gzipped), loaded with the skyline data.
- **Copy:** the original paragraph in three pinned panels: intro, the NYC market + quote, and the close + "Get in Touch" (#contact).
  - Fixes: "financial centre" → "financial center"; "one of the hardest and complex" → "one of the hardest and most complex"; quote punctuation normalized.
- **Layout:** desktop shows the copy on the left and the map on the right (view offset). Portrait shows the map centred in the space above the copy. The camera distance is fitted to the screen's width and the room left above the copy, so the map stays whole from 320 px up.
- **Hand-off:** the founder section now fogs out as its end approaches, so the cut to the map is hidden.
- **Verified:** reach panels sit clear of the header and inside the screen at all 9 sizes. No overflow and no console errors. Reduced motion and no-WebGL modes still work.

## Section 8 implementation notes

- **Anchor:** `#reviews`, so the "Reviews" nav item now works.
- **Backdrop:** a calm open sky above the cloud sea, far from the other set pieces. The camera glides slowly toward the low sun, and the veil keeps it soft (0.18 on desktop, 0.4 on phones). The fog only closes at the end when another section follows.
- **Heading:** the original, "What Our Clients Say About Us".
- **Stats:** the original four tiles: Google 5-star badge, 100% Google 5 stars, 25+ years of experience, 100% retention. The numbers count up once on reveal; with reduced motion they're static.
- **Reviews:** the 10 Google reviews from the live site, in its order, with names as shown.
  - **Excerpts only (Shahzad's choice):** the full review text couldn't be retrieved; the computer wasn't linked and the cloud can only read short quotes from the live site. Each card shows the verified opening sentence(s), word for word. Mid-sentence cut-offs end with "…" (Alana Tyler Slutsky, Leo Rubinfien), and a note reads "Excerpts from Google reviews". Customer wording is not edited.
  - **Swap in the full text later:** replace the blockquote text in `index.html`.
  - Avatars use initials, since the Google profile photos aren't available. No "View on Google" links, to keep the demo self-contained.
- **Slider:** native scroll-snap (swipe, trackpad, keyboard focus), arrows that page by the visible cards, and a progress line. Shows 3 / 2 / 1 cards (≥1100 / ≥640 / phones), with the next card peeking.
- **CTA band:** the original "Questions? Confused? Frustrated?" copy as a glass strip, with Get a Quote (#contact). Punctuation fix: the question mark now sits outside the quoted phrase.
- **Palette:** stars and quote marks use navy and soft blue instead of the old amber and gold.
- **Verified:** at all 9 sizes, stats and CTA are within the screen, the track scrolls, and the arrows work. No overflow and no console errors.

## Contact section implementation notes

- **Anchor:** `#contact`. Every "Get a Quote" / "Contact Us" / "Get in Touch" button on the page now has a real target. The menus are now Coverage, Products, About, Reviews and Contact (phones); "Insights" was removed.
- **Backdrop:** the same open sky as the reviews. The two sections share one continuous camera glide via `data-sky`, so there's no cut.
- **Copy (original, verified word for word):**
  - "Contact us for a Quote" and "We promise not to spam you!"
  - Both left-panel paragraphs.
  - The full SMS-consent wording, kept exactly as written because it's compliance text. Only a final full stop was added.
  - Direct contact lines from the original footer: phone, email, 75 Wall St, Open 24 Hours.
- **Form:** all 19 original fields, with the original placeholders as floating labels.
  - Name\*, Birthday (date), Email\*, Phone, Address, Square Feet (optional), Business Name / Website / Address / Square Feet (if applicable), and the message.
  - Six optional document uploads as compact tiles that show the chosen file name.
  - The SMS-consent checkbox and Submit.
- **Demo behaviour, no backend:**
  - Required fields validate on blur and on submit; the first error gets focus, and errors are announced through `aria-invalid` / `aria-describedby`.
  - Submitting shows "Thank you. This is a demo form, so nothing was sent…"; nothing leaves the page. A small "Demo form: nothing is sent yet" note sits beside the button.
- **Links not included:** "Privacy Policy" and "Terms and Conditions" in the consent text are plain text. Those pages aren't part of the self-contained demo.
- **Layout:**
  - Desktop: a sticky left panel with the form card on the right.
  - Tablet: stacked.
  - Phones: one column, uploads in two columns, a full-width submit, and 16px inputs so iOS doesn't zoom.
- **Verified:**
  - All parts fit at all 9 sizes with no overflow and no console errors.
  - Form test: an empty submit shows 2 errors and focuses Name; a file name appears in its tile; a valid submit shows the demo message.

## Footer implementation notes

- **Layout:** a light footer (silver-white gradient) in four columns: brand + tagline + Get a Quote, Contact, Featured Products, Company. It becomes 3, then 2, then 1 column on smaller screens. An oversized, barely-there "Prana Risk" wordmark signs off the page.
- **Content (original):**
  - Tagline: "Smart Asset Protection from Wall Street's #1 Insurance Broker & Agent."
  - Address, phone (tel:), email (mailto:), "Open 24 Hours".
  - Copyright line.
  - "Seth Patel, Founder&CEO" is now "Seth Patel, Founder & CEO".
- **Links, in-page only:**
  - The four Featured Products links land on that exact property in the Featured Products sequence, using the same jump as the product tabs.
  - Seth Patel → #founder; Our Approach → #mission; Our Partners → #partners; Testimonials → #reviews; Contact Us → #contact.
  - A "Back to top" link.
- **Left out:**
  - Glossary and Blog, which have no pages.
  - Privacy Policy, Accessibility Statement, Disclaimer and Terms of Use, which aren't part of the demo.
  - The LinkedIn, Facebook and X links, kept out so the demo stays self-contained. They can be added at go-live.
- **Logo:** the Vite plugin now inlines the logo in both the header and the footer.
- **Bug found and fixed:** the giant wordmark's glyphs overhung the footer's Get a Quote button and swallowed its clicks. It's now `pointer-events: none`. check.cjs now hit-tests every footer link at all 9 sizes.

## Redesign v2: photos instead of 3D (requested by Shahzad)

- **Loading screen first.** Critical CSS is inlined in `<head>`, and the loader is the first element in `<body>`, so nothing unstyled is ever painted, in dev or in production.
  - The logo draws in and a navy progress line fills while the CSS, fonts and hero photo load. The minimum time is 1.4 s and the cap is 7 s.
  - Then the screen slides up and the hero copy rises in.
  - The page renders underneath, so the hero photo is already decoded when the loader lifts.
- **All 3D removed:** Three.js, the procedural skyline, the porcelain buildings, the glass pillars, the colonnade, the 3D map and the WebGL stage and veil. JS is now 6.8 KB gzipped, down from about 150 KB.
- **No fog anywhere.** Every transition is a simple fade + slide, chosen by Shahzad. Photos also settle gently from a slight zoom.
- **Photos (Higgsfield, GPT Image 2.6):** 15 photorealistic images in the style of the live site.
  - Hero: the NYSE facade with flags, in wide and tall versions.
  - Mission, the 4 coverage lines, 4 NYC properties, Cyber, E&O, Life & Disability, and the contact view.
  - Encoded as AVIF + WebP at 2–3 widths, lazy-loaded except the hero, which is preloaded per orientation.
  - Cost: about 19 credits.
- **Graphics:** the Venn diagram and the US map are flat SVGs. The map is inlined at build time and its routes draw in when shown.
- **Layout:**
  - Hero: a full-bleed photo with a slow zoom and parallax.
  - Partners: the statement plus a two-row carrier marquee.
  - Mission: photo and copy, then the Venn diagram with the solve copy and steps.
  - Coverage: alternating photo rows.
  - Products: 4 photo cards, then 3 photo cards and a navy CTA band.
  - Founder: unchanged.
  - Across the USA: copy beside a sticky map.
  - Reviews, contact (now with a photo) and footer: unchanged.
- **Verified:**
  - 9 sizes: no overflow, all reveals fire, no broken images, no console errors.
  - Reduced motion: works.
  - No-JS: the loader is hidden and the content shows.

## Redesign v3: premium scroll-driven motion (requested by Shahzad)

All effects are tied to scroll, using transforms, opacity and clip-path only. One measured pass per frame feeds CSS variables (`src/ui/scroll-fx.ts`). There's no fog and no 3D.

- **Hero:** pinned for 175vh. The full-bleed NYSE photo shrinks into a rounded framed card while counter-zooming. The headline lifts and fades, and a "75 Wall Street · New York" tag appears inside the card.
- **Partners:** the statement's words light up one by one as you scroll. The two carrier rows drift in opposite directions with scroll, on top of their slow loop.
- **Headings:** every section heading rises word by word out of a mask.
- **Photos:** each one wipes open from the bottom as it enters, and the image inside moves slower than its frame (parallax).
- **Coverage:** full-height stacking cards on screens wider than 960px and taller than 700px. Each card slides over the previous one, which scales back and dims. Content fit was checked at 6 desktop sizes.
- **Products:** a pinned horizontal gallery on screens wider than 960px and taller than 640px, with a 01–04 counter and progress line. Each photo pans inside its card. Phones and tablets get a vertical list with photo reveals.
- **Diagrams:** the Venn circles converge with scroll, and the map routes draw out from New York in step with scrolling.
- **Small touches:**
  - A header scroll-progress line.
  - The footer wordmark rises letter by letter, finishing exactly at the bottom of the page.
- **Reduced motion:** everything is static and nothing is pinned.
- **Verified:** 9 sizes, no overflow, all reveals fire, no console errors. No-JS still works.

## Redesign v4: 3D sections and sheet transitions (requested by Shahzad)

All 3D comes from CSS perspective on real photos and cards (`src/ui/fx3d.ts`, `src/styles/sections-3d.css`). There's no CGI.

- **Reload:** a reload always opens on the hero. `history.scrollRestoration` is set to manual, any #hash is stripped, and the page scrolls to the top.
- **Hero:** the NYSE photo is split into 7 columns that turn into place on load. The headline letters flip up in 3D, and the pointer tilts the column wall. On scroll the columns part up and down while the headline flies forward.
- **Carrier partners:** the 25 carrier names sit on a 3D ring (cylinder) that turns slowly and spins with scroll.
- **Our mission:** pinned 230vh. The photo is a door that swings open on a hinge (left on desktop, top on phones) to reveal the copy.
- **Our approach:** pinned depth tunnel. Scrolling moves the viewer through 5 cards: the Venn diagram, 01–03 clarity steps, then "We Solve" with the CTA. A receding grid floor and progress dots complete it.
- **Business insurance:** the Cyber, E&O and Life & Disability cards start as a fanned deck and deal out into a row. On desktop they tilt with the pointer and show a glare.
- **Reviews:**
  - The stats are split-flap "trading board" digits.
  - The reviews are a 3D coverflow with arrows, swipe, keyboard and autoplay that pauses on hover or focus.
- **Get a Quote:** the form card folds down from a top hinge, and the photo swings in.
- **Sheet transitions:** a section leaving the screen tilts back and dims, while the next one slides over it with rounded corners. Applies to partners, coverage, founder, reach, reviews and contact (with the footer).
- **Reveals:** now driven by the scroll loop (IntersectionObserver missed elements inside 3D-transformed sections).
- **Verified:** 9 sizes, no overflow, all reveals fire, no console errors, reload lands on the hero. Reduced motion and no-JS fallbacks work.

## Redesign v5: cinematic frames for the hero, partners and mission (from Shahzad's reference video)

All three use the same visual language (`src/styles/cine.css`):
- A large rounded frame.
- Black-and-white photography tinted with the brand navy.
- White uppercase Jost type.
- A giant outlined word along the bottom.
- Floating frosted soft-blue glass shards that drift with the pointer.

- **Hero:**
  - **Header:** white over the frame (`.on-dark`), switching back to the glass header once past the hero.
  - **Layout:** a "Wall Street · New York City" tag, the headline in 4 lines, the lede, and white "Get a Quote" and ghost "Explore Coverage" pills.
  - **Glass info card:** arrow, text and 01/04 index, linking to the matching section.
  - **Photo switcher:** round thumbnails for Wall Street, NYC Condo, NYC Brownstone and Business. It autoplays every 6.5 s with a progress ring, pausing on hover or when off screen.
    - The new photo opens as a circle growing from its thumbnail.
    - The giant word's letters drop out and wave back in (WALL STREET / CONDO / BROWNSTONE / BUSINESS).
  - **Corner chips:** "Independent broker" and "Personal · Commercial · Life · Health".
- **Carrier partners:** a navy frame. The statement lights up word by word, there's a count of the 25 carriers listed, and a tilted 3D wall of 4 columns of carrier names scrolls up and down. A giant "CARRIERS" word moves with scroll.
- **Our mission:** pinned 220vh. The photo zooms out, the headline lights up word by word, and the paragraph rises in a glass card with an "Our approach" pill. A giant "MISSION" word glides sideways. On portrait screens the card takes over from the headline instead of covering it.
- **Removed:** the column hero, carrier ring and mission door from v4.
- **Verified:** 9 sizes plus 1280×720 and 375×667. No overflow, all reveals fire, no console errors. Reload lands on the hero, and the photo switcher works (word, card text and link update).

## Redesign v6: audit fixes (Shahzad's 11-point review)

The page is now conventional, readable and fast. Every point in the audit is addressed:
1. **Giant words:** the outlined CARRIERS / MISSION words are gone. The only decorative word left (hero) sits at z-index 1 inside the hero, behind the content, at 7% opacity, ≤ 17vh tall.
2. **Carrier partners:** a straight two-row marquee on navy (rows run in opposite directions). Every tile is the same size (210×64, 18px text), readable and clickable (→ the quote form, since carrier pages aren't part of the demo). Hover/focus pauses it; reduced motion shows a static wrapped grid.
3. **Transitions:** no fog, blur, dimming or sheet tilts. Elements slide up 24px, headings rise word by word, and photos wipe open.
4. **No scroll-jacking or pinning:** Our Approach is a normal grid (Venn card + 3 step cards + promise strip). The mission, founder and contact sections are no longer sticky.
5. **Typography:** body text ≥ 16px (leads 18px). An automated check finds no text below 4.5:1 contrast anywhere on solid backgrounds.
6. **Loader first:** all page content stays at opacity 0 until the preloader finishes (fonts + hero image), with a 9 s safety fallback, so raw HTML never shows.
7. **Spacing:** every section uses clamp(48px, 7vw, 80px) vertical padding; only the hero is full-height. Sections are separated by background colour (white / soft grey #f3f6f9 / navy).
8. **Corners:** full-width sections are square; cards, photos and the form card 12px; buttons, inputs and arrows 8px.
9. **Mobile:** html/body overflow-x hidden, 16px side gutter, no fixed widths. Zero horizontal scroll measured at 360, 375, 390, 768, 1280, 1440 and 1920.
10. **Copy:** paragraphs ≤ 30 words, headlines ≤ 8 words, long paragraphs replaced by 3 bullets with check icons (mission, reach, contact). Original meaning kept; nothing invented.
11. **Colour pairing:** white text only on navy or the navy-graded hero; navy/ink text on white and soft grey; slate labels darkened to #5a6676 on soft-grey surfaces.

Other changes:
- **Reviews:** the 3D coverflow is now a flat slider (3 / 2 / 1 cards per view), same arrows, swipe, keyboard and autoplay.
- **Header:** solid white once scrolled (no frosted blur); white over the hero.
- **Removed files:** `src/ui/fx3d.ts`, `src/styles/sections.css`, `src/styles/sections-3d.css`, `src/styles/cine.css`. New: `src/styles/site.css`, `src/styles/fixes.css`, `src/ui/extras.ts`.
- **Verified:** no console errors, reload lands on the hero (hash stripped), content hidden until the loader finishes.

## v6.1: section animations restored

v6 removed more motion than the audit asked for. Restored inside the sections (still no pinning, no fog or dimming between sections, no giant outline words):
- **Reveals:** content fades and slides up 40px again, staggered; headings still rise word by word.
- **Coverage:** cards come in from alternating sides; photos wipe open with parallax; hover lifts the card and zooms the photo.
- **Products:** property cards rise in a tilted wave; hover lift + photo zoom.
- **Business insurance (Cyber / E&O / Life):** the fanned deck deals out into a row as you scroll; on desktop each card tilts toward the pointer with a moving glare.
- **Founder:** portrait stays beside the list on desktop (sticky), zooms out with a light sheen, the 25+ badge rises, accomplishments appear one by one.
- **Across the USA:** routes still draw with scroll; the map drifts against the copy.
- **Reviews:** the 3D coverflow is back (with v6 styling: 12px cards, readable type); split-flap stats unchanged.
- **Get a Quote:** the form folds down from a top hinge and the photo swings in.
- **Footer:** the wordmark letters rise as the page ends (still 7% opacity).
- **Approach steps:** numbers slide in as each step card rises.
- **Coverage stacking (restored at Shahzad's request):** on wide, tall-enough screens each card sticks under the header and shrinks slightly as the next slides over it (no dark overlay). Phones/tablets keep the alternating slide-in.
- **Products horizontal gallery (restored at Shahzad's request):** on screens ≥ 961px wide the property cards glide sideways while the page scrolls, with a 01/04 progress bar and photo parallax. Smaller screens keep the grid.
- **Fix:** `body` now uses `overflow-x: clip` instead of `hidden` (hidden turned the body into a scroll box and silently broke every `position: sticky`, including the founder portrait).
- **Not restored:** the sheet tilt/dim transitions between sections (audit point 3).
- **Verified:** no horizontal scroll at 360/375/390/768/1440, every reveal fires, no console errors.

## v6.2: faster hero slides

Each hero photo now holds for 2 s after its 1.3 s circle reveal finishes (a new slide every 3.3 s, down from 6.5 s). The thumbnail ring timer matches. Clicking a thumbnail, pausing on hover and pausing off screen work as before.

## v1.0: production readiness — full test pass (Nov 7, 2026)

**Results (production build)**
- **Lighthouse mobile:** performance 97, accessibility 100, best practices 100, SEO 100 (FCP 1.2 s, LCP 2.3 s, TBT 70 ms, CLS 0). Was 57 / 94 / 100 / 92 before the fixes below.
- **Lighthouse desktop:** 99 / 100 / 100 / 100 (LCP 0.5 s, TBT 0 ms, CLS 0).
- **axe-core (WCAG 2.2 AA + best practices):** 0 violations at 1440 and 390.
- **HTML validation (html-validate, recommended):** 0 errors (was 31).
- **Functional suite:** 36/36 — loader, reload/hash lands on hero, hero thumbs + autoplay + hover pause, nav offsets for every section (desktop and mobile), in-page links, reviews arrows/keyboard, form validation / file names / demo submit with nothing sent, back to top, stacking + horizontal gallery on desktop, switching off on resize to mobile, no console errors or failed requests.
- **Keyboard:** 84 focus stops, all visible with a focus ring; skip link first; mobile menu traps focus, Esc closes and returns focus.
- **Layouts:** no horizontal scroll and all content revealed at 320, 360, 375, 390, 414, 768, 1024, 1280, 1366, 1536, 1920, 2560.
- **Reduced motion and no-JavaScript:** all content visible.
- **Scrolling:** ~55–56 fps desktop and on a 4× slowed CPU at 390 px.
- **Security headers (CSP etc.):** tested locally with the same headers — no violations, suite still 36/36.
- **npm audit:** 0 vulnerabilities (Vite upgraded 5 → 7.3.7; needs Node 20.19+).
- **Not tested:** Firefox and Safari engines (the browser downloads are blocked in the test environment). A CSS compatibility scan shows support back to Safari/iOS 15; the pinned effects switch themselves off in browsers without `overflow: clip` (Safari < 16), which then get the plain grids.

**Fixes made**
- Performance: hero thumbnails now use 4 KB 112 px images (were 50–85 KB photos); the other hero slides load at low priority; added an 800 px portrait hero for phones; the loader no longer waits for every image (fonts + hero photo only, 1.2 s minimum); replaced a full-screen blend mode on the hero with a plain navy wash.
- Bug: body `overflow-x: hidden` broke all `position: sticky` (now `clip`). Nav links landed 16 px low (offset used the tall header instead of the compact one).
- Accessibility: reviews neighbours are fully opaque (were 64%, failing contrast); coverflow markup is no longer a list of groups; ARIA roles fixed on the marquees, stat numbers and the carousel; the quote form fold is lighter so fields stay large enough to tap while it opens.
- HTML: uppercase doctype, non-breaking phone numbers, valid autocomplete tokens, no placeholder on the date field.
- Privacy: the form now posts (never puts form data in the URL) if JavaScript is off.
- SEO / sharing: robots.txt, InsuranceAgency structured data (facts from the page only), Open Graph image size/alt, Twitter card, apple-touch-icon.
- Vercel: CSP, HSTS, nosniff, frame and referrer/permissions policies; cache rules for assets, fonts and images.
- `start-site.bat` now runs `npm install` every time (fast when up to date), so the Vite upgrade is picked up.
