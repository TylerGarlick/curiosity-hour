// QuestionBankContext — Global State Management for Curiosity Hour
// Handles question banks, NSFW filtering, game state, and persistence

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// TYPES
// ============================================

export type Category = 'deep' | 'funny' | 'intimate' | 'nsfw' | 'spicy' | 'nostalgia' | 'would-you-rather' | 'custom';

export interface Question {
  id: string;
  text: string;
  category: Category;
  isNsfw: boolean;
  pack?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuestionBank {
  id: string;
  name: string;
  category: Category;
  isFree: boolean;
  questions: Question[];
  icon: string;
  color: string;
  description: string;
}

export interface Player {
  id: string;
  name: string;
  nsfwEnabled: boolean;
}

export type QuestionStatus = 'unread' | 'answered' | 'skipped';

export interface GameSession {
  id: string;
  name: string;
  players: Player[];
  questionIds: string[];
  questionStatuses: Record<string, QuestionStatus>;
  activeCategories: Category[];
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface GameState {
  usedQuestionIds: string[];
  skippedQuestionIds: string[];
}

export type PackId = 'deep' | 'funny' | 'nostalgia' | 'would-you-rather' | 'intimate' | 'nsfw' | 'spicy' | 'remove_ads' | 'premium';

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  GAMES: '@curiosity/games',
  SETTINGS: '@curiosity/settings',
  ENTITLEMENTS: '@curiosity/entitlements',
  GAME_STATE: '@curiosity/game_state',
};

// ============================================
// INITIAL STATE
// ============================================

interface AppState {
  // Question Banks
  banks: QuestionBank[];
  isLoadingBanks: boolean;
  
  // Global NSFW Toggle
  nsfwEnabled: boolean;
  
  // Entitlements (purchased packs)
  entitlements: PackId[];
  
  // Games
  games: GameSession[];
  currentGameId: string | null;
  
  // Selected categories for current game setup
  selectedCategories: Category[];
  
  // Persistent game state (used/skipped tracking)
  gameStates: Record<string, GameState>;
}

const initialState: AppState = {
  banks: [],
  isLoadingBanks: true,
  nsfwEnabled: false,
  entitlements: ['deep', 'funny', 'nostalgia', 'would-you-rather'], // Free packs always included
  games: [],
  currentGameId: null,
  selectedCategories: ['deep'],
  gameStates: {},
};

// ============================================
// ACTIONS
// ============================================

type Action =
  | { type: 'SET_BANKS'; payload: QuestionBank[] }
  | { type: 'SET_LOADING_BANKS'; payload: boolean }
  | { type: 'SET_NSFW_ENABLED'; payload: boolean }
  | { type: 'SET_ENTITLEMENTS'; payload: PackId[] }
  | { type: 'ADD_ENTITLEMENT'; payload: PackId }
  | { type: 'SET_GAMES'; payload: GameSession[] }
  | { type: 'ADD_GAME'; payload: GameSession }
  | { type: 'UPDATE_GAME'; payload: GameSession }
  | { type: 'DELETE_GAME'; payload: string }
  | { type: 'SET_CURRENT_GAME'; payload: string | null }
  | { type: 'SET_SELECTED_CATEGORIES'; payload: Category[] }
  | { type: 'TOGGLE_CATEGORY'; payload: Category }
  | { type: 'SET_GAME_STATE'; payload: { gameId: string; state: GameState } }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_BANKS':
      return { ...state, banks: action.payload };
    
    case 'SET_LOADING_BANKS':
      return { ...state, isLoadingBanks: action.payload };
    
    case 'SET_NSFW_ENABLED':
      return { ...state, nsfwEnabled: action.payload };
    
    case 'SET_ENTITLEMENTS':
      return { ...state, entitlements: action.payload };
    
    case 'ADD_ENTITLEMENT':
      if (state.entitlements.includes(action.payload)) return state;
      return { ...state, entitlements: [...state.entitlements, action.payload] };
    
    case 'SET_GAMES':
      return { ...state, games: action.payload };
    
    case 'ADD_GAME':
      return { ...state, games: [...state.games, action.payload], currentGameId: action.payload.id };
    
    case 'UPDATE_GAME':
      return {
        ...state,
        games: state.games.map(g => g.id === action.payload.id ? action.payload : g),
      };
    
    case 'DELETE_GAME':
      return {
        ...state,
        games: state.games.filter(g => g.id !== action.payload),
        currentGameId: state.currentGameId === action.payload ? null : state.currentGameId,
      };
    
