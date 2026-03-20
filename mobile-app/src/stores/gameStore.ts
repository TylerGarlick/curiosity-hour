// Game State Management with Zustand
import { create } from 'zustand';
import { nanoid } from 'nanoid';

// ============================================
// TYPES
// ============================================

export interface Player {
  id: string;
  name: string;
  nsfwEnabled: boolean;
}

export type QuestionStatus = 'unread' | 'answered' | 'skipped';

export interface Game {
  id: string;
  name: string;
  players: Player[];
  categories: string[];
  questionIds: string[]; // ordered list of question IDs for this game
  questionStatuses: Record<string, QuestionStatus>;
  currentIndex: number;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
}

interface GameStore {
  games: Game[];
  currentGameId: string | null;
  // actions
  createGame: (name: string, players: Player[], categories: string[], questionIds: string[]) => string;
  answerQuestion: (gameId: string, questionId: string) => void;
  skipQuestion: (gameId: string, questionId: string) => void;
  getNextQuestion: (gameId: string) => { questionId: string; category: string; text: string } | null;
  resetGame: (gameId: string) => void;
  archiveGame: (gameId: string) => void;
  restoreGame: (gameId: string) => void;
  setCurrentGame: (gameId: string | null) => void;
  updateGameName: (gameId: string, name: string) => void;
  getGame: (gameId: string) => Game | undefined;
  getActiveGames: () => Game[];
  getArchivedGames: () => Game[];
}

// ============================================
// STORE
// ============================================

export const useGameStore = create<GameStore>((set, get) => ({
  games: [],
  currentGameId: null,

  createGame: (name, players, categories, questionIds) => {
    const id = nanoid(10);
    const now = Date.now();
    
    // Initialize all questions as unread
    const questionStatuses: Record<string, QuestionStatus> = {};
    questionIds.forEach(qId => {
      questionStatuses[qId] = 'unread';
    });

    const newGame: Game = {
      id,
      name,
      players,
      categories,
      questionIds,
      questionStatuses,
      currentIndex: 0,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };

    set(state => ({
      games: [...state.games, newGame],
      currentGameId: id,
    }));

    return id;
  },

  answerQuestion: (gameId, questionId) => {
    set(state => ({
      games: state.games.map(game => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          questionStatuses: {
            ...game.questionStatuses,
            [questionId]: 'answered',
          },
          updatedAt: Date.now(),
        };
      }),
    }));
  },

  skipQuestion: (gameId, questionId) => {
    set(state => ({
      games: state.games.map(game => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          questionStatuses: {
            ...game.questionStatuses,
            [questionId]: 'skipped',
          },
          updatedAt: Date.now(),
        };
      }),
    }));
  },

  getNextQuestion: (gameId) => {
    const game = get().games.find(g => g.id === gameId);
    if (!game) return null;

    // Find unread questions
    const unread = game.questionIds.filter(
      qId => game.questionStatuses[qId] === 'unread'
    );

    if (unread.length > 0) {
      const randomIndex = Math.floor(Math.random() * unread.length);
      const questionId = unread[randomIndex];
      // Get category from question ID prefix (e.g., "deep_001" -> "deep")
      const category = questionId.split('_')[0];
      return { questionId, category, text: '' }; // text will be filled by caller
    }

    // Find skipped questions
    const skipped = game.questionIds.filter(
      qId => game.questionStatuses[qId] === 'skipped'
    );

    if (skipped.length > 0) {
      const randomIndex = Math.floor(Math.random() * skipped.length);
      const questionId = skipped[randomIndex];
      const category = questionId.split('_')[0];
      return { questionId, category, text: '' };
    }

    // Game complete
    return null;
  },

  resetGame: (gameId) => {
    set(state => ({
      games: state.games.map(game => {
        if (game.id !== gameId) return game;
        const questionStatuses: Record<string, QuestionStatus> = {};
        game.questionIds.forEach(qId => {
          questionStatuses[qId] = 'unread';
        });
        return {
          ...game,
          questionStatuses,
          currentIndex: 0,
          updatedAt: Date.now(),
        };
      }),
    }));
  },

  archiveGame: (gameId) => {
    set(state => ({
      games: state.games.map(game => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          isArchived: true,
          updatedAt: Date.now(),
        };
      }),
    }));
  },

  restoreGame: (gameId) => {
    set(state => ({
      games: state.games.map(game => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          isArchived: false,
          updatedAt: Date.now(),
        };
      }),
    }));
  },

  setCurrentGame: (gameId) => {
    set({ currentGameId: gameId });
  },

  updateGameName: (gameId, name) => {
    set(state => ({
      games: state.games.map(game => {
        if (game.id !== gameId) return game;
        return {
          ...game,
          name,
          updatedAt: Date.now(),
        };
      }),
    }));
  },

  getGame: (gameId) => {
    return get().games.find(g => g.id === gameId);
  },

  getActiveGames: () => {
    return get().games.filter(g => !g.isArchived);
  },

  getArchivedGames: () => {
    return get().games.filter(g => g.isArchived);
  },
}));

export default useGameStore;
