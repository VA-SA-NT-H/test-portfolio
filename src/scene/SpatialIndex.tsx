import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { edges, edgesFrom, groupAccent, mulberry32, nodes } from "./latticeGraph";
import type { PointerState } from "./interaction";

const WHITE = new THREE.Color("#ffffff");
const PAPER = new THREE.Color("#f4f0e8");

interface SceneProps {
  activeGroup: number | null;
  onHover: (nodeIndex: number | null) => void;
  state: { current: PointerState };
  visible: boolean;
  mobile: boolean;
}

/* ── Camera ─────────────────────────────────────────────────────── */

/** Distance that keeps the whole ring (±4.9 wide, ±2.6 tall) inside
 *  the frustum at any aspect ratio, so narrow phones never crop it. */
function ResponsiveCamera() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const aspect = Math.max(size.width, 1) / Math.max(size.height, 1);
    const distance = Math.max(9.8, 17.7 / aspect);
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

/* ── The lattice: instanced nodes + one line-segments batch ─────── */

/** Entrance schedule, derived from the edge list once: cluster spokes
 *  draw first (in creation order), then the links projects create.
 *  Hubs pop just before their spokes; a leaf grows with its own spoke. */
const EDGE_START: number[] = (() => {
  const projectCount = edges.filter((edge) => edge.kind === "project").length;
  const starts: number[] = [];
  let hubOrder = 0;
  let projectOrder = 0;
  for (const edge of edges) {
    if (edge.kind === "hub") {
      starts.push(0.3 + hubOrder * 0.014);
      hubOrder += 1;
    } else {
      starts.push(0.85 + (projectOrder / Math.max(projectCount, 1)) * 0.45);
      projectOrder += 1;
    }
  }
  return starts;
})();

const NODE_START: number[] = (() => {
  const starts = nodes.map((node) => (node.hub ? 0.05 + node.group * 0.02 : 0));
  let hubOrder = 0;
  for (const edge of edges) {
    if (edge.kind !== "hub") continue;
    starts[edge.b] = 0.3 + hubOrder * 0.014;
    hubOrder += 1;
  }
  return starts;
})();

/** 0→1 growth of a node during the entrance: hubs pop with a slight
 *  overshoot, leaves grow in step with the spoke reaching them. */
function nodeEntrance(index: number, t: number): number {
  const node = nodes[index];
  const raw = Math.min(Math.max((t - NODE_START[index]) / (node.hub ? 0.32 : 0.4), 0), 1);
  if (!node.hub) return 1 - Math.pow(1 - raw, 3);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(raw - 1, 3) + c1 * Math.pow(raw - 1, 2);
}

interface LatticeProps {
  activeGroup: number | null;
  onHover: (nodeIndex: number | null) => void;
  state: { current: PointerState };
  mobile: boolean;
}

