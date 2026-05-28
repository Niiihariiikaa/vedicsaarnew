# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

No test runner is configured. No linter is configured.

## Architecture

**Stack:** React 18 + Vite + Tailwind CSS v3 + React Router v7. Supabase client is installed but not wired to UI. Fonts are self-hosted from `public/assets/fonts/` (Lathusca, Glacial Indifference) and supplemented with Google Fonts imports inside individual page files.

**Entry:** `src/main.jsx` → `src/App.jsx`

### Routing (`App.jsx`)

`<Navbar />` and `<Footer />` render on every route, wrapping a `<Routes>` block. The home route `/` renders `MainLayout`, which stacks the homepage sections (`Homepage`, `MysticalServices`, `ServicesGrid`, `KnowYourAstrologer`, `Testimonials`) plus a design-system button showcase section (inline in `App.jsx`, not its own component).

All other routes map to full-page components in `src/pages/`:

| Path pattern | Component |
|---|---|
| `/gemstones`, `/rudraksha` | `Gemstones.jsx`, `Rudraksha.jsx` |
| `/vedic-astrology`, `/numerology`, `/vaastu` | `Vedic.jsx`, `Numerology.jsx`, `Vaastu.jsx` |
| `/life-solutions/*` | `LoveMarriage`, `Health`, `Career`, `Finance`, `ForeignTravel`, `ChildProgeny`, `Education`, `HouseProperty`, `CourtLitigation` |
| `/remedies/pooja`, `/remedies/lal-kitab` | `Pooja.jsx`, `LalKitab.jsx` |
| `/mantra`, `/about` | `Mantras.jsx`, `About.jsx` |

### Styling conventions

The project mixes two styling approaches:

1. **Tailwind utility classes** — used in `Navbar`, `Footer`, `Testimonials`, `Astrologer`, and layout wrappers.
2. **Inline `style={{}}` props** — used heavily in all `src/pages/` files and several components. Most pages define a `<style>` JSX string at the top (injected via `<style>{globalCss}</style>`) for things like keyframe animations, scroll reveal classes (`.rv`/`.vis`), and the `.cta-btn` CSS class.

**Shared colour palette (defined as constants at the top of each page file):**
- `DARK` / `dark` = `#1a1410` or `#0d0a06` (near-black)
- `GOLD` / `gold` = `#c9a96e`
- `CREAM` = `#f5f0e8`
- `MUTED` = `#8a7e76`

**Fonts used throughout:**
- `'Ibarra Real Nova', serif` — headings and display text
- `'Glacial Indifference', sans-serif` — body, buttons, labels
- `'Lathusca'` — logo only

### Button system

Buttons follow a consistent pattern across the codebase:

- **Primary CTA (dark):** `background: black/dark, color: white, border: 2px dashed white` — used for booking calls-to-action everywhere.
- **Transparent/outline:** `background: transparent, color: black/dark, border: 1px dashed black` — used for secondary actions (Discover More, Read All Reviews, first two booking buttons on Numerology/Vaastu/Vedic pages).
- **`cta-btn` CSS class:** Defined inside the `<style>` block of each life-solutions page (`Career`, `Finance`, `Health`, etc.). Must be `background: #0d0a06; border: 2px dashed #ffffff; color: #ffffff` across all pages.
- **Services Learn More:** Rendered as a plain `<span>` with `textDecoration: underline`, not a `<button>`.
- Navbar "Book Reading" and Home "Discover More" are intentionally kept as transparent-with-black-dashed; do not convert them to the dark style.

### Booking modal system

`BookingContext.jsx` provides a React context with `openBooking(serviceLabel)` and `openVaastuBooking()` functions. `BookingModal.jsx` and `VaastuBookingModal.jsx` are consumed globally via context — they render inside `App.jsx`'s layout and are triggered from any page without prop-drilling. Both modals connect to Supabase for form submissions.

### Page structure pattern (life-solutions and service pages)

All pages in `src/pages/` (except `Home.jsx`) follow the same internal structure:

1. Font injection via `document.createElement('link')` at module level (avoids re-injection on re-renders).
2. Colour/font constants defined at file top.
3. A `<style>{globalCss}</style>` block injected into the JSX for keyframes and class-based animations.
4. Scroll-reveal via `IntersectionObserver` — elements get class `.rv` in JSX; JS adds `.vis` when in viewport.
5. A hero `<section>` with dark background and parallax elements.
6. Content sections alternating light/dark backgrounds.
7. A final CTA section using the `Testimonialsbg.png` background image, containing an italic ✦…✦ quote (now styled `color: CREAM`) and a booking button.

### Key animation libraries

- **GSAP + ScrollTrigger** — used in `Astrologer.jsx` for scroll-driven animations (sunburst rotation, marquee, orb parallax, fade-in).
- **Lenis** — smooth scroll (check `main.jsx`).
- **framer-motion / motion** — installed but usage is minimal/ad-hoc.
- **OGL** — used in `Galaxy.jsx` for the WebGL footer background.
- **gsap** — also used directly in `Gemstones.jsx` and `Rudraksha.jsx` for card hover micro-animations.

### Assets

All images, fonts, and videos live in `public/assets/`. Key assets: `navvid.mp4` (navbar top bar), `Testimonialsbg.png` (reused as the final CTA section background across every page), `astrologer.png`, `wheel.png`, `zodiac-ring.svg`.
