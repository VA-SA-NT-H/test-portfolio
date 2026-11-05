import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { stubMatchMedia } from "../test/setup";
import { useCountUp } from "./useCountUp";

function Counter({ target, duration }: { target: number; duration: number }) {
  const { ref, value } = useCountUp(target, duration);
  return <span ref={ref}>{value}</span>;
}

test("starts at zero and counts up to the target once in view", async () => {
  render(<Counter target={15} duration={60} />);
  expect(screen.getByText("0")).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText("15")).toBeInTheDocument(), { timeout: 2000 });
});

test("jumps straight to the target under reduced motion", () => {
  vi.stubGlobal("matchMedia", stubMatchMedia(true));
  render(<Counter target={15} duration={60} />);
  expect(screen.getByText("15")).toBeInTheDocument();
});