    case 'SET_CURRENT_GAME':
      return { ...state, currentGameId: action.payload };
    
    case 'SET_SELECTED_CATEGORIES':
      return { ...state, selectedCategories: action.payload };
    
    case 'TOGGLE_CATEGORY':
      const cat = action.payload;
      const isPaid = ['intimate', 'nsfw', 'spicy'].includes(cat);
      const isEntitled = state.entitlements.includes(cat as PackId);
      
      // Don't allow selecting paid categories that aren't owned
      if (isPaid && !isEntitled) return state;
      
      const categories = state.selectedCategories.includes(cat)
        ? state.selectedCategories.filter(c => c !== cat)
        : [...state.selectedCategories, cat];
      
      // Ensure at least one category is selected
      if (categories.length === 0) return state;
      
      return { ...state, selectedCategories: categories };
    
    case 'SET_GAME_STATE':
      return {
        ...state,
        gameStates: {
          ...state.gameStates,
          [action.payload.gameId]: action.payload.state,
        },
      };
    
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

interface QuestionBankContextValue {
  state: AppState;
  
  // Question Bank actions
  loadBanks: () => Promise<void>;
  getQuestionsByCategory: (category: Category) => Question[];
  getQuestionById: (id: string) => Question | undefined;
  getRandomQuestion: (categories: Category[]) => Question | undefined;
  getAvailableQuestionCount: (categories: Category[]) => number;
  
  // NSFW actions
  toggleNsfw: () => void;
  setNsfwEnabled: (enabled: boolean) => void;
  isNsfwQuestion: (question: Question) => boolean;
  
  // Category actions
  getSelectedCategories: () => Category[];
  toggleCategory: (category: Category) => void;
  setSelectedCategories: (categories: Category[]) => void;
  
  // Entitlement actions
  isEntitled: (packId: PackId) => boolean;
  addEntitlement: (packId: PackId) => void;
  getOwnedPacks: () => PackId[];
  
  // Game actions
  createGame: (name: string, players: Player[]) => string;
  answerQuestion: (gameId: string, questionId: string) => void;
  skipQuestion: (gameId: string, questionId: string) => void;
  getNextQuestion: (gameId: string) => Question | null;
  resetGame: (gameId: string) => void;
  archiveGame: (gameId: string) => void;
  restoreGame: (gameId: string) => void;
  deleteGame: (gameId: string) => void;
  setCurrentGame: (gameId: string | null) => void;
  updateGameName: (gameId: string, name: string) => void;
  getCurrentGame: () => GameSession | undefined;
  getActiveGames: () => GameSession[];
  getArchivedGames: () => GameSession[];
  isGameComplete: (gameId: string) => boolean;
  
  // Game progress
  getGameProgress: (gameId: string) => { answered: number; skipped: number; remaining: number; total: number };
}

const QuestionBankContext = createContext<QuestionBankContextValue | undefined>(undefined);

// ============================================
// NANOID HELPER
// ============================================

function nanoid(size = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < size; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ============================================
// SHUFFLE HELPER
// ============================================

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ============================================
// PROVIDER COMPONENT
// ============================================

interface QuestionBankProviderProps {
  children: ReactNode;
}

export function QuestionBankProvider({ children }: QuestionBankProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ============================================
  // PERSISTENCE
  // ============================================

  // Load state from AsyncStorage on mount
  useEffect(() => {
    async function loadPersistedState() {
      try {
        const [gamesJson, settingsJson, entitlementsJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.GAMES),
          AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
          AsyncStorage.getItem(STORAGE_KEYS.ENTITLEMENTS),
        ]);

        const persistedState: Partial<AppState> = {};

        if (gamesJson) {
          persistedState.games = JSON.parse(gamesJson);
        }

        if (settingsJson) {
          const settings = JSON.parse(settingsJson);
          persistedState.nsfwEnabled = settings.globalNsfwEnabled ?? false;
        }

        if (entitlementsJson) {
          persistedState.entitlements = JSON.parse(entitlementsJson);
        }

        if (Object.keys(persistedState).length > 0) {
          dispatch({ type: 'LOAD_STATE', payload: persistedState });
        }
      } catch (error) {
        console.error('Failed to load persisted state:', error);
      }
    }

    loadPersistedState();
  }, []);

