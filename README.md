# Vasanth C — Portfolio

Single-page animated portfolio. Built with Vite, React, TypeScript, Tailwind CSS 4, and Motion.

The Craft section adds one WebGL moment — a spatial index of the stack built with React Three
Fiber (`three`, loaded as a separate lazy chunk only when the panel nears the viewport *and*
the device passes `src/scene/useCanvasGate.ts`). Reduced motion, blocked WebGL and low-end
devices render the static SVG projection in `src/scene/SpatialIndexFallback.tsx` instead; no
three.js is downloaded on those paths.

## Commands

- `npm install` — install dependencies
- `npm run dev` — dev server
- `npm test` — test suite (Vitest + Testing Library)
- `npm run typecheck` — TypeScript check
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build

## Content

All copy lives in `data/*.ts`:

- `data/portfolio.ts` — profile, timeline, skill groups
- `data/projects.ts` — projects (source of truth, includes `repoLink`)
- `data/experience.ts` — research internship details
- `data/certifications.ts` — certifications

To add a LinkedIn or résumé link later, extend the relevant data file and render it in `src/components/Contact.tsx`.
