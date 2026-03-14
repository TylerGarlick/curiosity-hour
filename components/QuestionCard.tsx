"use client";

import { Question } from "@/types";

interface QuestionCardProps {
  question: Question | null;
}

export function QuestionCard({ question }: QuestionCardProps) {
  if (!question) {
    return (
      <div className="bg-surface rounded-2xl border border-border p-8 text-center">
        <p className="text-lg text-text-secondary">
          No more questions available!
        </p>
        <p className="text-sm text-text-secondary mt-2 opacity-70">
          Try adjusting your filters or reset progress
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 min-h-56 flex items-center justify-center">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-text-primary text-center leading-relaxed">
        {question.text}
      </h2>
    </div>
  );
}
