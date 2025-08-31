"use client";
import { Theme, useTheme, palettes } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [currentPalette, currentMode] = theme.split("-");

  return (
    <>
      <div className="flex gap-3 justify-end pb-3">
        <button
          onClick={() => setTheme((currentPalette + "-light") as Theme)}
          aria-label="Light mode"
        >
          <Sun />
        </button>
        <button
          onClick={() => setTheme((currentPalette + "-dark") as Theme)}
          aria-label="Dark mode"
        >
          <Moon />
        </button>
      </div>
      <div className="hidden xl:flex flex-col gap-2 items-end">
        {palettes.map((palette) => (
          <button
            key={palette}
            className={`${currentPalette === palette ? "underline" : ""}`}
            onClick={() => setTheme((palette + "-" + currentMode) as Theme)}
          >
            {palette}
          </button>
        ))}
      </div>
    </>
  );
}
