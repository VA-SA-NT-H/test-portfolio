import { motion } from "motion/react";
import { useState } from "react";
import type { projects } from "../../data/projects";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export type Project = (typeof projects)[number];

interface ProjectCardProps {
  project: Project;
  /** Featured variant renders the project as a large case-study panel. */
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const detailId = `project-${project.id}-detail`;

  return (
    <motion.article
      className={`group relative border border-white/10 bg-panel transition-colors hover:border-accent/40 ${
        featured ? "border-l-2 border-l-accent p-6 sm:p-10" : "p-6"
      }`}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3
          className={`font-display font-semibold ${
            featured ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
          }`}
        >
          {project.title}
        </h3>
        <span className="text-sm text-muted">{project.category}</span>
      </div>

      <p className={`mt-2 text-signal ${featured ? "text-lg" : ""}`}>{project.tagline}</p>

      <ul
        className={`flex flex-wrap gap-2 ${featured ? "mt-6" : "mt-4"}`}
        aria-label="Technologies"
      >
        {project.technologies.map((tech) => (
          <li
            key={tech}
            className="border border-white/10 px-2 py-0.5 font-mono text-xs text-muted transition-colors group-hover:border-accent/30"
          >
            {tech}
          </li>
        ))}
      </ul>

      <dl
        className={`grid grid-cols-3 gap-4 border-t border-white/10 pt-4 ${
          featured ? "mt-8" : "mt-5"
        }`}
      >
        {project.metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="text-xs text-muted">{metric.label}</dt>
            <dd
              className={`font-mono text-signal ${
                featured ? "text-2xl sm:text-3xl" : "text-lg"
              }`}
            >
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className={`flex flex-wrap items-center gap-4 ${featured ? "mt-8" : "mt-5"}`}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => setOpen((value) => !value)}
          className="text-sm text-accent underline-offset-4 hover:underline"
        >
          {open ? "Hide details" : "Show details"}
        </button>
        {project.repoLink && (
          <a
            href={project.repoLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            View repository
          </a>
        )}
      </div>

      {open && (
        <div id={detailId} className="mt-4 border-t border-white/10 pt-4">
          <p className="max-w-3xl text-sm leading-relaxed text-muted">{project.description}</p>
          <p className="mt-2 text-sm text-ink">{project.highlight}</p>
        </div>
      )}
    </motion.article>
  );
}
