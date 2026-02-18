"use client";

import { Question } from "@/types";

interface QuestionCardProps {
  question: Question | null;
}

const categoryConfig: Record<string, { gradient: string; icon: string }> = {
  general: { gradient: "from-amber-400 to-yellow-500", icon: "💡" },
  funny: { gradient: "from-yellow-400 to-yellow-500", icon: "😄" },
  "would-you-rather": { gradient: "from-blue-400 to-cyan-500", icon: "🤔" },
  deep: { gradient: "from-indigo-400 to-purple-500", icon: "🌊" },
  spicy: { gradient: "from-orange-400 to-red-500", icon: "🔥" },
  nostalgia: { gradient: "from-teal-400 to-cyan-500", icon: "🎬" },
  intimate: { gradient: "from-rose-400 to-pink-500", icon: "💕" },
  nsfw: { gradient: "from-purple-400 to-pink-500", icon: "⚡" },
  custom: { gradient: "from-slate-400 to-slate-500", icon: "✨" },
};

export function QuestionCard({ question }: QuestionCardProps) {
  if (!question) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
        <p className="text-lg text-slate-600 dark:text-slate-400 font-light">
          No more questions in this category!
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Try adjusting your filters or resetting the game
        </p>
      </div>
    );
  }

  const config = categoryConfig[question.category] || categoryConfig.custom;

  return (
    <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-8 min-h-64 flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-text-primary flex-1 leading-tight">
          {question.text}
        </h2>
        <span
          className={`${categoryColor} text-white px-3 py-1 rounded-full text-xs font-sans font-semibold whitespace-nowrap capitalize flex-shrink-0`}
        >
          {question.category}
        </span>
      </div>
    </div>
  );
}
