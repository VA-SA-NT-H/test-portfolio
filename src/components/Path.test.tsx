import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

function pathRegion() {
  return screen.getByRole("region", { name: "Path" });
}

test("renders three timeline entries in order", () => {
  render(<App />);
  const region = pathRegion();
  expect(within(region).getByRole("heading", { level: 2, name: "Path" })).toBeInTheDocument();
  expect(within(region).getAllByRole("listitem")).toHaveLength(3);
  expect(within(region).getByText("Nov 2022 — May 2026")).toBeInTheDocument();
  expect(within(region).getByText("Jun 2025 — Jul 2025")).toBeInTheDocument();
  expect(within(region).getByText("Sep 2026 — Present")).toBeInTheDocument();
});

test("marks the current role with a Present badge and links the organization", () => {
  render(<App />);
  const region = pathRegion();
  expect(within(region).getByText("Present")).toBeInTheDocument();
  const digiclarity = within(region).getByRole("link", {
    name: "Digiclarity Global Solutions Private Limited",
  });
  expect(digiclarity).toHaveAttribute("href", "https://www.digiclarity.in/");
  expect(within(region).queryByRole("link", { name: "Annamalai University" })).toBeNull();
});

test("shows the degree and internship titles", () => {
  render(<App />);
  const region = pathRegion();
  expect(within(region).getByText("B.E. Computer Science & Engineering")).toBeInTheDocument();
  expect(within(region).getByRole("heading", { name: /Software Engineer/ })).toBeInTheDocument();
});
