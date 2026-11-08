import type { CSSProperties } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface MarqueeProps {
  items: readonly string[];
  /** Loop length in seconds. */
  duration?: number;
  /** Color of the square glyph placed between items. */
  squareClass?: string;
}

/**
 * Kinetic ticker band. The track holds two identical copies and slides
 * by exactly one copy width, so the loop is seamless. Static under
 * prefers-reduced-motion and hidden from assistive tech — the same
 * words exist as real content elsewhere on the page.
 */
export function Marquee({ items, duration = 38, squareClass = "bg-lime" }: MarqueeProps) {
  const reduced = usePrefersReducedMotion();

  const copy = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap px-5 font-mono text-[11px] uppercase tracking-[0.3em] sm:px-7 sm:text-xs">
            {item}
          </span>
          <span aria-hidden="true" className={`inline-block h-2 w-2 shrink-0 ${squareClass}`} />
        </span>
      ))}
    </div>
  );

  const style: CSSProperties | undefined = reduced
    ? { animation: "none" }
    : ({ "--marquee-duration": `${duration}s` } as CSSProperties);

  return (
    <div className="overflow-hidden py-3" aria-hidden="true">
      <div className="marquee-track" style={style}>
        {copy("a")}
        {copy("b")}
      </div>
    </div>
  );
}