  // Save games when they change
  useEffect(() => {
    if (state.games.length > 0) {
      AsyncStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(state.games)).catch(console.error);
    }
  }, [state.games]);

  // Save settings when NSFW toggle changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
      globalNsfwEnabled: state.nsfwEnabled,
    })).catch(console.error);
  }, [state.nsfwEnabled]);

  // Save entitlements when they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.ENTITLEMENTS, JSON.stringify(state.entitlements)).catch(console.error);
  }, [state.entitlements]);

  // ============================================
  // QUESTION BANK LOADING
  // ============================================

  const loadBanks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING_BANKS', payload: true });

    try {
      // Dynamically import question data
      const [
        deepQuestions,
        funnyQuestions,
        intimateQuestions,
        spicyQuestions,
        nostalgiaQuestions,
        wouldYouRatherQuestions,
        nsfwQuestions,
      ] = await Promise.all([
        import('../../../data/deep_questions.json').then(m => m.default),
        import('../../../data/intimate_questions.json').then(m => m.default),
        import('../../../data/spicy_questions.json').then(m => m.default),
        import('../../../data/questions_nostalgia.json').then(m => m.default),
        import('../../../data/would_you_rather.json').then(m => m.default),
        import('../../../data/nsfw.json').then(m => m.default),
      ]);

      // Generate funny questions since there's no funny.json
      const funny: Question[] = [
        { id: 'funny_1', text: 'What is the most embarrassing thing you have done while alone?', category: 'funny', isNsfw: false },
        { id: 'funny_2', text: 'If you were a vegetable, what would you be?', category: 'funny', isNsfw: false },
        { id: 'funny_3', text: 'What is your guilty pleasure TV show?', category: 'funny', isNsfw: false },
        { id: 'funny_4', text: 'What would you do if you woke up and everyone else was gone?', category: 'funny', isNsfw: false },
        { id: 'funny_5', text: 'What is the weirdest food combination you enjoy?', category: 'funny', isNsfw: false },
        { id: 'funny_6', text: 'What is your most used emoji?', category: 'funny', isNsfw: false },
        { id: 'funny_7', text: 'Describe your personality as a weather forecast.', category: 'funny', isNsfw: false },
        { id: 'funny_8', text: 'What fictional character would make the worst roommate?', category: 'funny', isNsfw: false },
        { id: 'funny_9', text: 'What would be the worst name for a pizza shop?', category: 'funny', isNsfw: false },
        { id: 'funny_10', text: 'If animals could talk, which would be the rudest?', category: 'funny', isNsfw: false },
      ];

      const banks: QuestionBank[] = [
        {
          id: 'deep',
          name: 'Deep Talk',
          category: 'deep',
          isFree: true,
          questions: deepQuestions.map((q: { id: string; text?: string; question?: string }) => ({
            id: q.id,
            text: q.text || q.question || '',
            category: 'deep' as Category,
            isNsfw: false,
          })),
          icon: '🤔',
          color: '#805ad5',
          description: 'Thought-provoking questions to deepen your connection',
        },
        {
          id: 'funny',
          name: 'Funny',
          category: 'funny',
          isFree: true,
          questions: funny,
          icon: '😂',
          color: '#ed8936',
          description: 'Hilarious questions to bring out the laughs',
        },
        {
          id: 'intimate',
          name: 'Intimate',
          category: 'intimate',
          isFree: false,
          questions: intimateQuestions.map((q: { id: string; text?: string; question?: string }) => ({
            id: q.id,
            text: q.text || q.question || '',
            category: 'intimate' as Category,
            isNsfw: true,
          })),
          icon: '❤️',
          color: '#d53f8c',
          description: 'Personal questions to build intimacy',
        },
        {
          id: 'spicy',
          name: 'Spicy',
          category: 'spicy',
          isFree: false,
          questions: spicyQuestions.map((q: { id: string; text?: string; question?: string }) => ({
            id: q.id,
            text: q.text || q.question || '',
            category: 'spicy' as Category,
            isNsfw: true,
          })),
          icon: '🌶️',
          color: '#e94560',
          description: 'Bold questions for confident pairs',
        },
        {
          id: 'nostalgia',
          name: 'Nostalgia',
          category: 'nostalgia',
          isFree: true,
          questions: nostalgiaQuestions.map((q: { id: string; text?: string; question?: string }) => ({
            id: q.id,
            text: q.text || q.question || '',
            category: 'nostalgia' as Category,
            isNsfw: false,
          })),
          icon: '📸',
          color: '#38b2ac',
          description: 'Memories and past experiences',
        },
        {
          id: 'would-you-rather',
          name: 'Would You Rather',
          category: 'would-you-rather',
          isFree: true,
          questions: wouldYouRatherQuestions.map((q: { id: string; text?: string; question?: string }) => ({
            id: q.id,
            text: q.text || q.question || '',
            category: 'would-you-rather' as Category,
            isNsfw: false,
          })),
          icon: '🤨',
          color: '#4299e1',
          description: 'Tough choices and fun dilemmas',
        },
        {
          id: 'nsfw',
          name: 'NSFW',
          category: 'nsfw',
          isFree: false,
          questions: nsfwQuestions.map((q: { id: string; text?: string; question?: string }) => ({
            id: q.id,
            text: q.text || q.question || '',
            category: 'nsfw' as Category,
            isNsfw: true,
          })),
          icon: '⚠️',
          color: '#ec4899',
          description: 'Adult questions for open-minded pairs',
        },
      ];

      dispatch({ type: 'SET_BANKS', payload: banks });
    } catch (error) {
      console.error('Failed to load question banks:', error);
    } finally {
      dispatch({ type: 'SET_LOADING_BANKS', payload: false });
    }
  }, []);

  // Load banks on mount
  useEffect(() => {
    loadBanks();
  }, [loadBanks]);

  // ============================================
  // QUESTION HELPERS
  // ============================================

  const getAllQuestions = useCallback((): Question[] => {
    return state.banks.flatMap(bank => bank.questions);
  }, [state.banks]);

  const getQuestionsByCategory = useCallback((category: Category): Question[] => {
    const bank = state.banks.find(b => b.category === category);
    if (!bank) return [];
    
    // Apply NSFW filter
    if (!state.nsfwEnabled) {
      return bank.questions.filter(q => !q.isNsfw);
    }
    return bank.questions;
  }, [state.banks, state.nsfwEnabled]);

  const getQuestionById = useCallback((id: string): Question | undefined => {
    return getAllQuestions().find(q => q.id === id);
  }, [getAllQuestions]);

  const getRandomQuestion = useCallback((categories: Category[]): Question | undefined => {
    // Get all questions from selected categories
    let questions: Question[] = [];
    
    for (const cat of categories) {
      const catQuestions = getQuestionsByCategory(cat);
      questions = [...questions, ...catQuestions];
    }
    
    if (questions.length === 0) return undefined;
    
    // Shuffle and pick random
    return shuffle(questions)[0];
  }, [getQuestionsByCategory]);

  const getAvailableQuestionCount = useCallback((categories: Category[]): number => {
    let count = 0;
    for (const cat of categories) {
      const catQuestions = getQuestionsByCategory(cat);
      count += catQuestions.length;
    }
    return count;
  }, [getQuestionsByCategory]);

  // ============================================
  // NSFW ACTIONS
  // ============================================

  const toggleNsfw = useCallback(() => {
    dispatch({ type: 'SET_NSFW_ENABLED', payload: !state.nsfwEnabled });
  }, [state.nsfwEnabled]);

  const setNsfwEnabled = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_NSFW_ENABLED', payload: enabled });
  }, []);

  const isNsfwQuestion = useCallback((question: Question): boolean => {
    return question.isNsfw;
  }, []);

  // ============================================
  // CATEGORY ACTIONS
  // ============================================

  const getSelectedCategories = useCallback((): Category[] => {
    return state.selectedCategories;
  }, [state.selectedCategories]);

  const toggleCategory = useCallback((category: Category) => {
    dispatch({ type: 'TOGGLE_CATEGORY', payload: category });
  }, []);

  const setSelectedCategories = useCallback((categories: Category[]) => {
    dispatch({ type: 'SET_SELECTED_CATEGORIES', payload: categories });
  }, []);

  // ============================================
  // ENTITLEMENT ACTIONS
  // ============================================

  const isEntitled = useCallback((packId: PackId): boolean => {
    // Free packs are always entitled
    if (['deep', 'funny', 'nostalgia', 'would-you-rather'].includes(packId)) {
      return true;
    }
    return state.entitlements.includes(packId);
  }, [state.entitlements]);

  const addEntitlement = useCallback((packId: PackId) => {
    dispatch({ type: 'ADD_ENTITLEMENT', payload: packId });
  }, []);

  const getOwnedPacks = useCallback((): PackId[] => {
    return state.entitlements;
  }, [state.entitlements]);

  // ============================================
  // GAME ACTIONS
  // ============================================

  const createGame = useCallback((name: string, players: Player[]): string => {
    const id = nanoid(10);
    const now = Date.now();

    // Get questions for selected categories
    const questionIds: string[] = [];
    for (const cat of state.selectedCategories) {
      const questions = getQuestionsByCategory(cat);
      questionIds.push(...questions.map(q => q.id));
    }

    // Shuffle question IDs
    const shuffledIds = shuffle(questionIds);

    // Initialize all as unread
    const questionStatuses: Record<string, QuestionStatus> = {};
    shuffledIds.forEach(qId => {
      questionStatuses[qId] = 'unread';
    });

    const newGame: GameSession = {
      id,
      name,
      players,
      questionIds: shuffledIds,
      questionStatuses,
      activeCategories: state.selectedCategories,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };

    // Initialize game state for tracking
    const gameState: GameState = {
      usedQuestionIds: [],
      skippedQuestionIds: [],
    };

    dispatch({ type: 'ADD_GAME', payload: newGame });
    dispatch({ type: 'SET_GAME_STATE', payload: { gameId: id, state: gameState } });

    return id;
  }, [state.selectedCategories, getQuestionsByCategory]);

  const answerQuestion = useCallback((gameId: string, questionId: string) => {
    const game = state.games.find(g => g.id === gameId);
    if (!game) return;

    const updatedGame: GameSession = {
      ...game,
      questionStatuses: {
        ...game.questionStatuses,
        [questionId]: 'answered',
      },
      updatedAt: Date.now(),
    };

    dispatch({ type: 'UPDATE_GAME', payload: updatedGame });

    // Update game state
    const currentState = state.gameStates[gameId] || { usedQuestionIds: [], skippedQuestionIds: [] };
    dispatch({
      type: 'SET_GAME_STATE',
      payload: {
        gameId,
        state: {
          ...currentState,
          usedQuestionIds: [...currentState.usedQuestionIds, questionId],
        },
      },
    });
  }, [state.games, state.gameStates]);

  const skipQuestion = useCallback((gameId: string, questionId: string) => {
    const game = state.games.find(g => g.id === gameId);
    if (!game) return;

    const updatedGame: GameSession = {
      ...game,
      questionStatuses: {
        ...game.questionStatuses,
        [questionId]: 'skipped',
      },
      updatedAt: Date.now(),
    };

    dispatch({ type: 'UPDATE_GAME', payload: updatedGame });

    // Update game state
    const currentState = state.gameStates[gameId] || { usedQuestionIds: [], skippedQuestionIds: [] };
    dispatch({
      type: 'SET_GAME_STATE',
      payload: {
        gameId,
        state: {
          ...currentState,
          skippedQuestionIds: [...currentState.skippedQuestionIds, questionId],
        },
      },
    });
  }, [state.games, state.gameStates]);

  const getNextQuestion = useCallback((gameId: string): Question | null => {
    const game = state.games.find(g => g.id === gameId);
    if (!game) return null;

    // Find unread questions
    const unread = game.questionIds.filter(
      qId => game.questionStatuses[qId] === 'unread'
    );

    if (unread.length > 0) {
      // Shuffle and pick random from unread
      const shuffled = shuffle(unread);
      return getQuestionById(shuffled[0]) || null;
    }

    // All unread exhausted - find skipped
    const skipped = game.questionIds.filter(
      qId => game.questionStatuses[qId] === 'skipped'
    );

    if (skipped.length > 0) {
      // Shuffle and pick random from skipped
      const shuffled = shuffle(skipped);
      return getQuestionById(shuffled[0]) || null;
    }

    // Game complete - no more questions
    return null;
  }, [state.games, getQuestionById]);

  const resetGame = useCallback((gameId: string) => {
    const game = state.games.find(g => g.id === gameId);
    if (!game) return;

    // Reset all questions to unread
    const questionStatuses: Record<string, QuestionStatus> = {};
    game.questionIds.forEach(qId => {
      questionStatuses[qId] = 'unread';
    });

    const updatedGame: GameSession = {
      ...game,
      questionStatuses,
      updatedAt: Date.now(),
    };

    dispatch({ type: 'UPDATE_GAME', payload: updatedGame });

    // Reset game state
    dispatch({
      type: 'SET_GAME_STATE',
      payload: {
        gameId,
        state: {
          usedQuestionIds: [],
          skippedQuestionIds: [],
        },
      },
    });
  }, [state.games]);

  const archiveGame = useCallback((gameId: string) => {
    const game = state.games.find(g => g.id === gameId);
    if (!game) return;

    const updatedGame: GameSession = {
      ...game,
      isArchived: true,
      updatedAt: Date.now(),
    };

    dispatch({ type: 'UPDATE_GAME', payload: updatedGame });
  }, [state.games]);

  const restoreGame = useCallback((gameId: string) => {
    const game = state.games.find(g => g.id === gameId);
    if (!game) return;

    const updatedGame: GameSession = {
      ...game,
      isArchived: false,
      updatedAt: Date.now(),
    };

    dispatch({ type: 'UPDATE_GAME', payload: updatedGame });
  }, [state.games]);

  const deleteGame = useCallback((gameId: string) => {
    dispatch({ type: 'DELETE_GAME', payload: gameId });
  }, []);

  const setCurrentGame = useCallback((gameId: string | null) => {
    dispatch({ type: 'SET_CURRENT_GAME', payload: gameId });
  }, []);

  const updateGameName = useCallback((gameId: string, name: string) => {
    const game = state.games.find(g => g.id === gameId);
    if (!game) return;

    const updatedGame: GameSession = {
      ...game,
      name,
      updatedAt: Date.now(),
    };

    dispatch({ type: 'UPDATE_GAME', payload: updatedGame });
  }, [state.games]);

  const getCurrentGame = useCallback((): GameSession | undefined => {
    return state.games.find(g => g.id === state.currentGameId);
  }, [state.games, state.currentGameId]);

  const getActiveGames = useCallback((): GameSession[] => {
    return state.games.filter(g => !g.isArchived);
  }, [state.games]);

  const getArchivedGames = useCallback((): GameSession[] => {
    return state.games.filter(g => g.isArchived);
  }, [state.games]);

  const isGameComplete = useCallback((gameId: string): boolean => {
    const game = state.games.find(g => g.id === gameId);
    if (!game) return false;

    return !game.questionIds.some(qId => 
      game.questionStatuses[qId] === 'unread' || game.questionStatuses[qId] === 'skipped'
    );
  }, [state.games]);

  const getGameProgress = useCallback((gameId: string): { answered: number; skipped: number; remaining: number; total: number } => {
    const game = state.games.find(g => g.id === gameId);
    if (!game) {
      return { answered: 0, skipped: 0, remaining: 0, total: 0 };
    }

    let answered = 0;
    let skipped = 0;

    game.questionIds.forEach(qId => {
      const status = game.questionStatuses[qId];
      if (status === 'answered') answered++;
      if (status === 'skipped') skipped++;
    });

    const total = game.questionIds.length;
    const remaining = total - answered - skipped;

    return { answered, skipped, remaining, total };
  }, [state.games]);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = useMemo<QuestionBankContextValue>(() => ({
    state,
    loadBanks,
    getQuestionsByCategory,
    getQuestionById,
    getRandomQuestion,
    getAvailableQuestionCount,
    toggleNsfw,
    setNsfwEnabled,
    isNsfwQuestion,
    getSelectedCategories,
    toggleCategory,
    setSelectedCategories,
    isEntitled,
    addEntitlement,
    getOwnedPacks,
    createGame,
    answerQuestion,
    skipQuestion,
    getNextQuestion,
    resetGame,
    archiveGame,
    restoreGame,
    deleteGame,
    setCurrentGame,
    updateGameName,
    getCurrentGame,
    getActiveGames,
    getArchivedGames,
    isGameComplete,
    getGameProgress,
  }), [
    state,
    loadBanks,
    getQuestionsByCategory,
    getQuestionById,
    getRandomQuestion,
    getAvailableQuestionCount,
    toggleNsfw,
    setNsfwEnabled,
    isNsfwQuestion,
    getSelectedCategories,
    toggleCategory,
    setSelectedCategories,
    isEntitled,
    addEntitlement,
    getOwnedPacks,
    createGame,
    answerQuestion,
    skipQuestion,
    getNextQuestion,
    resetGame,
    archiveGame,
    restoreGame,
    deleteGame,
    setCurrentGame,
    updateGameName,
    getCurrentGame,
    getActiveGames,
    getArchivedGames,
    isGameComplete,
    getGameProgress,
  ]);

  return (
    <QuestionBankContext.Provider value={value}>
      {children}
    </QuestionBankContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useQuestionBank(): QuestionBankContextValue {
  const context = useContext(QuestionBankContext);
  if (!context) {
    throw new Error('useQuestionBank must be used within a QuestionBankProvider');
  }
  return context;
}

// ============================================
// EXPORTS
// ============================================

export { QuestionBankContext };
export type { QuestionBankContextValue };
