import { render, screen, waitFor, within } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

function researchRegion() {
  return screen.getByRole("region", { name: "Research" });
}

test("renders the IIST internship details in a light-inverted section", () => {
  render(<App />);
  const region = researchRegion();
  expect(region).toHaveClass("bg-paper", "text-night");
  expect(within(region).getByRole("heading", { level: 2, name: "Research" })).toBeInTheDocument();
  expect(
    within(region).getByRole("heading", { name: "Summer Research Intern" }),
  ).toBeInTheDocument();
  expect(
    within(region).getByText(
      "Indian Institute of Space Science & Technology · Jun 2025 – Jul 2025",
    ),
  ).toBeInTheDocument();
});

test("lists all five research highlights", () => {
  render(<App />);
  const region = researchRegion();
  expect(within(region).getByText(/hybrid E91 QKD \+ Chaos \+ AES-256/i)).toBeInTheDocument();
  expect(within(region).getByText(/BITXOR fusion/i)).toBeInTheDocument();
  expect(
    within(region).getByText(/Passed all 15 NIST Statistical Test Suite validations/),
  ).toBeInTheDocument();
  expect(within(region).getByText(/BB84\+Chaos/i)).toBeInTheDocument();
  expect(within(region).getByText(/NPCR, UACI, PSNR, MSE, and MAE/)).toBeInTheDocument();
});

test("counts the achievement metrics up to their targets", async () => {
  render(<App />);
  const region = researchRegion();
  await waitFor(() => expect(within(region).getByText("15+")).toBeInTheDocument(), {
    timeout: 3000,
  });
  await waitFor(() => expect(within(region).getByText("8+")).toBeInTheDocument(), {
    timeout: 3000,
  });
  await waitFor(() => expect(within(region).getByText("1")).toBeInTheDocument(), {
    timeout: 3000,
  });
  expect(within(region).getByText("NIST Tests Passed")).toBeInTheDocument();
});
