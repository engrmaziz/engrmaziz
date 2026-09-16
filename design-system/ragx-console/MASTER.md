# RAGX Console — Design System Master

Source: UI/UX Pro Max reasoning (Portfolio + AI/Chatbot Platform + B2B service) + 21st.dev patterns (interactive dot-grid hero, holographic tilt bento, magnetic buttons, spotlight cards, cinematic footer). Component code was adapted locally — 21st paid retrievals were not consumed.

## Product

Senior AI/ML engineer portfolio and hire surface for Musharraf Aziz. Dual intent: freelance builds (call agents, chatbots, RAG, automation) and full-time recruiting. Markets: California and Florida. Honesty: remote from Lahore, no fake US address.

## Pattern

Hero-centric + proof + bento capabilities.

1. Interactive HUD hero (centerpiece in first 350px)
2. Trust / telemetry strip
3. Bento services
4. Flagship case studies
5. Philosophy
6. Stack
7. Process
8. Hire CTA

## Style

Dark-first **AI-Native HUD** + glass + bento. Not a generic SaaS landing page.

Keywords: scanlines, telemetry, cyan filaments, gold CTAs, corner brackets, magnetic pointer physics, cursor spotlight, 3D tilt tiles.

## Colors

| Token | Dark | Light |
|---|---|---|
| Background | `#06090F` | `#F3F6FB` |
| Elevated | `#0C121C` | `#FFFFFF` |
| Text | `#E8EEF7` | `#0B1220` |
| Secondary | `#8B9BB4` | `#4A5A70` |
| Accent (cyan) | `#2EE6D6` | `#0E8F86` |
| CTA gold | `#E8B86D` | `#B8860B` |
| Border | `rgba(46,230,214,0.16)` | `#D5DEEA` |

Contrast: body text ≥ 4.5:1. Accent on dark is cyan; primary buttons use gold on dark for CTA weight.

## Typography

- Display: **Syne** (headings)
- Body: **Inter**
- Mono: **JetBrains Mono** (labels, telemetry, badges)

Base 16px, body line-height 1.6, headings tracking-tight.

## Motion

High choreography, transform/opacity only (no width/height animation).

- Magnetic buttons (pointer spring)
- Canvas dot grid (hero only, pause offscreen)
- Spotlight follow (CSS variables, pointer-events none)
- Tilt bento tiles
- Scroll reveal with stagger
- Infinite marquee (paused on hover + reduced motion)

`prefers-reduced-motion: reduce` disables canvas, tilt, marquee, and long reveals.

## Anti-patterns

- AI purple/pink gradients
- Emoji as icons
- Placeholder-only form labels
- Hover-only interactions
- Layout shift from fonts/images
- Hiding SEO copy behind canvas (all copy stays in DOM)

## Stack

Next.js 14 App Router, Tailwind, Framer Motion, Lucide. No GSAP, no extra scroll libraries.
