import type { Variants } from "motion/react";

/**
 * The site's motion language, in one place.
 *
 * Two curves only: quint-out for everything that rises or responds,
 * quint-in-out for the panel wipes (curtain, menu, section sheets).
 * Durations ladder from micro feedback up to deliberate display moves.
 */

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_WIPE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const DUR = {
  /** Cursor growth, tap feedback, chip hovers. */
  micro: 0.2,
  /** The standard entrance: fade + rise, block reveals. */
  base: 0.6,
  /** Display type rising out of its mask. */
  slow: 0.85,
  /** Full-screen panel wipes. */
  wipe: 0.75,
  /** The timeline spine drawing itself. */
  draw: 1.4,
} as const;

/** Shared whileInView trigger — one threshold for every scroll entrance. */
export const VIEWPORT = { once: true, margin: "-70px" } as const;

export const SPRING = {
  /** Magnetic pull on the big calls to action. */
  magnet: { stiffness: 260, damping: 18, mass: 0.4 },
  /** Drafting-square cursor — near-instant, barely any overshoot. */
  cursor: { stiffness: 900, damping: 50, mass: 0.35 },
  /** Header nav indicator gliding between sections. */
  nav: { type: "spring", stiffness: 380, damping: 34 },
} as const;

/**
 * Load sequence. The curtain and the hero choreography share this
 * timeline so the hand-off reads as one motion instead of two events.
 */
export const INTRO = {
  curtainDelay: 0.25,
  curtainDuration: 0.7,
  /** Hero entrance begins while the curtain is still lifting. */
  heroStart: 0.45,
} as const;

/** Standard entrance cue: fade in while rising 22px. */
export const cue = (delay: number, duration = DUR.base): Variants => ({
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration, ease: EASE_OUT, delay } },
});

/** Container for lists that should enter as one sequence. */
export const staggerGroup = (step = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});

/** Child of staggerGroup: a short, quiet rise. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE_OUT } },
};
