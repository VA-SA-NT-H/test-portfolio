import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { stubMatchMedia } from "../test/setup";
import { EntanglementDiagram } from "./EntanglementDiagram";

function getSvg(container: HTMLElement): SVGSVGElement {
  const svg = container.querySelector("svg");
  expect(svg).not.toBeNull();
  return svg as SVGSVGElement;
}

test("renders two nodes, three photon paths and three animated photons", () => {
  const { container } = render(<EntanglementDiagram />);
  const svg = getSvg(container);
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg.querySelectorAll("path")).toHaveLength(3);
  expect(svg.querySelectorAll("circle")).toHaveLength(5);
  expect(svg.querySelectorAll("animateMotion")).toHaveLength(3);
});

test("freezes photon animation under reduced motion", () => {
  vi.stubGlobal("matchMedia", stubMatchMedia(true));
  const { container } = render(<EntanglementDiagram />);
  const svg = getSvg(container);
  expect(svg.querySelectorAll("circle")).toHaveLength(2);
  expect(svg.querySelectorAll("animateMotion")).toHaveLength(0);
});
