import { expect, test } from "vitest";
import * as portfolioModule from "../data/portfolio";
import { projects } from "../data/projects";
import { certifications } from "../data/certifications";
import { experience } from "../data/experience";

test("projects live only in data/projects.ts, three of four with repo links", () => {
  expect(projects).toHaveLength(4);
  expect(projects.filter((p) => p.repoLink)).toHaveLength(3);
  expect(portfolioModule).not.toHaveProperty("projects");
});

test("every project has title, description, technologies and metrics", () => {
  for (const p of projects) {
    expect(p.title.length).toBeGreaterThan(0);
    expect(p.description.length).toBeGreaterThan(0);
    expect(p.technologies.length).toBeGreaterThan(0);
    expect(p.metrics).toHaveLength(3);
  }
});

test("timeline entries match the TimelineEntry shape with no stray fields", () => {
  expect(portfolioModule.timeline).toHaveLength(3);
  for (const entry of portfolioModule.timeline) {
    expect(entry).toHaveProperty("start");
    expect(entry).toHaveProperty("period");
    expect(entry).toHaveProperty("title");
    expect(entry).toHaveProperty("organization");
    expect(entry).not.toHaveProperty("position");
  }
});

test("supporting data files are populated", () => {
  expect(portfolioModule.skillGroups).toHaveLength(6);
  expect(certifications).toHaveLength(4);
  expect(experience.highlights).toHaveLength(5);
  expect(experience.achievements).toHaveLength(3);
});
