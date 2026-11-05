import { useMemo, useState } from "react";
import { projects } from "../../data/projects";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";

/**
 * Projects as the centerpiece: first project featured full-width,
 * the rest offset in a zigzag — no identical card grid.
 */
export function Work() {
  const [active, setActive] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    [],
  );
  const visible = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6"
    >
      <Reveal>
        <h2 id="work-heading" className="font-display text-3xl font-semibold sm:text-4xl">
          Selected work
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Four systems — what they do, what they are built with, and the results they produced.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div
          role="group"
          aria-label="Filter projects by category"
          className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-white/10 pb-3"
        >
          {categories.map((category) => {
            const isActive = active === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(category)}
                className={`border-b-2 pb-1 text-sm transition-colors ${
                  isActive
                    ? "border-accent text-ink"
                    : "border-transparent text-muted hover:text-accent"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* key={active} re-runs the entrance choreography on filter change */}
      <div key={active} className="mt-10 flex flex-col gap-6">
        {visible.map((project, index) => (
          <Reveal
            key={project.id}
            delay={index * 0.05}
            className={
              index === 0
                ? undefined
                : index % 2 === 1
                  ? "lg:ml-auto lg:w-[94%]"
                  : "lg:w-[94%]"
            }
          >
            <ProjectCard project={project} featured={index === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
