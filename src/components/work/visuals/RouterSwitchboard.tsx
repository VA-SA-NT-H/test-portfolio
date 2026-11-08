import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

/**
 * IntelRouter — the routing switchboard, drawn as the system's own
 * decision path: requests enter from the left, the ML classifier
 * decides, and packets fan out across the multi-LLM pool while the
 * Redis cache hangs off a dashed side channel.
 *
 * Packets are SMIL dots travelling the real paths (skipped entirely
 * under prefers-reduced-motion); the lines themselves march dashes.
 * Hover on `group/router` lights the lanes lime and inverts the pool.
 */
export function RouterSwitchboard() {
  const reduced = usePrefersReducedMotion();

  const inbound = [
    "M40 112 C 130 112, 170 196, 248 196",
    "M40 192 C 120 192, 180 196, 248 196",
    "M40 272 C 130 272, 170 196, 248 196",
  ];
  const outbound = [
    "M372 196 C 430 196, 440 96, 506 96",
    "M372 196 L 506 196",
    "M372 196 C 430 196, 440 296, 506 296",
  ];
  const models = ["LLM 01", "LLM 02", "LLM 03"];

  return (
    <div className="group/router relative overflow-x-auto overscroll-x-contain">
      <svg
        viewBox="0 0 640 400"
        className="h-auto w-full min-w-[540px]"
        role="img"
        aria-label="Schematic: requests flow through an ML classifier and are routed across a multi-LLM pool with a Redis cache side channel."
      >
        <defs>
          <pattern id="rtr-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0 H0 V32" fill="none" stroke="#f4f0e8" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="640" height="400" fill="url(#rtr-grid)" opacity="0.07" />

        {/* Column labels */}
        <g className="fill-concrete font-mono text-[9px] uppercase tracking-[0.22em]">
          <text x="24" y="34">Ingest</text>
          <text x="250" y="34">Classify</text>
          <text x="512" y="34">Multi-LLM pool</text>
        </g>

        {/* Inbound lanes */}
        {inbound.map((d, i) => (
          <path
            key={`in-${i}`}
            d={d}
            fill="none"
            strokeWidth="2"
            strokeDasharray="8 10"
            className="flow-line stroke-paper/45 transition-colors duration-300 group-hover/router:stroke-lime"
          />
        ))}

        {/* Ingest nodes */}
        {[104, 184, 264].map((y, i) => (
          <rect
            key={`src-${i}`}
            x="24"
            y={y}
            width="16"
            height="16"
            strokeWidth="2"
            className="node-live fill-lime stroke-paper/60 transition-colors duration-300 group-hover/router:stroke-lime"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}

        {/* Classifier */}
        <rect
          x="250"
          y="160"
          width="120"
          height="72"
          strokeWidth="2.5"
          className="fill-ink stroke-paper transition-colors duration-300 group-hover/router:stroke-lime"
        />
        <text
          x="310"
          y="201"
          textAnchor="middle"
          className="fill-paper font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 group-hover/router:fill-lime"
        >
          ML classifier
        </text>

        {/* Outbound lanes */}
        {outbound.map((d, i) => (
          <path
            key={`out-${i}`}
            d={d}
            fill="none"
            strokeWidth="2"
            strokeDasharray="8 10"
            className="flow-line stroke-paper/45 transition-colors duration-300 group-hover/router:stroke-lime"
          />
        ))}

        {/* Model pool chips */}
        {[72, 172, 272].map((y, i) => (
          <g key={models[i]}>
            <rect
              x="512"
              y={y}
              width="104"
              height="48"
              strokeWidth="2"
              className="fill-ink stroke-paper/70 transition-colors duration-300 group-hover/router:fill-lime group-hover/router:stroke-lime"
            />
            <text
              x="564"
              y={y + 29}
              textAnchor="middle"
              className="fill-concrete font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 group-hover/router:fill-ink"
            >
              {models[i]}
            </text>
          </g>
        ))}

        {/* Redis side channel */}
        <path
          d="M310 232 L 310 330"
          fill="none"
          strokeWidth="2"
          strokeDasharray="6 9"
          className="flow-line flow-slow stroke-paper/40 transition-colors duration-300 group-hover/router:stroke-orange"
        />
        <rect
          x="250"
          y="332"
          width="120"
          height="44"
          strokeWidth="2"
          className="fill-ink stroke-paper/70 transition-colors duration-300 group-hover/router:stroke-orange"
        />
        <text
          x="310"
          y="359"
          textAnchor="middle"
          className="fill-concrete font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 group-hover/router:fill-orange"
        >
          Redis cache
        </text>
        <g className="font-mono uppercase tracking-[0.16em]">
          <text x="382" y="352" className="fill-lime text-[10px]">
            Caching
          </text>
          <text x="382" y="368" className="fill-concrete text-[9px]">
            Side channel
          </text>
        </g>

        {/* Packets */}
        {!reduced &&
          inbound.map((d, i) => (
            <circle key={`pin-${i}`} r="4.5" fill="#d7ff32">
              <animateMotion
                dur="2.4s"
                begin={`${i * 0.8}s`}
                repeatCount="indefinite"
                path={d}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.85;1"
                dur="2.4s"
                begin={`${i * 0.8}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        {!reduced &&
          outbound.map((d, i) => (
            <circle key={`pout-${i}`} r="4.5" fill="#3548ff" stroke="#d7ff32" strokeWidth="1.5">
              <animateMotion
                dur="2.2s"
                begin={`${0.4 + i * 0.7}s`}
                repeatCount="indefinite"
                path={d}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.85;1"
                dur="2.2s"
                begin={`${0.4 + i * 0.7}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
      </svg>
    </div>
  );
}
