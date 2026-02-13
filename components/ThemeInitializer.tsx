"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    // Initialize theme from localStorage or OS preference
    const savedTheme = localStorage.getItem("curiosity_hour_theme");
    const customTheme = localStorage.getItem("curiosity_hour_custom_theme");

    let theme = savedTheme || "light";

    // Detect OS preference if no saved theme
    if (!savedTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      theme = prefersDark ? "dark" : "light";
    }

    // Apply theme
    document.documentElement.setAttribute("data-theme", theme);

    // Apply custom theme variables if custom theme is active
    if (theme === "custom" && customTheme) {
      try {
        const vars = JSON.parse(customTheme);
        Object.entries(vars).forEach(([key, value]: [string, any]) => {
          const cssVarName = `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
          document.documentElement.style.setProperty(cssVarName, value);
        });
      } catch (error) {
        console.error("Error parsing custom theme:", error);
      }
    }
  }, []);

  return null;
}
