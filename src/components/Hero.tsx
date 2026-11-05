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
  const roles = portfolio.role
    .split("|")
    .map((part) => part.trim())
    .join(" · ");

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
          <a
            href={GITHUB}
            className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            GitHub
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
