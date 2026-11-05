# Animated Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-scroll animated portfolio page for Vasanth C from the `data/` folder, with projects as the centerpiece and research as a substantial second act.

**Architecture:** Vite + React + TypeScript SPA. Six section components (Hero, Work, Research, Path, Craft, Contact) composed in `App.tsx`, fed entirely by the four `data/*.ts` modules. Animation via `motion` (Framer Motion) hooks behind a shared `Reveal` wrapper and a `useCountUp` hook, all gated by a `usePrefersReducedMotion` hook. Styling with Tailwind CSS v4 theme tokens defined in `src/index.css`.

**Tech Stack:** Vite 6, React 19, TypeScript 5.8, Tailwind CSS 4, `motion` 12, Vitest 3 + Testing Library.

## Global Constraints

- **Palette (exact values):** void navy `#070B18` (base), panel `#10172B`, entangled cyan `#6EE7D7` (primary accent), measurement amber `#F2B441` (metrics/CTA), text `#E8ECF7`, muted `#8A93AD`; light-inverted Research section: paper `#F1F4F8`, ink `#0B1020`.
- **Fonts:** Space Grotesk (display), Inter (body), IBM Plex Mono (tech tags and metric readouts ONLY — never for section labels or body copy).
- **Motion:** every animation guarded by `usePrefersReducedMotion` (see Task 4). No animation may run when the OS reports reduced motion.
- **Anti-goals:** no cream+serif+terracotta look; no near-black+acid-green; no grid of identical rounded cards with soft shadows; no ALL-CAPS eyebrow labels above headings; no "→" appended to links; research section must not be a footnote; no scattered fade-in-up on every element.
- **Content source:** all copy comes from `data/*.ts`. The only literal strings allowed are UI labels (e.g. "View work", "Show details") and the GitHub URL `https://github.com/VA-SA-NT-H` (derived from `repoLink` values).
- **Data rules:** projects read from `data/projects.ts` (has `repoLink`); `data/portfolio.ts` must no longer export a duplicate `projects` array nor the stray `position` field on the timeline entry.
- **Out of scope:** no contact form, no LinkedIn, no résumé link, no multi-route router, no blog.
- **Section order (DOM):** Hero (`#top`) → Work (`#work`) → Research (`#research`) → Path (`#path`) → Craft (`#craft`) → Contact (`#contact`).
- **Accessibility:** semantic landmarks (`header`, `main`, `section` with `aria-labelledby`), skip link, visible `:focus-visible` outline in cyan, all interactive elements keyboard-operable.
- **Repo note:** the directory is not yet a git repo; Task 1 initializes it.

---

### Task 1: Project scaffold + tooling

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.gitignore`
- Create: `src/main.tsx`, `src/index.css`, `src/test/setup.ts`, `src/App.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `App` default export rendering `<main />` (later tasks insert sections); npm scripts `dev`, `build`, `preview`, `test`, `typecheck`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "vasanth-portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "motion": "^12.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.4.0",
    "jsdom": "^26.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "~5.8.0",
    "vite": "^6.0.0",
    "vitest": "^3.1.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true,
    "types": ["node", "vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "data", "vite.config.ts"]
}
```

- [ ] **Step 4: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Vasanth C — Software Engineer building secure, intelligent and scalable software systems."
    />
    <title>Vasanth C — Software Engineer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules
dist
coverage
*.local
```

- [ ] **Step 6: Create `src/index.css`** (tokens land in Task 3; Tailwind import now)

```css
@import "tailwindcss";
```

- [ ] **Step 7: Create `src/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 8: Create `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

export function stubMatchMedia(matches: boolean) {
  return (query: string): MediaQueryList =>
    ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList;
}

class ImmediateIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe(target: Element): void {
    this.callback(
      [{ target, isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
      this,
    );
  }
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal("matchMedia", stubMatchMedia(false));
vi.stubGlobal("IntersectionObserver", ImmediateIntersectionObserver);

if (typeof globalThis.requestAnimationFrame !== "function") {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 16) as unknown as number;
  globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);
}

afterEach(() => {
  vi.stubGlobal("matchMedia", stubMatchMedia(false));
  vi.stubGlobal("IntersectionObserver", ImmediateIntersectionObserver);
});
```

- [ ] **Step 9: Install dependencies**

Run: `npm install`
Expected: completes with no errors

- [ ] **Step 10: Create `src/App.test.tsx`** (failing first)

```tsx
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the app shell with a main landmark", () => {
  render(<App />);
  expect(screen.getByRole("main")).toBeInTheDocument();
});
```

- [ ] **Step 11: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./App`

- [ ] **Step 12: Create `src/App.tsx`**

```tsx
export default function App() {
  return <main />;
}
```

- [ ] **Step 13: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 1 test

- [ ] **Step 14: Commit** (repo already initialized on `main` — just add and commit)

```bash
git add -A
git commit -m "chore: scaffold vite react ts app with vitest and tailwind"
```

---

### Task 2: Data cleanup + integrity tests

**Files:**
- Modify: `data/portfolio.ts` (remove duplicate `projects` export lines 133-308; remove `position: "Associate",` line 50)
- Test: `src/data.test.ts`

**Interfaces:**
- Produces: `data/portfolio.ts` exporting only `portfolio`, `TimelineEntry`, `timeline`, `skillGroups`. `projects` (with `repoLink`) comes from `data/projects.ts`.

- [ ] **Step 1: Write the failing test**

