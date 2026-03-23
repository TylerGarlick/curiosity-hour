// Question Picker Utility
// Implements the game logic for selecting the next question

import { Game } from '../stores/gameStore';
import { shuffle } from './shuffle';
import { questions, type Question } from '../data/questions';

// Get the full question object by ID
export function getQuestionById(questionId: string): Question | undefined {
  return questions.find((q: Question) => q.id === questionId);
}

// Get next question for a game using unread-first, then skipped algorithm
export function getNextQuestion(
  game: Game
): { questionId: string; category: string; text: string } | null {
  // Find unread questions
  const unread = game.questionIds.filter(
    qId => game.questionStatuses[qId] === 'unread'
  );

  if (unread.length > 0) {
    // Shuffle unread and pick random
    const shuffled = shuffle(unread);
    const questionId = shuffled[0];
    const question = getQuestionById(questionId);
    
    return {
      questionId,
      category: question?.category || questionId.split('_')[0],
      text: question?.text || '',
    };
  }

  // All unread exhausted - find skipped
  const skipped = game.questionIds.filter(
    qId => game.questionStatuses[qId] === 'skipped'
  );

  if (skipped.length > 0) {
    // Shuffle skipped and pick random
    const shuffled = shuffle(skipped);
    const questionId = shuffled[0];
    const question = getQuestionById(questionId);
    
    return {
      questionId,
      category: question?.category || questionId.split('_')[0],
      text: question?.text || '',
    };
  }

  // Game complete - no more questions
  return null;
}

// Calculate game progress
export function getGameProgress(game: Game): {
  answered: number;
  skipped: number;
  remaining: number;
  total: number;
  percentComplete: number;
} {
  const total = game.questionIds.length;
  
  let answered = 0;
  let skipped = 0;

  game.questionIds.forEach(qId => {
    const status = game.questionStatuses[qId];
    if (status === 'answered') answered++;
    if (status === 'skipped') skipped++;
  });

  const remaining = total - answered - skipped;
  const percentComplete = total > 0 ? (answered + skipped) / total : 0;

  return {
    answered,
    skipped,
    remaining,
    total,
    percentComplete,
  };
}

// Check if game is complete
export function isGameComplete(game: Game): boolean {
  const { remaining } = getGameProgress(game);
  return remaining === 0;
}

// Get game status text
export function getGameStatusText(game: Game): string {
  const { answered, total } = getGameProgress(game);
  
  if (answered === 0) {
    return 'Not started';
  }
  
  if (isGameComplete(game)) {
    return 'Complete!';
  }
  
  return `${answered} of ${total} answered`;
}
