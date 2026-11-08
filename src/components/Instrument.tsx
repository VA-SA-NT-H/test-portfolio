import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const TICKS = Array.from({ length: 72 }, (_, index) => index);

/** Photon channels between the two measurement nodes (TX → RX). */
const CHANNELS = [
  { id: "scope-arc-up", d: "M170 300 C 245 174, 355 174, 430 300", dur: "3.6s", begin: "0s" },
  { id: "scope-arc-down", d: "M170 300 C 245 426, 355 426, 430 300", dur: "4.2s", begin: "-1.4s" },
  { id: "scope-straight", d: "M170 300 L 430 300", dur: "2.9s", begin: "-2.2s" },
];

const NODES = [
  { label: "TX", x: 170, pulse: "0s" },
  { label: "RX", x: 430, pulse: "-1.6s" },
];

/** How strongly the probe is onto a node, 0 → 1 over a 110-unit radius. */
function heatAt(localX: number, localY: number, nodeX: number) {
  const distance = Math.hypot(localX - nodeX, localY - 300);
  return Math.max(0, 1 - distance / 110);
}

interface ScopeNodeProps {
  label: string;
  x: number;
  pulse: string;
  heat: MotionValue<number>;
  reduced: boolean;
}

/** One measurement node: swells and flips to signal orange as the pointer probes it. */
function ScopeNode({ label, x, pulse, heat, reduced }: ScopeNodeProps) {
  const glow = useSpring(heat, { stiffness: 170, damping: 22, mass: 0.5 });
  const scale = useTransform(glow, [0, 1], [1, 1.28]);
  const ringOpacity = useTransform(glow, [0, 1], [0.55, 1]);
  const hotOpacity = useTransform(glow, [0, 1], [0, 1]);
  const labelOpacity = useTransform(glow, [0, 1], [0.6, 1]);

  return (
    <g>
      <circle cx={x} cy="300" r="44" fill="transparent" />

      {!reduced && (
        <circle
          cx={x}
          cy="300"
          r="26"
          fill="none"
          stroke="rgb(17 17 17 / 0.45)"
          strokeWidth="1"
          strokeDasharray="3 6"
        >
          <animate attributeName="r" values="26;54" dur="3.4s" begin={pulse} repeatCount="indefinite" />
          <animate
            attributeName="stroke-opacity"
            values="0.7;0"
            dur="3.4s"
            begin={pulse}
            repeatCount="indefinite"
          />
        </circle>
      )}

      <motion.g
        style={{
          scale,
          transformBox: "view-box",
          transformOrigin: `${x}px 300px`,
        }}
      >
        <motion.circle
          cx={x}
          cy="300"
          r="26"
          fill="none"
          stroke="rgb(17 17 17 / 0.85)"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          style={{ opacity: ringOpacity }}
        />
        <circle cx={x} cy="300" r="11" fill="#3548ff" />
        <motion.circle cx={x} cy="300" r="11" fill="#ff5938" style={{ opacity: hotOpacity }} />
      </motion.g>

      <motion.text
        className="fill-[#55514a] font-mono text-[14px] tracking-[0.26em]"
        x={x}
        y="360"
        textAnchor="middle"
        style={{ opacity: labelOpacity }}
      >
        {label}
      </motion.text>
    </g>
  );
}

interface InstrumentProps {
  className?: string;
}

/**
 * The hero figure: a drafting instrument — graduated ring, counter-drifting
 * reticles, a sweeping trace, and an entangled TX/RX pair exchanging
 * packets. It tilts toward the pointer on a spring and lights each node
 * as the cursor probes it; everything rests under prefers-reduced-motion.
 */