```tsx
import { expect, test } from "vitest";
import * as portfolioModule from "../data/portfolio";
import { projects } from "../data/projects";
import { certifications } from "../data/certifications";
import { experience } from "../data/experience";

test("projects live only in data/projects.ts, three of four with repo links", () => {
  expect(projects).toHaveLength(4);
  expect(projects.filter((p) => p.repoLink)).toHaveLength(3);
  expect(portfolioModule).not.toHaveProperty("projects");
});

test("every project has title, description, technologies and metrics", () => {
  for (const p of projects) {
    expect(p.title.length).toBeGreaterThan(0);
    expect(p.description.length).toBeGreaterThan(0);
    expect(p.technologies.length).toBeGreaterThan(0);
    expect(p.metrics).toHaveLength(3);
  }
});

test("timeline entries match the TimelineEntry shape with no stray fields", () => {
  expect(portfolioModule.timeline).toHaveLength(3);
  for (const entry of portfolioModule.timeline) {
    expect(entry).toHaveProperty("start");
    expect(entry).toHaveProperty("period");
    expect(entry).toHaveProperty("title");
    expect(entry).toHaveProperty("organization");
    expect(entry).not.toHaveProperty("position");
  }
});

test("supporting data files are populated", () => {
  expect(portfolioModule.skillGroups).toHaveLength(6);
  expect(certifications).toHaveLength(4);
  expect(experience.highlights).toHaveLength(5);
  expect(experience.achievements).toHaveLength(3);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `portfolio` module still has `projects`; entry still has `position`

- [ ] **Step 3: Run typecheck to confirm the stray field breaks it**

Run: `npm run typecheck`
Expected: FAIL — TS2353 mentioning `position`

- [ ] **Step 4: Fix `data/portfolio.ts`**

Delete the entire `export const projects = [ ... ];` block at the end of the file (starts with `export const projects = [` after `skillGroups`), and delete this single line from the third timeline entry:

```ts
    position: "Associate",
```

- [ ] **Step 5: Run typecheck to verify it passes**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — 5 tests (1 from Task 1 + 4 new)

- [ ] **Step 7: Commit**

```bash
git add data/portfolio.ts src/data.test.ts
git commit -m "fix: remove duplicate projects export and stray timeline field"
```

---

### Task 3: Design tokens + base styles

**Files:**
- Modify: `src/index.css`
- Test: `src/theme.test.ts`

**Interfaces:**
- Produces: Tailwind utilities `bg-void`, `bg-panel`, `text-entangle`, `text-measure`, `text-ink`, `text-muted`, `bg-paper`, `text-night`, `font-display`, `font-body`, `font-mono` available to all later tasks.

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

test("index.css defines the Entanglement palette and type roles", () => {
  const css = readFileSync(fileURLToPath(new URL("./index.css", import.meta.url)), "utf8");
  const lower = css.toLowerCase();
  for (const token of [
    "#070b18",
    "#10172b",
    "#6ee7d7",
    "#f2b441",
    "#e8ecf7",
    "#8a93ad",
    "#f1f4f8",
    "#0b1020",
    "space grotesk",
    "inter",
    "ibm plex mono",
  ]) {
    expect(lower).toContain(token);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — index.css has only the Tailwind import

- [ ] **Step 3: Write `src/index.css`**

```css
@import "tailwindcss";

@theme {
  --color-void: #070b18;
  --color-panel: #10172b;
  --color-entangle: #6ee7d7;
  --color-measure: #f2b441;
  --color-ink: #e8ecf7;
  --color-muted: #8a93ad;
  --color-paper: #f1f4f8;
  --color-night: #0b1020;

  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
}

@layer base {
  html {
    scroll-behavior: smooth;
    font-family: var(--font-body);
  }

  body {
    background-color: var(--color-void);
    color: var(--color-ink);
  }

  :focus-visible {
    outline: 2px solid var(--color-entangle);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS — 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/theme.test.ts
git commit -m "feat: add entanglement palette and type tokens"
```

---

### Task 4: Motion primitives — usePrefersReducedMotion, Reveal, useCountUp

**Files:**
- Create: `src/hooks/usePrefersReducedMotion.ts`, `src/hooks/useCountUp.ts`, `src/components/Reveal.tsx`
- Test: `src/hooks/useCountUp.test.tsx`, `src/components/Reveal.test.tsx`

**Interfaces:**
- Produces:
  - `usePrefersReducedMotion(): boolean` — reads `matchMedia("(prefers-reduced-motion: reduce)")` fresh on every mount (no module-level cache), subscribes to change events.
  - `useCountUp(target: number, duration?: number): { ref: RefObject<HTMLSpanElement | null>; value: number }` — `value` starts at 0, animates to `target` once `ref` enters the viewport (rAF, ease-out cubic); jumps straight to `target` when reduced motion is on. Default duration 1000.
  - `Reveal({ children, delay?, className? })` — renders a `motion.div` with `data-reveal="motion"` (fade+rise on first view) or a plain `div` with `data-reveal="static"` under reduced motion. Accepts `className` in both branches.

- [ ] **Step 1: Write the failing Reveal test**

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { stubMatchMedia } from "../test/setup";
import { Reveal } from "./Reveal";

test("wraps content in an animated reveal", () => {
  render(
    <Reveal className="wrapper">
      <p>hello</p>
    </Reveal>,
  );
  const wrapper = screen.getByText("hello").closest("[data-reveal]");
  expect(wrapper).toHaveAttribute("data-reveal", "motion");
  expect(wrapper).toHaveClass("wrapper");
});

test("renders statically when the user prefers reduced motion", () => {
  vi.stubGlobal("matchMedia", stubMatchMedia(true));
  render(
    <Reveal>
      <p>hello</p>
    </Reveal>,
  );
  expect(screen.getByText("hello").closest("[data-reveal]")).toHaveAttribute("data-reveal", "static");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./Reveal`

- [ ] **Step 3: Write `src/hooks/usePrefersReducedMotion.ts`**

```ts
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window.matchMedia === "function" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 4: Write `src/components/Reveal.tsx`**

```tsx
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div data-reveal="static" className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      data-reveal="motion"
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Run Reveal tests to verify they pass**

Run: `npm test`
Expected: Reveal tests PASS (other tests unchanged)

- [ ] **Step 6: Write the failing useCountUp test**

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { stubMatchMedia } from "../test/setup";
import { useCountUp } from "./useCountUp";

function Counter({ target, duration }: { target: number; duration: number }) {
  const { ref, value } = useCountUp(target, duration);
  return <span ref={ref}>{value}</span>;
}

test("starts at zero and counts up to the target once in view", async () => {
  render(<Counter target={15} duration={60} />);
  expect(screen.getByText("0")).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText("15")).toBeInTheDocument(), { timeout: 2000 });
});

test("jumps straight to the target under reduced motion", () => {
  vi.stubGlobal("matchMedia", stubMatchMedia(true));
  render(<Counter target={15} duration={60} />);
  expect(screen.getByText("15")).toBeInTheDocument();
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./useCountUp`

- [ ] **Step 8: Write `src/hooks/useCountUp.ts`**

```ts
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useCountUp(target: number, duration = 1000) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, target, duration]);

  return { ref, value };
}
```

- [ ] **Step 9: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests

- [ ] **Step 10: Commit**

```bash
git add src/hooks src/components/Reveal.tsx src/hooks/useCountUp.test.tsx src/components/Reveal.test.tsx
git commit -m "feat: add reduced-motion hook, reveal wrapper, and count-up hook"
```

---

### Task 5: Header with sticky nav + mobile menu

**Files:**
- Create: `src/components/Header.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/Header.test.tsx`

**Interfaces:**
- Consumes: none (standalone).
- Produces: `Header()` — `<header>` landmark containing one `<nav aria-label="Primary">`: desktop link list (hidden below `md`), a menu button (`aria-expanded`, `aria-controls="mobile-nav"`) shown below `md`, and the mobile list rendered only while open. Links: Work, Research, Path, Craft, Contact (in order, hrefs `#work` … `#contact`).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { Header } from "./Header";

