import { useCountUp } from "../hooks/useCountUp";

interface StatProps {
  /** Raw value from data, e.g. "15+", "8", "4" */
  value: string;
  label: string;
  /** "dark" = on light sections (Research), default = on dark sections */
  tone?: "dark" | "default";
}

/**
 * A single count-up metric. Animates from zero when scrolled into view,
 * jumps straight to the target under prefers-reduced-motion.
 */
export function Stat({ value, label, tone = "default" }: StatProps) {
  const target = parseInt(value, 10);
  const suffix = value.endsWith("+") ? "+" : "";
  const { ref, value: current } = useCountUp(target, 800);

  return (
    <div>
      <span
        ref={ref}
        className={`font-display text-4xl font-bold sm:text-5xl ${
          tone === "dark" ? "text-night" : "text-signal"
        }`}
      >
        {current}
        {suffix}
      </span>
      <p className={`mt-1 text-sm ${tone === "dark" ? "text-night/70" : "text-muted"}`}>
        {label}
      </p>
    </div>
  );
}