export function Instrument({ className = "" }: InstrumentProps) {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springX = useSpring(px, { stiffness: 55, damping: 18, mass: 0.7 });
  const springY = useSpring(py, { stiffness: 55, damping: 18, mass: 0.7 });
  const x = useTransform(springX, [-1, 1], [-14, 14]);
  const y = useTransform(springY, [-1, 1], [-10, 10]);
  const rotate = useTransform(springX, [-1, 1], [-2, 2]);

  const txHeat = useMotionValue(0);
  const rxHeat = useMotionValue(0);

  useEffect(() => {
    if (reduced) return;
    const element = wrapRef.current;
    if (!element) return;

    /* Cache the wrap rect — reading it on every pointermove forces
       layout. Invalidate on scroll/resize and skip all heat/tilt math
       once the instrument scrolls out of view. */
    let rect = element.getBoundingClientRect();
    let onScreen = rect.bottom > 0 && rect.top < window.innerHeight;

    const measure = () => {
      rect = element.getBoundingClientRect();
      onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const handle = (event: PointerEvent) => {
      if (!onScreen || rect.width === 0 || rect.height === 0) return;

      px.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
      py.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);

      const localX = ((event.clientX - rect.left) / rect.width) * 600;
      const localY = ((event.clientY - rect.top) / rect.height) * 600;
      txHeat.set(heatAt(localX, localY, 170));
      rxHeat.set(heatAt(localX, localY, 430));
    };

    window.addEventListener("pointermove", handle, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("pointermove", handle);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [reduced, px, py, txHeat, rxHeat]);

  return (
    <div ref={wrapRef} className={`pointer-events-none ${className}`}>
      <motion.div className="h-full w-full" style={reduced ? undefined : { x, y, rotate }}>
        <svg viewBox="0 0 600 600" aria-hidden="true" className="h-full w-full">
          <defs>
            <linearGradient
              id="scope-sweep"
              gradientUnits="userSpaceOnUse"
              x1="300"
              y1="40"
              x2="460"
              y2="95"
            >
              <stop offset="0" stopColor="#ff5938" stopOpacity="0" />
              <stop offset="1" stopColor="#ff5938" stopOpacity="0.28" />
            </linearGradient>
            <radialGradient id="scope-core" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#3548ff" stopOpacity="0.14" />
              <stop offset="1" stopColor="#3548ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Registration corners */}
          <g stroke="rgb(17 17 17 / 0.7)" strokeWidth="2" fill="none">
            <path d="M6 46 V6 H46" />
            <path d="M554 6 H594 V46" />
            <path d="M594 554 V594 H554" />
            <path d="M46 594 H6 V554" />
          </g>

          <circle cx="300" cy="300" r="288" stroke="rgb(17 17 17 / 0.3)" strokeWidth="1.5" fill="none" />
          <circle cx="300" cy="300" r="150" stroke="rgb(17 17 17 / 0.16)" strokeWidth="1" fill="url(#scope-core)" />

          {/* Graduated ring */}
          <g>
            {TICKS.map((tick) => {
              const angle = (tick / TICKS.length) * Math.PI * 2;
              const major = tick % 6 === 0;
              const inner = major ? 256 : 266;
              return (
                <line
                  key={tick}
                  x1={300 + Math.cos(angle) * 274}
                  y1={300 + Math.sin(angle) * 274}
                  x2={300 + Math.cos(angle) * inner}
                  y2={300 + Math.sin(angle) * inner}
                  stroke={major ? "rgb(17 17 17 / 0.85)" : "rgb(17 17 17 / 0.3)"}
                  strokeWidth={major ? 2 : 1}
                />
              );
            })}
          </g>

          {/* Counter-drifting reticle rings */}
          <circle
            cx="300"
            cy="300"
            r="244"
            fill="none"
            stroke="rgb(53 72 255 / 0.55)"
            strokeWidth="1.5"
            strokeDasharray="2 12"
            className="scope-spin"
            style={{ "--scope-dur": "120s" } as CSSProperties}
          />
          <circle
            cx="300"
            cy="300"
            r="216"
            fill="none"
            stroke="rgb(17 17 17 / 0.4)"
            strokeWidth="1.5"
            strokeDasharray="10 8"
            className="scope-spin scope-reverse"
            style={{ "--scope-dur": "90s" } as CSSProperties}
          />

          {/* Sweeping trace */}
          <g className="scope-spin" style={{ "--scope-dur": "11s" } as CSSProperties}>
            <path d="M300 300 L300 40 A260 260 0 0 1 460 95 Z" fill="url(#scope-sweep)" />
            <line x1="300" y1="300" x2="460" y2="95" stroke="#ff5938" strokeWidth="2" />
          </g>

          {/* Entangled channels */}
          <g fill="none" strokeWidth="1.5" strokeLinecap="square">
            {CHANNELS.map((channel) => (
              <path
                key={channel.id}
                id={channel.id}
                d={channel.d}
                stroke={channel.id === "scope-straight" ? "rgb(53 72 255 / 0.6)" : "rgb(17 17 17 / 0.5)"}
                strokeDasharray={channel.id === "scope-straight" ? "6 8" : undefined}
              />
            ))}
          </g>

          {/* Centre datum */}
          <g stroke="rgb(17 17 17 / 0.6)" strokeWidth="1.5">
            <line x1="290" y1="300" x2="310" y2="300" />
            <line x1="300" y1="290" x2="300" y2="310" />
          </g>

          {NODES.map((node) => (
            <ScopeNode
              key={node.label}
              label={node.label}
              x={node.x}
              pulse={node.pulse}
              heat={node.label === "TX" ? txHeat : rxHeat}
              reduced={reduced}
            />
          ))}

          {/* Packets in flight — hard squares, no glow */}
          {!reduced &&
            CHANNELS.map((channel) => (
              <rect key={channel.id} x="-5" y="-5" width="10" height="10" fill="#ff5938">
                <animateMotion dur={channel.dur} begin={channel.begin} repeatCount="indefinite">
                  <mpath href={`#${channel.id}`} />
                </animateMotion>
              </rect>
            ))}
        </svg>
      </motion.div>
    </div>
  );
}
