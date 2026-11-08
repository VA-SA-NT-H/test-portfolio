import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { portfolio } from "../../data/portfolio";
import { useActiveSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { DUR, EASE_OUT, EASE_WIPE, SPRING } from "../motion/presets";
import { SECTION_IDS, SECTIONS } from "../sections";
import { GITHUB } from "../links";

/**
 * A hard black band pinned to the top: numbered mono nav with a lime
 * block for the active section, a scroll-progress rule along its base,
 * and a full-screen oversized menu on mobile. The menu traps scroll,
 * closes on Escape, and restores focus.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const reduced = usePrefersReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  /* Page progress → a 2px lime rule drawing across the header base */
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  /* Lock the page behind the overlay */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* Escape closes and hands focus back to the toggle */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-ink bg-ink text-paper">
        {/* Scroll progress — transform-only, sits on the bottom border */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: reduced ? 0 : progressX }}
          className="absolute inset-x-0 bottom-[-2px] h-0.5 origin-left bg-lime"
        />
        <div className="shell flex h-14 items-center justify-between gap-4 md:h-16">
          <a
            href="#top"
            className="font-display text-lg tracking-tight text-paper transition-colors hover:text-lime md:text-xl"
          >
            VC<span className="text-lime">/</span>
            <span className="sr-only">Back to top</span>
          </a>

          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-concrete lg:inline">
            Java Full Stack — Tamil Nadu, India
          </span>

          <nav aria-label="Primary" className="flex items-center gap-3">
            <ul className="hidden items-center gap-1 md:flex">
              {SECTIONS.map((section) => {
                const isActive = active === section.id;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative block px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                        isActive ? "text-ink" : "text-paper/75 hover:text-lime"
                      }`}
                    >
                      {/* Shared lime block — glides between items via layout animation */}
                      {isActive && (
                        <motion.span
                          aria-hidden="true"
                          layoutId="nav-indicator"
                          transition={SPRING.nav}
                          className="absolute inset-0 bg-lime"
                        />
                      )}
                      <span className="relative">
                        <span className={`mr-1.5 ${isActive ? "opacity-60" : "opacity-45"}`}>
                          {section.index}
                        </span>
                        {section.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <button
              ref={toggleRef}
              type="button"
              className="border border-paper/50 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-colors hover:bg-lime hover:text-ink md:hidden"
              aria-expanded={open}
              aria-controls="menu-overlay"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="menu-overlay"
            className="surface-ink fixed inset-0 z-[90] flex flex-col bg-ink text-paper md:hidden"
            initial={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: DUR.base, ease: EASE_WIPE }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="shell flex h-14 items-center justify-between border-b border-paper/25 md:h-16">
              <span className="font-display text-lg">
                VC<span className="text-lime">/</span>
              </span>
              <button
                type="button"
                className="border border-paper/50 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:bg-lime hover:text-ink"
                onClick={() => setOpen(false)}
              >
                Close ×
              </button>
            </div>

            <nav aria-label="Sections" className="shell flex flex-1 flex-col justify-center py-8">
              <ul className="flex flex-col">
                {SECTIONS.map((section, index) => (
                  <li key={section.id} className="border-b border-paper/20 first:border-t">
                    <motion.a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={`#${section.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 py-4 transition-colors hover:text-lime"
                      initial={reduced ? false : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18 + index * 0.06, duration: DUR.base, ease: EASE_OUT }}
                    >
                      <span className="font-mono text-xs text-lime">{section.index}</span>
                      <span className="font-display text-[clamp(2.25rem,12vw,3.5rem)] uppercase leading-none tracking-[-0.02em]">
                        {section.label}
                      </span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="shell flex flex-wrap items-center justify-between gap-3 border-t border-paper/25 py-5 font-mono text-[11px] uppercase tracking-[0.2em] text-concrete">
              <a href={`mailto:${portfolio.email}`} className="transition-colors hover:text-lime">
                Email
              </a>
              <a href={GITHUB} target="_blank" rel="noreferrer" className="transition-colors hover:text-lime">
                GitHub ↗
              </a>
              <span>Tamil Nadu, India</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
