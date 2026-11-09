import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { DUR, EASE_OUT, VIEWPORT } from "../motion/presets";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Adds a backward tilt under perspective as the block rises —
   *  used only for the framed blueprint panels in Work. */
  depth?: boolean;
}

/**
 * Section entrance: the block rises out of its own mask — the same
 * verb as MaskText, at block scale, using transform + opacity only
 * (no clip-path, so no per-frame repaint of the whole subtree).
 *
 * The observed wrapper keeps its full layout box (transforms don't
 * change layout), so IntersectionObserver always has a real area and
 * there is never a layout shift. The inner pane is what moves.
 * `focus-within` lifts the clip while a child has keyboard focus so
 * focus rings near the wrapper edges are never cut off.
 */
export function Reveal({ children, delay = 0, className, depth = false }: RevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div data-reveal="static" className={className}>
        {children}
      </div>
    );
  }

  const classes = `overflow-hidden focus-within:overflow-visible${className ? ` ${className}` : ""}`;

  return (
    <motion.div
      data-reveal="motion"
      className={classes}
      style={depth ? { perspective: "1200px" } : undefined}
      variants={{ hidden: {}, show: {} }}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: "115%", rotateX: depth ? 9 : 0 },
          show: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { duration: DUR.base, ease: EASE_OUT, delay },
          },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
