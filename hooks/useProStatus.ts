"use client";

import { useState, useEffect } from "react";

const PRO_STATUS_KEY = "curiosity_hour_pro";

interface ProStatus {
  isPro: boolean;
  purchaseDate: number | null;
  email: string | null;
}

export function useProStatus() {
  const [proStatus, setProStatus] = useState<ProStatus>({
    isPro: false,
    purchaseDate: null,
    email: null,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load Pro status from localStorage
    const stored = localStorage.getItem(PRO_STATUS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProStatus(parsed);
      } catch (e) {
        // Invalid data, ignore
      }
    }
    setMounted(true);
  }, []);

  const upgradeToPro = (email?: string) => {
    const newStatus: ProStatus = {
      isPro: true,
      purchaseDate: Date.now(),
      email: email || null,
    };
    setProStatus(newStatus);
    localStorage.setItem(PRO_STATUS_KEY, JSON.stringify(newStatus));
  };

  const restorePurchase = () => {
    // For real implementation, this would verify with backend
    // For now, just a placeholder
    console.log("Restore purchase - would verify with backend");
  };

  const downgradeToFree = () => {
    const newStatus: ProStatus = {
      isPro: false,
      purchaseDate: null,
      email: null,
    };
    setProStatus(newStatus);
    localStorage.setItem(PRO_STATUS_KEY, JSON.stringify(newStatus));
  };

  return {
    isPro: mounted && proStatus.isPro,
    purchaseDate: proStatus.purchaseDate,
    email: proStatus.email,
    upgradeToPro,
    restorePurchase,
    downgradeToFree,
    isLoading: !mounted,
  };
}