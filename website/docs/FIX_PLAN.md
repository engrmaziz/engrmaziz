# Enterprise Release Candidate Fix Plan

## Phase 1: Build Stability
**Objective: Zero compile errors, hydration errors, import errors, or runtime errors.**

1. **Purge Unauthorized AI Models**
   - **WHAT**: Remove references to `Llama 3`, `LlamaIndex`, `Ollama` in components/pages. Replace with `openai/gpt-oss` as required.
2. **Environment Variable Configuration**
   - **WHAT**: Update `.env.local` to satisfy client-side validation logic (e.g., `NEXT_PUBLIC_SANITY_PROJECT_ID`).
3. **Resolve Image Paths**
   - **WHAT**: Move `app/musharraf.webp` to `public/images/musharraf.webp` and update imports.
4. **Verify Middleware Compatibility**
   - **WHAT**: Ensure Edge middleware doesn't conflict with static generation. Clean up any unhandled output export conflicts.

## Phase 2: Architecture
**Objective: Splitting large pages and correcting boundaries.**

1. **Split Large Pages into Reusable Components**
   - **WHAT**: `app/page.tsx` and `app/about/page.tsx` are currently monolithic (1000+ lines). 
   - **ACTION**: Break `app/about/page.tsx` into `components/about/AboutHero.tsx`, `ExperienceTimeline.tsx`, `Education.tsx`, etc. Keep sections under 300 lines.
2. **Correct Server/Client Boundaries**
   - **WHAT**: Retain server-rendering for page roots (`page.tsx`) while safely extracting interactive sections (Framer Motion, command palettes) into isolated `"use client"` leaf components.
3. **Static Asset Organization**
   - **WHAT**: Consolidate all static assets (images, logos, SVGs) into `public/images/` and `public/assets/`.

## Phase 3: Production Infrastructure
**Objective: Verify SDKs and Deployment Readiness.**

1. **Verify SDK Implementations**
   - **WHAT**: Audit `lib/supabase.ts`, `lib/resend.ts`, `lib/groq.ts`, `lib/sanity.ts`. If they are returning fake objects, implement actual API calls or SDK wrappers. Preserve the wrapper pattern (`createSupabaseClient()`, etc.).
2. **Validate Environment Variables**
   - **WHAT**: Ensure strict separation between `NEXT_PUBLIC_` and server-only secrets.
3. **Test Vercel and Cloudflare Compatibility**
   - **WHAT**: Verify DNS, CDN, Turnstile configurations, and deployment compatibility.

## Phase 4: Performance
**Objective: Optimize the application payload and load metrics.**

1. **Bundle Analysis**
   - **WHAT**: Install `@next/bundle-analyzer` and run `ANALYZE=true npm run build` to identify bloated chunks (e.g., checking if Framer Motion or React Icons dominate).
2. **Suspense & Lazy Loading**
   - **WHAT**: Implement `<Suspense>` boundaries and `next/dynamic` for heavy client components and below-the-fold content.
3. **Image Optimization Verification**
   - **WHAT**: Confirm strategy (e.g., relying on Cloudflare image optimization and `images: { unoptimized: true }` without needing `sharp`).

## Phase 5: UI Polish
**Objective: Refinement and FAANG-grade presentation.**

1. **Hero & Marquee Redesign**
   - **WHAT**: Ensure animations are fluid, layouts are pixel-perfect, and the skills marquee behaves deterministically.
2. **Accessibility & Contrast**
   - **WHAT**: Add `aria-labels`, focus rings, and ensure all text passes WCAG AA contrast ratios.
3. **Responsive Testing**
   - **WHAT**: Validate layouts across mobile, tablet, and desktop breakpoints.

> [!IMPORTANT]
> **Execution Rule**: We will fix one phase at a time. After each step, we run lint, typecheck, and build. We will never proceed if a build fails.
