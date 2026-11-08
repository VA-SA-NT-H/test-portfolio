import { EnterpriseStage } from "./stages/EnterpriseStage";
import { QuantumStage } from "./stages/QuantumStage";
import { RouterStage } from "./stages/RouterStage";
import { VisionStage } from "./stages/VisionStage";
import type { Project } from "./types";

interface ProjectStageProps {
  project: Project;
  onOpen: () => void;
}

/**
 * One composition per project — the dispatcher maps each id to the
 * layout built around what that system actually does. Unknown ids
 * fall back to the gateway layout rather than an empty block.
 */
export function ProjectStage({ project, onOpen }: ProjectStageProps) {
  switch (project.id) {
    case 1:
      return <RouterStage project={project} onOpen={onOpen} />;
    case 2:
      return <QuantumStage project={project} onOpen={onOpen} />;
    case 3:
      return <VisionStage project={project} onOpen={onOpen} />;
    case 4:
      return <EnterpriseStage project={project} onOpen={onOpen} />;
    default:
      return <RouterStage project={project} onOpen={onOpen} />;
  }
}
