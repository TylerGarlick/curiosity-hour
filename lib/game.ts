import { GameSession, Question, Category } from "@/types";

/**
 * Fisher-Yates shuffle algorithm.
 * Returns a new shuffled array without mutating the original.
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Initialize or reinitialize the shuffled question order for a game session.
 * This should be called once per game session (or when categories change).
 */
export function initializeShuffledQuestions(
  session: GameSession,
  allQuestions: Question[]
): GameSession {
  const available = getAvailableQuestions(session, allQuestions);
  const shuffledIds = fisherYatesShuffle(available.map((q) => q.id));
  
  return {
    ...session,
    shuffledQuestionIds: shuffledIds,
    questionIndex: 0,
  };
}

/**
 * Get the next question from the shuffled list.
 * Returns null if all questions have been exhausted.
 */
export function getNextQuestionFromShuffled(
  session: GameSession
): string | null {
  if (!session.shuffledQuestionIds || session.questionIndex === undefined) {
    return null;
  }
  
  if (session.questionIndex >= session.shuffledQuestionIds.length) {
    return null; // All questions exhausted
  }
  
  return session.shuffledQuestionIds[session.questionIndex];
}

/**
 * Advance the question index after a question has been answered/skipped.
 */
export function advanceQuestionIndex(session: GameSession): GameSession {
  if (session.questionIndex === undefined) {
    return session;
  }
  
  return {
    ...session,
    questionIndex: session.questionIndex + 1,
  };
}

export function getAvailableQuestions(
  session: GameSession,
  allQuestions: Question[]
): Question[] {
  // Start with all questions
  let available = allQuestions;

  // Filter by category if not "all"
  if (session.activeCategories !== "all") {
    available = available.filter((q) => session.activeCategories.includes(q.category));
  }

  // If friend mode, exclude intimate and nsfw
  if (session.relationshipMode === "friend") {
    available = available.filter((q) => q.category !== "intimate" && q.category !== "nsfw");
  }

  // Exclude already answered questions
  available = available.filter((q) => !session.answeredIds.includes(q.id));

  return available;
}

/**
 * Get available questions sorted to prefer non-skipped questions.
 * Returns unanswered questions with skipped ones at the end.
 */
export function getAvailableQuestionsSorted(
  session: GameSession,
  allQuestions: Question[]
): Question[] {
  const available = getAvailableQuestions(session, allQuestions);

  // Split into non-skipped and skipped
  const nonSkipped = available.filter((q) => !session.skippedIds.includes(q.id));
  const skipped = available.filter((q) => session.skippedIds.includes(q.id));

  // Return non-skipped first, then skipped
  return [...nonSkipped, ...skipped];
}

export function getAvailableCategories(
  relationshipMode: "friend" | "partner"
): Category[] {
  const allCategories: Category[] = [
    "general",
    "funny",
    "would-you-rather",
    "deep",
    "spicy",
    "nostalgia",
    "intimate",
    "nsfw",
    "custom",
  ];

  if (relationshipMode === "friend") {
    return allCategories.filter((c) => c !== "intimate" && c !== "nsfw");
  }

  return allCategories;
}

/**
 * Filter questions based on tier mode.
 * Basic mode: Returns first 200 curated questions (general, funny, would-you-rather, deep)
 * Pro mode: Returns all questions
 */
export function filterQuestionsByTier(
  questions: Question[],
  tierMode: "basic" | "pro"
): Question[] {
  if (tierMode === "pro") {
    return questions;
  }

  // Basic mode: curated subset of 200 questions
  const curatedCategories: Category[] = ["general", "funny", "would-you-rather", "deep"];
  const curated = questions.filter((q) => curatedCategories.includes(q.category));
  
  // Return first 200, shuffled for variety
  return fisherYatesShuffle(curated).slice(0, 200);
}
