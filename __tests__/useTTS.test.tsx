/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useTTS } from "@/hooks/useTTS";

// Mock SpeechSynthesisUtterance
class MockSpeechSynthesisUtterance {
  text: string;
  rate: number = 1;
  pitch: number = 1;
  volume: number = 1;
  voice: SpeechSynthesisVoice | null = null;
  lang: string = "";
  onstart: ((event: SpeechSynthesisEvent) => void) | null = null;
  onend: ((event: SpeechSynthesisEvent) => void) | null = null;
  onerror: ((event: SpeechSynthesisEvent) => void) | null = null;
  onpause: ((event: SpeechSynthesisEvent) => void) | null = null;
  onresume: ((event: SpeechSynthesisEvent) => void) | null = null;
  onboundary: ((event: SpeechSynthesisEvent) => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

// Mock SpeechSynthesis
const mockSpeak = jest.fn();
const mockCancel = jest.fn();
const mockGetVoices = jest.fn(() => []);

window.speechSynthesis = {
  speak: mockSpeak,
  cancel: mockCancel,
  getVoices: mockGetVoices,
  paused: false,
  speaking: false,
  pending: false,
  onvoiceschanged: null,
} as unknown as SpeechSynthesis;

window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;

describe("useTTS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSpeak.mockClear();
    mockCancel.mockClear();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useTTS());

    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.autoAdvanceEnabled).toBe(false);
    expect(typeof result.current.speak).toBe("function");
    expect(typeof result.current.cancel).toBe("function");
    expect(typeof result.current.autoSpeak).toBe("function");
  });

  it("should speak text when speak() is called", () => {
    const { result } = renderHook(() => useTTS());

    act(() => {
      result.current.speak("Hello world");
    });

    expect(mockSpeak).toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(true);
  });

  it("should not speak empty text", () => {
    const { result } = renderHook(() => useTTS());

    act(() => {
      result.current.speak("");
    });

    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it("should cancel ongoing speech when cancel() is called", () => {
    const { result } = renderHook(() => useTTS());

    act(() => {
      result.current.speak("Hello world");
    });

    expect(mockSpeak).toHaveBeenCalled();

    act(() => {
      result.current.cancel();
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(false);
  });

  it("should auto-speak when autoTts is enabled", () => {
    const onSpeechEnd = jest.fn();
    const { result } = renderHook(() =>
      useTTS({
        autoTts: true,
        autoAdvanceDelayMs: 100,
        onSpeechEnd,
      })
    );

    act(() => {
      result.current.autoSpeak("Test question");
    });

    expect(mockSpeak).toHaveBeenCalled();
  });

  it("should not auto-speak when autoTts is disabled", () => {
    const { result } = renderHook(() =>
      useTTS({
        autoTts: false,
      })
    );

    act(() => {
      result.current.autoSpeak("Test question");
    });

    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it("should call onSpeechEnd callback when speech ends", (done) => {
    const onSpeechEnd = jest.fn();
    const { result } = renderHook(() =>
      useTTS({
        autoTts: true,
        autoAdvanceDelayMs: 50,
        onSpeechEnd,
      })
    );

    act(() => {
      result.current.speak("Test", true);
    });

    // Simulate speech end
    const utterance = mockSpeak.mock.calls[0][0];
    if (utterance && utterance.onend) {
      setTimeout(() => {
        utterance.onend();
        setTimeout(() => {
          expect(onSpeechEnd).toHaveBeenCalled();
          done();
        }, 100);
      }, 10);
    }
  });

  it("should handle speech errors gracefully", () => {
    const onSpeechEnd = jest.fn();
    const { result } = renderHook(() =>
      useTTS({
        onSpeechEnd,
      })
    );

    act(() => {
      result.current.speak("Test");
    });

    // Simulate speech error
    const utterance = mockSpeak.mock.calls[0][0];
    if (utterance && utterance.onerror) {
      act(() => {
        utterance.onerror({ error: "test-error" });
      });

      expect(result.current.isSpeaking).toBe(false);
    }
  });

  it("should cancel previous speech when speaking new text", () => {
    const { result } = renderHook(() => useTTS());

    act(() => {
      result.current.speak("First text");
    });

    act(() => {
      result.current.speak("Second text");
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalledTimes(2);
  });

  it("should use custom rate and pitch settings", () => {
    const { result } = renderHook(() =>
      useTTS({
        rate: 1.2,
        pitch: 0.8,
      })
    );

    act(() => {
      result.current.speak("Test");
    });

    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance.rate).toBe(1.2);
    expect(utterance.pitch).toBe(0.8);
  });

  it("should trigger auto-advance after speech ends when enabled", (done) => {
    const onSpeechEnd = jest.fn();
    const { result } = renderHook(() =>
      useTTS({
        autoTts: true,
        autoAdvanceDelayMs: 50,
        onSpeechEnd,
      })
    );

    act(() => {
      result.current.speak("Test", true);
    });

    // Simulate speech end
    const utterance = mockSpeak.mock.calls[0][0];
    if (utterance && utterance.onend) {
      act(() => {
        utterance.onend();
      });

      expect(result.current.autoAdvanceEnabled).toBe(true);

      // Wait for auto-advance delay
      setTimeout(() => {
        expect(onSpeechEnd).toHaveBeenCalled();
        done();
      }, 100);
    }
  });
});
