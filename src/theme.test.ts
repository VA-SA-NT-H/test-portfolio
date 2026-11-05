import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

test("index.css defines the Entanglement palette and type roles", () => {
  const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");
  const lower = css.toLowerCase();
  for (const token of [
    "#070b18",
    "#10172b",
    "#6ee7d7",
    "#f2b441",
    "#e8ecf7",
    "#8a93ad",
    "#f1f4f8",
    "#0b1020",
    "space grotesk",
    "inter",
    "ibm plex mono",
  ]) {
    expect(lower).toContain(token);
  }
});
