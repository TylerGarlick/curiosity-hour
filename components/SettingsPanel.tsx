"use client";

import { useSettings } from "@/hooks/useSettings";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, isClient } = useSettings();

  if (!isOpen || !isClient) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="card-style-elevated card-texture p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-track/80 transition-all active:scale-95 touch-manipulation shadow-sm"
            aria-label="Close settings"
          >
            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Tier Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-text-primary font-medium">🎯 Mode</label>
              <p className="text-sm text-text-secondary mt-1">
                Basic: 200 curated questions, no ads
              </p>
            </div>
            <button
              onClick={() => updateSettings({ tierMode: settings.tierMode === "basic" ? "pro" : "basic" })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.tierMode === "pro" ? "bg-accent" : "bg-track"
              }`}
              role="switch"
              aria-checked={settings.tierMode === "pro"}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.tierMode === "pro" ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
          <div className="text-xs text-text-secondary mt-1">
            {settings.tierMode === "basic" ? "🟢 Basic (200 questions)" : "⭐ Pro (All questions + features)"}
          </div>

          {/* Global Auto-Read Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-text-primary font-medium">🔊 Auto-read questions</label>
              <p className="text-sm text-text-secondary mt-1">
                Automatically read questions aloud (Car Mode always enabled)
              </p>
            </div>
            <button
              onClick={() => updateSettings({ globalAutoRead: !settings.globalAutoRead })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.globalAutoRead ? "bg-accent" : "bg-track"
              }`}
              role="switch"
              aria-checked={settings.globalAutoRead}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.globalAutoRead ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Auto-Advance Delay */}
          {settings.globalAutoRead && (
            <div>
              <label className="text-text-primary font-medium block mb-2">
                ⏱️ Delay before auto-advance
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="500"
                  value={settings.autoAdvanceDelayMs}
                  onChange={(e) => updateSettings({ autoAdvanceDelayMs: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-track rounded-full appearance-none cursor-pointer"
                />
                <span className="text-sm text-text-secondary w-16 text-right">
                  {settings.autoAdvanceDelayMs / 1000}s
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Time to read the question before moving to the next one
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-all active:scale-95 touch-manipulation shadow-md"
          >
            ✅ Done
          </button>
        </div>
      </div>
    </div>
  );
}
