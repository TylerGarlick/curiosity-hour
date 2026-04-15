"use client";

import { useEffect } from "react";

export function PWAInitializer() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration.scope);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update().then(() => {
              console.log("[PWA] Checked for SW updates");
            });
          }, 60 * 60 * 1000); // Check every hour
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error);
        });

      // Listen for SW updates
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("[PWA] Service Worker updated, page will reload on next navigation");
      });
    }
  }, []);

  return null;
}
