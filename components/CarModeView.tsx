"use client";

import { Question } from "@/types";
import { useTTS } from "@/hooks/useTTS";
import { useEffect } from "react";

interface CarModeViewProps {
  question: Question | null;
  onNext: () => void;
  onPrevious: () => void;
  onStop: () => void;
  disabled?: boolean;
  autoTts?: boolean;
}

export function CarModeView({
  question,
  onNext,
  onPrevious,
  onStop,
  disabled = false,
  autoTts = false,
}: CarModeViewProps) {
  const { isSpeaking, speak, cancel, autoSpeak } = useTTS({
    autoTts,
    autoAdvanceDelayMs: 0, // No auto-advance in car mode
  });

  // Auto-speak when question changes
  useEffect(() => {
    if (question?.text && autoTts) {
      autoSpeak(question.text);
    }
    // Cancel speech when question changes or component unmounts
    return () => {
      cancel();
    };
  }, [question?.text, autoTts, autoSpeak, cancel]);

  // Handle repeat speech
  const handleRepeat = () => {
    if (question?.text) {
      cancel(); // Cancel any ongoing speech first
      speak(question.text);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-4 sm:p-6 animate-fadeIn">
      {/* Dark overlay background effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-zinc-950 to-black opacity-90 pointer-events-none -z-10" />
      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-slideDown">
        <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
          Curiosity Hour
        </h1>
        <button
          onClick={onStop}
          className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95 touch-manipulation shadow-lg shadow-red-600/40 active:shadow-red-600/60 hover:shadow-red-600/50"
          aria-label="Exit Car Mode"
        >
          ✕ Exit
        </button>
      </header>

      {/* Question Card - High contrast, maximum readability */}
      <div className="flex-1 flex items-center justify-center mb-6 animate-scaleIn">
        <div className="w-full max-w-2xl bg-zinc-900/95 backdrop-blur-sm border-2 border-white/90 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-white/10">
          {question ? (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-md animate-fadeIn">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 animate-slideUp">
        <button
          onClick={onPrevious}
          disabled={disabled}
          className={`py-10 px-8 rounded-3xl font-bold text-3xl transition-all duration-200 active:scale-90 touch-manipulation ${
            disabled
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xl shadow-blue-600/40 active:shadow-blue-600/60 hover:shadow-blue-600/50"
          }`}
          aria-label="Previous Question"
        >
          ⏮ Previous
        </button>

        <button
          onClick={onNext}
          disabled={disabled || !question}
          className={`py-10 px-8 rounded-3xl font-bold text-3xl transition-all duration-200 active:scale-90 touch-manipulation ${
            disabled || !question
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
              : "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-xl shadow-green-600/40 active:shadow-green-600/60 hover:shadow-green-600/50"
          }`}
          aria-label="Next Question"
        >
          ✓ Next
        </button>

        <button
          onClick={handleRepeat}
          disabled={!question}
          className={`py-10 px-8 rounded-3xl font-bold text-3xl transition-all duration-200 active:scale-90 touch-manipulation ${
            !question
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
              : isSpeaking
                ? "bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-xl shadow-purple-600/40 active:shadow-purple-600/60 hover:shadow-purple-600/50"
                : "bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 text-white shadow-xl shadow-zinc-700/40 active:shadow-zinc-700/60 hover:shadow-zinc-700/50"
          }`}
          aria-label="Repeat Question"
        >
          {isSpeaking ? "🔊 Speaking..." : "🔁 Repeat"}
        </button>
      </div>

      {/* Stop button moved to separate row for better layout */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 animate-slideUp">
        <button
          onClick={onStop}
          className="py-10 px-8 rounded-3xl font-bold text-3xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-all duration-200 active:scale-90 touch-manipulation shadow-xl shadow-red-600/40 active:shadow-red-600/60 hover:shadow-red-600/50"
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
