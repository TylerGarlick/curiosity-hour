// Question Data - Central export for all question categories
// Maps existing JSON files to the unified Question interface

export type Category =
  | 'deep'
  | 'funny'
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

// Import questions from JSON files
import deepQuestions from './deep.json';
import funnyQuestions from './funny.json';
import intimateQuestions from './intimate.json';
import spicyQuestions from './spicy.json';
import nostalgiaQuestions from './nostalgia.json';
import wouldYouRatherQuestions from './would-you-rather.json';
import nsfwQuestions from './nsfw.json';

type RawQuestion = { id: string; text?: string; question?: string };

function mapQuestion(raw: RawQuestion, category: Category, nsfw: boolean): Question {
  return {
    id: raw.id,
    text: raw.text || raw.question || '',
    category,
    nsfw,
  };
}

export const questions: Question[] = [
  ...(deepQuestions as RawQuestion[]).map(q => mapQuestion(q, 'deep', false)),
  ...(funnyQuestions as RawQuestion[]).map(q => mapQuestion(q, 'funny', false)),
  ...(intimateQuestions as RawQuestion[]).map(q => mapQuestion(q, 'intimate', true)),
  ...(spicyQuestions as RawQuestion[]).map(q => mapQuestion(q, 'spicy', true)),
  ...(nostalgiaQuestions as RawQuestion[]).map(q => mapQuestion(q, 'nostalgia', false)),
  ...(wouldYouRatherQuestions as RawQuestion[]).map(q => mapQuestion(q, 'wouldYouRather', false)),
  ...(nsfwQuestions as RawQuestion[]).map(q => mapQuestion(q, 'nsfw', true)),
];
