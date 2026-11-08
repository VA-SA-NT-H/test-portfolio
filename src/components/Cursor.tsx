import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { DUR, EASE_OUT, SPRING } from "../motion/presets";

const INTERACTIVE = "a, button, [data-cursor]";

/** Base box; idle scale shrinks it to the 12px resting dot. */
const SIZE = 42;
const IDLE_SCALE = 12 / SIZE;

/**
 * A drafting-square cursor that inverts against whatever it crosses
 * (mix-blend-difference). It only appears on fine pointers, never
 * replaces the native cursor, and stays out of the way entirely under
 * prefers-reduced-motion.
 */
export function Cursor() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 900, damping: 50, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 900, damping: 50, mass: 0.35 });

  useEffect(() => {
    if (reduced) return;
    if (typeof window.matchMedia !== "function") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target;
      setActive(target instanceof Element && target.closest(INTERACTIVE) !== null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[95] mix-blend-difference"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 border-2 border-white bg-white"
        initial={false}
        animate={{
          scale: active ? 1 : IDLE_SCALE,
          backgroundColor: active ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)",
        }}
        transition={{
          scale: SPRING.cursor,
          backgroundColor: { duration: DUR.micro, ease: EASE_OUT },
        }}
        style={{ width: SIZE, height: SIZE }}
      />
    </motion.div>
  );
}
