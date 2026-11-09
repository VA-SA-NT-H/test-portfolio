import { motion } from "motion/react";
import type { ReactNode } from "react";
import { DUR, EASE_OUT, VIEWPORT } from "../../motion/presets";
import type { Project } from "./types";

/* ── Shared parts of every case study ────────────────────────
   Tone-driven so the same semantic block can sit on an ink
   surface, a paper surface, or a solid accent field without
   ever changing its markup or its data source.            */

export type Tone = "ink" | "paper" | "field";
export type Accent = "lime" | "orange" | "blue";

export const ACCENT_TEXT = {
  lime: "text-lime",
  orange: "text-orange",
  blue: "text-blue",
} as const;

export const ACCENT_BG = {
  lime: "bg-lime",
  orange: "bg-orange",
  blue: "bg-blue",
} as const;

export const ACCENT_SVG = {
  lime: "stroke-lime",
  orange: "stroke-orange",
  blue: "stroke-blue",
} as const;

export const ACCENT_FILL = {
  lime: "fill-lime",
  orange: "fill-orange",
  blue: "fill-blue",
} as const;

/** Which accent carries each project — same mapping the gallery uses. */
export const ACCENT_BY_ID: Record<number, Accent> = {
  1: "lime",
  2: "orange",
  3: "orange",
  4: "blue",
};

/* ── Technology tags ───────────────────────────────────────── */

