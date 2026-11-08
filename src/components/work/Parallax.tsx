import { motion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface ParallaxProps {
  children: ReactNode;
  /** Peak drift in px, from entering to leaving the viewport. */
  amount?: number;
  className?: string;
}

/**
 * Quiet depth: the child drifts against its editorial column as the
 * block crosses the viewport. Transform only — no layout, no repaint —
 * and fully static under prefers-reduced-motion.
 */
export function Parallax({ children, amount = 18, className }: ParallaxProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
