import { projects } from "../../data/projects";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";

export function Work() {
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
      <div className="mt-10 flex flex-col gap-6">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.05}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
