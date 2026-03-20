// Curiosity Hour — Type Definitions
// Comprehensive type system for the mobile app

// ============================================
// CATEGORY & QUESTION TYPES
// ============================================

export type BuiltInCategory =
  | 'deep'
  | 'funny'
  | 'intimate'
  | 'nsfw'
  | 'spicy'
  | 'nostalgia'
  | 'would-you-rather';

export type Category = BuiltInCategory | 'custom';

// Question interface with NSFW flag
export interface Question {
  id: string;           // e.g., "deep_001"
  text: string;
  category: Category;
  isNsfw: boolean;      // NSFW flag per question
  pack?: string;        // Pack identifier
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Question Bank - collection of questions per category/pack
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

// ============================================
// PLAYER TYPES
// ============================================

export interface Player {
  id: string;
  name: string;
  nsfwEnabled: boolean;   // Per-player NSFW toggle for this game
}

// ============================================
// GAME SESSION TYPES
// ============================================

export type QuestionStatus = 'unread' | 'answered' | 'skipped';

export interface GameSession {
  id: string;
  name: string;
  players: Player[];
  
  // Question pool for this game (ordered list of IDs from selected categories)
  questionIds: string[];
  
  // Per-question tracking
  questionStatuses: Record<string, QuestionStatus>;
  
  // Which categories are enabled for this game
  activeCategories: Category[];
  
  // Archive state
  isArchived: boolean;
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
}

// Game state for persistence
export interface GameState {
  usedQuestionIds: string[];
  skippedQuestionIds: string[];
}

// ============================================
// PURCHASE / ENTITLEMENTS
// ============================================

export type PackId = 
  | 'deep'           // Free (bundled)
  | 'funny'          // Free (bundled)
  | 'nostalgia'      // Free (bundled)
  | 'would-you-rather' // Free (bundled)
  | 'intimate'       // $1.99
  | 'nsfw'           // $1.99
  | 'spicy';         // $1.99

export interface Pack {
  id: PackId;
  name: string;
  description: string;
  price: number;          // 0 for free, 199 for $1.99
  category: Category;
  questionCount: number;
  isNsfw: boolean;
}

export interface Entitlement {
  packId: PackId;
  purchasedAt: number;
  receiptId?: string;     // StoreKit / Play Billing receipt
}

// ============================================
// SETTINGS TYPES
// ============================================

export interface Settings {
  globalNsfwEnabled: boolean;    // Global NSFW toggle (hides NSFW questions when false)
  carModeSpeed: 0.75 | 1.0 | 1.25;  // TTS speed multiplier
  carModeAutoTTS: boolean;       // Auto-read questions in car mode
  darkMode: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

// ============================================
// STORE TYPES
// ============================================

// Game Store
export interface GameStore {
  games: GameSession[];
  currentGameId: string | null;
  
  // Actions
  createGame: (
    name: string,
    players: Player[],
    categories: Category[],
    questionIds: string[]
  ) => string;
  answerQuestion: (gameId: string, questionId: string) => void;
  skipQuestion: (gameId: string, questionId: string) => void;
  getNextQuestion: (gameId: string) => { questionId: string; category: string; text: string } | null;
  resetGame: (gameId: string) => void;
  archiveGame: (gameId: string) => void;
  restoreGame: (gameId: string) => void;
  deleteGame: (gameId: string) => void;
  setCurrentGame: (gameId: string | null) => void;
  updateGameName: (gameId: string, name: string) => void;
  getGame: (gameId: string) => GameSession | undefined;
  getActiveGames: () => GameSession[];
  getArchivedGames: () => GameSession[];
  
  // Persistence
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

// Settings Store
export interface SettingsStore {
  globalNsfwEnabled: boolean;
  carModeSpeed: 0.75 | 1.0 | 1.25;
  carModeAutoTTS: boolean;
  darkMode: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  
  // Actions
  setGlobalNsfwEnabled: (v: boolean) => void;
  setCarModeSpeed: (v: 0.75 | 1.0 | 1.25) => void;
  setCarModeAutoTTS: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
  setSoundEnabled: (v: boolean) => void;
  setHapticEnabled: (v: boolean) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

// Purchase Store
export interface PurchaseStore {
  entitlements: Entitlement[];
  
  // Actions
  addEntitlement: (entitlement: Entitlement) => void;
  isEntitled: (packId: PackId) => boolean;
  getOwnedPackIds: () => PackId[];
  restorePurchases: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

// Question Bank Store
export interface QuestionBankStore {
  banks: QuestionBank[];
  isLoading: boolean;
  
  // Actions
  loadQuestions: () => Promise<void>;
  getQuestionsByCategory: (category: Category) => Question[];
  getQuestionById: (id: string) => Question | undefined;
  getRandomQuestion: (categories: Category[], options?: { excludeNsfw?: boolean }) => Question | undefined;
  getQuestionCount: (categories: Category[], excludeNsfw: boolean) => number;
}

// ============================================
// GAME FLOW STATE MACHINE
// ============================================

export type GameFlowState = 
  | 'SETUP'        // Collecting player names, categories, NSFW preferences
  | 'PLAYING'      // Displaying question, waiting for action
  | 'CYCLING_SKIPPED' // No unread left; replaying skipped questions
  | 'COMPLETE';    // All questions answered or skipped

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface CategoryCardProps {
  bank: QuestionBank;
  isSelected: boolean;
  isLocked: boolean;
  onPress: () => void;
}

export interface QuestionCardProps {
  question: Question;
  animated?: boolean;
}

export interface ActionButtonsProps {
  onAnswer: () => void;
  onSkip: () => void;
  layout?: 'horizontal' | 'vertical';
}

export interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}