function Lattice({ activeGroup, onHover, state, mobile }: LatticeProps) {
  const rootRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const [hovered, setHovered] = useState<number | null>(null);

  /* Rotation state, mutated in place by the frame loop. */
  const smoothX = useRef(0);
  const smoothY = useRef(0);
  const driftY = useRef(0);

  /** Per-instance animation state — hubs read twice as large as
   *  leaves; a hovered node swells to 1.5×. */
  const baseScale = useMemo<number[]>(
    () => nodes.map((node) => (node.hub ? 0.34 : 0.17)),
    [],
  );
  /* Starts at zero so the entrance grows nodes from nothing instead
     of snapping down from full size on the first frame. */
  const currentScale = useMemo(() => new Array<number>(nodes.length).fill(0), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  /* Node geometry: one unit box, every node a scaled instance — the
     whole graph is a single draw call. */
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  /* Edge geometry: every link in one LineSegments batch. Targets are
     kept separately so the entrance can draw each link from one end
     and still restore the true endpoints when it finishes. */
  const edgeTargets = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
    edges.forEach((edge, index) => {
      positions.set(nodes[edge.a].pos, index * 6);
      positions.set(nodes[edge.b].pos, index * 6 + 3);
    });
    return positions;
  }, []);

  const edgeGeometry = useMemo(() => {
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(edgeTargets.slice(), 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(new Float32Array(edges.length * 6), 3));
    return buffer;
  }, [edgeTargets]);
  useEffect(() => () => edgeGeometry.dispose(), [edgeGeometry]);

  /* Entrance clock — advances only while the frame loop runs, so a
     panel scrolled past mid-build resumes instead of skipping. */
  const entrance = useRef({ t: 0, done: false });

  /* Initial matrices — the frame loop only touches them again when a
     hover is actually animating. */
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    nodes.forEach((node, index) => {
      dummy.position.set(node.pos[0], node.pos[1], node.pos[2]);
      dummy.scale.setScalar(baseScale[index]);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy, baseScale]);

  /* Node colours: focus dims every other cluster to 16%, the chosen
     one keeps full accent, hubs lift toward white. Hovering a node
     keeps its direct neighbours lit and dims the rest — the graph
     answers "what is this connected to?" in colour. Recolouring only
     happens when the focus or hover changes — never per frame. */
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const scratch = new THREE.Color();

    const neighbours = new Set<number>();
    if (hovered !== null) {
      for (const edgeIndex of edgesFrom[hovered]) {
        const edge = edges[edgeIndex];
        neighbours.add(edge.a === hovered ? edge.b : edge.a);
      }
    }

    nodes.forEach((node, index) => {
      scratch.set(node.color);
      if (activeGroup !== null && node.group !== activeGroup) {
        scratch.multiplyScalar(0.16);
      } else {
        if (node.hub) scratch.multiplyScalar(1.1);
        if (hovered !== null && index !== hovered && !neighbours.has(index)) {
          scratch.multiplyScalar(0.4);
        }
        if (index === hovered) scratch.lerp(WHITE, 0.4);
        else if (neighbours.has(index)) scratch.multiplyScalar(1.15);
      }
      mesh.setColorAt(index, scratch);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [activeGroup, hovered]);

  /* Edge colours: same focus logic, one recolour per state change. */
  useEffect(() => {
    const attribute = edgeGeometry.getAttribute("color") as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;
    const scratch = new THREE.Color();
    const accent = activeGroup === null ? null : new THREE.Color(groupAccent(activeGroup));

    edges.forEach((edge, index) => {
      const inA = nodes[edge.a].group === activeGroup;
      const inB = nodes[edge.b].group === activeGroup;

      if (accent === null) {
        scratch.copy(PAPER).multiplyScalar(edge.kind === "hub" ? 0.3 : 0.17);
      } else if (inA && inB) {
        scratch.copy(accent).multiplyScalar(0.85);
      } else if (inA || inB) {
        scratch.copy(accent).multiplyScalar(0.4);
      } else {
        scratch.copy(PAPER).multiplyScalar(0.07);
      }

      /* Hover emphasis: links touching the hovered node light up,
         every other link recedes — "what does this connect to?"
         becomes visible without a word of explanation. */
      if (hovered !== null) {
        const touches = edge.a === hovered || edge.b === hovered;
        if (touches) scratch.lerp(WHITE, 0.55).multiplyScalar(1.35);
        else scratch.multiplyScalar(0.4);
      }

      array[index * 6] = scratch.r;
      array[index * 6 + 1] = scratch.g;
      array[index * 6 + 2] = scratch.b;
      array[index * 6 + 3] = scratch.r;
      array[index * 6 + 4] = scratch.g;
      array[index * 6 + 5] = scratch.b;
    });

    attribute.needsUpdate = true;
  }, [edgeGeometry, activeGroup, hovered]);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const id = event.instanceId ?? null;
    if (id === hovered) return;
    setHovered(id);
    onHover(id);
  };

  const handlePointerLeave = () => {
    if (hovered === null) return;
    setHovered(null);
    onHover(null);
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const pointer = state.current;

    /* Idle drift + pointer parallax + drag, all smoothed so the
       lattice glides rather than snaps. Drag decays to rest once
       the pointer is released. */
    if (pointer.released) {
      const decay = Math.exp(-dt * 1.1);
      pointer.dragX *= decay;
      pointer.dragY *= decay;
    }

    const goalY = pointer.dragY + pointer.x * 0.3;
    const goalX = pointer.dragX - pointer.y * 0.16;
    const easing = 1 - Math.exp(-4.5 * dt);
    driftY.current += dt * 0.05;
    smoothY.current += (goalY + driftY.current - smoothY.current) * easing;
    smoothX.current += (goalX - smoothX.current) * easing;
    if (rootRef.current) rootRef.current.rotation.set(smoothX.current, smoothY.current, 0);

    /* Rim light tracks the pointer — the scene's dynamic lighting. */
    if (lightRef.current) {
      lightRef.current.position.set(pointer.x * 7, -pointer.y * 5, 4.5);
    }

    /* ── Entrance: cluster plates pop, spokes draw outward from each
       hub, then the links that projects create appear last. The build
       order itself explains the graph's structure. Runs on accumulated
       frame time, so a panel scrolled past mid-build resumes rather
       than skipping, and it never repeats. */
    const entranceState = entrance.current;
    if (!entranceState.done) {
      entranceState.t += dt;
      const t = entranceState.t;

      const attribute = edgeGeometry.getAttribute("position") as THREE.BufferAttribute;
      const array = attribute.array as Float32Array;
      let allDrawn = true;

      edges.forEach((_edge, index) => {
        const raw = Math.min(Math.max((t - EDGE_START[index]) / 0.4, 0), 1);
        if (raw < 1) allDrawn = false;
        const progress = 1 - Math.pow(1 - raw, 3);
        const base = index * 6;
        for (let k = 0; k < 3; k += 1) {
          const origin = edgeTargets[base + k];
          array[base + 3 + k] = origin + (edgeTargets[base + 3 + k] - origin) * progress;
        }
      });

      attribute.needsUpdate = true;
      if (allDrawn) {
        array.set(edgeTargets);
        attribute.needsUpdate = true;
        entranceState.done = true;
      }
    }

    /* Hover swell, lerped per node. During the entrance the scale is
       scripted directly; afterwards it eases toward the hover goal. */
    const mesh = meshRef.current;
    if (mesh) {
      let animating = false;
      nodes.forEach((node, index) => {
        const grow = entranceState.done ? 1 : nodeEntrance(index, entranceState.t);
        const goal = baseScale[index] * (index === hovered ? 1.5 : 1) * grow;
        if (!entranceState.done) {
          currentScale[index] = goal;
          animating = true;
        } else {
          const difference = goal - currentScale[index];
          if (Math.abs(difference) > 1e-4) {
            animating = true;
            currentScale[index] += difference * (1 - Math.exp(-12 * dt));
          } else {
            currentScale[index] = goal;
          }
        }
        dummy.position.set(node.pos[0], node.pos[1], node.pos[2]);
        dummy.scale.setScalar(currentScale[index]);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      });
      if (animating) mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={rootRef}>
      <lineSegments geometry={edgeGeometry} frustumCulled={false}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.75}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, nodes.length]}
        geometry={geometry}
        frustumCulled={false}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <meshStandardMaterial
          roughness={0.4}
          metalness={0.05}
          toneMapped={false}
        />
      </instancedMesh>

      <pointLight ref={lightRef} color="#d7ff32" intensity={18} distance={18} decay={2} position={[0, 0, 4.5]} />

      <Dust mobile={mobile} />
    </group>
  );
}

