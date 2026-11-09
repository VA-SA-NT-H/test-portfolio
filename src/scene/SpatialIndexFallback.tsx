import { edges, groupAccent, nodes, stats } from "./latticeGraph";

/**
 * The static projection — same lattice, same data, drawn as a
 * drafting plate. It renders when WebGL is unavailable, the user
 * prefers reduced motion, the device is too weak, or the scene chunk
 * has not arrived yet. It never animates: this is the resting frame.
 *
 * Only cluster numbers are drawn as text (they sit inside their own
 * hub plates, so they scale with the drawing at any viewport — the
 * labels live in the Craft index below, numbered 01–09 to match).
 */

const D = 11.5;
const H_STRETCH = 1.35;
const PAD = 1.4;

interface Plate {
  x: number;
  y: number;
  f: number;
  hub: boolean;
  group: number;
}

const plate: Plate[] = nodes.map((node) => {
  const f = D / (D - node.pos[2]);
  return {
    x: node.pos[0] * f * H_STRETCH,
    y: -node.pos[1] * f,
    f,
    hub: node.hub,
    group: node.group,
  };
});

const maxX = Math.max(...plate.map((point) => Math.abs(point.x)));
const maxY = Math.max(...plate.map((point) => Math.abs(point.y)));

const VIEWBOX = `${-maxX - PAD} ${-maxY - PAD} ${(maxX + PAD) * 2} ${(maxY + PAD) * 2}`;

/** 0 (furthest) → 1 (nearest): depth as opacity, no blur, no cost. */
const depth = (f: number) => Math.min(1, Math.max(0.3, 0.3 + ((f - 0.7) / 1.04) * 0.7));

export function SpatialIndexFallback() {
  return (
    <svg
      viewBox={VIEWBOX}
      className="h-full w-full"
      role="img"
      aria-label={`Static projection of the technical index: ${stats.clusters} clusters and ${stats.nodeCount} nodes joined by ${stats.edgeCount} links. The same clusters are listed and numbered in the index below.`}
    >
      <defs>
        <pattern id="lattice-plate-grid" width="0.5" height="0.5" patternUnits="userSpaceOnUse">
          <path d="M0.5 0 H0 V0.5" fill="none" stroke="#f4f0e8" strokeWidth="0.012" />
        </pattern>
      </defs>

      {/* Drawing plate */}
      <rect x={-maxX - PAD} y={-maxY - PAD} width={(maxX + PAD) * 2} height={(maxY + PAD) * 2} fill="url(#lattice-plate-grid)" opacity="0.09" />
      <rect
        x={-maxX - PAD}
        y={-maxY - PAD}
        width={(maxX + PAD) * 2}
        height={(maxY + PAD) * 2}
        fill="none"
        stroke="#f4f0e8"
        strokeOpacity="0.28"
        strokeWidth="0.03"
      />
      <g stroke="#f4f0e8" strokeOpacity="0.65" strokeWidth="0.06" fill="none">
        <path d={`M${-maxX - PAD} ${-maxY - PAD + 0.7} V${-maxY - PAD} H${-maxX - PAD + 0.7}`} />
        <path d={`M${maxX + PAD - 0.7} ${-maxY - PAD} H${maxX + PAD} V${-maxY - PAD + 0.7}`} />
        <path d={`M${maxX + PAD} ${maxY + PAD - 0.7} V${maxY + PAD} H${maxX + PAD - 0.7}`} />
        <path d={`M${-maxX - PAD + 0.7} ${maxY + PAD} H${-maxX - PAD} V${maxY + PAD - 0.7}`} />
      </g>

      {/* Links — project co-use behind, cluster spokes in front */}
      <g fill="none" strokeLinecap="square">
        {edges.map((edge, index) => {
          const a = plate[edge.a];
          const b = plate[edge.b];
          const opacity = depth((a.f + b.f) / 2);
          const spoke = edge.kind === "hub";
          return (
            <line
              key={`edge-${index}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={spoke ? groupAccent(nodes[edge.a].group) : "#f4f0e8"}
              strokeOpacity={(spoke ? 0.5 : 0.24) * opacity}
              strokeWidth={spoke ? 0.032 : 0.022}
            />
          );
        })}
      </g>

      {/* Nodes — leaves first, hub plates last so numbers stay on top */}
      <g>
        {plate.map((point, index) =>
          point.hub ? null : (
            <rect
              key={`leaf-${index}`}
              x={point.x - (0.24 * point.f) / 2}
              y={point.y - (0.24 * point.f) / 2}
              width={0.24 * point.f}
              height={0.24 * point.f}
              fill={groupAccent(point.group)}
              fillOpacity={depth(point.f)}
            />
          ),
        )}
        {plate.map((point, index) => {
          if (!point.hub) return null;
          const size = 0.72 * point.f;
          return (
            <g key={`hub-${index}`}>
              <rect
                x={point.x - size / 2}
                y={point.y - size / 2}
                width={size}
                height={size}
                fill={groupAccent(point.group)}
                fillOpacity={depth(point.f)}
              />
              <text
                x={point.x}
                y={point.y + 0.14 * point.f}
                textAnchor="middle"
                fill="#111111"
                className="font-mono"
                fontSize={0.38 * point.f}
                letterSpacing={0.02 * point.f}
              >
                {String(point.group + 1).padStart(2, "0")}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
