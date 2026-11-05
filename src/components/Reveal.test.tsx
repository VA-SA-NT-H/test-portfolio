import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { stubMatchMedia } from "../test/setup";
import { Reveal } from "./Reveal";

test("wraps content in an animated reveal", () => {
  render(
    <Reveal className="wrapper">
      <p>hello</p>
    </Reveal>,
  );
  const wrapper = screen.getByText("hello").closest("[data-reveal]");
  expect(wrapper).toHaveAttribute("data-reveal", "motion");
  expect(wrapper).toHaveClass("wrapper");
});

test("renders statically when the user prefers reduced motion", () => {
  vi.stubGlobal("matchMedia", stubMatchMedia(true));
  render(
    <Reveal>
      <p>hello</p>
    </Reveal>,
  );
  expect(screen.getByText("hello").closest("[data-reveal]")).toHaveAttribute("data-reveal", "static");
});
