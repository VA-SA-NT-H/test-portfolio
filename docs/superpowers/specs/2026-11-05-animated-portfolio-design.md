# Design: Vasanth C — Animated Portfolio Page

Date: 2026-11-05

## Intent and why

A single-page animated portfolio for Vasanth C (software engineer: Java,
full-stack, security). Two audiences: **clients/collaborators who must be
convinced by the projects**, and **technical peers who care most about the
quantum-cryptography research**. The page must feel animated, attractive,
professional, reactive, and responsive. All content is sourced from the
repo's `data/` folder.

## Goals

- Single-scroll narrative page; projects are the centerpiece, research gets
  its own substantial section.
- Hook-driven reactive animation: scroll reveals, spring hovers, animated
  counters, cursor-reactive hero.
- Fully responsive (mobile → wide desktop), keyboard accessible, respects
  `prefers-reduced-motion`.
- Static build, deployable to any static host.
- Content read from `data/` files; no duplicated hardcoded copy.

## Non-goals

- No multi-route app, no blog, no CMS, no backend, no contact form
  (email/phone links only).
- No per-project case-study pages (4 projects fit one page).
- No LinkedIn or résumé download (can be added later by extending `data/`).

## Anti-goals (failure even if it works)

- Must not look like a generic AI portfolio: no cream+serif+terracotta; no
  near-black+acid-green; no grid of identical rounded cards with soft grey
  shadows; no ALL-CAPS eyebrow above every heading; no monospace data labels;
  no "→" on every link.
- Research must not be buried or become a footnote.
- No scattered fade-in-up on every element — motion is orchestrated, with one
  hero moment.

## Constraints

- Repo contains only `data/` (4 TypeScript files); everything else is new.
- **Data fixes:** `portfolio.ts` duplicates the projects list without
  `repoLink` — the app reads projects from `projects.ts` and the duplicate is
  removed from `portfolio.ts`. The stray `position: "Associate"` field on the
  last timeline entry is removed to match the `TimelineEntry` interface.

## Approaches (chosen with user)

- **Page structure: (A) single-scroll narrative** — chosen over (B)
  project-led landing (buries research) and (C) multi-route site (overkill
  for 4 projects).
- **Visual direction: (D1) "Entanglement"** — chosen over (D2) light
  "Spec Sheet": dark, luminous, research-forward, grounded in E91 quantum
  key distribution.

## The how (decided)

- **Stack:** Vite + React + TypeScript, Tailwind CSS, Framer Motion
  (`useScroll`, `useInView`, `useSpring`). Static build.
- **Palette:** void navy `#070B18` (base), panel `#10172B`, entangled cyan
  `#6EE7D7` (primary accent), measurement amber `#F2B441` (metrics/CTA),
  text `#E8ECF7`, muted `#8A93AD`. One light-inverted section (Research)
  with paper `#F1F4F8` / ink `#0B1020`.
- **Type:** Space Grotesk (display) + Inter (body); monospace only for tech
  tags and metric readouts.
- **Section order:** Hero → Work (4 project cards: metrics, tech tags,
  GitHub links where present, expandable detail) → Research
  (light-inverted; IIST internship, count-up 15/15 metrics, highlight list)
  → Path (timeline: education → IIST → current role at Digiclarity marked
  "Present") → Craft (6 skill groups + certifications strip) → Contact
  (email, phone, location, GitHub link).
- **Hero moment:** animated SVG entanglement diagram — two nodes, photon
  pairs flowing between them, lines subtly follow the cursor; name, tagline,
  two CTAs ("View work", "Get in touch") plus small GitHub link
  (`github.com/VA-SA-NT-H`, derived from existing `repoLink` values). The
  single bold motion moment; everything else stays disciplined.
- **Motion:** staggered scroll-linked reveals, spring hover states on
  project cards, count-up on research metrics, one orchestrated page-load
  sequence in the hero. All guarded by `prefers-reduced-motion`.
- **Nav:** sticky header with section links; mobile collapses to a compact
  menu (exact behavior left to the builder).

## Decisions from builder check

1. **Certifications** render as a compact strip inside the Craft section.
2. **Project 2 (Quantum Cryptography Image Security)** has no `repoLink`;
   its card renders without a GitHub link. The card layout must handle a
   missing link gracefully.
3. **GitHub profile link** (`github.com/VA-SA-NT-H`) appears in the hero and
   Contact. No LinkedIn or résumé for now.

## Left to the builder

Component breakdown, file structure, Tailwind config, breakpoints, mobile
nav behavior, accessibility details (focus states, skip link, landmarks),
deployment setup (host, base path, CI).
