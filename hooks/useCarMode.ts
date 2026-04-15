"use client";

import { useState, useEffect } from "react";

const CAR_MODE_KEY = "curiosity_hour_car_mode";

export function useCarMode(): [boolean, (enabled: boolean) => void] {
  const [carMode, setCarMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem(CAR_MODE_KEY);
        if (saved) {
          setCarMode(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error("Error reading car mode from localStorage:", error);
    }
  }, []);

  const setCarModeEnabled = (enabled: boolean) => {
    try {
      setCarMode(enabled);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(CAR_MODE_KEY, JSON.stringify(enabled));
      }
    } catch (error) {
      console.error("Error saving car mode to localStorage:", error);
    }
  };

  return [isClient ? carMode : false, setCarModeEnabled];
}
