"use client";

import { useState, useEffect } from "react";
import ThemeSelector from "../components/ThemeSelector";
import ProjectsGraph from "../components/ProjectsGraph";
import SocialLinks from "../components/SocialLinks";
import PerlinArt from "../components/PerlinArt";
import HomeContent from "../components/HomeContent";
import ProjectsContent from "../components/ProjectsContent";
import PostsContent from "../components/PostsContent";
import Prompt from "../components/Prompt";

export default function Home() {
  const [open, setOpen] = useState<"home" | "projects" | "posts">("home");

  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<string[]>([]);

  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  useEffect(() => {
    fetch("/projects.json")
      .then((res) => res.json())
      .then((data) => setProjects(data));
    fetch("/api/posts-list")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <main className="font-fira-code font-mono max-w-screen-lg relative fg my-16 mr-10">
      <div className="static right-16 top-16 lg:fixed mb-5">
        <SocialLinks />
        <ThemeSelector />
      </div>
      <div className="mb-6 ml-10 sm:ml-28">
        <Prompt />
      </div>
      {[
        {
          label: "home",
          command: "cat",
          content: <HomeContent />,
        },
        {
          label: "projects",
          command: "ls",
          content: (
            <ProjectsContent
              projects={projects}
              setHoveredProject={setHoveredProject}
              setHoveredTag={setHoveredTag}
            />
          ),
        },
        { label: "geckomaps", command: "cd" },
        {
          label: "posts",
          command: "ls",
          content: <PostsContent posts={posts} />,
        },
        {
          label: "music",
          command: "xdg-open",
          content: null,
          onClick: () => {
            window.open("https://soundcloud.com/g3_cko");
          },
        },
      ].map(({ label, command, content, onClick }) => (
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
      <div className="ml-10 bottom-12 right-12 p-2 lg:fixed">
        {open === "home" && <PerlinArt />}
        {open === "projects" && (
          <ProjectsGraph
            hoveredProject={hoveredProject}
            hoveredTag={hoveredTag}
          />
        )}
      </div>
    </main>
  );
}
