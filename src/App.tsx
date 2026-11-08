import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useState } from "react";
import { DUR, EASE_OUT, EASE_WIPE, INTRO } from "./motion/presets";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Craft } from "./components/Craft";
import { Cursor } from "./components/Cursor";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { IndexRail } from "./components/IndexRail";
import { Path } from "./components/Path";
import { Research } from "./components/Research";
import { Work } from "./components/Work";

/**
 * One-time curtain: an ink panel with the monogram lifts away on load.
 * It never blocks pointer events and always unmounts — a timeout is
 * the safety net in case the animation never reports completion.
 */
function Curtain() {
  const [visible, setVisible] = useState(
    () =>
      typeof window.matchMedia === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (!visible) return;
    const fallback = window.setTimeout(() => setVisible(false), 2200);
    return () => window.clearTimeout(fallback);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          initial={{ y: 0 }}
          animate={{ y: "-101%" }}
          exit={{ y: "-101%" }}
          transition={{ duration: INTRO.curtainDuration, delay: INTRO.curtainDelay, ease: EASE_WIPE }}
          onAnimationComplete={() => setVisible(false)}
        >
          <motion.span
            className="font-display text-[14vw] leading-none text-paper"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
          >
            VC<span className="text-lime">/</span>
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  // Deep links (#work, #research, …) arrive before React mounts, so the
  // browser's own fragment scroll finds nothing — honor the hash once
  // rendered, then again after webfonts swap: the font change shifts text
  // heights, and without the second pass the target lands off-target.
  useEffect(() => {
    const target = window.location.hash.slice(1);
    if (!target) return;
    const element = document.getElementById(target);
    if (!element) return;

    const align = () => element.scrollIntoView();
    align();

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) align();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-paper font-body text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:border-2 focus:border-lime focus:bg-ink focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-lime"
        >
          Skip to content
        </a>

        <Curtain />
        <Header />
        <IndexRail />

        <main id="main">
          <Hero />
          <About />
          <Work />
          <Research />
          <Path />
          <Craft />
          <Contact />
        </main>

        <Cursor />
      </div>
    </MotionConfig>
  );
}
