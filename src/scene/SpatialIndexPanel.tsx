import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useSceneVisibility } from "../hooks/useSceneVisibility";
import { SceneBoundary } from "./SceneBoundary";
import { createPointerState } from "./interaction";
import { groupTitles, stats, explainNode, groupAccent } from "./latticeGraph";
import { SpatialIndexFallback } from "./SpatialIndexFallback";
import { useCanvasGate } from "./useCanvasGate";

/** Loaded only when the panel approaches the viewport *and* the gate
 *  says the device deserves it — three.js never reaches the main chunk. */
const SpatialIndex = lazy(() => import("./SpatialIndex"));

interface SpatialIndexPanelProps {
  /** The Craft row under the pointer (or null) — lights its cluster. */
  activeGroup: number | null;
}

export function SpatialIndexPanel({ activeGroup }: SpatialIndexPanelProps) {
  const gate = useCanvasGate();
  const [surfaceRef, { near, visible }] = useSceneVisibility<HTMLDivElement>();
  const pointerState = useRef(createPointerState());
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const onChange = (event: MediaQueryListEvent) => setMobile(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const showScene = gate === "scene" && near;

  /* Pointer tracking: cached rect, listeners only while the scene is
     actually mounted, and no work at all once the panel is off screen.
     Vertical drags belong to the page (the canvas is touch-action:
     pan-y) — only horizontal movement rotates the lattice. */
  useEffect(() => {
    if (!showScene) return;
    const element = surfaceRef.current;
    if (!element) return;

    let rect = element.getBoundingClientRect();
    let onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
    let dragging = false;
    let lastX = 0;

    const measure = () => {
      rect = element.getBoundingClientRect();
      onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const track = (event: PointerEvent) => {
      if (!onScreen || rect.width === 0) return;
      pointerState.current.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointerState.current.y = (event.clientY - rect.top) / rect.height - 0.5;
      pointerState.current.x *= 2;
      pointerState.current.y *= 2;

      if (!dragging) return;
      const delta = (event.clientX - lastX) / rect.width;
      lastX = event.clientX;
      const next = pointerState.current.dragY + delta * 2.4;
      pointerState.current.dragY = Math.max(-0.7, Math.min(0.7, next));
    };

    const handleDown = (event: PointerEvent) => {
      dragging = true;
      pointerState.current.released = false;
      lastX = event.clientX;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      pointerState.current.released = true;
    };

    element.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointermove", track, { passive: true });
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      element.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointermove", track);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [showScene, surfaceRef]);

  /* The readout is the graph's voice: it always states a fact — the
     focus, a relationship between two technologies and the project
     that proves it, or the totals. */
  const readout =
    activeGroup !== null
      ? `Focus · ${groupTitles[activeGroup]} — hub ${String(activeGroup + 1).padStart(2, "0")} / ${String(stats.clusters).padStart(2, "0")}`
      : hoveredNode !== null
        ? explainNode(hoveredNode)
        : `${stats.nodeCount} nodes · ${stats.edgeCount} links`;

  const staticPlate = (
    <div className="h-full w-full p-3 sm:p-4">
      <SpatialIndexFallback />
    </div>
  );

  return (
    <section
      aria-label="Spatial index of the technical stack"
      className="surface-ink relative mt-10 border-2 border-ink bg-ink text-paper"
    >
      {/* Live header — mono, same idiom as the certifications block */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-paper/20 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] sm:px-5">
        <span className="flex items-center gap-2.5">
          <span aria-hidden="true" className="inline-block h-2 w-2 bg-lime" />
          Spatial index
        </span>
        <span className="text-lime">{readout}</span>
      </div>

      {/* Surface */}
      <div
        ref={surfaceRef}
        className="spatial-surface relative h-[300px] sm:h-[380px] lg:h-[440px]"
      >
        {showScene ? (
          /* The live canvas is decorative: the readout above and the
             index below carry every fact it shows. */
          <div aria-hidden="true" className="absolute inset-0">
            <SceneBoundary fallback={staticPlate}>
              <Suspense fallback={staticPlate}>
                <SpatialIndex
                  activeGroup={activeGroup}
                  onHover={setHoveredNode}
                  state={pointerState}
                  visible={visible}
                  mobile={mobile}
                />
              </Suspense>
            </SceneBoundary>
          </div>
        ) : (
          staticPlate
        )}
      </div>

      {/* Legend — the picture decoded in words, so the graph never
          asks to be admired without being understood. */}
      <div className="border-t border-paper/20 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-concrete">
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block h-1.5 w-1.5 bg-paper/70" />
              Square = technology
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 bg-lime" />
              Large square = cluster hub 01–09
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block h-px w-5 bg-paper/50" />
              Line = used together in a project
            </span>
          </span>
          <span className="text-lime">
            {showScene ? "Drag to rotate · hover a node" : "Static projection"}
          </span>
        </div>

        {/* Numbered cluster key — decodes every hub plate at a glance */}
        <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.14em]">
          {groupTitles.map((title, index) => {
            const active = activeGroup === index;
            return (
              <li
                key={title}
                className={`flex items-center gap-1.5 transition-colors duration-200 ${
                  active ? "text-lime" : "text-concrete"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2"
                  style={{ background: groupAccent(index) }}
                />
                {String(index + 1).padStart(2, "0")} {title}
              </li>
            );
          })}
        </ul>
      </div>

      <p className="sr-only">
        A decorative projection of the technical index: {stats.clusters} clusters of technologies
        linked by which of the four case-study projects use them together. Every cluster and
        technology is also listed in the index below, numbered to match.
      </p>
    </section>
  );
}
