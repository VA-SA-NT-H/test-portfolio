import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

/**
 * Enterprise Business Management — the system drawn as a blueprint:
 * four business modules wire down into a single REST API bus, the
 * Spring Boot core hangs off that bus, and the core reaches MySQL
 * persistence on one side and the GitHub Actions CI/CD rail (with
 * its Docker packaging) on the other. The rail marker walks the
 * pipeline; module cells invert to blue on hover.
 */
export function SystemBlueprint() {
  const reduced = usePrefersReducedMotion();

  const modules = [
    { x: 16, label: "CRM" },
    { x: 172, label: "Inventory" },
    { x: 328, label: "Employee" },
    { x: 484, label: "Reporting" },
  ];

  return (
    <div className="group/blueprint relative overflow-x-auto overscroll-x-contain">
      <svg
        viewBox="0 0 640 420"
        className="h-auto w-full min-w-[540px]"
        role="img"
        aria-label="Schematic: CRM, inventory, employee and reporting modules wired into a REST API bus on a Spring Boot core, reaching MySQL persistence and a GitHub Actions CI/CD pipeline."
      >
        <defs>
          <pattern id="ent-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0 H0 V32" fill="none" stroke="#111111" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="640" height="420" fill="url(#ent-grid)" opacity="0.06" />

        {/* Module cells */}
        <text x="16" y="26" fill="#55514a" className="font-mono text-[9px] uppercase tracking-[0.24em]">
          Modules
        </text>
        {modules.map((module) => {
          const center = module.x + 70;
          return (
            <g key={module.label}>
              <path
                d={`M${center} 104 V 170`}
                fill="none"
                strokeWidth="2"
                strokeDasharray="7 9"
                className="flow-line flow-slow stroke-ink/55 transition-colors duration-300 group-hover/blueprint:stroke-blue"
              />
              <rect
                x={module.x}
                y="40"
                width="140"
                height="64"
                strokeWidth="2.5"
                className="fill-paper stroke-ink transition-colors duration-300 group-hover/blueprint:fill-blue"
              />
              <text
                x={center}
                y="78"
                textAnchor="middle"
                className="fill-ink font-display text-[13px] uppercase tracking-tight transition-colors duration-300 group-hover/blueprint:fill-paper"
              >
                {module.label}
              </text>
            </g>
          );
        })}

        {/* REST API bus */}
        <path
          d="M40 170 H600"
          fill="none"
          strokeWidth="3"
          strokeDasharray="12 10"
          className="flow-line stroke-ink transition-colors duration-300 group-hover/blueprint:stroke-blue"
        />
        <rect x="256" y="154" width="128" height="32" fill="#111111" />
        <text
          x="320"
          y="175"
          textAnchor="middle"
          fill="#f4f0e8"
          className="font-mono text-[11px] uppercase tracking-[0.18em]"
        >
          REST API
        </text>

        {/* Core drop */}
        <path
          d="M320 186 V 214"
          fill="none"
          strokeWidth="2.5"
          strokeDasharray="7 9"
          className="flow-line stroke-ink transition-colors duration-300 group-hover/blueprint:stroke-blue"
        />
        <rect
          x="196"
          y="216"
          width="248"
          height="64"
          strokeWidth="2.5"
          fill="#111111"
          className="stroke-ink transition-colors duration-300 group-hover/blueprint:fill-blue"
        />
        <text
          x="320"
          y="255"
          textAnchor="middle"
          fill="#f4f0e8"
          className="font-display text-[14px] uppercase tracking-tight"
        >
          Spring Boot core
        </text>

        {/* Persistence wire → MySQL */}
        <path
          d="M244 280 C 244 312, 140 304, 140 332"
          fill="none"
          strokeWidth="2"
          strokeDasharray="7 9"
          className="flow-line flow-slow stroke-ink/55 transition-colors duration-300 group-hover/blueprint:stroke-blue"
        />
        <g>
          <ellipse cx="140" cy="336" rx="60" ry="13" fill="#f4f0e8" stroke="#111111" strokeWidth="2.5" />
          <path
            d="M80 336 V 384 A 60 13 0 0 0 200 384 V 336"
            fill="#f4f0e8"
            stroke="#111111"
            strokeWidth="2.5"
          />
          <text
            x="140"
            y="368"
            textAnchor="middle"
            className="fill-ink font-mono text-[11px] uppercase tracking-[0.16em]"
          >
            MySQL
          </text>
        </g>

        {/* CI/CD wire → pipeline */}
        <path
          d="M400 280 C 400 312, 460 304, 460 332"
          fill="none"
          strokeWidth="2"
          strokeDasharray="7 9"
          className="flow-line flow-slow stroke-ink/55 transition-colors duration-300 group-hover/blueprint:stroke-blue"
        />
        <rect
          x="300"
          y="332"
          width="324"
          height="72"
          strokeWidth="2.5"
          className="fill-paper stroke-ink transition-colors duration-300 group-hover/blueprint:stroke-blue"
        />
        <text
          x="314"
          y="356"
          fill="#55514a"
          className="font-mono text-[10px] uppercase tracking-[0.16em]"
        >
          GitHub Actions CI/CD
        </text>
        <text
          x="610"
          y="356"
          textAnchor="end"
          fill="#55514a"
          className="font-mono text-[9px] uppercase tracking-[0.16em]"
        >
          Docker
        </text>
        <path
          d="M314 378 H610"
          fill="none"
          strokeWidth="2.5"
          strokeDasharray="8 10"
          className="flow-line stroke-ink/60 transition-colors duration-300 group-hover/blueprint:stroke-blue"
        />
        {!reduced && (
          <rect
            x="314"
            y="372"
            width="12"
            height="12"
            fill="#d7ff32"
            stroke="#111111"
            strokeWidth="2"
            className="rail-marker"
            style={{ ["--rail-travel" as string]: "270px" }}
          />
        )}
      </svg>
    </div>
  );
}
