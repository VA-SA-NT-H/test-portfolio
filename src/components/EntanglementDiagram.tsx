import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const photons = [0, 1, 2];

export function EntanglementDiagram({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 50, damping: 18 });
  const y = useSpring(my, { stiffness: 50, damping: 18 });

  function handleMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((event.clientX - rect.left) / rect.width - 0.5) * 28);
    my.set(((event.clientY - rect.top) / rect.height - 0.5) * 18);
  }

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 800 400"
      fill="none"
      aria-hidden="true"
      onMouseMove={reduced ? undefined : handleMouseMove}
    >
      <motion.g style={reduced ? undefined : { x, y }}>
        <path
          id="photon-1"
          d="M180 200 C 320 80, 480 80, 620 200"
          stroke="currentColor"
          className="stroke-entangle/30"
          strokeWidth="1.5"
        />
        <path
          id="photon-2"
          d="M180 200 C 320 320, 480 320, 620 200"
          stroke="currentColor"
          className="stroke-entangle/30"
          strokeWidth="1.5"
        />
        <path
          id="photon-3"
          d="M180 200 C 360 200, 440 200, 620 200"
          stroke="currentColor"
          className="stroke-entangle/20"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
        <circle cx="180" cy="200" r="14" className="fill-entangle" />
        <circle cx="620" cy="200" r="14" className="fill-entangle" />
        {!reduced &&
          photons.map((index) => (
            <circle key={index} r="5" className="fill-measure">
              <animateMotion
                dur={`${3 + index * 0.6}s`}
                begin={`${index * 0.9}s`}
                repeatCount="indefinite"
              >
                <mpath href={`#photon-${index + 1}`} />
              </animateMotion>
            </circle>
          ))}
      </motion.g>
    </svg>
  );
}
