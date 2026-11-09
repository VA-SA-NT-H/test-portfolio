import { Component, type ReactNode } from "react";

interface SceneBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface SceneBoundaryState {
  failed: boolean;
}

/**
 * WebGL failures don't throw nicely — a blocked context, a driver
 * reset or a lost context all surface as render-time errors. This
 * boundary catches them once and swaps in the static projection, so
 * a broken GPU never means a broken section.
 */
export class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  override state: SceneBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true };
  }

  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
