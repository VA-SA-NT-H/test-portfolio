import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { Header } from "./Header";

test("shows the five section links", () => {
  render(<Header />);
  const nav = screen.getByRole("navigation", { name: "Primary" });
  const links = within(nav).getAllByRole("link");
  expect(links.map((l) => l.textContent)).toEqual([
    "Work",
    "Research",
    "Path",
    "Craft",
    "Contact",
  ]);
  expect(links.map((l) => l.getAttribute("href"))).toEqual([
    "#work",
    "#research",
    "#path",
    "#craft",
    "#contact",
  ]);
});

test("toggles the mobile menu and closes it when a link is chosen", async () => {
  const user = userEvent.setup();
  render(<Header />);
  const button = screen.getByRole("button", { name: "Menu" });
  expect(button).toHaveAttribute("aria-expanded", "false");

  await user.click(button);
  expect(button).toHaveAttribute("aria-expanded", "true");
  expect(within(screen.getByRole("navigation", { name: "Primary" })).getAllByRole("link")).toHaveLength(10);

  const mobileWorkLinks = screen.getAllByRole("link", { name: "Work" });
  await user.click(mobileWorkLinks[mobileWorkLinks.length - 1]);
  expect(button).toHaveAttribute("aria-expanded", "false");
});
