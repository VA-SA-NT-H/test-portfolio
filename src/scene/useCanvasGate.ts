import { useMemo } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export type CanvasGate = "scene" | "fallback";

interface SaveDataNavigator extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

/**
 * Decides — in the main bundle, *before* anything imports three.js —
 * whether the WebGL scene is allowed to load at all. Any "no" means
 * the static SVG projection renders instead and the 3D chunk is never
 * fetched, so low-end devices pay zero bytes for the experiment.
 *
 * Deliberately conservative: reduced motion, data saving, ≤2 GB of
 * reported memory, ≤2 cores, or a WebGL context that cannot be
 * created all route to the fallback.
 */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    // Release the probe context immediately — browsers cap live
    // contexts at ~16 and this one is throwaway.
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function useCanvasGate(): CanvasGate {
  const reduced = usePrefersReducedMotion();

  return useMemo(() => {
    if (typeof window === "undefined" || reduced) return "fallback";

    const nav = navigator as SaveDataNavigator;
    if (nav.connection?.saveData) return "fallback";
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return "fallback";
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) {
      return "fallback";
    }
    if (!hasWebGL()) return "fallback";

    return "scene";
  }, [reduced]);
}
