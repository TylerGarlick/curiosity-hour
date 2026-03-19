// Import all questions from the main app data files
import deepQuestions from '../../../deep_questions.json';
import intimateQuestions from '../../../intimate_questions.json';
import nostalgiaQuestions from '../../../questions_nostalgia.json';
import spicyQuestions from '../../../spicy_questions.json';
import wouldYouRather from '../../../would_you_rather.json';

export interface Question {
  id: string;
  text: string;
  category: 'deep' | 'funny' | 'intimate' | 'nostalgia' | 'spicy' | 'custom' | 'would-you-rather';
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Transform JSON data into our Question format
const transformQuestions = (
  questions: { id: string; text: string }[], 
  category: Question['category']
): Question[] => {
  return questions.map(q => ({
    id: q.id,
    text: q.text,
    category,
    difficulty: 'medium' as const
  }));
};

// Sample questions for "funny" category (since there's no funny.json)
const funnyQuestions: Question[] = [
  { id: 'funny_1', text: 'What is the most embarrassing thing you have done while alone?', category: 'funny', difficulty: 'easy' },
  { id: 'funny_2', text: 'If you were a vegetable, what would you be?', category: 'funny', difficulty: 'easy' },
  { id: 'funny_3', text: 'What is your guilty pleasure TV show?', category: 'funny', difficulty: 'easy' },
  { id: 'funny_4', text: 'What would you do if you woke up and everyone else was gone?', category: 'funny', difficulty: 'medium' },
  { id: 'funny_5', text: 'What is the weirdest food combination you enjoy?', category: 'funny', difficulty: 'easy' },
  { id: 'funny_6', text: 'What is your most used emoji?', category: 'funny', difficulty: 'easy' },
  { id: 'funny_7', text: 'Describe your personality as a weather forecast.', category: 'funny', difficulty: 'easy' },
  { id: 'funny_8', text: 'What fictional character would make the worst roommate?', category: 'funny', difficulty: 'medium' },
  { id: 'funny_9', text: 'What would be the worst name for a pizza shop?', category: 'funny', difficulty: 'easy' },
  { id: 'funny_10', text: 'If animals could talk, which would be the rudest?', category: 'funny', difficulty: 'easy' },
];

// Combine all questions from the real data files
export const sampleQuestions: Question[] = [
  ...transformQuestions(deepQuestions as { id: string; text: string }[], 'deep'),
  ...funnyQuestions,
  ...transformQuestions(intimateQuestions as { id: string; text: string }[], 'intimate'),
  ...transformQuestions(nostalgiaQuestions as { id: string; text: string }[], 'nostalgia'),
  ...transformQuestions(spicyQuestions as { id: string; text: string }[], 'spicy'),
  ...transformQuestions(wouldYouRather as { id: string; text: string }[], 'would-you-rather'),
];

// Category definitions with counts
export const categories = [
  { id: 'deep', label: 'Deep', icon: '🤔', color: '#805ad5', count: deepQuestions.length },
  { id: 'funny', label: 'Funny', icon: '😂', color: '#ed8936', count: funnyQuestions.length },
  { id: 'intimate', label: 'Intimate', icon: '❤️', color: '#d53f8c', count: intimateQuestions.length },
  { id: 'nostalgia', label: 'Nostalgia', icon: '📸', color: '#38b2ac', count: nostalgiaQuestions.length },
  { id: 'spicy', label: 'Spicy', icon: '🌶️', color: '#e94560', count: spicyQuestions.length },
  { id: 'would-you-rather', label: 'Would You Rather', icon: '🤨', color: '#4299e1', count: wouldYouRather.length },
];

// Get questions by category
export const getQuestionsByCategory = (categoryId: string): Question[] => {
  if (categoryId === 'all') {
    return sampleQuestions;
  }
  return sampleQuestions.filter(q => q.category === categoryId);
};

// Get random question from category
export const getRandomQuestion = (categoryId?: string): Question => {
  const questions = categoryId ? getQuestionsByCategory(categoryId) : sampleQuestions;
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

// Get total question count
export const getTotalQuestionCount = (): number => {
  return sampleQuestions.length;
};