import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

/**
 * Fall Detection — a monitoring sheet: the top panel is the camera
 * viewport (live dot, sweeping scan line, locked detection box
 * around a fallen figure), the lower rail is the alert pipeline
 * walking from camera frame to email with the <5s window pinned
 * to the right. Labels are the project's own architecture steps.
 */
export function FallMonitor() {
  const reduced = usePrefersReducedMotion();

  const stops = [
    { x: 64, label: "Camera frame" },
    { x: 223, label: "OpenCV detection" },
    { x: 381, label: "Fall confirmed" },
    { x: 540, label: "Email alert" },
  ];

  return (
    <div className="group/monitor relative overflow-x-auto overscroll-x-contain">
      <svg
        viewBox="0 0 640 430"
        className="h-auto w-full min-w-[540px]"
        role="img"
        aria-label="Schematic: a camera viewport with a scan line and a detection box around a fallen figure, feeding an alert pipeline from camera frame to email alert in under five seconds."
      >
        <defs>
          <pattern id="fll-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0 H0 V40" fill="none" stroke="#111111" strokeWidth="1" />
          </pattern>
          <clipPath id="fll-viewport">
            <rect x="17" y="17" width="606" height="250" />
          </clipPath>
        </defs>

        {/* Viewport */}
        <rect x="16" y="16" width="608" height="252" fill="#f4f0e8" stroke="#111111" strokeWidth="2.5" />
        <g clipPath="url(#fll-viewport)">
          <rect x="17" y="17" width="606" height="250" fill="url(#fll-grid)" opacity="0.07" />

          {/* Scan line */}
          <g className="scan-line" style={{ ["--scan-travel" as string]: "246px" }}>
            <rect x="17" y="17" width="606" height="3" fill="#d7ff32" />
          </g>

          {/* Floor line */}
          <path d="M40 236 H600" stroke="#111111" strokeWidth="1.5" strokeDasharray="10 12" opacity="0.35" />

          {/* Fallen figure */}
          <g
            fill="none"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-300 group-hover/monitor:stroke-blue"
          >
            <path d="M246 214 L 300 206 L 336 196" />
            <path d="M246 214 L 228 232" />
            <path d="M286 208 L 276 230" />
            <path d="M300 206 L 314 226" />
          </g>
          <circle cx="350" cy="190" r="11" fill="#111111" className="transition-colors duration-300 group-hover/monitor:fill-blue" />

          {/* Detection lock */}
          <rect
            x="206"
            y="160"
            width="172"
            height="88"
            fill="none"
            strokeWidth="2.5"
            strokeDasharray="10 8"
            className="flow-line stroke-orange transition-colors duration-300 group-hover/monitor:stroke-blue"
          />
          <rect x="206" y="138" width="140" height="20" fill="#ff5938" className="transition-colors duration-300 group-hover/monitor:fill-blue" />
          <text x="214" y="152" fill="#111111" className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
            Fall detected
          </text>

          {/* Viewport chrome */}
          <circle cx="30" cy="36" r="4.5" fill="#ff5938" className="node-live" />
          <text x="42" y="40" fill="#55514a" className="font-mono text-[10px] uppercase tracking-[0.2em]">
            CAM 01 / Live
          </text>
          <text x="608" y="40" textAnchor="end" fill="#55514a" className="font-mono text-[10px] uppercase tracking-[0.2em]">
            OpenCV
          </text>
        </g>

        {/* Registration corners */}
        <g fill="none" stroke="#111111" strokeWidth="3">
          <path d="M16 40 V16 H40" />
          <path d="M600 16 H624 V40" />
          <path d="M624 244 V268 H600" />
          <path d="M40 268 H16 V244" />
        </g>

        {/* Alert window */}
        <text x="16" y="316" fill="#55514a" className="font-mono text-[10px] uppercase tracking-[0.24em]">
          Alert window
        </text>
        <text
          x="624"
          y="330"
          textAnchor="end"
          className="fill-ink font-display text-[46px] leading-none tracking-[-0.04em]"
        >
          &lt;5s
        </text>

        {/* Pipeline rail */}
        <path
          d="M64 376 H540"
          fill="none"
          strokeWidth="2.5"
          strokeDasharray="8 10"
          className="flow-line stroke-ink/60 transition-colors duration-300 group-hover/monitor:stroke-orange"
        />
        {stops.map((stop, index) => (
          <g key={stop.label}>
            <circle
              cx={stop.x}
              cy="376"
              r="10"
              strokeWidth="2.5"
              className={
                index === stops.length - 1
                  ? "fill-lime stroke-ink transition-colors duration-300 group-hover/monitor:fill-orange"
                  : "fill-paper stroke-ink transition-colors duration-300 group-hover/monitor:fill-ink"
              }
            />
            <text
              x={stop.x}
              y="408"
              textAnchor="middle"
              fill="#55514a"
              className="font-mono text-[9px] uppercase tracking-[0.1em]"
            >
              {stop.label}
            </text>
          </g>
        ))}

        {/* Travelling alert packet */}
        {!reduced && (
          <circle r="6" fill="#ff5938">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M64 376 H540"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.08;0.9;1"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </svg>
    </div>
  );
}
