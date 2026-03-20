// Settings State Management with Zustand
import { create } from 'zustand';

interface SettingsStore {
  nsfwEnabled: boolean;
  carModeSpeed: 0.75 | 1 | 1.25;
  carModeAutoTTS: boolean;
  proUnlocked: boolean;
  // actions
  setNsfwEnabled: (v: boolean) => void;
  setCarModeSpeed: (v: 0.75 | 1 | 1.25) => void;
  setCarModeAutoTTS: (v: boolean) => void;
  setProUnlocked: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  nsfwEnabled: false,
  carModeSpeed: 1,
  carModeAutoTTS: true,
  proUnlocked: false,

  setNsfwEnabled: (v) => set({ nsfwEnabled: v }),
  setCarModeSpeed: (v) => set({ carModeSpeed: v }),
  setCarModeAutoTTS: (v) => set({ carModeAutoTTS: v }),
  setProUnlocked: (v) => set({ proUnlocked: v }),
}));

export default useSettingsStore;
