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
    <div className="relative group">
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />

      {/* Main card */}
      <div className={`relative bg-gradient-to-br ${config.gradient} rounded-2xl shadow-2xl p-8 sm:p-12 min-h-80 sm:min-h-96 flex flex-col justify-between overflow-hidden border border-white/20`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl">{config.icon}</span>
            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
              {question.category}
            </span>
          </div>

          {/* Question text */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {question.text}
          </h2>
        </div>

        {/* Bottom accent */}
        <div className="relative z-10 flex items-center gap-2 mt-6 pt-6 border-t border-white/20">
          <div className="w-2 h-2 bg-white rounded-full" />
          <p className="text-xs text-white/70 font-light">Take your time and be honest</p>
        </div>
      </div>
    </div>
  );
}
