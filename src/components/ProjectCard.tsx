import { motion } from "motion/react";
import { useState } from "react";
import type { projects } from "../../data/projects";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export type Project = (typeof projects)[number];

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const detailId = `project-${project.id}-detail`;

  return (
    <motion.article
      className="border border-white/10 bg-panel p-6 sm:p-8"
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl font-semibold">{project.title}</h3>
        <span className="text-sm text-muted">{project.category}</span>
      </div>
      <p className="mt-1 text-entangle">{project.tagline}</p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
        {project.technologies.map((tech) => (
          <li key={tech} className="border border-white/10 px-2 py-0.5 font-mono text-xs text-muted">
            {tech}
          </li>
        ))}
      </ul>

      <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
        {project.metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="text-xs text-muted">{metric.label}</dt>
            <dd className="font-mono text-lg text-measure">{metric.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => setOpen((value) => !value)}
          className="text-sm text-entangle underline-offset-4 hover:underline"
        >
          {open ? "Hide details" : "Show details"}
        </button>
        {project.repoLink && (
          <a
            href={project.repoLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            View repository
          </a>
        )}
      </div>

      {open && (
        <div id={detailId} className="mt-4 border-t border-white/10 pt-4">
          <p className="text-sm leading-relaxed text-muted">{project.description}</p>
          <p className="mt-2 text-sm text-ink">{project.highlight}</p>
        </div>
      )}
    </motion.article>
  );
}
