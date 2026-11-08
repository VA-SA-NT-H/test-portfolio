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
import { FallMonitor } from "../visuals/FallMonitor";

interface StageProps {
  project: Project;
  onOpen: () => void;
}

/**
 * Case 03 — Fall detection: a monitoring sheet. The camera
 * viewport and alert rail take the wide left columns, the story
 * and metrics sit in a framed right column.
 */
export function VisionStage({ project, onOpen }: StageProps) {
  return (
    <article className="group relative border-2 border-ink bg-paper-dim p-6 text-ink sm:p-9">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Monitor */}
        <div className="lg:col-span-7">
          <VisualCaption
            label="Live monitor schematic"
            note="Detect → confirm → alert"
            tone="paper"
            accent="orange"
          />
          <Parallax amount={16}>
            <div className="border-2 border-ink bg-paper p-4 sm:p-5">
              <FallMonitor />
            </div>
          </Parallax>
          <Metrics metrics={project.metrics} tone="paper" accent="orange" className="mt-7" />
        </div>

        {/* Story */}
        <div className="lg:col-span-5">
          <Eyebrow index="03" category={project.category} tone="paper" accent="orange" />
          <CaseTitle project={project} tone="paper" accent="orange" />

          <p className="mt-6 font-grotesk text-lg font-medium text-rust sm:text-xl">
            {project.tagline}
          </p>

          <p className="mt-5 leading-relaxed text-slate">{project.description}</p>

          <ResultBlock project={project} tone="paper" />

          <div className="mt-7">
            <TechTags technologies={project.technologies} tone="paper" />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <OpenCaseButton tone="paper" onClick={onOpen} />
            <LinkRow project={project} tone="paper" />
          </div>
        </div>
      </div>
    </article>
  );
}
