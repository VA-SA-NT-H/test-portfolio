import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

function contactRegion() {
  return screen.getByRole("region", { name: "Contact" });
}

test("offers email, phone, location and GitHub", () => {
  render(<App />);
  const region = contactRegion();
  expect(within(region).getByRole("heading", { level: 2, name: "Contact" })).toBeInTheDocument();
  expect(within(region).getByRole("link", { name: "vasanthc.work@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:vasanthc.work@gmail.com",
  );
  expect(within(region).getByRole("link", { name: "+91 93440 86105" })).toHaveAttribute(
    "href",
    "tel:+919344086105",
  );
  expect(within(region).getByText("Tamil Nadu, India")).toBeInTheDocument();
  expect(
    within(region).getByRole("link", { name: "github.com/VA-SA-NT-H" }),
  ).toHaveAttribute("href", "https://github.com/VA-SA-NT-H");
});
