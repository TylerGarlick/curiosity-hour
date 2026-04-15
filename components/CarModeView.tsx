"use client";

import { Question } from "@/types";

interface CarModeViewProps {
  question: Question | null;
  onNext: () => void;
  onPrevious: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function CarModeView({
  question,
  onNext,
  onPrevious,
  onStop,
  disabled = false,
}: CarModeViewProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-4 sm:p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Curiosity Hour
        </h1>
        <button
          onClick={onStop}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 touch-manipulation"
          aria-label="Exit Car Mode"
        >
          ✕ Exit
        </button>
      </header>

      {/* Question Card - High contrast, maximum readability */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="w-full max-w-2xl bg-zinc-900 border-2 border-white rounded-3xl p-8 sm:p-12 text-center">
          {question ? (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              {question.text}
            </h2>
          ) : (
            <p className="text-2xl sm:text-3xl text-zinc-400">
              No more questions available!
            </p>
          )}
        </div>
      </div>

      {/* Giant Action Buttons - Optimized for drivers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <button
          onClick={onPrevious}
          disabled={disabled}
          className={`py-8 px-6 rounded-2xl font-bold text-2xl transition-all active:scale-95 touch-manipulation ${
            disabled
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
          }`}
          aria-label="Previous Question"
        >
          ⏮ Previous
        </button>

        <button
          onClick={onNext}
          disabled={disabled || !question}
          className={`py-8 px-6 rounded-2xl font-bold text-2xl transition-all active:scale-95 touch-manipulation ${
            disabled || !question
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30"
          }`}
          aria-label="Next Question"
        >
          ✓ Next
        </button>

        <button
          onClick={onStop}
          className="py-8 px-6 rounded-2xl font-bold text-2xl bg-zinc-700 hover:bg-zinc-600 text-white transition-all active:scale-95 touch-manipulation"
          aria-label="Stop Car Mode"
        >
          ⏹ Stop
        </button>
      </div>

      {/* Safety reminder */}
      <p className="text-center text-zinc-500 text-sm mt-6">
        ⚠️ Use responsibly while driving
      </p>
    </div>
  );
}
