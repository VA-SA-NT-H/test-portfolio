import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

/**
 * Quantum Cryptography — the key's journey drawn top to bottom:
 * an E91 source splits an entangled pair to Alice and Bob, both
 * sides converge on a shared key stream (the flickering bit
 * blocks), which feeds the SHA-256 / AES-256 layer and ends at
 * the NIST validation bar — the project's own 15/15 result.
 *
 * Entangled photons are SMIL dots riding both branches; the bits
 * shimmer on a CSS loop. All of it stops under reduced motion.
 */
export function QuantumKey() {
  const reduced = usePrefersReducedMotion();

  const toAlice = "M320 92 C 320 150, 176 140, 176 176";
  const toBob = "M320 92 C 320 150, 464 140, 464 176";
  const bits = Array.from({ length: 20 }, (_, i) => 250 + i * 13);

  return (
    <div className="group/quantum relative overflow-x-auto overscroll-x-contain">
      <svg
        viewBox="0 0 640 470"
        className="h-auto w-full min-w-[440px]"
        role="img"
        aria-label="Schematic: an E91 quantum key distribution source shares a key between Alice and Bob, feeding a SHA-256 and AES-256 encryption layer validated by the NIST Statistical Test Suite."
      >
        {/* Source */}
        <text
          x="320"
          y="26"
          textAnchor="middle"
          className="fill-concrete font-mono text-[9px] uppercase tracking-[0.24em]"
        >
          E91 QKD source
        </text>
        <circle
          cx="320"
          cy="64"
          r="28"
          strokeWidth="2.5"
          className="fill-ink stroke-orange transition-colors duration-300 group-hover/quantum:stroke-lime"
        />
        <text
          x="320"
          y="70"
          textAnchor="middle"
          className="fill-orange font-display text-[15px] transition-colors duration-300 group-hover/quantum:fill-lime"
        >
          E91
        </text>

        {/* Entangled branches */}
        {[toAlice, toBob].map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            strokeWidth="2"
            strokeDasharray="7 9"
            className={`flow-line ${i === 1 ? "flow-slow" : ""} stroke-paper/50 transition-colors duration-300 group-hover/quantum:stroke-orange`}
          />
        ))}

        {/* Alice & Bob — labels sit beside the nodes so the wires
            to the key bar never cross the type */}
        {[
          { x: 176, name: "Alice", labelX: 142, anchor: "end" as const },
          { x: 464, name: "Bob", labelX: 498, anchor: "start" as const },
        ].map((party) => (
          <g key={party.name}>
            <circle
              cx={party.x}
              cy="196"
              r="22"
              strokeWidth="2"
              className="fill-ink stroke-paper transition-colors duration-300 group-hover/quantum:stroke-lime"
            />
            <circle cx={party.x} cy="196" r="5" className="fill-lime" />
            <text
              x={party.labelX}
              y="201"
              textAnchor={party.anchor}
              className="fill-concrete font-mono text-[10px] uppercase tracking-[0.18em]"
            >
              {party.name}
            </text>
            <path
              d={`M${party.x} 218 L ${party.x} 268`}
              fill="none"
              strokeWidth="2"
              strokeDasharray="7 9"
              className="flow-line stroke-paper/50 transition-colors duration-300 group-hover/quantum:stroke-orange"
            />
          </g>
        ))}

        {/* Shared key stream */}
        <rect
          x="120"
          y="268"
          width="400"
          height="52"
          strokeWidth="2"
          className="fill-ink stroke-paper transition-colors duration-300 group-hover/quantum:stroke-lime"
        />
        <text
          x="136"
          y="299"
          className="fill-concrete font-mono text-[10px] uppercase tracking-[0.16em]"
        >
          Shared key
        </text>
        {bits.map((x, i) => (
          <rect
            key={x}
            x={x}
            y="282"
            width="9"
            height="24"
            className={i % 3 === 0 ? "fill-lime bit-flicker" : "fill-paper/70"}
            style={{ animationDelay: `${(i % 7) * 0.22}s` }}
          />
        ))}

        {/* Encryption layer */}
        <path
          d="M320 320 L 320 344"
          fill="none"
          strokeWidth="2"
          strokeDasharray="7 9"
          className="flow-line stroke-paper/50"
        />
        {[
          { x: 140, label: "SHA-256" },
          { x: 340, label: "AES-256" },
        ].map((layer) => (
          <g key={layer.label}>
            <rect
              x={layer.x}
              y="344"
              width="160"
              height="42"
              strokeWidth="2"
              className="fill-ink stroke-orange/80 transition-colors duration-300 group-hover/quantum:stroke-lime"
            />
            <text
              x={layer.x + 80}
              y="371"
              textAnchor="middle"
              className="fill-paper font-mono text-[12px] uppercase tracking-[0.16em]"
            >
              {layer.label}
            </text>
          </g>
        ))}
        <path
          d="M220 386 L 220 412 M420 386 L 420 412"
          fill="none"
          strokeWidth="2"
          strokeDasharray="7 9"
          className="flow-line stroke-paper/50"
        />

        {/* Validation bar — the project's own result */}
        <rect
          x="140"
          y="412"
          width="360"
          height="44"
          strokeWidth="2.5"
          className="fill-lime stroke-lime"
        />
        <text
          x="156"
          y="439"
          className="fill-ink font-mono text-[10px] uppercase tracking-[0.14em]"
        >
          NIST statistical test suite
        </text>
        <text
          x="484"
          y="440"
          textAnchor="end"
          className="fill-ink font-display text-[17px]"
        >
          15/15
        </text>

        {/* Entangled photons */}
        {!reduced && (
          <>
            <circle r="5" fill="#ff5938">
              <animateMotion dur="2.6s" repeatCount="indefinite" path={toAlice} />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.85;1"
                dur="2.6s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="5" fill="#ff5938">
              <animateMotion dur="2.6s" begin="0.12s" repeatCount="indefinite" path={toBob} />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.85;1"
                dur="2.6s"
                begin="0.12s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}
