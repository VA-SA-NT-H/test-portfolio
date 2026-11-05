import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

function craftRegion() {
  return screen.getByRole("region", { name: "Craft" });
}

test("renders all six skill groups", () => {
  render(<App />);
  const region = craftRegion();
  expect(within(region).getByRole("heading", { level: 2, name: "Craft" })).toBeInTheDocument();
  for (const title of ["Programming", "Backend", "Databases", "DevOps", "AI & ML", "Security"]) {
    expect(within(region).getByRole("heading", { name: title })).toBeInTheDocument();
  }
});

test("renders every skill and all four certifications", () => {
  render(<App />);
  const region = craftRegion();
  expect(within(region).getAllByRole("listitem")).toHaveLength(36);
  expect(within(region).getByText("Spring Boot")).toBeInTheDocument();
  expect(within(region).getByText("E91")).toBeInTheDocument();
  expect(within(region).getByRole("heading", { name: "Certifications" })).toBeInTheDocument();
  expect(within(region).getByText("Cloud Computing (NPTEL)")).toBeInTheDocument();
  expect(within(region).getByText("AI & Quantum Computing Mastery")).toBeInTheDocument();
});