test("shows the five section links", () => {
  render(<Header />);
  const nav = screen.getByRole("navigation", { name: "Primary" });
  const links = within(nav).getAllByRole("link");
  expect(links.map((l) => l.textContent)).toEqual([
    "Work",
    "Research",
    "Path",
    "Craft",
    "Contact",
  ]);
  expect(links.map((l) => l.getAttribute("href"))).toEqual([
    "#work",
    "#research",
    "#path",
    "#craft",
    "#contact",
  ]);
});

test("toggles the mobile menu and closes it when a link is chosen", async () => {
  const user = userEvent.setup();
  render(<Header />);
  const button = screen.getByRole("button", { name: "Menu" });
  expect(button).toHaveAttribute("aria-expanded", "false");

  await user.click(button);
  expect(button).toHaveAttribute("aria-expanded", "true");
  expect(within(screen.getByRole("navigation", { name: "Primary" })).getAllByRole("link")).toHaveLength(10);

  const mobileWorkLinks = screen.getAllByRole("link", { name: "Work" });
  await user.click(mobileWorkLinks[mobileWorkLinks.length - 1]);
  expect(button).toHaveAttribute("aria-expanded", "false");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./Header`

- [ ] **Step 3: Write `src/components/Header.tsx`**

```tsx
import { useState } from "react";

const links = [
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "path", label: "Path" },
  { id: "craft", label: "Craft" },
  { id: "contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-void/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="font-display text-lg font-semibold text-ink">
          VC
        </a>
        <nav aria-label="Primary">
          <ul className="hidden gap-6 md:flex">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="text-sm text-muted transition-colors hover:text-entangle"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="text-sm text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          {open && (
            <ul id="mobile-nav" className="mt-3 flex flex-col gap-3 border-t border-white/10 pt-3 md:hidden">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-sm text-muted"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: Header tests PASS

- [ ] **Step 5: Wire into `src/App.tsx`**

```tsx
import { Header } from "./components/Header";

export default function App() {
  return (
    <div className="min-h-svh bg-void font-body text-ink antialiased">
      <Header />
      <main />
    </div>
  );
}
```

- [ ] **Step 6: Run full suite**

Run: `npm test`
Expected: PASS — all tests

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.tsx src/components/Header.test.tsx src/App.tsx
git commit -m "feat: add sticky header with responsive mobile menu"
```

---

### Task 6: EntanglementDiagram (hero visual)

**Files:**
- Create: `src/components/EntanglementDiagram.tsx`
- Test: `src/components/EntanglementDiagram.test.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` (Task 4).
- Produces: `EntanglementDiagram({ className? })` — decorative `aria-hidden` SVG, `viewBox="0 0 800 400"`, two node circles, three curved photon paths, three amber photon circles animated along the paths with `<animateMotion>` (omitted under reduced motion). Mouse-move over the SVG springs the whole group toward the cursor (also disabled under reduced motion).

- [ ] **Step 1: Write the failing test**

```tsx
import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { stubMatchMedia } from "../test/setup";
import { EntanglementDiagram } from "./EntanglementDiagram";

function getSvg(container: HTMLElement): SVGSVGElement {
  const svg = container.querySelector("svg");
  expect(svg).not.toBeNull();
  return svg as SVGSVGElement;
}

test("renders two nodes, three photon paths and three animated photons", () => {
  const { container } = render(<EntanglementDiagram />);
  const svg = getSvg(container);
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg.querySelectorAll("path")).toHaveLength(3);
  expect(svg.querySelectorAll("circle")).toHaveLength(5);
  expect(svg.querySelectorAll("animateMotion")).toHaveLength(3);
});

test("freezes photon animation under reduced motion", () => {
  vi.stubGlobal("matchMedia", stubMatchMedia(true));
  const { container } = render(<EntanglementDiagram />);
  const svg = getSvg(container);
  expect(svg.querySelectorAll("circle")).toHaveLength(2);
  expect(svg.querySelectorAll("animateMotion")).toHaveLength(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./EntanglementDiagram`

- [ ] **Step 3: Write `src/components/EntanglementDiagram.tsx`**

```tsx
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const photons = [0, 1, 2];

export function EntanglementDiagram({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 50, damping: 18 });
  const y = useSpring(my, { stiffness: 50, damping: 18 });

  function handleMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((event.clientX - rect.left) / rect.width - 0.5) * 28);
    my.set(((event.clientY - rect.top) / rect.height - 0.5) * 18);
  }

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 800 400"
      fill="none"
      aria-hidden="true"
      onMouseMove={reduced ? undefined : handleMouseMove}
    >
      <motion.g style={reduced ? undefined : { x, y }}>
        <path
          d="M180 200 C 320 80, 480 80, 620 200"
          stroke="currentColor"
          className="stroke-entangle/30"
          strokeWidth="1.5"
        />
        <path
          d="M180 200 C 320 320, 480 320, 620 200"
          stroke="currentColor"
          className="stroke-entangle/30"
          strokeWidth="1.5"
        />
        <path
          d="M180 200 C 360 200, 440 200, 620 200"
          stroke="currentColor"
          className="stroke-entangle/20"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
        <circle cx="180" cy="200" r="14" className="fill-entangle" />
        <circle cx="620" cy="200" r="14" className="fill-entangle" />
        {!reduced &&
          photons.map((index) => (
            <circle key={index} r="5" className="fill-measure">
              <animateMotion
                dur={`${3 + index * 0.6}s`}
                begin={`${index * 0.9}s`}
                repeatCount="indefinite"
              >
                <mpath href={`#photon-${index + 1}`} />
              </animateMotion>
            </circle>
          ))}
      </motion.g>
    </svg>
  );
}
```

Add `id="photon-1"`, `id="photon-2"`, `id="photon-3"` to the three `<path>` elements respectively (first path gets `id="photon-1"`, etc.) so `<mpath href>` resolves.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests

- [ ] **Step 5: Commit**

```bash
git add src/components/EntanglementDiagram.tsx src/components/EntanglementDiagram.test.tsx
git commit -m "feat: add cursor-reactive entanglement diagram"
```

---

### Task 7: Hero section

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/Hero.test.tsx`

**Interfaces:**
- Consumes: `portfolio` from `../data/portfolio`, `EntanglementDiagram` (Task 6).
- Produces: `Hero()` — `<section id="top" aria-labelledby="hero-title">` with h1 `Vasanth C`, roles joined by ` · ` from `portfolio.role`, `portfolio.tagline`, CTAs "View work" (`#work`) and "Get in touch" (`#contact`), plus GitHub link (`https://github.com/VA-SA-NT-H`). Orchestrated staggered load animation, static under reduced motion (`initial={false}`).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Hero } from "./Hero";

