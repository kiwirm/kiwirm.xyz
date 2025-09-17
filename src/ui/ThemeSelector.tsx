"use client";

import { Moon, Sun } from "lucide-react";

import { palettes, Theme, useTheme } from "./ThemeProvider";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [currentPalette, currentMode] = theme.split("-");

  return (
    <>
      <nav aria-label="Theme mode" className="flex gap-3 justify-end pb-3">
        <button
          onClick={() => setTheme((currentPalette + "-light") as Theme)}
          aria-label="Light mode"
          className="hover-fg-secondary hover:underline"
        >
          <Sun />
        </button>
        <button
          onClick={() => setTheme((currentPalette + "-dark") as Theme)}
          aria-label="Dark mode"
          className="hover-fg-secondary hover:underline"
        >
          <Moon />
        </button>
      </nav>
      <ul className="hidden xl:flex flex-col gap-2 items-end">
        {palettes.map((palette) => (
          <li key={palette}>
            <button
              className={`hover:text-fg-secondary ${currentPalette === palette ? "underline" : "hover:underline"}`}
              onClick={() => setTheme((palette + "-" + currentMode) as Theme)}
            >
              {palette}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
