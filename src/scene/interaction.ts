/**
 * Pointer state written by the panel (main bundle) and read every
 * frame by the scene (async chunk) through a mutable ref — no React
 * re-render, no context, no allocation in the frame loop.
 *
 * `x` / `y` are normalised to [-1, 1] over the panel rect;
 * `dragX` / `dragY` accumulate while the pointer is down and decay
 * back to rest after release, so the lattice settles instead of
 * stopping dead.
 */
export interface PointerState {
  x: number;
  y: number;
  dragX: number;
  dragY: number;
  released: boolean;
}

export const createPointerState = (): PointerState => ({
  x: 0,
  y: 0,
  dragX: 0,
  dragY: 0,
  released: true,
});
