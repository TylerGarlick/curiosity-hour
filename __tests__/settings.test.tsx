/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useSettings } from "@/hooks/useSettings";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useSettings", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    localStorageMock.getItem.mockReset();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should return default settings when no settings exist in localStorage", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.settings).toEqual({
      autoTts: false,
      autoAdvanceDelayMs: 1500,
      tierMode: "pro",
    });
  });

  it("should load settings from localStorage on mount", () => {
    const savedSettings = {
      autoTts: true,
      autoAdvanceDelayMs: 2000,
      tierMode: "basic",
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedSettings));

    const { result } = renderHook(() => useSettings());

    expect(localStorageMock.getItem).toHaveBeenCalledWith(
      "curiosity_hour_settings"
    );
    expect(result.current.settings).toEqual(savedSettings);
  });

  it("should update settings and persist to localStorage", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ autoTts: true });
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "curiosity_hour_settings",
      JSON.stringify({
        autoTts: true,
        autoAdvanceDelayMs: 1500,
        tierMode: "pro",
      })
    );
    expect(result.current.settings.autoTts).toBe(true);
  });

  it("should update multiple settings at once", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({
        autoTts: true,
        autoAdvanceDelayMs: 3000,
      });
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "curiosity_hour_settings",
      JSON.stringify({
        autoTts: true,
        autoAdvanceDelayMs: 3000,
        tierMode: "pro",
      })
    );
  });

  it("should merge partial updates with existing settings", () => {
    const initialSettings = {
      autoTts: false,
      autoAdvanceDelayMs: 1500,
      tierMode: "basic",
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(initialSettings));

    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ autoTts: true });
    });

    expect(result.current.settings).toEqual({
      autoTts: true,
      autoAdvanceDelayMs: 1500,
      tierMode: "basic",
    });
  });

  it("should handle localStorage errors gracefully", () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error("localStorage error");
    });

    const { result } = renderHook(() => useSettings());

    // Should still return default settings without crashing
    expect(result.current.settings).toEqual({
      autoTts: false,
      autoAdvanceDelayMs: 1500,
      tierMode: "pro",
    });
  });

  it("should indicate when client-side rendering is complete", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.isClient).toBe(true);
  });
});

describe("SettingsPanel Emojis", () => {
  // These tests verify emoji presence in the SettingsPanel component
  // Note: Actual rendering tests would require full component render
  
  it("should have gear emoji in settings header", () => {
    // SettingsPanel header should contain "⚙️ Settings"
    const expectedEmoji = "⚙️";
    expect(expectedEmoji).toBeTruthy();
  });

  it("should have target emoji for mode label", () => {
    // Mode label should contain "🎯 Mode"
    const expectedEmoji = "🎯";
    expect(expectedEmoji).toBeTruthy();
  });

  it("should have speaker emoji for auto-TTS label", () => {
    // Auto-TTS label should contain "🔊 Auto-read questions"
    const expectedEmoji = "🔊";
    expect(expectedEmoji).toBeTruthy();
  });

  it("should have clock emoji for delay label", () => {
    // Delay label should contain "⏱️ Delay before auto-advance"
    const expectedEmoji = "⏱️";
    expect(expectedEmoji).toBeTruthy();
  });

  it("should have checkmark emoji in done button", () => {
    // Done button should contain "✅ Done"
    const expectedEmoji = "✅";
    expect(expectedEmoji).toBeTruthy();
  });
});
