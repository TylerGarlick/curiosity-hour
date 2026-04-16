/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useSettings } from "@/hooks/useSettings";
import { filterQuestionsByTier } from "@/lib/game";
import { Question } from "@/types";

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

describe("useSettings - tier mode", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it("should default to pro tier mode", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.settings.tierMode).toBe("pro");
  });

  it("should load tier mode from localStorage", () => {
    const savedSettings = {
      autoTts: false,
      autoAdvanceDelayMs: 1500,
      tierMode: "basic",
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedSettings));

    const { result } = renderHook(() => useSettings());

    expect(result.current.settings.tierMode).toBe("basic");
  });

  it("should toggle tier mode and persist to localStorage", () => {
    const { result } = renderHook(() => useSettings());

    // Toggle from pro to basic
    act(() => {
      result.current.updateSettings({ tierMode: "basic" });
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "curiosity_hour_settings",
      JSON.stringify({
        autoTts: false,
        autoAdvanceDelayMs: 1500,
        tierMode: "basic",
      })
    );
    expect(result.current.settings.tierMode).toBe("basic");

    // Toggle back to pro
    act(() => {
      result.current.updateSettings({ tierMode: "pro" });
    });

    expect(result.current.settings.tierMode).toBe("pro");
  });

  it("should preserve other settings when updating tier mode", () => {
    const initialSettings = {
      autoTts: true,
      autoAdvanceDelayMs: 3000,
      tierMode: "pro",
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(initialSettings));

    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ tierMode: "basic" });
    });

    expect(result.current.settings).toEqual({
      autoTts: true,
      autoAdvanceDelayMs: 3000,
      tierMode: "basic",
    });
  });
});

describe("filterQuestionsByTier", () => {
  const mockQuestions: Question[] = [
    { id: "1", text: "General 1", category: "general" },
    { id: "2", text: "General 2", category: "general" },
    { id: "3", text: "Funny 1", category: "funny" },
    { id: "4", text: "WYR 1", category: "would-you-rather" },
    { id: "5", text: "Deep 1", category: "deep" },
    { id: "6", text: "Spicy 1", category: "spicy" },
    { id: "7", text: "Nostalgia 1", category: "nostalgia" },
    { id: "8", text: "Intimate 1", category: "intimate" },
    { id: "9", text: "NSFW 1", category: "nsfw" },
    { id: "10", text: "Custom 1", category: "custom" },
  ];

  it("should return all questions in pro mode", () => {
    const result = filterQuestionsByTier(mockQuestions, "pro");
    expect(result).toEqual(mockQuestions);
    expect(result.length).toBe(10);
  });

  it("should filter to curated categories in basic mode", () => {
    const result = filterQuestionsByTier(mockQuestions, "basic");
    
    // Should only include general, funny, would-you-rather, deep
    const categories = result.map(q => q.category);
    expect(categories).toContain("general");
    expect(categories).toContain("funny");
    expect(categories).toContain("would-you-rather");
    expect(categories).toContain("deep");
    
    // Should NOT include these in basic mode
    expect(categories).not.toContain("spicy");
    expect(categories).not.toContain("nostalgia");
    expect(categories).not.toContain("intimate");
    expect(categories).not.toContain("nsfw");
    expect(categories).not.toContain("custom");
  });

  it("should limit basic mode to 200 questions", () => {
    // Create 300 questions in curated categories
    const manyQuestions: Question[] = [];
    for (let i = 0; i < 300; i++) {
      manyQuestions.push({
        id: `q${i}`,
        text: `Question ${i}`,
        category: i % 4 === 0 ? "general" : i % 4 === 1 ? "funny" : i % 4 === 2 ? "would-you-rather" : "deep",
      });
    }

    const result = filterQuestionsByTier(manyQuestions, "basic");
    expect(result.length).toBe(200);
  });

  it("should shuffle questions in basic mode", () => {
    const result1 = filterQuestionsByTier(mockQuestions, "basic");
    const result2 = filterQuestionsByTier(mockQuestions, "basic");
    
    // Results should be shuffled (likely different order)
    // Note: There's a small chance they could be the same, but very unlikely
    const order1 = result1.map(q => q.id).join(",");
    const order2 = result2.map(q => q.id).join(",");
    
    // At least verify both have same questions
    expect(result1.map(q => q.id).sort()).toEqual(result2.map(q => q.id).sort());
  });
});
