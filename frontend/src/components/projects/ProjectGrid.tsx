import ProjectCard from "./ProjectCard";
import type { Project } from "../../type/project";

interface Props {
  projects: Project[];
  onOpen?: (project: Project) => void; // ✅ optional (important)
}

export default function ProjectGrid({ projects, onOpen }: Props) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onOpen={() => onOpen?.(project)} // ✅ safe call
        />
      ))}
    </div>
  );
}
