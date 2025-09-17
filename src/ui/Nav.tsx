"use client";
import { useState } from "react";
import { TableData } from "../types/types";
import HomeVisual from "../visuals/Home";
import MapsVisual from "../visuals/Maps";
import ProjectsVisual from "../visuals/Projects";
import Posts from "./Posts";
import Table from "./Table";

interface MenuItem {
  label: "home" | "projects" | "posts" | "music" | "maps";
  command: string;
  content: React.ReactNode | null;
  visual: React.ReactNode | null;
  onClick?: () => void;
}

interface PageClientProps {
  home: any;
  projects: TableData;
  maps: TableData;
  posts: string[];
  music: TableData;
}

const Nav = ({ home, projects, maps, posts, music }: PageClientProps) => {
  const [open, setOpen] = useState<MenuItem["label"]>("home");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [hoveredMap, setHoveredMap] = useState<string | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [hoveredClient, setHoveredClient] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      label: "home",
      command: "cat",
      content: (<section>
        <pre className="whitespace-pre-wrap">{home}</pre>
      </section>),
      visual: <HomeVisual />,
    },
    {
      label: "projects",
      command: "ls",
      content:
        <Table table={projects} setHovered={setHoveredProject} hovered={hoveredProject} setHoveredRelation={setHoveredTag} hoveredRelation={hoveredTag} />
      ,
      visual: (
        <ProjectsVisual
          projects={projects}
          hoveredProject={hoveredProject}
          hoveredTag={hoveredTag}
          setHoveredProject={setHoveredProject}
          setHoveredTag={setHoveredTag}
        />
      ),
    },
    {
      label: "maps",
      command: "ls",
      content: <Table table={maps} setHovered={setHoveredMap} hovered={hoveredMap} setHoveredRelation={setHoveredClient} hoveredRelation={hoveredClient} />,
      visual: <MapsVisual maps={(maps as any).rows.map((r: any) => ({ name: r.key, location: r.location }))} hovered={hoveredMap} />,
    },
    {
      label: "posts",
      command: "ls",
      content: <Posts posts={posts} />,
      visual: null,
    },
    {
      label: "music",
      command: "ls",
      content: <Table table={music} setHovered={setHoveredMap} hovered={hoveredMap} setHoveredRelation={setHoveredClient} hoveredRelation={hoveredClient} />,
      visual: null,
    },
  ];

  return (
    <main>
      <aside className="ml-10 bottom-12 right-12 p-2 lg:fixed h-64 w-64">
        {menuItems.find((item) => item.label === open)?.visual}
      </aside>

      <nav aria-label="Primary">
        <ul>
          {menuItems.map(({ label, command, content, onClick }) => (
            <li key={label} className="flex flex-row items-start mb-6">
              <div className="w-10 sm:w-28 inline-block select-none text-right pr-2">
                <code className="hidden sm:inline">
                  {open === label ? command : ""}
                </code>
              </div>
              <section className="flex-1">
                <button
                  className={`font-bold hover:text-fg-secondary ${open === label ? "underline" : "hover:underline"}`}
                  onClick={() => {
                    setOpen(label as typeof open);
                    if (onClick && label === "music") {
                      onClick();
                    }
                  }}
                >
                  {label}
                </button>
                {open === label && (<>
                  <span className="terminal-cursor ml-1">&#9608;</span>
                  <section>
                    {content}
                  </section>
                </>
                )}
              </section>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
};

export default Nav;
