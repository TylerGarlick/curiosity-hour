export type BuiltInCategory =
  | "general"
  | "intimate"
  | "nsfw"
  | "funny"
  | "would-you-rather"
  | "deep"
  | "spicy"
  | "nostalgia";

export type Category = BuiltInCategory | "custom";

export type RelationshipMode = "friend" | "partner";

export interface Question {
  id: string;
  text: string;
  category: Category;
}

export interface GameSession {
  id: string;
  playerNames: string[];
  relationshipMode: RelationshipMode;
  answeredIds: string[];
  currentId: string | null;
  activeCategories: Category[] | "all";
  createdAt: number;
}

export interface AppState {
  activeGameId: string | null;
  games: GameSession[];
  globalAnsweredIds: string[];
  customQuestions: Question[];
}

export interface ThemeVars {
  bg: string;
  surface: string;
  border: string;
  accent: string;
  "accent-hover": string;
  "text-primary": string;
  "text-secondary": string;
  track: string;
}
