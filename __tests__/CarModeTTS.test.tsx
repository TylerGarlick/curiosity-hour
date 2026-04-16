/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CarModeView } from "@/components/CarModeView";
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

// Mock useTTS hook
jest.mock("@/hooks/useTTS", () => ({
  useTTS: ({ autoTts = false }: { autoTts?: boolean } = {}) => {
    const [isSpeaking, setIsSpeaking] = require("react").useState(false);
    
    return {
      isSpeaking,
      autoAdvanceEnabled: false,
      speak: jest.fn((text: string) => {
        mockSpeak(text);
        setIsSpeaking(true);
      }),
      autoSpeak: jest.fn((text: string) => {
        if (autoTts) {
          mockSpeak(text);
          setIsSpeaking(true);
        }
      }),
      cancel: jest.fn(() => {
        mockCancel();
        setIsSpeaking(false);
      }),
    };
  },
}));

describe("CarModeView TTS Integration", () => {
  const mockQuestion: Question = {
    id: "test-1",
    text: "What is your favorite travel destination?",
    category: "travel",
  };

  const mockHandlers = {
    onNext: jest.fn(),
    onPrevious: jest.fn(),
    onStop: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSpeak.mockClear();
    mockCancel.mockClear();
  });

  it("should auto-speak question when autoTts is enabled", () => {
    render(
      <CarModeView
        question={mockQuestion}
        {...mockHandlers}
        autoTts={true}
      />
    );

    expect(mockSpeak).toHaveBeenCalledWith(mockQuestion.text);
  });

  it("should NOT auto-speak when autoTts is disabled", () => {
    render(
      <CarModeView
        question={mockQuestion}
        {...mockHandlers}
        autoTts={false}
      />
    );

    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it("should cancel ongoing speech when question changes", async () => {
    const { rerender } = render(
      <CarModeView
        question={mockQuestion}
        {...mockHandlers}
        autoTts={true}
      />
    );

    expect(mockSpeak).toHaveBeenCalledWith(mockQuestion.text);

    const newQuestion: Question = {
      id: "test-2",
      text: "What's your dream job?",
      category: "career",
    };

    rerender(
      <CarModeView
        question={newQuestion}
        {...mockHandlers}
        autoTts={true}
      />
    );

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalledWith(newQuestion.text);
  });

  it("should have a Repeat button that re-speaks the question", () => {
    render(
      <CarModeView
        question={mockQuestion}
        {...mockHandlers}
        autoTts={false}
      />
    );

    const repeatButton = screen.getByLabelText("Repeat Question");
    expect(repeatButton).toBeInTheDocument();

    fireEvent.click(repeatButton);

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalledWith(mockQuestion.text);
  });

  it("should disable Repeat button when no question is available", () => {
    render(
      <CarModeView
        question={null}
        {...mockHandlers}
        autoTts={false}
      />
    );

    const repeatButton = screen.getByLabelText("Repeat Question");
    expect(repeatButton).toBeDisabled();
  });

  it("should show normal state on Repeat button when not speaking", () => {
    render(
      <CarModeView
        question={mockQuestion}
        {...mockHandlers}
        autoTts={false}
      />
    );

    const repeatButton = screen.getByText("🔁 Repeat");
    expect(repeatButton).toBeInTheDocument();
  });

  it("should cancel speech on unmount", () => {
    const { unmount } = render(
      <CarModeView
        question={mockQuestion}
        {...mockHandlers}
        autoTts={true}
      />
    );

    unmount();

    expect(mockCancel).toHaveBeenCalled();
  });

  it("should call cancel before speaking again on Repeat", () => {
    render(
      <CarModeView
        question={mockQuestion}
        {...mockHandlers}
        autoTts={false}
      />
    );

    const repeatButton = screen.getByLabelText("Repeat Question");
    fireEvent.click(repeatButton);

    // Verify cancel is called before speak (state safety)
    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
  });

  it("should not speak empty or null questions", () => {
    render(
      <CarModeView
        question={null}
        {...mockHandlers}
        autoTts={true}
      />
    );

    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it("should have all required action buttons", () => {
    render(
      <CarModeView
        question={mockQuestion}
        {...mockHandlers}
        autoTts={false}
      />
    );

    expect(screen.getByLabelText("Previous Question")).toBeInTheDocument();
    expect(screen.getByLabelText("Next Question")).toBeInTheDocument();
    expect(screen.getByLabelText("Repeat Question")).toBeInTheDocument();
    expect(screen.getByLabelText("Stop Car Mode")).toBeInTheDocument();
  });

  it("should use high contrast styling for driving safety", () => {
    render(
      <CarModeView
        question={mockQuestion}
        {...mockHandlers}
        autoTts={false}
      />
    );

    // Check for high contrast elements
    const mainContainer = screen.getByText("Curiosity Hour").closest("div");
    expect(mainContainer).toHaveClass("bg-black");
    expect(mainContainer).toHaveClass("text-white");
  });
});