/* ── Dust ───────────────────────────────────────────────────────── */

function Dust({ mobile }: { mobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = mobile ? 120 : 260;

  const geometry = useMemo(() => {
    const buffer = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#d7ff32"),
      new THREE.Color("#ff5938"),
      new THREE.Color("#f4f0e8"),
    ];
    const random = mulberry32(7);

    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (random() * 2 - 1) * 7;
      positions[index * 3 + 1] = (random() * 2 - 1) * 3.6;
      positions[index * 3 + 2] = -5 + random() * 8;
      const color = palette[index % palette.length];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return buffer;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += Math.min(delta, 0.05) * 0.035;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.055}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.5}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/* ── Scene root ─────────────────────────────────────────────────── */

export default function SpatialIndex({
  activeGroup,
  onHover,
  state,
  visible,
  mobile,
}: SceneProps) {
  return (
    <Canvas
      flat
      dpr={mobile ? 1 : [1, 1.5]}
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 11.5], fov: 34, near: 0.1, far: 60 }}
      gl={{
        alpha: true,
        antialias: !mobile,
        powerPreference: "low-power",
        stencil: false,
      }}
      style={{ touchAction: "pan-y", cursor: "crosshair" }}
    >
      <ResponsiveCamera />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 6, 6]} intensity={1.5} />
      <pointLight color="#5b6bff" intensity={14} distance={20} decay={2} position={[-4, -3, -2]} />
      <Lattice
        activeGroup={activeGroup}
        onHover={onHover}
        state={state}
        mobile={mobile}
      />
    </Canvas>
  );
}
