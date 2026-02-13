import { Question, BuiltInCategory } from "@/types";

// Import all question data files
import generalQuestions from "@/data/general.json";
import funnyQuestions from "@/data/funny.json";
import wyrQuestions from "@/data/would-you-rather.json";
import deepQuestions from "@/data/deep.json";
import spicyQuestions from "@/data/spicy.json";
import nostalgiaQuestions from "@/data/nostalgia.json";
import intimateQuestions from "@/data/intimate.json";
import nsfwQuestions from "@/data/nsfw.json";

// Map of category to raw questions
const categoryMap: Record<BuiltInCategory, Array<{ id: string; text: string }>> = {
  general: generalQuestions,
  funny: funnyQuestions,
  "would-you-rather": wyrQuestions,
  deep: deepQuestions,
  spicy: spicyQuestions,
  nostalgia: nostalgiaQuestions,
  intimate: intimateQuestions,
  nsfw: nsfwQuestions,
};

// Load all questions and tag them with their category
export const allBuiltInQuestions: Question[] = [];

(Object.entries(categoryMap) as [BuiltInCategory, Array<{ id: string; text: string }>][]).forEach(
  ([category, questions]) => {
    questions.forEach((q) => {
      allBuiltInQuestions.push({
        id: q.id,
        text: q.text,
        category,
      });
    });
  }
);

export function getAllQuestions(customQuestions: Question[]): Question[] {
  return [...allBuiltInQuestions, ...customQuestions];
}
