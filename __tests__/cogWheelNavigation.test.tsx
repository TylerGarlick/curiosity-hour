/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';

// Mock localStorage
const mockLocalStorage: Record<string, string> = {};
const mockStorage = {
  getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockLocalStorage[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockLocalStorage[key];
  }),
  clear: jest.fn(() => {
    Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key]);
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
  writable: true,
});

// Mock useLocalStorage hook
jest.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: <T,>(key: string, initialValue: T) => {
    const [storedValue, setStoredValue] = require('react').useState<T>(() => {
      const item = mockStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    });

    const setValue = (value: T | ((val: T) => T)) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      mockStorage.setItem(key, JSON.stringify(valueToStore));
    };

    return [storedValue, setValue] as const;
  },
}));

// Mock useProStatus hook
jest.mock('@/hooks/useProStatus', () => ({
  useProStatus: () => ({
    isPro: false,
    upgradeToPro: jest.fn(),
    isLoading: false,
  }),
}));

// Mock useCarMode hook
jest.mock('@/hooks/useCarMode', () => ({
  useCarMode: () => {
    const [carMode, setCarMode] = require('react').useState(false);
    return [carMode, setCarMode] as const;
  },
}));

// Mock useSettings hook
jest.mock('@/hooks/useSettings', () => ({
  useSettings: () => ({
    settings: {
      autoTts: false,
      autoAdvanceDelayMs: 3000,
      tierMode: 'basic' as 'basic' | 'pro',
    },
    updateSettings: jest.fn(),
  }),
}));

