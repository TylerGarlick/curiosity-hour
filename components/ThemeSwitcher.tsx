"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { ThemePanel } from "./ThemePanel";

export function ThemeSwitcher() {
  const { theme, mounted } = useTheme();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="p-2 bg-surface border border-border rounded-lg text-text-primary hover:bg-track transition-colors flex items-center gap-2"
        title="Theme settings"
      >
        <span className="text-lg">🎨</span>
        <span className="text-xs font-sans font-medium capitalize">{theme}</span>
      </button>

      {isPanelOpen && <ThemePanel onClose={() => setIsPanelOpen(false)} />}
    </div>
  );
}
