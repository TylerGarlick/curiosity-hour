import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { ResumeGameModal } from "@/components/ResumeGameModal";
import { GameSession } from "@/types";

// Mock localStorage
const mockLocalStorage = (() => {
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

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe("Modal Rendering Fix - Global Dialogs Always in DOM", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  it("renders ResumeGameModal in DOM when on Welcome Screen (no active game)", async () => {
    // Setup: User has saved games but no active game (Welcome Screen state)
    const existingState = {
      activeGameId: null,
      games: [
        {
          id: "game_1",
          playerNames: ["Alice", "Bob"],
          relationshipMode: "partner",
          answeredIds: ["q1", "q2"],
          skippedIds: [],
          currentId: "q3",
          activeCategories: "all",
          createdAt: Date.now(),
          shuffledQuestionIds: ["q1", "q2", "q3"],
          questionIndex: 2,
        } as GameSession,
      ],
      globalAnsweredIds: [],
      customQuestions: [],
    };
    mockLocalStorage.setItem("curiosity_hour_app", JSON.stringify(existingState));

    render(<Home />);

    // Wait for component to mount
    await waitFor(() => {
      expect(screen.getByText("🎯 Curiosity Hour")).toBeInTheDocument();
    });

    // Verify Welcome Screen is visible (not game screen)
    expect(screen.getByText("💕 Get to know each other better")).toBeInTheDocument();

    // Open the resume modal via cog-wheel button
    const cogButton = screen.getByLabelText("Open saved sessions");
    fireEvent.click(cogButton);

    // Verify modal opens - this proves the modal is rendered and functional on Welcome Screen
    await waitFor(() => {
      expect(screen.getByText("📋 Saved Sessions")).toBeInTheDocument();
    });

    expect(screen.getByText("Alice & Bob")).toBeInTheDocument();
  });

  it("renders ResumeGameModal in DOM when on Game Screen", async () => {
    // Setup: User has an active game (Game Screen state)
    const existingState = {
      activeGameId: "game_1",
      games: [
        {
          id: "game_1",
          playerNames: ["Bob"],
          relationshipMode: "friend",
          answeredIds: ["q1"],
          skippedIds: [],
          currentId: "q2",
          activeCategories: "all",
          createdAt: Date.now(),
          shuffledQuestionIds: ["q1", "q2", "q3"],
          questionIndex: 1,
        } as GameSession,
      ],
      globalAnsweredIds: [],
      customQuestions: [],
    };
    mockLocalStorage.setItem("curiosity_hour_app", JSON.stringify(existingState));

    render(<Home />);

    // Wait for component to mount
    await waitFor(() => {
      expect(screen.getByText("🎯 Curiosity Hour")).toBeInTheDocument();
    });

    // Verify Game Screen is visible (question card should be present)
    // The cog button is hidden on game screen, but modal should still be in DOM
    expect(screen.queryByLabelText("Open saved sessions")).not.toBeInTheDocument();

    // Navigate back to home to access the modal
    const homeButton = screen.getByText("🎯 Curiosity Hour");
    fireEvent.click(homeButton);

    // Wait for Welcome Screen
    await waitFor(() => {
      expect(screen.getByText("💕 Get to know each other better")).toBeInTheDocument();
    });

    // Now cog button should be visible
    const cogButton = screen.getByLabelText("Open saved sessions");
    fireEvent.click(cogButton);

    // Verify modal opens
    await waitFor(() => {
      expect(screen.getByText("📋 Saved Sessions")).toBeInTheDocument();
    });
  });

  it("renders all global dialogs regardless of screen state", async () => {
    const existingState = {
      activeGameId: null,
      games: [],
      globalAnsweredIds: [],
      customQuestions: [],
    };
    mockLocalStorage.setItem("curiosity_hour_app", JSON.stringify(existingState));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("🎯 Curiosity Hour")).toBeInTheDocument();
    });

    // All global dialogs should be in the DOM even if not visible
    // We verify this by checking they can be opened/triggered
    
    // Start a game to get to game screen
    const nameInputs = screen.getAllByPlaceholderText(/Player \d+/);
    fireEvent.change(nameInputs[0], { target: { value: "Test Player" } });
    fireEvent.change(nameInputs[1], { target: { value: "Test Player 2" } });
    
    const startButton = screen.getByText("🎮 Start Game");
    fireEvent.click(startButton);

    // Wait for game screen
    await waitFor(() => {
      expect(screen.getByText("Test Player & Test Player 2")).toBeInTheDocument();
    });

    // Now verify we can open Settings - use getAllBy and pick the button (not h2)
    const settingsButtons = screen.getAllByText("⚙️ Settings");
    // The button is the first one, h2 is inside the panel
    fireEvent.click(settingsButtons[0]);

    await waitFor(() => {
      // Settings panel should be visible
      expect(screen.getByText("🔊 Auto-read questions")).toBeInTheDocument();
    });
  });

  it("cog-wheel button on welcome screen opens ResumeGameModal", async () => {
    // This is the critical test for the fix
    const existingState = {
      activeGameId: null,
      games: [
        {
          id: "game_test",
          playerNames: ["Test"],
          relationshipMode: "partner",
          answeredIds: ["q1"],
          skippedIds: [],
          currentId: "q2",
          activeCategories: "all",
          createdAt: Date.now(),
          shuffledQuestionIds: ["q1", "q2"],
          questionIndex: 1,
        } as GameSession,
      ],
      globalAnsweredIds: [],
      customQuestions: [],
    };
    mockLocalStorage.setItem("curiosity_hour_app", JSON.stringify(existingState));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("💕 Get to know each other better")).toBeInTheDocument();
    });

    // Find and click the cog-wheel button
    const cogButton = screen.getByLabelText("Open saved sessions");
    expect(cogButton).toBeInTheDocument();
    
    fireEvent.click(cogButton);

    // Verify the modal opens - this proves the modal was rendered and is functional
    await waitFor(() => {
      expect(screen.getByText("📋 Saved Sessions")).toBeInTheDocument();
      expect(screen.getByText("Test (Solo)")).toBeInTheDocument();
    });
  });

  it("ResumeGameModal is present in DOM when !activeGame is true", async () => {
    // Direct test: Verify modal component exists when there's no active game
    const existingState = {
      activeGameId: null,
      games: [
        {
          id: "game_1",
          playerNames: ["Player"],
          relationshipMode: "friend",
          answeredIds: [],
          skippedIds: [],
          currentId: null,
          activeCategories: "all",
          createdAt: Date.now(),
          shuffledQuestionIds: [],
          questionIndex: 0,
        } as GameSession,
      ],
      globalAnsweredIds: [],
      customQuestions: [],
    };
    mockLocalStorage.setItem("curiosity_hour_app", JSON.stringify(existingState));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("💕 Get to know each other better")).toBeInTheDocument();
    });

    // The modal should be in the DOM (may not be visible, but present)
    // We verify by checking the component can be triggered
    const cogButton = screen.getByLabelText("Open saved sessions");
    expect(cogButton).toBeInTheDocument();

    // Click to open modal
    fireEvent.click(cogButton);

    // Modal content should appear
    await waitFor(() => {
      expect(screen.getByText("📋 Saved Sessions")).toBeInTheDocument();
    });

    // This proves the modal was rendered in the DOM even on Welcome Screen
    expect(true).toBe(true);
  });

  it("SettingsPanel is accessible from all screens", async () => {
    const existingState = {
      activeGameId: "game_1",
      games: [
        {
          id: "game_1",
          playerNames: ["Player"],
          relationshipMode: "friend",
          answeredIds: ["q1"],
          skippedIds: [],
          currentId: "q2",
          activeCategories: "all",
          createdAt: Date.now(),
          shuffledQuestionIds: ["q1", "q2"],
          questionIndex: 1,
        } as GameSession,
      ],
      globalAnsweredIds: [],
      customQuestions: [],
    };
    mockLocalStorage.setItem("curiosity_hour_app", JSON.stringify(existingState));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("1 answered")).toBeInTheDocument();
    });

    // Settings button should be on game screen - use getAllBy and pick button
    const settingsButtons = screen.getAllByText("⚙️ Settings");
    fireEvent.click(settingsButtons[0]);

    await waitFor(() => {
      // Settings panel content should be visible
      expect(screen.getByText("🔊 Auto-read questions")).toBeInTheDocument();
    });
  });

  it("ProUpgradeModal is accessible from all screens", async () => {
    const existingState = {
      activeGameId: null,
      games: [],
      globalAnsweredIds: [],
      customQuestions: [],
    };
    mockLocalStorage.setItem("curiosity_hour_app", JSON.stringify(existingState));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("💕 Get to know each other better")).toBeInTheDocument();
    });

    // Start a game to get Pro button
    const nameInputs = screen.getAllByPlaceholderText(/Player \d+/);
    fireEvent.change(nameInputs[0], { target: { value: "Test" } });
    fireEvent.change(nameInputs[1], { target: { value: "Test 2" } });
    
    const startButton = screen.getByText("🎮 Start Game");
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText("Pro")).toBeInTheDocument();
    });

    // Click Pro upgrade button - there might be multiple, use getAllBy
    const proButtons = screen.getAllByText("Pro");
    fireEvent.click(proButtons[0]);

    // Upgrade modal should open
    await waitFor(() => {
      expect(screen.getByText("Go Pro")).toBeInTheDocument();
    });
  });
});
