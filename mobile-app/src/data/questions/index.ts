// Question Data - Central export for all question categories
// Maps existing JSON files to the unified Question interface

import deepQuestions from '../../../../../curiosity-hour/data/deep.json';
import intimateQuestions from '../../../../../curiosity-hour/data/intimate.json';
import spicyQuestions from '../../../../../curiosity-hour/data/spicy.json';
import nostalgiaQuestions from '../../../../../curiosity-hour/data/nostalgia.json';
import wouldYouRatherQuestions from '../../../../../curiosity-hour/data/would-you-rather.json';
import nsfwQuestions from '../../../../../curiosity-hour/data/nsfw.json';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type Category =
  | 'deep'
  | 'intimate'
  | 'spicy'
  | 'nostalgia'
  | 'wouldYouRather'
  | 'nsfw';

export interface Question {
  id: string;
  text: string;
  category: Category;
  nsfw: boolean;
}

// ============================================
// RAW DATA WITH TYPE MAPPING
// ============================================

interface RawQuestion {
  id: string;
  question?: string;
  text?: string;
}

// Map raw question to standard format
function mapQuestion(raw: RawQuestion, category: Category, nsfw: boolean): Question {
  return {
    id: raw.id,
    text: raw.question || raw.text || '',
    category,
    nsfw,
  };
}

// ============================================
// TRANSFORMED QUESTIONS
// ============================================

export const questions: Question[] = [
  // Deep questions
  ...deepQuestions.map((q) => mapQuestion(q, 'deep', false)),
  
  // Intimate questions (nsfw content)
  ...intimateQuestions.map((q) => mapQuestion(q, 'intimate', true)),
  
  // Spicy questions (nsfw content)
  ...spicyQuestions.map((q) => mapQuestion(q, 'spicy', true)),
  
  // Nostalgia questions
  ...nostalgiaQuestions.map((q) => mapQuestion(q, 'nostalgia', false)),
  
  // Would You Rather questions
  ...wouldYouRatherQuestions.map((q) => mapQuestion(q, 'wouldYouRather', false)),
  
  // NSFW questions (nsfw content)
  ...nsfwQuestions.map((q) => mapQuestion(q, 'nsfw', true)),
];

// ============================================
// INDEXED ACCESS
// ============================================

// Get all questions for a category
export function getQuestionsByCategory(category: Category): Question[] {
  return questions.filter(q => q.category === category);
}

// Get all NSFW questions
export function getNsfwQuestions(): Question[] {
  return questions.filter(q => q.nsfw);
}

// Get all non-NSFW questions
export function getSafeQuestions(): Question[] {
  return questions.filter(q => !q.nsfw);
}

// Get question by ID
export function getQuestion(id: string): Question | undefined {
  return questions.find(q => q.id === id);
}

// ============================================
// CATEGORY METADATA
// ============================================

export const categoryInfo: Record<Category, { label: string; emoji: string; color: string }> = {
  deep: { label: 'Deep Talk', emoji: '💭', color: '#FF6B4A' },
  intimate: { label: 'Intimate', emoji: '🔥', color: '#A855F7' },
  spicy: { label: 'Spicy', emoji: '🌶️', color: '#EF4444' },
  nostalgia: { label: 'Nostalgia', emoji: '� Polaroid', color: '#F59E0B' },
  wouldYouRather: { label: 'Would You Rather', emoji: '🤔', color: '#3B82F6' },
  nsfw: { label: 'NSFW', emoji: '⚠️', color: '#EC4899' },
};

// ============================================
// GAME QUESTION POOL GENERATION
// ============================================

// Get question IDs for selected categories (respects NSFW filter)
export function getQuestionIdsForCategories(
  categories: Category[],
  includeNsfw: boolean
): string[] {
  return questions
    .filter(q => {
      // Must be in selected categories
      if (!categories.includes(q.category)) return false;
      // Must respect NSFW filter
      if (q.nsfw && !includeNsfw) return false;
      return true;
    })
    .map(q => q.id);
}

// Count questions available for categories
export function countQuestionsForCategories(
  categories: Category[],
  includeNsfw: boolean
): number {
  return getQuestionIdsForCategories(categories, includeNsfw).length;
}

// ============================================
// FREE/PAID CATEGORIES (Freemium model)
// ============================================

export const FREE_CATEGORY: Category = 'deep';

export const PAID_CATEGORIES: Category[] = [
  'intimate',
  'spicy',
  'nostalgia',
  'wouldYouRather',
  'nsfw',
];

export function isCategoryPaid(category: Category): boolean {
  return category !== FREE_CATEGORY;
}

export function getCategoriesForProStatus(isPro: boolean): Category[] {
  if (isPro) {
    return [FREE_CATEGORY, ...PAID_CATEGORIES];
  }
  return [FREE_CATEGORY];
}
