"use client";

import { useState, useEffect } from "react";
import { ThemeVars } from "@/types";
import { useLocalStorage } from "./useLocalStorage";

export type ThemeName = "light" | "dark" | "rose" | "custom";

const themes: Record<Exclude<ThemeName, "custom">, ThemeVars> = {
  light: {
    bg: "#fefce8",
    surface: "#ffffff",
    border: "#fde68a",
    accent: "#f59e0b",
    "accent-hover": "#d97706",
    "text-primary": "#1c1917",
    "text-secondary": "#78716c",
    track: "#fef3c7",
  },
  dark: {
    bg: "#09090b",
    surface: "#18181b",
    border: "#27272a",
    accent: "#f59e0b",
    "accent-hover": "#fbbf24",
    "text-primary": "#f4f4f5",
    "text-secondary": "#a1a1aa",
    track: "#27272a",
  },
  rose: {
    bg: "#fff1f2",
    surface: "#ffffff",
    border: "#fecdd3",
    accent: "#f43f5e",
    "accent-hover": "#e11d48",
    "text-primary": "#1c1917",
    "text-secondary": "#78716c",
    track: "#ffe4e6",
  },
};

export function useTheme() {
  const [theme, setThemeState] = useLocalStorage<ThemeName>("curiosity_hour_theme", "light");
  const [customVars, setCustomVarsState] = useLocalStorage<ThemeVars | null>(
    "curiosity_hour_custom_theme",
    null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detect OS preference on first mount if no saved theme
    if (typeof window !== "undefined" && !window.localStorage.getItem("curiosity_hour_theme")) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const detectedTheme: ThemeName = prefersDark ? "dark" : "light";
      setThemeState(detectedTheme);
      applyTheme(detectedTheme, null);
    } else {
      applyTheme(theme, customVars);
    }
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    applyTheme(newTheme, customVars);
  };

  const setCustomVars = (vars: ThemeVars | null) => {
    setCustomVarsState(vars);
    if (theme === "custom" || vars !== null) {
      applyTheme(vars ? "custom" : theme, vars);
    }
  };

  return { theme, setTheme, customVars, setCustomVars, mounted };
}

function applyTheme(themeName: ThemeName, customVars: ThemeVars | null) {
  if (typeof window === "undefined") return;

  const html = document.documentElement;
  html.setAttribute("data-theme", themeName);

  // Get the color values
  let colors: ThemeVars;

  if (themeName === "custom" && customVars) {
    colors = customVars;
  } else {
    colors = themes[themeName as Exclude<ThemeName, "custom">];
  }

  // Apply CSS variables
  Object.entries(colors).forEach(([key, value]) => {
    html.style.setProperty(`--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`, value);
  });

  // Remove any existing custom theme style tag
  const existingStyle = document.getElementById("custom-theme-style");
  if (existingStyle) {
    existingStyle.remove();
  }

  // If custom theme, inject style tag for [data-theme="custom"]
  if (themeName === "custom" && customVars) {
    const styleTag = document.createElement("style");
    styleTag.id = "custom-theme-style";

    let cssVars = "";
    Object.entries(customVars).forEach(([key, value]) => {
      cssVars += `  --color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};\n`;
    });

    styleTag.textContent = `[data-theme="custom"] {\n${cssVars}}`;
    document.head.appendChild(styleTag);
  }
}
