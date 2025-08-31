"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme =
  | "monokai-light"
  | "monokai-dark"
  | "gruvbox-light"
  | "gruvbox-dark"
  | "solarized-light"
  | "solarized-dark";

export const palettes = ["gruvbox", "monokai", "solarized"];
export const themes = palettes.flatMap(palette => [
  `${palette}-light` as Theme,
  `${palette}-dark` as Theme
]);

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("gruvbox-dark");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved && themes.includes(saved as Theme)) {
      setTheme(saved as Theme);
    } else {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("gruvbox-dark");
      } else {
        setTheme("gruvbox-light");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
    const html = document.documentElement;
    html.classList.remove(...themes);
    html.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
