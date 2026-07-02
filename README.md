# Fluffy HUGS — Animated Landing Page

A single-page, animation-heavy recreation of [nft.fluffyhugs.io](https://nft.fluffyhugs.io/) built for the UI Animation.

## Setup

Requires Node.js 20.9+.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (Turbopack)
npm run start    # serve the production build
npm run lint     # eslint
```

## Which 3 slides

1. **Loading screen** — full-screen preloader with a bouncing mascot, a percentage counter driven by real asset loading, and a two-tone curtain exit that reveals the page.
2. **Hero** — Japanese tagline with per-character staggered entrance, five floating characters that idle-bounce and then scatter off-screen as you scroll, over a pinned section the next slide slides across.
3. **Collection** — pinned horizontal-scroll gallery on desktop (vertical scroll scrubs the track sideways with per-card parallax drift); staggered rise-in grid on tablet/mobile. Cards are clickable links with hover lift/zoom/shadow states.

## Libraries & why

| Library                     | Why                                                                                                                                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GSAP + ScrollTrigger**    | Timeline orchestration (preloader → hero handoff) and scrubbed/pinned scroll sequences. `gsap.matchMedia()` gives responsive + reduced-motion animation branches that auto-rebuild on breakpoint changes. |
| **@gsap/react**             | `useGSAP()` — StrictMode-safe `gsap.context()` wrapper with automatic cleanup for React 19.                                                                                                               |
| **Lenis**                   | Smooth scrolling that stays on _native_ window scroll (root mode, no wrapper element), so ScrollTrigger pinning keeps its default `pinType: 'fixed'` and stays jitter-free.                               |
| **Tailwind CSS 4**          | Design tokens via `@theme` (`--color-cream`, `--color-ink`, font vars) exposed as utilities; stateless hover/focus transitions stay in CSS.                                                               |
| **Next.js 16 (App Router)** | Static prerender, `next/image` (intrinsic sizes → no CLS), `next/font` (Zen Maru Gothic + Baloo 2, zero layout-shift font loading).                                                                       |

## Approach

### Animation architecture

- **One rAF for everything:** Lenis runs with `autoRaf: false` inside `gsap.ticker` (`components/providers/SmoothScroll.tsx`), with `lenis.on('scroll', ScrollTrigger.update)` and `lagSmoothing(0)` — smooth scroll and scrubbed animations can never drift apart.
- **Division of labor:** GSAP owns anything sequenced, scrubbed, or coordinated (entrances, scatter, pin, preloader). CSS owns stateless hover transitions (cards, buttons, icons) — cheaper and works without JS.
- **Layered transforms:** each hero character is three nested elements — outer div (ScrollTrigger scatter via `transform`), inner div (entrance pop + idle float), image (CSS `scale` on hover). Different elements/properties, so the three motions compose instead of fighting.
- **Preloader → hero handoff:** a tiny context (`LoadStateProvider`) counts hero image `onLoad`s; the preloader's exit is gated on `Promise`-equivalent logic — minimum 1.8s display (fast connections still see the branded moment) AND (all assets loaded OR 6s hard timeout, so slow assets can never deadlock the reveal). When the curtain finishes it flips `ready`, which triggers the hero entrance and a `ScrollTrigger.refresh()`.
- **Text reveals** use a server-rendered per-character splitter (`components/SplitChars.tsx`) — no hydration mismatch, no client-side splitting cost, `aria-label` keeps the full string for screen readers.

### Smooth scroll

Lenis in root mode animates real `window` scroll. No `scroll-behavior: smooth` in CSS (it would double-smooth, and Next 16 no longer overrides it). Under `prefers-reduced-motion`, Lenis is never instantiated — native scrolling throughout.

### Responsiveness

- Layout: Tailwind responsive utilities across 3 breakpoints (mobile / `md` 768 / `lg` 1024).
- Animation: `gsap.matchMedia()` branches — desktop gets the pinned horizontal gallery, below `lg` gets a grid with `ScrollTrigger.batch` rise-ins. Crossing a breakpoint (including live window resize) reverts and rebuilds the correct variant automatically; function-based ScrollTrigger values + `invalidateOnRefresh` re-measure on resize.
- Hero scatter vectors are fractions of the viewport, so characters clear the screen edge on any display.

## Performance notes

- **Transform/opacity only** — every tween uses `x/y/xPercent/scale/rotation/autoAlpha`; hover shadows animate a pre-rendered layer's _opacity_, never `box-shadow`; nothing animates layout properties.
- **Zero scroll-driven React state** — no scroll listeners, no re-renders while scrolling (the only animation-path `setState` is the one-time `ready` flip). The preloader counter writes `textContent` via a tweened proxy object.
- **Measured 60fps** during full-page scripted scroll in headless Chrome against the production build.
- **Images:** static imports (intrinsic dimensions → no CLS), hero/preloader images eager with `fetchPriority="high"` on the mascot, collection cards lazy-loaded with proper `sizes`.
- `will-change-transform` only on the persistently animated wrappers (hero characters, gallery track).
- **`prefers-reduced-motion` honored on three levels:** Lenis not created, `gsap.matchMedia` reduce branches (no pin, no scatter, no loops — simple fades or static layout), and a global CSS guard zeroing transitions/animations.

## Edge cases

- **Slow assets:** the preloader covers the page until images load, with a 6s hard timeout so it can never hang; image `onError` also counts as progress.
- **No JS:** a `<noscript>` style hides the preloader so content stays reachable.
- **Resize across breakpoints:** `gsap.matchMedia` + `invalidateOnRefresh` rebuild pin distances and swap desktop/mobile animation variants live.

## Assumptions

- Artwork, copy, and social links are placeholders taken from the reference site's public assets; 5 images are cycled to fill 10 collection cards.
- "View collection" and card links point at the real OpenSea collection; header logo and nav links are decorative (per the brief, no real navigation).
- The reference's remaining slides (story, roadmap, team, FAQ) are out of scope — the brief asks for 3.
