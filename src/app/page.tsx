import fs from "fs";
import path from "path";

import { Map, Project } from "../types/types";

import Nav from "./Nav";

export default function Page() {
  const projectsPath = path.join(process.cwd(), "public/projects.json");
  const mapsPath = path.join(process.cwd(), "public/maps.json");
  const postsDir = path.join(process.cwd(), "src/posts");

  const projects: Project[] = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
  const maps: Map[] = JSON.parse(fs.readFileSync(mapsPath, "utf8"));
  let posts: string[] = [];

  try {
    posts = fs
      .readdirSync(postsDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  } catch (e) {}

  return <Nav projects={projects} maps={maps} posts={posts} />;
}
