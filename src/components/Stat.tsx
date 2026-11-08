import { useCountUp } from "../hooks/useCountUp";

interface StatProps {
  /** Raw value from data, e.g. "15+", "8", "4" */
  value: string;
  label: string;
  /** "ink" = dark text on light/lime surfaces, "paper" = light text on ink */
  tone?: "ink" | "paper";
}

/**
 * A single oversized metric with a mono caption rule beneath it.
 * Counts up when scrolled into view, jumps straight to the target
 * under prefers-reduced-motion.
 */
export function Stat({ value, label, tone = "ink" }: StatProps) {
  const target = parseInt(value, 10);
  const suffix = value.endsWith("+") ? "+" : "";
  const { ref, value: current } = useCountUp(target, 900);

  const numberClass = tone === "ink" ? "text-ink" : "text-paper";
  const ruleClass = tone === "ink" ? "border-ink/30 text-slate" : "border-paper/30 text-concrete";

  return (
    <div className="flex flex-col">
      <span
        ref={ref}
        className={`font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-none tracking-[-0.03em] tabular-nums ${numberClass}`}
      >
        {current}
        {suffix}
      </span>
      <span
        className={`mt-3 border-t-2 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:text-[11px] ${ruleClass}`}
      >
        {label}
      </span>
    </div>
  );
}
