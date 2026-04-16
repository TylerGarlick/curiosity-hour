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

  it("should close when clicking outside the panel", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    
    const overlay = document.querySelector(".fixed.inset-0");
    if (overlay) {
      fireEvent.click(overlay);
    }
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should not close when clicking inside the panel", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    
    const panel = screen.getByRole("heading", { name: /⚙️ Settings/i }).closest(".bg-surface");
    if (panel) {
      fireEvent.click(panel);
    }
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should toggle tier mode when clicking the toggle", () => {
    const mockUpdateSettings = jest.fn();
    jest.mock("@/hooks/useSettings", () => ({
      useSettings: () => ({
        settings: {
          autoTts: false,
          autoAdvanceDelayMs: 1500,
          tierMode: "pro",
        },
        updateSettings: mockUpdateSettings,
        isClient: true,
      }),
    }));

    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    
    const tierToggle = screen.getByRole("switch", { name: "" });
    fireEvent.click(tierToggle);
    
    expect(mockUpdateSettings).toHaveBeenCalledWith({ tierMode: "basic" });
  });

  it("should toggle auto-TTS when clicking the toggle", () => {
    const mockUpdateSettings = jest.fn();
    jest.mock("@/hooks/useSettings", () => ({
      useSettings: () => ({
        settings: {
          autoTts: false,
          autoAdvanceDelayMs: 1500,
          tierMode: "pro",
        },
        updateSettings: mockUpdateSettings,
        isClient: true,
      }),
    }));

    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    
    const autoTtsLabel = screen.getByText(/🔊 Auto-read questions/i);
    const toggle = autoTtsLabel.closest("div.flex.items-center");
    if (toggle) {
      const switchEl = toggle.querySelector("[role='switch']");
      if (switchEl) {
        fireEvent.click(switchEl);
      }
    }
    
    expect(mockUpdateSettings).toHaveBeenCalledWith({ autoTts: true });
  });

  it("should show delay slider when auto-TTS is enabled", () => {
    jest.mock("@/hooks/useSettings", () => ({
      useSettings: () => ({
        settings: {
          autoTts: true,
          autoAdvanceDelayMs: 1500,
          tierMode: "pro",
        },
        updateSettings: jest.fn(),
        isClient: true,
      }),
    }));

    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText(/⏱️ Delay before auto-advance/i)).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("should close when clicking the Done button", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    
    const doneButton = screen.getByText("✅ Done");
    fireEvent.click(doneButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should have proper accessibility attributes", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText("Close settings");
    expect(closeButton).toHaveAttribute("aria-label");
    
    const switches = screen.getAllByRole("switch");
    switches.forEach((sw) => {
      expect(sw).toHaveAttribute("aria-checked");
    });
  });
});

describe("SettingsPanel Visual Styles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have opaque background for readability", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    
    const overlay = document.querySelector(".fixed.inset-0");
    expect(overlay).toHaveClass("bg-black/60");
    
    const panel = screen.getByRole("heading", { name: /⚙️ Settings/i }).closest(".bg-surface");
    expect(panel).toHaveClass("bg-surface/98");
  });

  it("should have backdrop blur effects", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    
    const overlay = document.querySelector(".fixed.inset-0");
    expect(overlay).toHaveClass("backdrop-blur-md");
    
    const panel = screen.getByRole("heading", { name: /⚙️ Settings/i }).closest(".bg-surface");
    expect(panel).toHaveClass("backdrop-blur-lg");
  });

  it("should have enhanced shadow for depth", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    
    const panel = screen.getByRole("heading", { name: /⚙️ Settings/i }).closest(".bg-surface");
    expect(panel).toHaveClass("shadow-2xl");
    expect(panel).toHaveClass("shadow-black/50");
  });

  it("should have ring for additional definition", () => {
    render(<SettingsPanel isOpen={true} onClose={mockOnClose} />);
    
    const panel = screen.getByRole("heading", { name: /⚙️ Settings/i }).closest(".bg-surface");
    expect(panel).toHaveClass("ring-1");
    expect(panel).toHaveClass("ring-black/5");
  });
});
