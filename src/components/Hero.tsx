import { motion, type Variants } from "motion/react";
import { portfolio } from "../../data/portfolio";
import { GITHUB } from "../links";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { EntanglementDiagram } from "./EntanglementDiagram";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const roles = portfolio.role
    .split("|")
    .map((part) => part.trim())
    .join(" · ");

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden lab-grid"
    >
      <div aria-hidden="true" className="glow-field pointer-events-none absolute inset-0" />

      {/* Signature visual: bleeds off the right edge, sits behind content */}
      <EntanglementDiagram className="absolute inset-y-0 right-0 h-full w-full text-signal opacity-50 sm:w-[70%] sm:opacity-80" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 sm:px-6"
        variants={container}
        initial={reduced ? false : "hidden"}
        animate="show"
      >
        <motion.h1
          id="hero-title"
          variants={item}
          className="max-w-[14ch] font-display text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
        >
          {portfolio.name}
        </motion.h1>

        <motion.p variants={item} className="mt-5 text-lg text-accent sm:text-xl">
          {roles}
        </motion.p>

        <motion.p variants={item} className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
          {portfolio.tagline}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="bg-signal px-6 py-3 font-medium text-void transition-transform hover:-translate-y-0.5"
          >
            View work
          </a>
          <a
            href="#contact"
            className="border border-accent px-6 py-3 font-medium text-accent transition-colors hover:bg-accent/10"
          >
            Get in touch
          </a>
          <a
            href={GITHUB}
            className="text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            GitHub
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      {!reduced && (
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 h-10 w-px -translate-x-1/2 overflow-hidden bg-white/20"
        >
          <motion.span
            className="absolute left-0 top-0 block h-3 w-px bg-signal"
            animate={{ y: [-12, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}
    </section>
  );
}
