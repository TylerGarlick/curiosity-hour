"use client";

import { Question } from "@/types";

interface QuestionCardProps {
  question: Question | null;
}

const categoryColors: Record<string, string> = {
  general: "bg-amber-500",
  funny: "bg-yellow-500",
  "would-you-rather": "bg-sky-500",
  deep: "bg-indigo-500",
  spicy: "bg-orange-500",
  nostalgia: "bg-teal-500",
  intimate: "bg-rose-500",
  nsfw: "bg-purple-500",
  custom: "bg-stone-500",
};

export function QuestionCard({ question }: QuestionCardProps) {
  if (!question) {
    return (
      <div className="bg-surface rounded-3xl border border-border p-8 text-center">
        <p className="text-text-secondary font-sans">No more questions in this category!</p>
      </div>
    );
  }

  const categoryColor = categoryColors[question.category] || "bg-stone-500";

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
