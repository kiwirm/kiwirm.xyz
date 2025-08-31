"use client";

import { useEffect, useState } from "react";
import Home from "../content/Home";
import Maps from "../content/Maps";
import Posts from "../content/Posts";
import Projects from "../content/Projects";

import Prompt from "../ui/Prompt";
import SocialLinks from "../ui/SocialLinks";
import ThemeSelector from "../ui/ThemeSelector";

import HomeVisual from "../visuals/Home";
import ProjectsVisual from "../visuals/Projects";
import MapsVisual from "../visuals/Maps";
import { Map, Project } from "../types/types";

interface MenuItem {
  label: "home" | "projects" | "geckomaps" | "posts" | "music";
  command: string;
  content: React.ReactNode | null;
  visual: React.ReactNode | null;
  onClick?: () => void;
}

export default function Page() {
  const [open, setOpen] = useState<MenuItem["label"]>("home");

  const [projects, setProjects] = useState<Project[]>([]);
  const [maps, setMaps] = useState<Map[]>([]);
  const [posts, setPosts] = useState<string[]>([]);

  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [hoveredMap, setHoveredMap] = useState<string | null>(null);

  useEffect(() => {
    fetch("/projects.json")
      .then((res) => res.json())
      .then((data) => setProjects(data));
    fetch("/maps.json")
      .then((res) => res.json())
      .then((data) => setMaps(data));
    fetch("/api/posts-list")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const menuItems: MenuItem[] = [
    {
      label: "home",
      command: "cat",
      content: <Home />,
      visual: <HomeVisual />,
    },
    {
      label: "projects",
      command: "ls",
      content: (
        <Projects
          projects={projects}
          setHoveredProject={setHoveredProject}
          setHoveredTag={setHoveredTag}
        />
      ),
      visual: (
        <ProjectsVisual
          projects={projects}
          hoveredProject={hoveredProject}
          hoveredTag={hoveredTag}
        />
      ),
    },
    {
      label: "maps",
      command: "ls",
      content: <Maps maps={maps} setHovered={setHoveredMap} />,
      visual: <MapsVisual maps={maps} hovered={hoveredMap} />,
    },
    {
      label: "posts",
      command: "ls",
      content: <Posts posts={posts} />,
      visual: null,
    },
    {
      label: "music",
      command: "xdg-open",
      content: null,
      visual: null,
      onClick: () => {
        window.open("https://soundcloud.com/g3_cko");
      },
    },
  ];

  return (
    <main>
      <div className="ml-10 bottom-12 right-12 p-2 lg:fixed h-64 w-64">
        {menuItems.find((item) => item.label === open)?.visual}
      </div>

      {menuItems.map(({ label, command, content, onClick }) => (
        <div key={label} className="flex flex-row items-start mb-6">
          <div className="w-10 sm:w-28 inline-block select-none text-right pr-2">
            <span className="hidden sm:inline">
              {open === label ? command : ""}
            </span>
          </div>
          <div className="flex-1">
            <button
              className="underline font-bold"
              onClick={() => {
                setOpen(label as typeof open);
                if (onClick && label === "music") {
                  onClick();
                }
              }}
            >
              {label}
            </button>
            {open === label && (
              <span>
                <span className="terminal-cursor ml-1">&#9608;</span>
                {content}
              </span>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}