describe('Cog Wheel Button Visibility & Logo Navigation', () => {
  beforeEach(() => {
    mockStorage.clear();
    jest.clearAllMocks();
  });

  describe('Cog Wheel Button - Startup Screen', () => {
    it('should NOT show cog wheel button on startup screen when no saved games exist', async () => {
      render(<Home />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getByText('🎯 Curiosity Hour')).toBeInTheDocument();
      });

      // Cog wheel should NOT be visible when there are no saved games
      const cogWheelButton = screen.queryByLabelText('Open saved sessions');
      expect(cogWheelButton).not.toBeInTheDocument();
    });

    it('should show cog wheel button on startup screen when saved games exist', async () => {
      // Pre-populate with a saved game
      const savedGameState = {
        activeGameId: null,
        games: [
          {
            id: 'game_123',
            playerNames: ['Alice', 'Bob'],
            relationshipMode: 'partner' as const,
            answeredIds: [1, 2, 3],
            skippedIds: [],
            currentId: null,
            activeCategories: 'all' as const,
            createdAt: Date.now(),
          },
        ],
        globalAnsweredIds: [],
        customQuestions: [],
      };
      mockStorage.setItem('curiosity_hour_app', JSON.stringify(savedGameState));

      render(<Home />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getByText('🎯 Curiosity Hour')).toBeInTheDocument();
      });

      // Cog wheel SHOULD be visible when there are saved games
      const cogWheelButton = screen.getByLabelText('Open saved sessions');
      expect(cogWheelButton).toBeInTheDocument();
    });

    it('should open resume modal when cog wheel button is clicked', async () => {
      // Pre-populate with a saved game
      const savedGameState = {
        activeGameId: null,
        games: [
          {
            id: 'game_123',
            playerNames: ['Alice', 'Bob'],
            relationshipMode: 'partner' as const,
            answeredIds: [1, 2, 3],
            skippedIds: [],
            currentId: null,
            activeCategories: 'all' as const,
            createdAt: Date.now(),
          },
        ],
        globalAnsweredIds: [],
        customQuestions: [],
      };
      mockStorage.setItem('curiosity_hour_app', JSON.stringify(savedGameState));

      render(<Home />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getByText('🎯 Curiosity Hour')).toBeInTheDocument();
      });

      // Click cog wheel button
      const cogWheelButton = screen.getByLabelText('Open saved sessions');
      fireEvent.click(cogWheelButton);

      // Resume modal should appear - check for modal content
      await waitFor(() => {
        expect(screen.getByText(/Saved Sessions/i)).toBeInTheDocument();
      });
    });
  });

  describe('Cog Wheel Button - Gameplay Screen', () => {
    it('should NOT show cog wheel button during normal gameplay', async () => {
      // Pre-populate with an active game
      const savedGameState = {
        activeGameId: 'game_123',
        games: [
          {
            id: 'game_123',
            playerNames: ['Alice', 'Bob'],
            relationshipMode: 'partner' as const,
            answeredIds: [1, 2, 3],
            skippedIds: [],
            currentId: 'question_4',
            activeCategories: 'all' as const,
            createdAt: Date.now(),
          },
        ],
        globalAnsweredIds: [],
        customQuestions: [],
      };
      mockStorage.setItem('curiosity_hour_app', JSON.stringify(savedGameState));

      render(<Home />);

      // Wait for game screen to load - look for question card or game UI
      await waitFor(() => {
        // Game screen shows "answered" text in progress bar
        expect(screen.getByText(/answered/i)).toBeInTheDocument();
      });

      // Cog wheel should NOT be visible during gameplay
      const cogWheelButton = screen.queryByLabelText('Open saved sessions');
      expect(cogWheelButton).not.toBeInTheDocument();
    });
  });

  describe('Logo Navigation', () => {
    it('should navigate back to home page when logo/header is clicked during gameplay', async () => {
      // Pre-populate with an active game
      const savedGameState = {
        activeGameId: 'game_123',
        games: [
          {
            id: 'game_123',
            playerNames: ['Alice', 'Bob'],
            relationshipMode: 'partner' as const,
            answeredIds: [1, 2, 3],
            skippedIds: [],
            currentId: 'question_4',
            activeCategories: 'all' as const,
            createdAt: Date.now(),
          },
        ],
        globalAnsweredIds: [],
        customQuestions: [],
      };
      mockStorage.setItem('curiosity_hour_app', JSON.stringify(savedGameState));

      render(<Home />);

      // Wait for game screen to load
      await waitFor(() => {
        expect(screen.getByText(/answered/i)).toBeInTheDocument();
      });

      // Click the logo/header (which should be a button now)
      const logoButton = screen.getByRole('button', { name: /back to home/i });
      fireEvent.click(logoButton);

      // Should return to welcome screen
      await waitFor(() => {
        expect(screen.getByText('🎯 Curiosity Hour')).toBeInTheDocument();
        expect(screen.getByText(/Get to know each other better/i)).toBeInTheDocument();
      });
    });

    it('logo should be a clickable button with proper accessibility', async () => {
      // Pre-populate with an active game
      const savedGameState = {
        activeGameId: 'game_123',
        games: [
          {
            id: 'game_123',
            playerNames: ['Alice', 'Bob'],
            relationshipMode: 'partner' as const,
            answeredIds: [1, 2, 3],
            skippedIds: [],
            currentId: 'question_4',
            activeCategories: 'all' as const,
            createdAt: Date.now(),
          },
        ],
        globalAnsweredIds: [],
        customQuestions: [],
      };
      mockStorage.setItem('curiosity_hour_app', JSON.stringify(savedGameState));

      render(<Home />);

      // Wait for game screen to load
      await waitFor(() => {
        expect(screen.getByText(/answered/i)).toBeInTheDocument();
      });

      // Logo should be a button with proper accessibility
      const logoButton = screen.getByRole('button', { name: /back to home/i });
      expect(logoButton).toBeInTheDocument();
      expect(logoButton).toHaveAttribute('title', 'Back to Home');
    });
  });

  describe('Conditional Rendering Logic', () => {
    it('should correctly toggle cog wheel visibility based on game state transitions', async () => {
      // Start with no games
      mockStorage.setItem('curiosity_hour_app', JSON.stringify({
        activeGameId: null,
        games: [],
        globalAnsweredIds: [],
        customQuestions: [],
      }));

      render(<Home />);

      // Wait for welcome screen
      await waitFor(() => {
        expect(screen.getByText('🎯 Curiosity Hour')).toBeInTheDocument();
      });

      // No cog wheel when no games
      expect(screen.queryByLabelText('Open saved sessions')).not.toBeInTheDocument();

      // Start a game
      const startButton = screen.getByText('🎮 Start Game');
      expect(startButton).toBeDisabled();

      // Fill in player names
      const inputs = screen.getAllByPlaceholderText(/Player \d+/);
      fireEvent.change(inputs[0], { target: { value: 'Alice' } });
      fireEvent.change(inputs[1], { target: { value: 'Bob' } });

      // Now start button should be enabled
      expect(screen.getByText('🎮 Start Game')).not.toBeDisabled();

      // Start the game
      fireEvent.click(screen.getByText('🎮 Start Game'));

      // Wait for game screen
      await waitFor(() => {
        expect(screen.getByText(/answered/i)).toBeInTheDocument();
      });

      // Cog wheel should still not be visible during gameplay
      expect(screen.queryByLabelText('Open saved sessions')).not.toBeInTheDocument();

      // Navigate back to home
      const logoButton = screen.getByRole('button', { name: /back to home/i });
      fireEvent.click(logoButton);

      // Wait for welcome screen
      await waitFor(() => {
        expect(screen.getByText('🎯 Curiosity Hour')).toBeInTheDocument();
      });

      // Now cog wheel SHOULD be visible (since we have a saved game)
      expect(screen.getByLabelText('Open saved sessions')).toBeInTheDocument();
    });
  });
});
