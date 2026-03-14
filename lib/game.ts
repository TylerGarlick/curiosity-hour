import { GameSession, Question, Category } from "@/types";

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

export function pickRandomQuestion(available: Question[]): string | null {
  if (available.length === 0) return null;
  const index = Math.floor(Math.random() * available.length);
  return available[index].id;
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
