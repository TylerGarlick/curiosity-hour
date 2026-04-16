/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { WelcomeScreen } from "@/components/WelcomeScreen";

describe("WelcomeScreen", () => {
  const mockOnStartGame = jest.fn();
  const mockOnUpgrade = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with default partner mode", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    expect(screen.getByText("🎯 Curiosity Hour")).toBeInTheDocument();
    expect(screen.getByText("💕 Get to know each other better")).toBeInTheDocument();
  });

  it("should allow changing player count", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const threePlayerButton = screen.getByText("3");
    fireEvent.click(threePlayerButton);
    const inputs = screen.getAllByPlaceholderText(/Player \d+/);
    expect(inputs).toHaveLength(3);
  });

  it("should update player names", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const input = screen.getByPlaceholderText("Player 1");
    fireEvent.change(input, { target: { value: "Alice" } });
    expect(input).toHaveValue("Alice");
  });

  it("should toggle between friend and partner mode", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const friendButton = screen.getByRole("button", { name: /friend/i });
    fireEvent.click(friendButton);
    expect(friendButton).toHaveClass("bg-accent");
    expect(screen.getByText("👯 Fun questions for friends")).toBeInTheDocument();
  });

  it("should show partner mode description when selected", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const partnerButton = screen.getByRole("button", { name: /partner/i });
    fireEvent.click(partnerButton);
    expect(partnerButton).toHaveClass("bg-accent");
    expect(screen.getByText("💕 Intimate questions for couples")).toBeInTheDocument();
  });

  it("should show checkmark icon on selected mode", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const partnerButton = screen.getByRole("button", { name: /partner/i });
    const icon = partnerButton.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should disable start button when names are empty", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const startButton = screen.getByText("🎮 Start Game");
    expect(startButton).toBeDisabled();
    expect(startButton).toHaveClass("cursor-not-allowed");
  });

  it("should enable start button when all names are filled", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const input1 = screen.getByPlaceholderText("Player 1");
    const input2 = screen.getByPlaceholderText("Player 2");
    fireEvent.change(input1, { target: { value: "Alice" } });
    fireEvent.change(input2, { target: { value: "Bob" } });
    const startButton = screen.getByText("🎮 Start Game");
    expect(startButton).not.toBeDisabled();
    expect(startButton).toHaveClass("cursor-pointer");
  });

  it("should call onStartGame with correct parameters", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const input1 = screen.getByPlaceholderText("Player 1");
    const input2 = screen.getByPlaceholderText("Player 2");
    fireEvent.change(input1, { target: { value: "Alice" } });
    fireEvent.change(input2, { target: { value: "Bob" } });
    const startButton = screen.getByText("🎮 Start Game");
    fireEvent.click(startButton);
    expect(mockOnStartGame).toHaveBeenCalledWith(["Alice", "Bob"], "partner");
  });

  it("should show upgrade prompt for free users", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={false} onUpgrade={mockOnUpgrade} />);
    expect(screen.getByText("⭐ Support the app and remove ads")).toBeInTheDocument();
    expect(screen.getByText("💎 Go Pro — $2.99")).toBeInTheDocument();
  });

  it("should not show upgrade prompt for pro users", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    expect(screen.queryByText("💎 Go Pro — $2.99")).not.toBeInTheDocument();
  });

  it("should call onUpgrade when clicking upgrade button", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={false} onUpgrade={mockOnUpgrade} />);
    const upgradeButton = screen.getByText("💎 Go Pro — $2.99");
    fireEvent.click(upgradeButton);
    expect(mockOnUpgrade).toHaveBeenCalledTimes(1);
  });
});

describe("WelcomeScreen Visual Improvements", () => {
  const mockOnStartGame = jest.fn();
  const mockOnUpgrade = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have high-contrast border on selected mode", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const partnerButton = screen.getByRole("button", { name: /partner/i });
    expect(partnerButton).toHaveClass("border-2");
    expect(partnerButton).toHaveClass("border-accent");
  });

  it("should have enhanced shadow on selected mode", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const partnerButton = screen.getByRole("button", { name: /partner/i });
    expect(partnerButton).toHaveClass("shadow-lg");
    expect(partnerButton).toHaveClass("shadow-accent/40");
  });

  it("should have ring effect on selected mode", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const partnerButton = screen.getByRole("button", { name: /partner/i });
    expect(partnerButton).toHaveClass("ring-2");
    expect(partnerButton).toHaveClass("ring-accent/50");
  });

  it("should have hover effect on unselected mode", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const friendButton = screen.getByRole("button", { name: /friend/i });
    expect(friendButton).toHaveClass("hover:border-accent/70");
    expect(friendButton).toHaveClass("hover:bg-accent/5");
  });

  it("should display mode description below selector", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    expect(screen.getByText("💕 Intimate questions for couples")).toBeInTheDocument();
  });
});

describe("WelcomeScreen Accessibility", () => {
  const mockOnStartGame = jest.fn();
  const mockOnUpgrade = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have proper contrast ratios for text", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const heading = screen.getByText("🎯 Curiosity Hour");
    expect(heading).toHaveClass("text-text-primary");
    const subtitle = screen.getByText("💕 Get to know each other better");
    expect(subtitle).toHaveClass("text-text-secondary");
  });

  it("should have accessible button states", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const disabledButton = screen.getByText("🎮 Start Game");
    expect(disabledButton).toBeDisabled();
    const inputs = screen.getAllByPlaceholderText(/Player \d+/);
    inputs.forEach((input) => {
      expect(input).toHaveAttribute("type", "text");
    });
  });

  it("should have touch-friendly button targets", () => {
    render(<WelcomeScreen onStartGame={mockOnStartGame} isPro={true} />);
    const friendButton = screen.getByRole("button", { name: /friend/i });
    const partnerButton = screen.getByRole("button", { name: /partner/i });
    expect(friendButton).toHaveClass("py-3");
    expect(partnerButton).toHaveClass("py-3");
  });
});
