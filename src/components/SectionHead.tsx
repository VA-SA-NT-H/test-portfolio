import { motion } from "motion/react";
import { cue, DUR, EASE_OUT, VIEWPORT } from "../motion/presets";
import { MaskText } from "./MaskText";

interface SectionHeadProps {
  /** Section number, e.g. "02". */
  index: string;
  title: string;
  /** Small mono descriptor that sits beside the number. */
  kicker: string;
  /** Right-aligned mono note (counts, dates, status). */
  meta?: string;
  /** Wired to the h2 so the section can reference it via aria-labelledby. */
  headingId?: string;
}

/**
 * The shared editorial masthead: registration mark + number + kicker,
 * then an oversized display title that reveals character by character.
 * Every section opens on the same beat — the kicker row fades in as
 * the title starts rising, and the rule beneath draws itself in.
 * Inherits its colors from the section surface it sits on.
 */
export function SectionHead({ index, title, kicker, meta, headingId }: SectionHeadProps) {
  return (
    <header className="relative pb-5">
      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-[0.26em] sm:text-[11px]"
      >
        <motion.span variants={cue(0)} className="flex items-center gap-3">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 bg-current" />
          <span>
            {index} / {kicker}
          </span>
        </motion.span>
        {meta && (
          <motion.span variants={cue(0.05)} className="opacity-55">
            {meta}
          </motion.span>
        )}
      </motion.div>

      <h2
        id={headingId}
        className="mt-4 font-display text-[clamp(2.6rem,9.5vw,8rem)] uppercase leading-[0.85] tracking-[-0.025em]"
      >
        <MaskText text={title} stagger={0.035} />
      </h2>

      {/* Rule draws in as the title finishes rising */}
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: DUR.wipe, ease: EASE_OUT, delay: 0.15 }}
        className="absolute inset-x-0 bottom-0 block h-0.5 origin-left bg-current"
      />
    </header>
  );
}
