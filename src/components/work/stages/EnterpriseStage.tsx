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
import { SystemBlueprint } from "../visuals/SystemBlueprint";

interface StageProps {
  project: Project;
  onOpen: () => void;
}

/**
 * Case 04 — Enterprise backend: a blue masthead over a system
 * blueprint, then a wide editorial split for story and metrics
 * with the links pinned to a bottom rule.
 */
export function EnterpriseStage({ project, onOpen }: StageProps) {
  return (
    <article className="group relative border-2 border-ink bg-paper text-ink">
      {/* Blue masthead */}
      <div className="border-b-2 border-ink bg-blue p-6 text-paper sm:p-9">
        <Eyebrow index="04" category={project.category} tone="ink" accent="lime" />
        <CaseTitle project={project} tone="ink" accent="lime" />
        <p className="mt-6 font-grotesk text-lg font-medium text-lime sm:text-xl">
          {project.tagline}
        </p>
      </div>

      <div className="p-6 sm:p-9">
        <VisualCaption
          label="System blueprint"
          note="Modules → REST bus → core → persistence + CI/CD"
          tone="paper"
          accent="blue"
        />
        <Parallax amount={18}>
          <SystemBlueprint />
        </Parallax>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="max-w-xl leading-relaxed text-slate">{project.description}</p>
            <ResultBlock project={project} tone="paper" />
          </div>
          <div className="lg:col-span-5">
            <Metrics metrics={project.metrics} tone="paper" accent="blue" />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t-2 border-ink pt-6">
          <OpenCaseButton tone="paper" onClick={onOpen} />
          <LinkRow project={project} tone="paper" />
          <span className="ml-auto">
            <TechTags technologies={project.technologies} tone="paper" />
          </span>
        </div>
      </div>
    </article>
  );
}
