import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "./App";

test("renders the app shell with a main landmark", () => {
  render(<App />);
  expect(screen.getByRole("main")).toBeInTheDocument();
});

test("orders the page hero, work, research, path, craft, contact", () => {
  render(<App />);
  const main = screen.getByRole("main");
  const ids = Array.from(main.querySelectorAll("section")).map((section) => section.id);
  expect(ids).toEqual(["top", "work", "research", "path", "craft", "contact"]);
});

test("provides skip link, banner and primary navigation landmarks", () => {
  render(<App />);
  expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  expect(screen.getByRole("main")).toHaveAttribute("id", "main");
});
