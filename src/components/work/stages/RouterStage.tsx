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
import { RouterSwitchboard } from "../visuals/RouterSwitchboard";

interface StageProps {
  project: Project;
  onOpen: () => void;
}

/**
 * Case 01 — IntelRouter: an inverted full-width gateway. Story on
 * the left five columns, the routing switchboard diagram owns the
 * right seven, metrics running under it.
 */
export function RouterStage({ project, onOpen }: StageProps) {
  return (
    <article className="group relative border-2 border-ink bg-ink text-paper">
      <div className="grid lg:grid-cols-12">
        <div className="border-b-2 border-paper/30 p-6 sm:p-9 lg:col-span-5 lg:border-b-0 lg:border-r-2">
          <Eyebrow index="01" category={project.category} tone="ink" accent="blue" />
          <CaseTitle project={project} tone="ink" accent="lime" />

          <p className="mt-6 font-grotesk text-lg font-medium text-lime sm:text-xl">
            {project.tagline}
          </p>

          <p className="mt-5 max-w-xl leading-relaxed text-concrete">{project.description}</p>

          <ResultBlock project={project} tone="ink" />

          <div className="mt-7">
            <TechTags technologies={project.technologies} tone="ink" />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <OpenCaseButton tone="ink" onClick={onOpen} />
            <LinkRow project={project} tone="ink" />
          </div>
        </div>

        <div className="bg-paper/[0.04] p-6 sm:p-9 lg:col-span-7">
          <VisualCaption
            label="Schematic — request routing path"
            note="Ingest → classify → route"
            tone="ink"
            accent="lime"
          />
          <Parallax amount={20}>
            <RouterSwitchboard />
          </Parallax>
          <Metrics metrics={project.metrics} tone="ink" accent="lime" className="mt-7" />
        </div>
      </div>
    </article>
  );
}
