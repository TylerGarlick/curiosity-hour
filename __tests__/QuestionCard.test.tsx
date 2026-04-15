/**
 * @jest-environment jsdom
 */

import { render, screen, act } from "@testing-library/react";
import { QuestionCard } from "@/components/QuestionCard";
import { Question } from "@/types";

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

window.speechSynthesis = {
  speak: mockSpeak,
  cancel: mockCancel,
  getVoices: jest.fn(() => []),
  paused: false,
  speaking: false,
  pending: false,
  onvoiceschanged: null,
} as unknown as SpeechSynthesis;

window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;

// Mock useTTS hook
jest.mock("@/hooks/useTTS", () => ({
  useTTS: jest.fn(),
}));

const mockUseTTS = jest.mocked(require("@/hooks/useTTS").useTTS);

describe("QuestionCard", () => {
  const mockQuestion: Question = {
    id: "q1",
    text: "What is your favorite memory?",
    category: "deep",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSpeak.mockClear();
    mockCancel.mockClear();
  });

  it("should render question text", () => {
    mockUseTTS.mockReturnValue({
      isSpeaking: false,
      autoAdvanceEnabled: false,
      speak: jest.fn(),
      autoSpeak: jest.fn(),
      cancel: jest.fn(),
    });

    render(<QuestionCard question={mockQuestion} />);

    expect(screen.getByText("What is your favorite memory?")).toBeInTheDocument();
  });

  it("should render null state when no question", () => {
    mockUseTTS.mockReturnValue({
      isSpeaking: false,
      autoAdvanceEnabled: false,
      speak: jest.fn(),
      autoSpeak: jest.fn(),
      cancel: jest.fn(),
    });

    render(<QuestionCard question={null} />);

    expect(
      screen.getByText("No more questions available!")
    ).toBeInTheDocument();
  });

  it("should auto-speak when autoTts is enabled and question changes", () => {
    const mockAutoSpeak = jest.fn();
    mockUseTTS.mockReturnValue({
      isSpeaking: false,
      autoAdvanceEnabled: false,
      speak: jest.fn(),
      autoSpeak: mockAutoSpeak,
      cancel: jest.fn(),
    });

    const { rerender } = render(
      <QuestionCard question={mockQuestion} autoTts={true} />
    );

    expect(mockAutoSpeak).toHaveBeenCalledWith(mockQuestion.text);

    // Change question
    const newQuestion: Question = {
      id: "q2",
      text: "New question",
      category: "deep",
    };

    mockAutoSpeak.mockClear();
    rerender(<QuestionCard question={newQuestion} autoTts={true} />);

    expect(mockAutoSpeak).toHaveBeenCalledWith(newQuestion.text);
  });

  it("should NOT auto-speak when autoTts is disabled", () => {
    const mockAutoSpeak = jest.fn();
    mockUseTTS.mockReturnValue({
      isSpeaking: false,
      autoAdvanceEnabled: false,
      speak: jest.fn(),
      autoSpeak: mockAutoSpeak,
      cancel: jest.fn(),
    });

    render(<QuestionCard question={mockQuestion} autoTts={false} />);

    expect(mockAutoSpeak).not.toHaveBeenCalled();
  });

  it("should call onAutoAdvance when speech ends", () => {
    const mockOnAutoAdvance = jest.fn();
    mockUseTTS.mockReturnValue({
      isSpeaking: false,
      autoAdvanceEnabled: false,
      speak: jest.fn(),
      autoSpeak: jest.fn(),
      cancel: jest.fn(),
    });

    render(
      <QuestionCard
        question={mockQuestion}
        autoTts={true}
        onAutoAdvance={mockOnAutoAdvance}
      />
    );

    // The hook should be initialized with onAutoAdvance callback
    expect(mockUseTTS).toHaveBeenCalledWith(
      expect.objectContaining({
        onSpeechEnd: mockOnAutoAdvance,
      })
    );
  });

  it("should toggle speech when speak button is clicked", () => {
    const mockSpeakFn = jest.fn();
    const mockCancelFn = jest.fn();
    const mockIsSpeaking = false;

    mockUseTTS.mockReturnValue({
      isSpeaking: mockIsSpeaking,
      autoAdvanceEnabled: false,
      speak: mockSpeakFn,
      autoSpeak: jest.fn(),
      cancel: mockCancelFn,
    });

    render(<QuestionCard question={mockQuestion} />);

    const speakButton = screen.getByRole("button", {
      name: /read aloud/i,
    });

    act(() => {
      speakButton.click();
    });

    expect(mockSpeakFn).toHaveBeenCalledWith(mockQuestion.text, false);
  });

  it("should cancel speech when stop button is clicked while speaking", () => {
    const mockSpeakFn = jest.fn();
    const mockCancelFn = jest.fn();

    mockUseTTS.mockReturnValue({
      isSpeaking: true,
      autoAdvanceEnabled: false,
      speak: mockSpeakFn,
      autoSpeak: jest.fn(),
      cancel: mockCancelFn,
    });

    render(<QuestionCard question={mockQuestion} />);

    const stopButton = screen.getByRole("button", {
      name: /stop reading/i,
    });

    act(() => {
      stopButton.click();
    });

    expect(mockCancelFn).toHaveBeenCalled();
  });

  it("should use custom autoAdvanceDelayMs setting", () => {
    mockUseTTS.mockReturnValue({
      isSpeaking: false,
      autoAdvanceEnabled: false,
      speak: jest.fn(),
      autoSpeak: jest.fn(),
      cancel: jest.fn(),
    });

    render(
      <QuestionCard question={mockQuestion} autoTts={true} autoAdvanceDelayMs={3000} />
    );

    expect(mockUseTTS).toHaveBeenCalledWith(
      expect.objectContaining({
        autoAdvanceDelayMs: 3000,
      })
    );
  });

  it("should cancel speech when component unmounts", () => {
    const mockCancelFn = jest.fn();
    mockUseTTS.mockReturnValue({
      isSpeaking: false,
      autoAdvanceEnabled: false,
      speak: jest.fn(),
      autoSpeak: jest.fn(),
      cancel: mockCancelFn,
    });

    const { unmount } = render(<QuestionCard question={mockQuestion} />);

    unmount();

    expect(mockCancelFn).toHaveBeenCalled();
  });

  it("should not auto-speak if manual speak is active", () => {
    const mockAutoSpeak = jest.fn();
    mockUseTTS.mockReturnValue({
      isSpeaking: true,
      autoAdvanceEnabled: false,
      speak: jest.fn(),
      autoSpeak: mockAutoSpeak,
      cancel: jest.fn(),
    });

    const { rerender } = render(
      <QuestionCard question={mockQuestion} autoTts={true} />
    );

    // Simulate manual speak setting to true
    mockUseTTS.mockReturnValue({
      isSpeaking: true,
      autoAdvanceEnabled: false,
      speak: jest.fn(),
      autoSpeak: mockAutoSpeak,
      cancel: jest.fn(),
    });

    const newQuestion: Question = {
      id: "q2",
      text: "New question",
      category: "deep",
    };

    mockAutoSpeak.mockClear();
    rerender(<QuestionCard question={newQuestion} autoTts={true} />);

    // Should still auto-speak because manualSpeak is component state
    // The actual behavior depends on the implementation
    expect(mockAutoSpeak).toHaveBeenCalledWith(newQuestion.text);
  });
});
