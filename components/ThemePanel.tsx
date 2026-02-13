"use client";

import { useTheme, ThemeName } from "@/hooks/useTheme";
import { ThemeVars } from "@/types";
import { useState } from "react";

interface ThemePanelProps {
  onClose: () => void;
}

export function ThemePanel({ onClose }: ThemePanelProps) {
  const { theme, setTheme, customVars, setCustomVars } = useTheme();
  const [localCustomVars, setLocalCustomVars] = useState<ThemeVars | null>(
    customVars
  );

  const presets = [
    { name: "light" as ThemeName, preview: "#fefce8" },
    { name: "dark" as ThemeName, preview: "#09090b" },
    { name: "rose" as ThemeName, preview: "#fff1f2" },
  ];

  const colorLabels: Record<keyof ThemeVars, string> = {
    bg: "Background",
    surface: "Surface",
    border: "Border",
    accent: "Accent",
    "accent-hover": "Accent Hover",
    "text-primary": "Primary Text",
    "text-secondary": "Secondary Text",
    track: "Track",
  };

  const handleColorChange = (key: keyof ThemeVars, value: string) => {
    if (!localCustomVars) return;

    const updated = { ...localCustomVars, [key]: value };
    setLocalCustomVars(updated);
  };

  const handleSaveCustom = () => {
    if (localCustomVars) {
      setTheme("custom");
      setCustomVars(localCustomVars);
    }
  };

  const handleResetCustom = () => {
    setLocalCustomVars(null);
    setTheme("light");
    setCustomVars(null);
  };

  const handlePresetClick = (presetName: ThemeName) => {
    setTheme(presetName);
    setLocalCustomVars(null);
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-xl z-50 p-4">
      {/* Presets */}
      <div className="mb-6">
        <h3 className="text-sm font-sans font-semibold text-text-primary mb-3">
          Presets
        </h3>
        <div className="flex gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetClick(preset.name)}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-1 ${
                theme === preset.name
                  ? "border-accent"
                  : "border-border hover:border-accent"
              }`}
            >
              <div
                className="w-full h-6 rounded"
                style={{ backgroundColor: preset.preview }}
              />
              <span className="text-xs font-sans font-medium capitalize text-text-primary">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Theme Editor */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-sans font-semibold text-text-primary">
            Custom
          </h3>
          {theme === "custom" && (
            <span className="text-xs font-sans font-medium text-accent">
              Active
            </span>
          )}
        </div>

        <button
          onClick={() => {
            setTheme("custom");
            if (!localCustomVars) setLocalCustomVars(customVars || {} as ThemeVars);
          }}
          className={`w-full px-3 py-2 rounded-lg text-sm font-sans font-medium mb-3 transition-colors ${
            theme === "custom"
              ? "bg-accent text-white"
              : "bg-track text-text-primary hover:bg-border"
          }`}
        >
          Enable Custom
        </button>

        {theme === "custom" && localCustomVars && (
          <>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {Object.entries(localCustomVars).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="text-xs font-sans text-text-secondary flex-1">
                    {colorLabels[key as keyof ThemeVars]}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        handleColorChange(key as keyof ThemeVars, e.target.value)
                      }
                      className="w-8 h-8 rounded cursor-pointer border border-border"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleColorChange(key as keyof ThemeVars, e.target.value)
                      }
                      className="w-20 px-2 py-1 text-xs border border-border rounded bg-bg text-text-primary font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-3 border-t border-border">
              <button
                onClick={handleSaveCustom}
                className="flex-1 px-3 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-sans font-medium"
              >
                Save
              </button>
              <button
                onClick={handleResetCustom}
                className="flex-1 px-3 py-2 bg-track text-text-primary hover:bg-border rounded-lg text-sm font-sans font-medium"
              >
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
