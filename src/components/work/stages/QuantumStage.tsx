import { staggerGroup, staggerItem, VIEWPORT } from "../../../motion/presets";
import { motion } from "motion/react";
import {
  CaseTitle,
  Eyebrow,
  LinkRow,
  Metrics,
  OpenCaseButton,
  ResultBlock,
  TechTags,
  VisualCaption,
} from "../bits";
import type { Project } from "../types";
import { Parallax } from "../Parallax";
import { QuantumKey } from "../visuals/QuantumKey";

interface StageProps {
  project: Project;
  onOpen: () => void;
}

/**
 * Case 02 — Quantum cryptography: a three-band composition. Story
 * on paper, a solid orange validation field carrying the 15/15
 * result, and a full-width ink band holding the E91 key diagram.
 */
export function QuantumStage({ project, onOpen }: StageProps) {
  return (
    <article className="group relative border-2 border-ink bg-paper">
      <div className="grid lg:grid-cols-2">
        {/* Story */}
        <div className="border-b-2 border-ink p-6 sm:p-9 lg:border-b-0 lg:border-r-2">
          <Eyebrow index="02" category={project.category} tone="paper" accent="orange" />
          <CaseTitle project={project} tone="paper" accent="blue" />

          <p className="mt-6 font-grotesk text-lg font-medium text-rust sm:text-xl">
            {project.tagline}
          </p>

          <p className="mt-5 leading-relaxed text-slate">{project.description}</p>

          {/* Pipeline, straight from data */}
          {project.architecture && (
            <motion.ol
              aria-hidden="true"
              variants={staggerGroup(0.07, 0.05)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="mt-7 border-t border-ink"
            >
              {project.architecture.steps.map((step, index) => (
                <motion.li
                  key={step}
                  variants={staggerItem}
                  className="flex items-center gap-4 border-b border-ink py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 group-hover:bg-paper-dim"
                >
                  <span className="text-blue">{String(index + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                </motion.li>
              ))}
            </motion.ol>
          )}

          <ResultBlock project={project} tone="paper" />

          <div className="mt-7">
            <TechTags technologies={project.technologies} tone="paper" />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <OpenCaseButton tone="paper" onClick={onOpen} />
            <LinkRow project={project} tone="paper" />
          </div>
        </div>

        {/* Orange validation field */}
        <div className="flex flex-col justify-between bg-orange p-6 text-ink sm:p-9">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] sm:text-[11px]">
            <span className="flex items-center gap-3">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 bg-ink" />
              Validation
            </span>
            <span className="border border-ink px-2 py-1">NIST STS</span>
          </div>

          <div className="py-8">
            <span className="block font-display text-[clamp(3.5rem,11vw,7.5rem)] leading-[0.85] tracking-[-0.04em]">
              15/15
            </span>
            <span className="mt-3 block font-mono text-[11px] uppercase tracking-[0.2em]">
              NIST Statistical Test Suite
            </span>
          </div>

          <Metrics metrics={project.metrics} tone="field" accent="orange" />
        </div>
      </div>

      {/* Ink band: the key's journey */}
      <div className="border-t-2 border-ink bg-ink p-6 text-paper sm:p-9">
        <VisualCaption
          label="Schematic — E91 key distribution"
          note="Source → pair → shared key → cipher → validation"
          tone="ink"
          accent="orange"
        />
        <div className="mx-auto max-w-3xl">
          <Parallax amount={16}>
            <QuantumKey />
          </Parallax>
        </div>
      </div>
    </article>
  );
}
