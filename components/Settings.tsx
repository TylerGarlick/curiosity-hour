'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SettingsState {
  carModeEnabled: boolean;
  darkMode: boolean;
  soundEnabled: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  carModeEnabled: false,
  darkMode: true,
  soundEnabled: true,
};

export function Settings({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useLocalStorage<SettingsState>(
    'curiosity_hour_settings',
    DEFAULT_SETTINGS
  );

  const toggleCarMode = () => {
    setSettings({ ...settings, carModeEnabled: !settings.carModeEnabled });
  };

  const toggleDarkMode = () => {
    setSettings({ ...settings, darkMode: !settings.darkMode });
  };

  const toggleSound = () => {
    setSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  return (
    <div className="settings-modal">
      <div className="settings-header">
        <h2>Settings</h2>
        <button onClick={onClose} className="close-button" aria-label="Close settings">✕</button>
      </div>

      <div className="settings-section">
        <h3>Modes</h3>
        
        <div className="setting-toggle">
          <label>
            <span className="toggle-label">
              <span className="toggle-title">Car Mode</span>
              <span className="toggle-description">Large buttons, TTS questions, auto-advance</span>
            </span>
            <input
              type="checkbox"
              checked={settings.carModeEnabled}
              onChange={toggleCarMode}
              className="toggle-checkbox"
            />
            <span className="toggle-switch" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Appearance</h3>
        
        <div className="setting-toggle">
          <label>
            <span className="toggle-label">
              <span className="toggle-title">Dark Mode</span>
            </span>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={toggleDarkMode}
              className="toggle-checkbox"
              defaultChecked
            />
            <span className="toggle-switch" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Audio</h3>
        
        <div className="setting-toggle">
          <label>
            <span className="toggle-label">
              <span className="toggle-title">Sound Effects</span>
            </span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={toggleSound}
              className="toggle-checkbox"
              defaultChecked
            />
            <span className="toggle-switch" />
          </label>
        </div>
      </div>

      <div className="settings-footer">
        <p className="settings-version">v1.0.0</p>
      </div>
    </div>
  );
}
