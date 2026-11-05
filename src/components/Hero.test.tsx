import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Hero } from "./Hero";

test("introduces Vasanth with role, tagline and CTAs", () => {
  render(<Hero />);
  expect(screen.getByRole("heading", { level: 1, name: "Vasanth C" })).toBeInTheDocument();
  expect(
    screen.getByText("Software Engineer · Java Developer · Full Stack Developer"),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Building Secure, Intelligent & Scalable Software Systems"),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View work" })).toHaveAttribute("href", "#work");
  expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "#contact");
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/VA-SA-NT-H",
  );
});
