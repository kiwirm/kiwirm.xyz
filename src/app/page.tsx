import fs from "fs";
import path from "path";

import { TableData } from "../types/types";

import Nav from "../ui/Nav";

export default function Page() {
  const homePath = path.join(process.cwd(), "public/content/home.txt");
  const projectsPath = path.join(process.cwd(), "public/content/projects.json");
  const mapsPath = path.join(process.cwd(), "public/content/maps.json");
  const musicPath = path.join(process.cwd(), "public/content/music.json");

  const postsDir = path.join(process.cwd(), "src/posts");

  const home = fs.readFileSync(homePath, "utf-8");

  const projects: TableData = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
  const maps: TableData = JSON.parse(fs.readFileSync(mapsPath, "utf8"));
  const music: TableData = JSON.parse(fs.readFileSync(musicPath, "utf8"));

  let posts: string[] = [];

  try {
    posts = fs
      .readdirSync(postsDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  } catch (e) { }

  return <Nav home={home} projects={projects} maps={maps} posts={posts} music={music} />;
}