test("introduces Vasanth with role, tagline and CTAs", () => {
  render(<Hero />);
  expect(screen.getByRole("heading", { level: 1, name: "Vasanth C" })).toBeInTheDocument();
  expect(screen.getByText("Software Engineer · Java Developer · Full Stack Developer")).toBeInTheDocument();
  expect(screen.getByText("Building Secure, Intelligent & Scalable Software Systems")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View work" })).toHaveAttribute("href", "#work");
  expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "#contact");
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/VA-SA-NT-H",
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./Hero`

- [ ] **Step 3: Write `src/components/Hero.tsx`**

```tsx
import { motion } from "motion/react";
import { portfolio } from "../../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { EntanglementDiagram } from "./EntanglementDiagram";

const GITHUB = "https://github.com/VA-SA-NT-H";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const roles = portfolio.role.split("|").map((part) => part.trim()).join(" · ");

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden"
    >
      <EntanglementDiagram className="absolute inset-0 h-full w-full text-entangle opacity-60" />
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 sm:px-6"
        variants={container}
        initial={reduced ? false : "hidden"}
        animate="show"
      >
        <motion.h1
          id="hero-title"
          variants={item}
          className="font-display text-5xl font-bold tracking-tight sm:text-7xl"
        >
          {portfolio.name}
        </motion.h1>
        <motion.p variants={item} className="mt-4 text-lg text-entangle">
          {roles}
        </motion.p>
        <motion.p variants={item} className="mt-3 max-w-xl text-lg text-muted">
          {portfolio.tagline}
        </motion.p>
        <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="bg-measure px-5 py-2.5 font-medium text-void transition-transform hover:-translate-y-0.5"
          >
            View work
          </a>
          <a
            href="#contact"
            className="border border-entangle px-5 py-2.5 font-medium text-entangle transition-colors hover:bg-entangle/10"
          >
            Get in touch
          </a>
          <a href={GITHUB} className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            GitHub
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: Hero test PASS

- [ ] **Step 5: Wire into `src/App.tsx`** — import `Hero` and render it inside `<main>`:

```tsx
<main>
  <Hero />
</main>
```

- [ ] **Step 6: Run full suite**

Run: `npm test`
Expected: PASS — all tests

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero.tsx src/components/Hero.test.tsx src/App.tsx
git commit -m "feat: add hero with entanglement visual and staggered entrance"
```

---

### Task 8: Work section + ProjectCard

**Files:**
- Create: `src/components/Work.tsx`, `src/components/ProjectCard.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/Work.test.tsx`

**Interfaces:**
- Consumes: `projects` from `../data/projects`, `Reveal` (Task 4).
- Produces:
  - `type Project = (typeof projects)[number]`
  - `ProjectCard({ project }: { project: Project })` — `<article>` with title h3, category, tagline, tech tags (`font-mono`), metrics `dl` (3 entries, values in amber mono), a details toggle button (`aria-expanded`, `aria-controls`), and a "View repository" link rendered ONLY when `project.repoLink` exists. Expanded panel shows `description` + `highlight`. Hover lift (`y: -4`) disabled under reduced motion.
  - `Work()` — `<section id="work" aria-labelledby="work-heading">`, heading "Selected work", subtitle, the four cards stacked full-width (single column — not a card grid), each wrapped in `Reveal`.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import App from "../App";

function workRegion() {
  return screen.getByRole("region", { name: "Selected work" });
}

test("renders all four projects as stacked articles", () => {
  render(<App />);
  const region = workRegion();
  expect(within(region).getByRole("heading", { level: 2, name: "Selected work" })).toBeInTheDocument();
  const articles = within(region).getAllByRole("article");
  expect(articles).toHaveLength(4);
  expect(within(region).getByRole("heading", { name: "IntelRouter" })).toBeInTheDocument();
  expect(within(region).getByRole("heading", { name: /Quantum Cryptography/ })).toBeInTheDocument();
});

test("shows repository links only where repoLink exists", () => {
  render(<App />);
  const region = workRegion();
  const intel = within(region).getByRole("heading", { name: "IntelRouter" }).closest("article")!;
  expect(intel.querySelector('a[href="https://github.com/VA-SA-NT-H/intelrouter"]')).not.toBeNull();
  const quantum = within(region).getByRole("heading", { name: /Quantum Cryptography/ }).closest("article")!;
  expect(quantum.querySelector("a")).toBeNull();
});

test("expands and collapses project details", async () => {
  const user = userEvent.setup();
  render(<App />);
  const region = workRegion();
  const intel = within(region).getByRole("heading", { name: "IntelRouter" }).closest("article")!;
  const button = within(intel).getByRole("button", { name: "Show details" });
  expect(button).toHaveAttribute("aria-expanded", "false");
  expect(within(intel).queryByText(/ML-powered routing engine/)).toBeNull();

  await user.click(button);
  expect(within(intel).getByText(/ML-powered routing engine/)).toBeInTheDocument();
  expect(within(intel).getByText(/Reduced AI inference costs/)).toBeInTheDocument();
  expect(within(intel).getByRole("button", { name: "Hide details" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );

  await user.click(within(intel).getByRole("button", { name: "Hide details" }));
  expect(within(intel).queryByText(/ML-powered routing engine/)).toBeNull();
});

test("renders metrics and tech tags", () => {
  render(<App />);
  const region = workRegion();
  const intel = within(region).getByRole("heading", { name: "IntelRouter" }).closest("article")!;
  expect(within(intel).getByText("Dynamic")).toBeInTheDocument();
  expect(within(intel).getByText("Redis")).toBeInTheDocument();
  const quantum = within(region).getByRole("heading", { name: /Quantum Cryptography/ }).closest("article")!;
  expect(within(quantum).getByText("15/15")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — region "Selected work" not found

- [ ] **Step 3: Write `src/components/ProjectCard.tsx`**

```tsx
import { motion } from "motion/react";
import { useState } from "react";
import type { projects } from "../../data/projects";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export type Project = (typeof projects)[number];

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const detailId = `project-${project.id}-detail`;

  return (
    <motion.article
      className="border border-white/10 bg-panel p-6 sm:p-8"
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl font-semibold">{project.title}</h3>
        <span className="text-sm text-muted">{project.category}</span>
      </div>
      <p className="mt-1 text-entangle">{project.tagline}</p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
        {project.technologies.map((tech) => (
          <li key={tech} className="border border-white/10 px-2 py-0.5 font-mono text-xs text-muted">
            {tech}
          </li>
        ))}
      </ul>

      <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
        {project.metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="text-xs text-muted">{metric.label}</dt>
            <dd className="font-mono text-lg text-measure">{metric.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => setOpen((value) => !value)}
          className="text-sm text-entangle underline-offset-4 hover:underline"
        >
          {open ? "Hide details" : "Show details"}
        </button>
        {project.repoLink && (
          <a
            href={project.repoLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            View repository
          </a>
        )}
      </div>

      {open && (
        <div id={detailId} className="mt-4 border-t border-white/10 pt-4">
          <p className="text-sm leading-relaxed text-muted">{project.description}</p>
          <p className="mt-2 text-sm text-ink">{project.highlight}</p>
        </div>
      )}
    </motion.article>
  );
}
```

- [ ] **Step 4: Write `src/components/Work.tsx`**

```tsx
import { projects } from "../../data/projects";
import { Reveal } from "./Reveal";
import { ProjectCard } from "./ProjectCard";

export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6"
    >
      <Reveal>
        <h2 id="work-heading" className="font-display text-3xl font-semibold sm:text-4xl">
          Selected work
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Four systems — what they do, what they are built with, and the results they produced.
        </p>
      </Reveal>
      <div className="mt-10 flex flex-col gap-6">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.05}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: Work tests PASS

- [ ] **Step 6: Wire into `src/App.tsx`** — add `<Work />` after `<Hero />` inside `<main>`.

- [ ] **Step 7: Run full suite**

Run: `npm test`
Expected: PASS — all tests

- [ ] **Step 8: Commit**

```bash
git add src/components/Work.tsx src/components/ProjectCard.tsx src/components/Work.test.tsx src/App.tsx
git commit -m "feat: add work section with expandable project cards"
```

---

### Task 9: Research section (light-inverted, count-up metrics)

**Files:**
- Create: `src/components/Research.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/Research.test.tsx`

**Interfaces:**
- Consumes: `experience` from `../data/experience`, `Reveal`, `useCountUp` (Task 4).
- Produces: `Research()` — `<section id="research" aria-labelledby="research-heading">` with `bg-paper text-night` (the one light section), heading "Research", `experience.role` h3, `experience.organization · experience.duration`, three count-up achievements (parse leading integer from `experience.achievements[].value`, keep trailing `+`), and the five `experience.highlights` as a list. Count-ups use `useCountUp` (so reduced motion jumps to final).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, waitFor, within } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

function researchRegion() {
  return screen.getByRole("region", { name: "Research" });
}

test("renders the IIST internship details in a light-inverted section", () => {
  render(<App />);
  const region = researchRegion();
  expect(region).toHaveClass("bg-paper", "text-night");
  expect(within(region).getByRole("heading", { level: 2, name: "Research" })).toBeInTheDocument();
  expect(within(region).getByRole("heading", { name: "Summer Research Intern" })).toBeInTheDocument();
  expect(
    within(region).getByText(
      "Indian Institute of Space Science & Technology · Jun 2025 – Jul 2025",
    ),
  ).toBeInTheDocument();
});

test("lists all five research highlights", () => {
  render(<App />);
  const region = researchRegion();
  expect(within(region).getByText(/hybrid E91 QKD \+ Chaos \+ AES-256/i)).toBeInTheDocument();
  expect(within(region).getByText(/BITXOR fusion/i)).toBeInTheDocument();
  expect(within(region).getByText(/Passed all 15 NIST Statistical Test Suite validations/)).toBeInTheDocument();
  expect(within(region).getByText(/BB84\+Chaos/i)).toBeInTheDocument();
  expect(within(region).getByText(/NPCR, UACI, PSNR, MSE, and MAE/)).toBeInTheDocument();
});

test("counts the achievement metrics up to their targets", async () => {
  render(<App />);
  const region = researchRegion();
  await waitFor(() => expect(within(region).getByText("15+")).toBeInTheDocument(), {
    timeout: 3000,
  });
  await waitFor(() => expect(within(region).getByText("8+")).toBeInTheDocument(), {
    timeout: 3000,
  });
  await waitFor(() => expect(within(region).getByText("1")).toBeInTheDocument(), {
    timeout: 3000,
  });
  expect(within(region).getByText("NIST Tests Passed")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — region "Research" not found

- [ ] **Step 3: Write `src/components/Research.tsx`**

```tsx
import { experience } from "../../data/experience";
import { useCountUp } from "../hooks/useCountUp";
import { Reveal } from "./Reveal";

function Achievement({ value, label }: { value: string; label: string }) {
  const target = parseInt(value, 10);
  const suffix = value.endsWith("+") ? "+" : "";
  const { ref, value: current } = useCountUp(target, 800);

  return (
    <div>
      <span ref={ref} className="font-display text-4xl font-bold text-night">
        {current}
        {suffix}
      </span>
      <p className="mt-1 text-sm text-night/70">{label}</p>
    </div>
  );
}

export function Research() {
  return (
    <section id="research" aria-labelledby="research-heading" className="bg-paper text-night">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <h2 id="research-heading" className="font-display text-3xl font-semibold sm:text-4xl">
            Research
          </h2>
          <p className="mt-2 max-w-2xl text-night/70">
            Quantum-secure image encryption, evaluated the way a paper would be: standards,
            metrics, and comparisons.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <h3 className="font-display text-2xl font-semibold">{experience.role}</h3>
            <p className="mt-1 text-night/70">
              {experience.organization} · {experience.duration}
            </p>
            <ul className="mt-6 space-y-3">
              {experience.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-night" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-3 gap-6 border-t border-night/15 pt-6">
              {experience.achievements.map((achievement) => (
                <Achievement
                  key={achievement.label}
                  value={achievement.value}
                  label={achievement.label}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: Research tests PASS

- [ ] **Step 5: Wire into `src/App.tsx`** — add `<Research />` after `<Work />`.

- [ ] **Step 6: Run full suite**

Run: `npm test`
Expected: PASS — all tests

- [ ] **Step 7: Commit**

```bash
git add src/components/Research.tsx src/components/Research.test.tsx src/App.tsx
git commit -m "feat: add light-inverted research section with count-up metrics"
```

---

### Task 10: Path (timeline) section

**Files:**
- Create: `src/components/Path.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/Path.test.tsx`

**Interfaces:**
- Consumes: `timeline` from `../data/portfolio`, `Reveal`.
- Produces: `Path()` — `<section id="path" aria-labelledby="path-heading">`, heading "Path", an `<ol>` of three `<li>` entries: period (plain text, NOT mono), title, organization (linked when `entry.link` exists). The entry with `end === null` gets an amber "Present" badge. A vertical rule with dots marks each entry; the current dot is amber, others cyan.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

function pathRegion() {
  return screen.getByRole("region", { name: "Path" });
}

test("renders three timeline entries in order", () => {
  render(<App />);
  const region = pathRegion();
  expect(within(region).getByRole("heading", { level: 2, name: "Path" })).toBeInTheDocument();
  expect(within(region).getAllByRole("listitem")).toHaveLength(3);
  expect(within(region).getByText("Nov 2022 — May 2026")).toBeInTheDocument();
  expect(within(region).getByText("Jun 2025 — Jul 2025")).toBeInTheDocument();
  expect(within(region).getByText("Sep 2026 — Present")).toBeInTheDocument();
});

test("marks the current role with a Present badge and links the organization", () => {
  render(<App />);
  const region = pathRegion();
  expect(within(region).getByText("Present")).toBeInTheDocument();
  const digiclarity = within(region).getByRole("link", {
    name: "Digiclarity Global Solutions Private Limited",
  });
  expect(digiclarity).toHaveAttribute("href", "https://www.digiclarity.in/");
  expect(within(region).queryByRole("link", { name: "Annamalai University" })).toBeNull();
});

test("shows the degree and internship titles", () => {
  render(<App />);
  const region = pathRegion();
  expect(within(region).getByText("B.E. Computer Science & Engineering")).toBeInTheDocument();
  expect(within(region).getByRole("heading", { name: "Software Engineer" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — region "Path" not found

- [ ] **Step 3: Write `src/components/Path.tsx`**

```tsx
import { timeline } from "../../data/portfolio";
import { Reveal } from "./Reveal";

export function Path() {
  return (
    <section
      id="path"
      aria-labelledby="path-heading"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6"
    >
      <Reveal>
        <h2 id="path-heading" className="font-display text-3xl font-semibold sm:text-4xl">
          Path
        </h2>
        <p className="mt-2 max-w-2xl text-muted">Education, research, and the role I am in now.</p>
      </Reveal>

      <ol className="mt-10 border-l border-white/10 pl-6 sm:pl-8">
        {timeline.map((entry) => {
          const current = entry.end === null;
          return (
            <li key={entry.start} className="relative pb-10 last:pb-0">
              <span
                aria-hidden="true"
                className={`absolute -left-[30px] top-1.5 h-3 w-3 rounded-full border-2 ${
                  current ? "border-measure bg-measure" : "border-entangle bg-void"
                }`}
              />
              <Reveal>
                <p className="text-sm text-muted">{entry.period}</p>
                <h3 className="mt-1 font-display text-xl font-semibold">
                  {entry.title}
                  {current && (
                    <span className="ml-2 align-middle border border-measure px-2 py-0.5 text-xs font-medium text-measure">
                      Present
                    </span>
                  )}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {entry.link ? (
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noreferrer"
                      className="underline-offset-4 hover:text-entangle hover:underline"
                    >
                      {entry.organization}
                    </a>
                  ) : (
                    entry.organization
                  )}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: Path tests PASS

- [ ] **Step 5: Wire into `src/App.tsx`** — add `<Path />` after `<Research />`.

- [ ] **Step 6: Run full suite**

Run: `npm test`
Expected: PASS — all tests

- [ ] **Step 7: Commit**

```bash
git add src/components/Path.tsx src/components/Path.test.tsx src/App.tsx
git commit -m "feat: add timeline path section with present-role marker"
```

---

### Task 11: Craft (skills + certifications strip)

**Files:**
- Create: `src/components/Craft.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/Craft.test.tsx`

**Interfaces:**
- Consumes: `skillGroups` from `../data/portfolio`, `certifications` from `../data/certifications`, `Reveal`.
- Produces: `Craft()` — `<section id="craft" aria-labelledby="craft-heading">`, heading "Craft", six skill-group columns (each: group title h3 + skill tags in `font-mono`), then a certifications strip: h3 "Certifications" + the four certifications as a four-column list with amber left borders.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

function craftRegion() {
  return screen.getByRole("region", { name: "Craft" });
}

test("renders all six skill groups", () => {
  render(<App />);
  const region = craftRegion();
  expect(within(region).getByRole("heading", { level: 2, name: "Craft" })).toBeInTheDocument();
  for (const title of ["Programming", "Backend", "Databases", "DevOps", "AI & ML", "Security"]) {
    expect(within(region).getByRole("heading", { name: title })).toBeInTheDocument();
  }
});

test("renders every skill and all four certifications", () => {
  render(<App />);
  const region = craftRegion();
  expect(within(region).getAllByRole("listitem")).toHaveLength(36);
  expect(within(region).getByText("Spring Boot")).toBeInTheDocument();
  expect(within(region).getByText("E91")).toBeInTheDocument();
  expect(within(region).getByRole("heading", { name: "Certifications" })).toBeInTheDocument();
  expect(within(region).getByText("Cloud Computing (NPTEL)")).toBeInTheDocument();
  expect(within(region).getByText("AI & Quantum Computing Mastery")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — region "Craft" not found

- [ ] **Step 3: Write `src/components/Craft.tsx`**

```tsx
import { certifications } from "../../data/certifications";
import { skillGroups } from "../../data/portfolio";
import { Reveal } from "./Reveal";

export function Craft() {
  return (
    <section
      id="craft"
      aria-labelledby="craft-heading"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6"
    >
      <Reveal>
        <h2 id="craft-heading" className="font-display text-3xl font-semibold sm:text-4xl">
          Craft
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Tools grouped by what they are for, and the certifications behind them.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <Reveal key={group.title}>
            <h3 className="font-display text-lg font-semibold text-ink">{group.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="border border-white/10 bg-panel px-2.5 py-1 font-mono text-xs text-muted"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 border-t border-white/10 pt-8">
        <h3 className="font-display text-lg font-semibold">Certifications</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((certification) => (
            <li key={certification} className="border-l-2 border-measure pl-3 text-sm text-ink">
              {certification}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: Craft tests PASS

- [ ] **Step 5: Wire into `src/App.tsx`** — add `<Craft />` after `<Path />`.

- [ ] **Step 6: Run full suite**

Run: `npm test`
Expected: PASS — all tests

- [ ] **Step 7: Commit**

```bash
git add src/components/Craft.tsx src/components/Craft.test.tsx src/App.tsx
git commit -m "feat: add craft section with skills and certifications strip"
```

---

### Task 12: Contact section + final App composition

**Files:**
- Create: `src/components/Contact.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/Contact.test.tsx`, `src/App.test.tsx` (extend)

**Interfaces:**
- Consumes: `portfolio` from `../data/portfolio`, `Reveal`.
- Produces:
  - `Contact()` — `<section id="contact" aria-labelledby="contact-heading">` on `bg-panel` with `mailto:` link, `tel:` link (spaces stripped: `+919344086105`), location text, GitHub link (`https://github.com/VA-SA-NT-H`).
  - Final `App`: skip link → `Header` → `main#main` containing Hero, Work, Research, Path, Craft, Contact in that order.

- [ ] **Step 1: Write the failing Contact test**

```tsx
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

function contactRegion() {
  return screen.getByRole("region", { name: "Contact" });
}

test("offers email, phone, location and GitHub", () => {
  render(<App />);
  const region = contactRegion();
  expect(within(region).getByRole("heading", { level: 2, name: "Contact" })).toBeInTheDocument();
  expect(within(region).getByRole("link", { name: "vasanthc.work@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:vasanthc.work@gmail.com",
  );
  expect(within(region).getByRole("link", { name: "+91 93440 86105" })).toHaveAttribute(
    "href",
    "tel:+919344086105",
  );
  expect(within(region).getByText("Tamil Nadu, India")).toBeInTheDocument();
  expect(
    within(region).getByRole("link", { name: "github.com/VA-SA-NT-H" }),
  ).toHaveAttribute("href", "https://github.com/VA-SA-NT-H");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — region "Contact" not found

- [ ] **Step 3: Write `src/components/Contact.tsx`**

```tsx
import { portfolio } from "../../data/portfolio";
import { Reveal } from "./Reveal";

const GITHUB = "https://github.com/VA-SA-NT-H";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="border-t border-white/10 bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <h2 id="contact-heading" className="font-display text-3xl font-semibold sm:text-4xl">
            Contact
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Building something secure, intelligent, or scalable? I would like to hear about it.
          </p>
          <address className="mt-8 flex flex-col gap-4 not-italic sm:flex-row sm:flex-wrap sm:gap-8">
            <a
              href={`mailto:${portfolio.email}`}
              className="underline-offset-4 hover:text-entangle hover:underline"
            >
              {portfolio.email}
            </a>
            <a
              href={`tel:${portfolio.phone.replace(/\s+/g, "")}`}
              className="underline-offset-4 hover:text-entangle hover:underline"
            >
              {portfolio.phone}
            </a>
            <span className="text-muted">{portfolio.location}</span>
            <a
              href={GITHUB}
              className="underline-offset-4 hover:text-entangle hover:underline"
            >
              github.com/VA-SA-NT-H
            </a>
          </address>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: Contact test PASS

- [ ] **Step 5: Write the failing composition tests** — replace `src/App.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "./App";

test("renders the app shell with a main landmark", () => {
  render(<App />);
  expect(screen.getByRole("main")).toBeInTheDocument();
});

test("orders the page hero, work, research, path, craft, contact", () => {
  render(<App />);
  const main = screen.getByRole("main");
  const ids = Array.from(main.querySelectorAll("section")).map((section) => section.id);
  expect(ids).toEqual(["top", "work", "research", "path", "craft", "contact"]);
});

test("provides skip link, banner and primary navigation landmarks", () => {
  render(<App />);
  expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  expect(screen.getByRole("main")).toHaveAttribute("id", "main");
});
```

- [ ] **Step 6: Run test to verify the composition tests fail**

Run: `npm test`
Expected: FAIL — skip link missing, section order incomplete

- [ ] **Step 7: Finalize `src/App.tsx`**

```tsx
import { Contact } from "./components/Contact";
import { Craft } from "./components/Craft";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Path } from "./components/Path";
import { Research } from "./components/Research";
import { Work } from "./components/Work";

export default function App() {
  return (
    <div className="min-h-svh bg-void font-body text-ink antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-measure focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <Research />
        <Path />
        <Craft />
        <Contact />
      </main>
    </div>
  );
}
```

- [ ] **Step 8: Run full suite**

Run: `npm test`
Expected: PASS — all tests

- [ ] **Step 9: Commit**

```bash
git add src/components/Contact.tsx src/components/Contact.test.tsx src/App.tsx src/App.test.tsx
git commit -m "feat: add contact section and finalize page composition"
```

---

### Task 13: Production build, QA checklist, README

**Files:**
- Create: `README.md`
- Verify: `npm run typecheck`, `npm test`, `npm run build`

**Interfaces:**
- Consumes: everything above.
- Produces: green typecheck + tests + production build in `dist/`; README documenting commands.

- [ ] **Step 1: Run typecheck**

Run: `npm run typecheck`
Expected: PASS — no errors

- [ ] **Step 2: Run full test suite**

Run: `npm test`
Expected: PASS — every test green

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: PASS — `dist/` emitted, no TS errors

- [ ] **Step 4: Manual QA checklist**

Run `npm run preview` and verify in a browser:

- At 1280px: sticky header visible; hero fills the viewport minus header; entanglement photons flow; moving the cursor across the hero shifts the diagram.
- At 768px: nav links still visible; sections single-column where specified.
- At 375px: menu button appears; opening it reveals five links; tapping one closes it; no horizontal scroll on any section.
- Keyboard: Tab reaches skip link first; activating it moves focus to `#main`; every link/button shows the cyan focus outline.
- OS "reduce motion" enabled (or DevTools rendering emulation): no photon animation, no scroll reveals (content visible immediately), counters show final values, smooth-scroll disabled.
- Research section is the only light section; all other sections are void navy.
- Each project card: "Show details" expands description + highlight; cards 1, 3, 4 show repository links; card 2 (Quantum Cryptography) shows none.

- [ ] **Step 5: Write `README.md`**

```md
# Vasanth C — Portfolio

Single-page animated portfolio. Built with Vite, React, TypeScript, Tailwind CSS 4, and Motion.

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
```

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: add readme with commands and content map"
```

- [ ] **Step 7: Final verification**

Run: `npm run typecheck && npm test && npm run build`
Expected: all three PASS in one go

---

## Self-Review Notes

- **Spec coverage:** palette/fonts/motion primitives (T3–T4), hero moment (T6–T7), Work centerpiece with missing-link handling (T8), light-inverted Research with count-ups (T9), Path with Present marker (T10), Craft + certifications strip (T11), Contact + GitHub + skip link + landmarks (T12), reduced-motion QA (T13), anti-goals enforced via Global Constraints (square panels, no eyebrows, no arrows, mono limited to tags/metrics).
- **Type consistency:** `Reveal({ children, delay?, className? })`, `useCountUp(target, duration?) → { ref, value }`, `usePrefersReducedMotion(): boolean`, `Project = (typeof projects)[number]` — used identically in every task.
- **Placeholders:** none; every step carries runnable code or exact commands.


---

# Redesign: Digital Engineering Laboratory (ui-taste)

Direction contract (development-only):
- Thesis: portfolio as an engineer's live instrument bench; every section its own asymmetric composition — no identical card grids, no centered hero.
- Palette roles: ground #070B18 / panels #0E1526 / charcoal #0A0D16; electric blue #4C7DFF = interaction accent (CTAs, focus, active nav); cyan #35D6E8 = data & signal (metrics, photons, diagram); violet #8B5CF6 = atmosphere only (glows, never text/controls); cool grey family #8A93AD. Amber/teal retired.
- Type: Space Grotesk display / Inter body / IBM Plex Mono only for tech tags + metric values.
- Signature: fine technical grid + violet atmospheric glow; cursor-reactive nodal hero visualization; scroll-linked active nav indicator.
- Authority: Replace (user-approved redesign). Product truth, data/*.ts, links, and the 30-test contract preserved; no résumé or live-demo links invented.
- Finish: typecheck + tests + build green; browser captures at 375/768/1440 compared to generated target; reduced-motion + keyboard checks.
