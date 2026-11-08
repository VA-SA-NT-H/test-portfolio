import { useMotionValue, useSpring } from "motion/react";
import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { SPRING } from "../motion/presets";

/** Distance the pointer must travel before pull re-engages after a leave. */
const REENTRY = 4;

/**
 * Magnetic pull for actions: the wrapper stays put so the offset is
 * always measured against the resting position. Springs back on exit
 * and does nothing under prefers-reduced-motion.
 *
 * Re-entry guard: after a leave, pull stays disarmed until the pointer
 * has genuinely moved REENTRY px. Without it, the spring-back can carry
 * the element under a stationary pointer, which re-triggers the pull
 * and oscillates at rest boundaries.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.magnet);
  const springY = useSpring(y, SPRING.magnet);
  const ref = useRef<T>(null);

  const armed = useRef(true);
  const leaveX = useRef(0);
  const leaveY = useRef(0);

  const onPointerMove = (event: ReactPointerEvent<T>) => {
    if (reduced) return;
    const element = ref.current;
    if (!element) return;

    if (!armed.current) {
      const dx = event.clientX - leaveX.current;
      const dy = event.clientY - leaveY.current;
      if (Math.hypot(dx, dy) < REENTRY) return;
      armed.current = true;
    }

    const rect = element.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onPointerLeave = (event: ReactPointerEvent<T>) => {
    armed.current = false;
    leaveX.current = event.clientX;
    leaveY.current = event.clientY;
    x.set(0);
    y.set(0);
  };

  return { ref, style: { x: springX, y: springY }, onPointerMove, onPointerLeave };
}
