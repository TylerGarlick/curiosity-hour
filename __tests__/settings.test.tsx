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
  });

  it("should return default settings when no settings exist in localStorage", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.settings).toEqual({
      autoTts: false,
      autoAdvanceDelayMs: 1500,
    });
  });

  it("should load settings from localStorage on mount", () => {
    const savedSettings = {
      autoTts: true,
      autoAdvanceDelayMs: 2000,
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
      })
    );
  });

  it("should merge partial updates with existing settings", () => {
    const initialSettings = {
      autoTts: false,
      autoAdvanceDelayMs: 1500,
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(initialSettings));

    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ autoTts: true });
    });

    expect(result.current.settings).toEqual({
      autoTts: true,
      autoAdvanceDelayMs: 1500,
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
    });
  });

  it("should indicate when client-side rendering is complete", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.isClient).toBe(true);
  });
});