export function TechTags({
  technologies,
  tone,
  label = "Technologies",
}: {
  technologies: string[];
  tone: Tone;
  label?: string;
}) {
  const chip =
    tone === "ink"
      ? "border-paper/40 text-concrete group-hover:border-paper/80"
      : "border-ink/60 text-slate group-hover:border-ink";
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {technologies.map((tech) => (
        <li
          key={tech}
          className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${chip}`}
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

/* ── Metrics row ───────────────────────────────────────────── */

export function Metrics({
  metrics,
  tone,
  accent,
  className = "",
}: ToneProps & { metrics: Project["metrics"]; className?: string }) {
  const rule = tone === "ink" ? "border-paper/30" : "border-ink";
  const label =
    tone === "ink" ? "text-concrete" : tone === "field" ? "text-ink/75" : "text-slate";
  /* Value color by surface: on ink every accent sings; on a colour
     field the value stays ink; on paper lime and orange are surface
     colors — orange drops to its deep variant, lime to ink. */
  const value =
    tone === "field"
      ? "text-ink"
      : tone === "paper"
        ? accent === "orange"
          ? "text-rust"
          : accent === "blue"
            ? "text-blue"
            : "text-ink"
        : ACCENT_TEXT[accent];
  return (
    /* Results arrive one metric after the story, left → right —
       sequencing the eye across the three numbers. */
    <motion.dl
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className={`grid grid-cols-3 gap-4 border-t-2 ${rule} pt-5 ${className}`}
    >
      {metrics.map((metric) => (
        <motion.div
          key={metric.label}
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE_OUT } },
          }}
        >
          <dt className={`font-mono text-[10px] uppercase tracking-[0.2em] ${label}`}>
            {metric.label}
          </dt>
          <dd
            className={`mt-1.5 font-display text-[clamp(0.95rem,1.7vw,1.5rem)] uppercase leading-tight ${value}`}
          >
            {metric.value}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}

interface ToneProps {
  /** ink = light type on a dark block, paper = dark type on a light
   *  surface, field = ink type on a solid accent field */
  tone: Tone;
  accent: Accent;
}

/* ── Result / achievement callout ──────────────────────────── */

export function ResultBlock({
  project,
  tone,
  heading = "Result",
}: {
  project: Project;
  tone: Tone;
  heading?: string;
}) {
  const bar = tone === "ink" ? "border-lime" : "border-ink";
  const labelColor = tone === "ink" ? "text-lime" : "text-slate";
  const textColor = tone === "ink" ? "text-paper" : "text-ink";
  return (
    <div className={`mt-7 border-l-4 pl-4 ${bar}`}>
      <span className={`font-mono text-[10px] uppercase tracking-[0.26em] ${labelColor}`}>
        {heading}
      </span>
      <p
        className={`mt-2 font-grotesk text-lg font-semibold leading-snug sm:text-xl ${textColor}`}
      >
        {project.highlight}
      </p>
    </div>
  );
}

/* ── Links: repository + (only when real) live demo ────────── */

export function LinkRow({
  project,
  tone,
  className = "",
  children,
}: {
  project: Project;
  tone: Tone;
  className?: string;
  children?: ReactNode;
}) {
  const skin =
    tone === "ink"
      ? "border-paper text-paper hover:border-lime hover:bg-lime hover:text-ink"
      : "border-ink text-ink hover:bg-ink hover:text-paper";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {children}
      {project.repoLink && (
        <motion.a
          href={project.repoLink}
          target="_blank"
          rel="noreferrer"
          whileTap={{ scale: 0.96 }}
          transition={{ duration: DUR.micro, ease: EASE_OUT }}
          className={`group/link inline-flex items-center gap-2 border-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${skin}`}
        >
          GitHub
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5"
          >
            ↗
          </span>
        </motion.a>
      )}
      {project.demoLink && (
        <motion.a
          href={project.demoLink}
          target="_blank"
          rel="noreferrer"
          whileTap={{ scale: 0.96 }}
          transition={{ duration: DUR.micro, ease: EASE_OUT }}
          className={`group/link inline-flex items-center gap-2 border-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${skin}`}
        >
          Live demo
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5"
          >
            ↗
          </span>
        </motion.a>
      )}
    </div>
  );
}

/* ── Case title with the hover rule wipe ───────────────────── */

export function CaseTitle({
  project,
  tone,
  accent,
  className = "",
}: ToneProps & { project: Project; className?: string }) {
  const color = tone === "ink" ? "text-paper" : "text-ink";
  return (
    <h3
      className={`relative mt-5 inline-block font-display text-[clamp(1.85rem,5vw,4rem)] uppercase leading-[0.92] tracking-[-0.03em] ${color} ${className}`}
    >
      {project.title}
      <span
        aria-hidden="true"
        className={`absolute -bottom-2 left-0 block h-1.5 w-full origin-left scale-x-0 transition-transform duration-500 ease-rise group-hover:scale-x-100 ${ACCENT_BG[accent]}`}
      />
    </h3>
  );
}

/* ── Caption strip above a schematic visual ────────────────── */

export function VisualCaption({
  label,
  note,
  tone,
  accent,
}: {
  label: string;
  note?: string;
  tone: Tone;
  accent: Accent;
}) {
  const text = tone === "ink" ? "text-concrete" : "text-slate";
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[9px] uppercase tracking-[0.22em] sm:text-[10px]">
      <span className={`flex items-center gap-2.5 ${text}`}>
        <span aria-hidden="true" className={`inline-block h-2 w-2 ${ACCENT_BG[accent]}`} />
        {label}
      </span>
      {/* On ink the flow note lights up with the panel hover — the
          diagram's direction of travel answers the pointer. */}
      {note && (
        <span
          className={`${text}${
            tone === "ink" ? " transition-colors duration-300 group-hover:text-lime" : ""
          }`}
        >
          {note}
        </span>
      )}
    </div>
  );
}

/* ── "Open case study" affordance ──────────────────────────── */

export function OpenCaseButton({
  tone,
  onClick,
}: {
  tone: Tone;
  onClick: () => void;
}) {
  const skin =
    tone === "ink"
      ? "border-lime bg-lime text-ink hover:bg-transparent hover:text-lime"
      : "border-ink bg-ink text-paper hover:bg-lime hover:text-ink";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      whileTap={{ scale: 0.96 }}
      transition={{ duration: DUR.micro, ease: EASE_OUT }}
      className={`group/open inline-flex items-center gap-3 border-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${skin}`}
    >
      Open case study
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover/open:translate-x-1.5"
      >
        →
      </span>
    </motion.button>
  );
}

/* ── Case index eyebrow (number · accent square · category) ── */

export function Eyebrow({
  index,
  category,
  tone,
  accent,
}: {
  index: string;
  category: string;
  tone: Tone;
  accent: Accent;
}) {
  const meta = tone === "ink" ? "text-paper" : tone === "field" ? "text-ink" : "text-slate";
  const border = tone === "ink" ? "border-paper/50" : "border-current";
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.24em] sm:text-[11px]">
      <span className={`flex items-center gap-3 ${meta}`}>
        <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 ${ACCENT_BG[accent]}`} />
        {index} / Case study
      </span>
      <span className={`border px-2 py-1 ${border} ${meta}`}>{category}</span>
    </div>
  );
}
