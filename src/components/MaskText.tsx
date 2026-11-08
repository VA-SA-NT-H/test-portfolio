import { motion, type Variants } from "motion/react";
import { Fragment } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { DUR, EASE_OUT, VIEWPORT } from "../motion/presets";

/** One unit rising out of its own mask. */
const riseAt = (delay: number): Variants => ({
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: DUR.slow, ease: EASE_OUT, delay } },
});

interface MaskTextProps {
  text: string;
  className?: string;
  /** Base delay before the first unit starts rising. */
  delay?: number;
  /** Gap between units, in seconds. */
  stagger?: number;
  /** Animate on mount (hero) instead of on scroll into view. */
  immediate?: boolean;
  /** Reveal whole words instead of single characters. */
  granularity?: "char" | "word";
}

/**
 * Character-by-character masked reveal: each glyph sits in its own
 * overflow-hidden box and rises into place. Words stay unbreakable,
 * and the whole string keeps a single accessible label.
 *
 * The observer lives on the word wrapper, never on the glyph: a glyph
 * translated out of its mask box is fully clipped by the ancestor's
 * overflow, and IntersectionObserver reports a clipped target as never
 * intersecting — whileInView would never fire. The wrapper stays put,
 * so it intersects reliably and propagates its variant to the glyphs.
 */
export function MaskText({
  text,
  className,
  delay = 0,
  stagger = 0.04,
  immediate = false,
  granularity = "char",
}: MaskTextProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");
  let unit = 0;

  return (
    <span className={className} aria-label={text}>
      {words.map((word, wordIndex) => {
        const units = granularity === "word" ? [word] : word.split("");
        return (
          <Fragment key={`${word}-${wordIndex}`}>
            <motion.span
              className="inline-block whitespace-nowrap"
              aria-hidden="true"
              variants={{ hidden: {}, show: {} }}
              initial="hidden"
              animate={immediate ? "show" : undefined}
              whileInView={immediate ? undefined : "show"}
              viewport={immediate ? undefined : VIEWPORT}
            >
              {units.map((piece, pieceIndex) => {
                const cue = delay + unit * stagger;
                unit += 1;
                return (
                  <span
                    key={`${piece}-${pieceIndex}`}
                    className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom"
                  >
                    <motion.span className="inline-block" variants={riseAt(cue)}>
                      {piece}
                    </motion.span>
                  </span>
                );
              })}
            </motion.span>
            {/* The gap lives *between* word boxes: a trailing space
                inside an inline-block is trimmed, which collapsed
                "Selected Work" into "SelectedWork" on one line. */}
            {wordIndex < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </span>
  );
}
