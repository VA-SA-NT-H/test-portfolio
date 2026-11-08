import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { DUR, EASE_OUT, EASE_WIPE } from "../../motion/presets";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { ACCENT_BY_ID, ACCENT_BG } from "./bits";
import { CaseStudy } from "./CaseStudy";
import type { Project } from "./types";

interface CaseOverlayProps {
  /** Full, unfiltered project order — prev/next walk the whole set. */
  projects: Project[];
  /** Position of the open project inside `projects`. */
  position: number;
  onNavigate: (position: number) => void;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The case-study viewer: a full-viewport panel that wipes up over
 * the page, traps focus, locks body scroll and restores both on
 * close. Prev/next cross-fade the narrative in place (mode="wait"),
 * so moving between cases reads as one continuous move rather than
 * a close-and-reopen.
 */
export function CaseOverlay({ projects, position, onNavigate, onClose }: CaseOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();

  const project = projects[position];
  const prevPosition = (position - 1 + projects.length) % projects.length;
  const nextPosition = (position + 1) % projects.length;
  const accent = ACCENT_BY_ID[project.id] ?? "lime";

  // Keep the latest close handler without re-running the trap effect.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const root = panelRef.current;
      if (!root) return;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && root.contains(active);

      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  // Each case starts at its own top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [position, reduced]);

  const jump = (target: number) => () => onNavigate(target);

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Case study: ${project.title}`}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: DUR.wipe, ease: EASE_WIPE }}
      className="fixed inset-0 z-[92] flex flex-col bg-paper"
    >
      {/* ── Bar ─────────────────────────────────────────── */}
      <div className="surface-ink flex shrink-0 items-center justify-between gap-4 border-b-2 border-ink bg-ink px-4 py-3 text-paper sm:px-6">
        <span className="flex min-w-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] sm:text-[11px]">
          <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 shrink-0 ${ACCENT_BG[accent]}`} />
          <span className="shrink-0 text-concrete">
            {String(position + 1).padStart(2, "0")} / Case study
          </span>
          <span className="hidden truncate border border-paper/40 px-2 py-1 text-concrete md:inline">
            {project.category}
          </span>
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={jump(prevPosition)}
            aria-label="Previous case study"
            className="border border-paper/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-200 hover:border-lime hover:bg-lime hover:text-ink sm:px-4"
          >
            ←<span className="ml-2 hidden sm:inline">Prev</span>
          </button>
          <button
            type="button"
            onClick={jump(nextPosition)}
            aria-label="Next case study"
            className="border border-paper/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-200 hover:border-lime hover:bg-lime hover:text-ink sm:px-4"
          >
            <span className="mr-2 hidden sm:inline">Next</span>→
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close case study (Escape)"
            className="border border-lime bg-lime px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:bg-ink hover:text-lime sm:px-4"
          >
            Close ✕<span className="ml-2 hidden text-[9px] opacity-70 sm:inline">Esc</span>
          </button>
        </div>
      </div>

      {/* ── Scrolling narrative ─────────────────────────── */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-paper">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: reduced ? 0 : DUR.base, ease: EASE_OUT }}
          >
            <CaseStudy
              project={project}
              index={String(position + 1).padStart(2, "0")}
            />

            {/* ── Continue through the gallery ───────────── */}
            <nav
              aria-label="Case study navigation"
              className="shell grid gap-4 border-t-2 border-ink py-10 sm:grid-cols-2"
            >
              <button
                type="button"
                onClick={jump(prevPosition)}
                className="group/jump border-2 border-ink p-5 text-left transition-colors duration-300 hover:bg-ink hover:text-paper"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate transition-colors duration-300 group-hover/jump:text-lime">
                  ← Previous case
                </span>
                <span className="mt-2 block font-display text-base uppercase leading-tight tracking-tight sm:text-lg">
                  {projects[prevPosition].title}
                </span>
              </button>
              <button
                type="button"
                onClick={jump(nextPosition)}
                className="group/jump border-2 border-ink p-5 text-right transition-colors duration-300 hover:bg-ink hover:text-paper"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate transition-colors duration-300 group-hover/jump:text-lime">
                  Next case →
                </span>
                <span className="mt-2 block font-display text-base uppercase leading-tight tracking-tight sm:text-lg">
                  {projects[nextPosition].title}
                </span>
              </button>
            </nav>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
