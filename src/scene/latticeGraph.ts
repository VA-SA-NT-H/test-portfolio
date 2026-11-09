import { skillGroups } from "../../data/portfolio";
import { projects } from "../../data/projects";

/**
 * The spatial index graph — one pure, deterministic module shared by
 * the WebGL scene and its static SVG fallback, so both render the
 * exact same lattice.
 *
 * Clusters come from `skillGroups` (a hub per group), leaves are the
 * skills themselves, and the cross-cluster links are real: two skills
 * are joined when a project in `data/projects.ts` uses both. Nothing
 * here is decorative filler — every edge is a claim the data backs.
 */

/** Cluster accents, cycled. The blue is lifted to #5b6bff so it clears
 *  3:1 against the ink panel — identity blue #3548ff reads at 2.4:1
 *  as a non-text graphic. Same family, lit. */
export const ACCENTS = ["#d7ff32", "#ff5938", "#5b6bff", "#f4f0e8"] as const;

export const groupAccent = (index: number): string => ACCENTS[index % ACCENTS.length];

/** Deterministic PRNG (mulberry32) so the lattice is identical on
 *  every load — no hydration surprises, reproducible screenshots. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface LatticeNode {
  index: number;
  label: string;
  group: number;
  hub: boolean;
  pos: [number, number, number];
  color: string;
}

export interface LatticeEdge {
  a: number;
  b: number;
  kind: "hub" | "project";
  /** For project edges: which case study uses both endpoints — the
   *  sentence the readout shows, so a link is never unexplained. */
  project?: string;
}

/** skill → the projects that use it. Powers the Craft row readout
 *  ("used in N projects") and the node hover explanation. */
export const skillProjects: Map<string, string[]> = (() => {
  const map = new Map<string, string[]>();
  for (const project of projects) {
    for (const technology of project.technologies) {
      const list = map.get(technology);
      if (list) list.push(project.title);
      else map.set(technology, [project.title]);
    }
  }
  return map;
})();

export const groupTitles: string[] = skillGroups.map((group) => group.title);

const nodeList: LatticeNode[] = [];
const edgeList: LatticeEdge[] = [];
const skillIndex = new Map<string, number>();
const seenEdges = new Set<string>();

const RING = 3.6;
const GROUPS = skillGroups.length;

skillGroups.forEach((group, gi) => {
  const angle = (gi / GROUPS) * Math.PI * 2;
  const cx = Math.cos(angle) * RING;
  const cz = Math.sin(angle) * RING;
  const cy = Math.sin(angle * 2.3) * 1.3;
  const color = groupAccent(gi);

  const hubIndex = nodeList.length;
  nodeList.push({
    index: hubIndex,
    label: group.title,
    group: gi,
    hub: true,
    pos: [cx, cy, cz],
    color,
  });

  const count = group.skills.length;
  group.skills.forEach((skill, si) => {
    const a = (si / count) * Math.PI * 2 + gi * 0.7;
    const r = 1.15 + (si % 3) * 0.16;
    const index = nodeList.length;
    nodeList.push({
      index,
      label: skill,
      group: gi,
      hub: false,
      pos: [
        cx + Math.cos(a) * r,
        cy + Math.sin(a) * r * 0.85,
        cz + Math.sin(a * 2 + gi) * 0.9,
      ],
      color,
    });
    skillIndex.set(skill, index);
    edgeList.push({ a: hubIndex, b: index, kind: "hub" });
  });
});

/** Cross-cluster edges: every pair of skills a project uses together. */
for (const project of projects) {
  const mapped = project.technologies
    .map((technology) => skillIndex.get(technology))
    .filter((index): index is number => index !== undefined);

  for (let i = 0; i < mapped.length; i += 1) {
    for (let j = i + 1; j < mapped.length; j += 1) {
      const a = Math.min(mapped[i], mapped[j]);
      const b = Math.max(mapped[i], mapped[j]);
      const key = `${a}:${b}`;
      if (seenEdges.has(key)) continue;
      seenEdges.add(key);
      edgeList.push({ a, b, kind: "project", project: project.title });
    }
  }
}

export const nodes: LatticeNode[] = nodeList;
export const edges: LatticeEdge[] = edgeList;

/** Edge indices touching a node — precomputed so hover is a lookup. */
export const edgesFrom: number[][] = (() => {
  const list: number[][] = nodes.map(() => []);
  edges.forEach((edge, index) => {
    list[edge.a].push(index);
    list[edge.b].push(index);
  });
  return list;
})();

/**
 * The sentence a node hover shows. Prefer a concrete cross-project
 * claim ("React ↔ FastAPI — together in Aura"), then fall back to
 * the skill's own project usage, then to plain usage count.
 */
export function explainNode(index: number): string {
  const node = nodes[index];

  for (const edgeIndex of edgesFrom[index]) {
    const edge = edges[edgeIndex];
    if (edge.kind !== "project" || !edge.project) continue;
    const other = nodes[edge.a === index ? edge.b : edge.a];
    return `${node.label} ↔ ${other.label} — together in ${edge.project}`;
  }

  const usedIn = skillProjects.get(node.label);
  if (usedIn && usedIn.length > 0) {
    return `${node.label} — used in ${usedIn[0]}`;
  }
  if (node.hub) return `${node.label} — ${skillGroups[node.group].skills.length} technologies`;
  return `${node.label} — index entry`;
}

export const stats = {
  clusters: GROUPS,
  nodeCount: nodes.length,
  edgeCount: edges.length,
};
