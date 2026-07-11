# Frontend Platform Design System & Engineering Guidelines

This document details the frontend platform architecture and design system implementation for the portfolio project.

## Architecture

The project strictly follows a primitive-first architecture built on Next.js App Router.

- **No `src/` directory**: All code is located directly in `website/`.
- **Path Aliases**: `@/*` points to `website/*`.
- **Component Hierarchy**:
  - `components/ui/` - Foundational primitives (Button, Typography, Card, Surface, etc.)
  - `components/layout/` - Layout compositions (AppShell, Stack, Cluster, PageWrapper, etc.)
  - `components/forms/` - Form controls (Input, Select, Switch, etc.)
  - `components/search/` - Search components
  - `components/rag/` - RAG / Chat interface components
  - `components/seo/` - SEO and Schema utilities
  - `components/content/` - Markdown and Code renderers
  - `components/accessibility/` - A11y helpers (FocusTrap, SkipLink)
  - Feature-specific components (`project`, `blog`, `service`) composed from UI primitives.

## Design System Tokens

### Colors
Defined in `tailwind.config.ts` and mapped to CSS variables in `styles/globals.css`.
- **Base (Background)**: `#F5F2ED` (Light), `#14140F` (Dark)
- **Elevated (Surfaces)**: `#FFFFFF` (Light), `#1C1C16` (Dark)
- **Primary Text**: `#1A1A18` (Light), `#F5F2ED` (Dark)
- **Secondary Text**: `#5C5850` (Light), `#A39F98` (Dark)
- **Accent**: `#C1652F` (Burnt Amber) - Used strictly for CTAs, active states, and focus rings.

### Typography
Uses `Outfit` (sans) and `Fira Code` (mono).
- Sans-serif for all UI elements and body text.
- Monospace for code, badges, metadata, and technical details.

### Spacing & Layout
- Pre-defined spacing system.
- `Stack` and `Cluster` primitives handle 1D layouts.
- `ContentGrid`, `SplitLayout`, and `SidebarLayout` handle 2D layouts.

### Animation (`framer-motion`)
- Standardized durations: `normal` (0.3s), `slow` (0.5s)
- Standard ease: `cubic-bezier(0.25, 1, 0.5, 1)`
- Primitives exposed via `lib/motion.ts` (e.g., `fadeUp`, `staggerChildren`).

## Primitives Reference

### Typography (`components/ui/Typography.tsx`)
- Standardized heading and text variants (`h1` through `h6`, `body1`, `body2`, `caption`).

### Layout (`components/layout/`)
- `AppShell`: Root layout shell.
- `PageWrapper`: Wraps individual pages with animation.
- `Stack`: Vertical stack of elements.
- `Cluster`: Horizontal cluster of elements (wrapping supported).

### Surfaces (`components/ui/Surface.tsx` & `Card.tsx`)
- Surfaces define base backgrounds and borders.
- Cards use composition (`CardHeader`, `CardContent`, etc.).

### Specialized Cards
- `ProjectCard`, `ServiceCard`, `ArticleCard`, `MetricCard`, `CaseStudyCard`, `TimelineCard`.
- Compose using `Card` or `Surface` primitives.

### Interaction
- `Button` and `Icon` handle core interactions.
- Specialized interaction elements: `Modal`, `Drawer`, `Accordion`, `Tabs`, `Dropdown`.

### Form Controls
- `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`.

### AI & Search
- `SearchInput`, `SearchResult`, `ChatDrawer`, `ChatLauncher`, `MessageBubble`, `SourcesPanel`.
