"use client";

import { useState, useEffect } from "react";

export interface AppSettings {
  autoTts: boolean;
  autoAdvanceDelayMs: number;
  tierMode: "basic" | "pro";
}

const DEFAULT_SETTINGS: AppSettings = {
  autoTts: false,
  autoAdvanceDelayMs: 1500,
  tierMode: "pro",
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem("curiosity_hour_settings");
        if (item) {
          const parsed = JSON.parse(item);
          setSettings({
            ...DEFAULT_SETTINGS,
            ...parsed,
          });
        }
      }
      setIsClient(true);
    } catch (error) {
      console.error("Error reading settings from localStorage:", error);
      setIsClient(true);
    }
  }, []);

  const updateSettings = (updates: Partial<AppSettings>) => {
    try {
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "curiosity_hour_settings",
          JSON.stringify(newSettings)
        );
      }
    } catch (error) {
      console.error("Error saving settings to localStorage:", error);
    }
  };

  return {
    settings,
    updateSettings,
    isClient,
  };
}
