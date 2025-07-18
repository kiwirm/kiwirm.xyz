import Link from "next/link";

export default function ProjectsContent({
  projects,
  setHoveredProject,
  setHoveredTag,
}: {
  projects: any[];
  setHoveredProject: (name: string | null) => void;
  setHoveredTag: (tag: string | null) => void;
}) {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="font-normal text-left green">project</th>
          <th className="font-normal text-left green hidden md:table-cell">tags</th>
          <th className="font-normal text-left green">description</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr
            key={project.url}
            onMouseEnter={() => setHoveredProject(project.name)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <td className="pr-4 align-top">
              <Link
                href={project.url}
                className="blue underline font-semibold"
              >
                {project.name}
              </Link>
            </td>
            <td className="pr-4 align-top hidden md:table-cell">
              {project.tags && project.tags.length > 0 ? (
                project.tags.map((tag: string, i: number) => (
                  <span
                    key={tag}
                    onMouseEnter={() => setHoveredTag(tag)}
                    onMouseLeave={() => setHoveredTag(null)}
                    className="cursor-pointer hover:underline yellow mr-1"
                  >
                    {tag}
                    {i < project.tags.length - 1 ? "," : ""}
                  </span>
                ))
              ) : (
                "No tags"
              )}
            </td>
            <td className="align-top">{project.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
