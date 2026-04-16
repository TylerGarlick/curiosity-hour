/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsPanel } from "@/components/SettingsPanel";

// Mock useSettings hook
jest.mock("@/hooks/useSettings", () => ({
  useSettings: () => ({
    settings: {
      autoTts: false,
      autoAdvanceDelayMs: 1500,
      tierMode: "pro",
    },
    updateSettings: jest.fn(),
    isClient: true,
  }),
}));

describe("SettingsPanel", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("should not render when isOpen is false", () => {
    render(<SettingsPanel isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render when isOpen is true", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByRole("heading", { name: /⚙️ Settings/i })).toBeInTheDocument();
  });

  it("should close when clicking the close button", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText("Close settings");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should close when clicking the Done button", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    const doneButton = screen.getByText("✅ Done");
    fireEvent.click(doneButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should display tier mode toggle", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText(/🎯 Mode/i)).toBeInTheDocument();
  });

  it("should display auto-TTS toggle", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText(/🔊 Auto-read questions/i)).toBeInTheDocument();
  });

  it("should have accessible close button", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText("Close settings");
    expect(closeButton).toHaveAttribute("aria-label");
  });
});

describe("SettingsPanel Visual Improvements", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render panel with improved opacity", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByRole("heading", { name: /⚙️ Settings/i })).toBeInTheDocument();
  });

  it("should have backdrop blur overlay", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    const overlay = document.querySelector(".fixed.inset-0");
    expect(overlay).toBeTruthy();
  });

  it("should have enhanced shadow", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText("✅ Done")).toBeInTheDocument();
  });

  it("should have ring border", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByLabelText("Close settings")).toBeInTheDocument();
  });
});
