import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import App from "../App";

function workRegion() {
  return screen.getByRole("region", { name: "Selected work" });
}

test("renders all four projects as stacked articles", () => {
  render(<App />);
  const region = workRegion();
  expect(
    within(region).getByRole("heading", { level: 2, name: "Selected work" }),
  ).toBeInTheDocument();
  const articles = within(region).getAllByRole("article");
  expect(articles).toHaveLength(4);
  expect(within(region).getByRole("heading", { name: "IntelRouter" })).toBeInTheDocument();
  expect(
    within(region).getByRole("heading", { name: /Quantum Cryptography/ }),
  ).toBeInTheDocument();
});

test("shows repository links only where repoLink exists", () => {
  render(<App />);
  const region = workRegion();
  const intel = within(region).getByRole("heading", { name: "IntelRouter" }).closest("article")!;
  expect(
    intel.querySelector('a[href="https://github.com/VA-SA-NT-H/intelrouter"]'),
  ).not.toBeNull();
  const quantum = within(region)
    .getByRole("heading", { name: /Quantum Cryptography/ })
    .closest("article")!;
  expect(quantum.querySelector("a")).toBeNull();
});

test("expands and collapses project details", async () => {
  const user = userEvent.setup();
  render(<App />);
  const region = workRegion();
  const intel = within(region).getByRole("heading", { name: "IntelRouter" }).closest("article")!;
  const button = within(intel).getByRole("button", { name: "Show details" });
  expect(button).toHaveAttribute("aria-expanded", "false");
  expect(within(intel).queryByText(/ML-powered routing engine/)).toBeNull();

  await user.click(button);
  expect(within(intel).getByText(/ML-powered routing engine/)).toBeInTheDocument();
  expect(within(intel).getByText(/Reduced AI inference costs/)).toBeInTheDocument();
  expect(within(intel).getByRole("button", { name: "Hide details" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );

  await user.click(within(intel).getByRole("button", { name: "Hide details" }));
  expect(within(intel).queryByText(/ML-powered routing engine/)).toBeNull();
});

test("renders metrics and tech tags", () => {
  render(<App />);
  const region = workRegion();
  const intel = within(region).getByRole("heading", { name: "IntelRouter" }).closest("article")!;
  expect(within(intel).getByText("Dynamic")).toBeInTheDocument();
  const techList = within(intel).getByRole("list", { name: "Technologies" });
  expect(within(techList).getByText("Redis")).toBeInTheDocument();
  expect(within(techList).getByText("FastAPI")).toBeInTheDocument();
  const quantum = within(region)
    .getByRole("heading", { name: /Quantum Cryptography/ })
    .closest("article")!;
  expect(within(quantum).getByText("15/15")).toBeInTheDocument();
});
