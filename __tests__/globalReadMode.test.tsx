/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useSettings } from "@/hooks/useSettings";

describe("useSettings - Global Read Mode", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("should have globalAutoRead default to false", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.settings.globalAutoRead).toBe(false);
  });

  it("should persist globalAutoRead to localStorage", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ globalAutoRead: true });
    });

    expect(result.current.settings.globalAutoRead).toBe(true);

    // Verify localStorage was updated
    const stored = localStorage.getItem("curiosity_hour_settings");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.globalAutoRead).toBe(true);
  });

  it("should load globalAutoRead from localStorage on mount", () => {
    // Pre-populate localStorage
    localStorage.setItem(
      "curiosity_hour_settings",
      JSON.stringify({ globalAutoRead: true })
    );

    const { result } = renderHook(() => useSettings());

    expect(result.current.settings.globalAutoRead).toBe(true);
  });

  it("should toggle globalAutoRead correctly", () => {
    const { result } = renderHook(() => useSettings());

    // Start with default (false)
    expect(result.current.settings.globalAutoRead).toBe(false);

    // Toggle to true
    act(() => {
      result.current.updateSettings({ globalAutoRead: true });
    });
    expect(result.current.settings.globalAutoRead).toBe(true);

    // Toggle back to false
    act(() => {
      result.current.updateSettings({ globalAutoRead: false });
    });
    expect(result.current.settings.globalAutoRead).toBe(false);
  });

  it("should maintain other settings when updating globalAutoRead", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({
        globalAutoRead: true,
        tierMode: "basic",
        autoAdvanceDelayMs: 2000,
      });
    });

    expect(result.current.settings.globalAutoRead).toBe(true);
    expect(result.current.settings.tierMode).toBe("basic");
    expect(result.current.settings.autoAdvanceDelayMs).toBe(2000);
  });

  it("should preserve globalAutoRead when updating other settings", () => {
    const { result } = renderHook(() => useSettings());

    // Enable globalAutoRead
    act(() => {
      result.current.updateSettings({ globalAutoRead: true });
    });

    // Update a different setting
    act(() => {
      result.current.updateSettings({ tierMode: "basic" });
    });

    // globalAutoRead should still be true
    expect(result.current.settings.globalAutoRead).toBe(true);
    expect(result.current.settings.tierMode).toBe("basic");
  });
});
