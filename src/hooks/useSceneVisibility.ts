import { useEffect, useRef, useState, type RefObject } from "react";

interface SceneVisibility {
  /** Within `nearMargin` of the viewport — the cue to start fetching the scene chunk. */
  near: boolean;
  /** Fully on screen — the cue to run the frame loop. */
  visible: boolean;
}

/**
 * One element, two IntersectionObservers:
 *
 * - `near` is sticky (once it turns true it stays true) so the lazy
 *   WebGL chunk is requested exactly once and never re-fetched while
 *   scrolling past.
 * - `visible` tracks the real intersection so the frame loop can stop
 *   the moment the panel leaves the viewport.
 *
 * Falls back to "everything on" when IntersectionObserver is missing
 * — the scene still works, it just renders while off screen.
 */
export function useSceneVisibility<T extends HTMLElement>(): [
  RefObject<T | null>,
  SceneVisibility,
] {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  /* Starts true: the scene mounts only after `near` fires, and a
     first frame must never be deferred to the observer's callback —
     a "never" loop that misses its first invalidate is a blank box. */
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setNear(true);
      setVisible(true);
      return;
    }

    const nearObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setNear(true);
        }
      },
      { rootMargin: "600px 0px" },
    );

    const visibleObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVisible(entry.isIntersecting);
      },
      { rootMargin: "0px" },
    );

    nearObserver.observe(element);
    visibleObserver.observe(element);

    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
    };
  }, []);

  return [ref, { near, visible }];
}
