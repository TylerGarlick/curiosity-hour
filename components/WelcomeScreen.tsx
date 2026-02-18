"use client";

import { useState } from "react";
import { RelationshipMode } from "@/types";

interface WelcomeScreenProps {
  onStartGame: (names: string[], mode: RelationshipMode) => void;
}

export function WelcomeScreen({ onStartGame }: WelcomeScreenProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState<string[]>(["", ""]);
  const [mode, setMode] = useState<RelationshipMode>("partner");

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setNames(Array(count).fill(""));
  };

  const allNamesFilled = names.every((name) => name.trim().length > 0);

  const handleStart = () => {
    if (allNamesFilled) {
      onStartGame(names, mode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-200/20 dark:from-amber-900/10 dark:to-orange-900/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-lg animate-fade-in">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-6 shadow-lg">
            <span className="text-2xl font-bold text-white">💬</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
            Curiosity Hour
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-light">
            Discover each other through thought-provoking questions
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-8 sm:p-10 space-y-8 backdrop-blur">

          {/* Player Count Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
              How many players?
            </label>
            <div className="flex gap-3">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => handlePlayerCountChange(count)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-base ${
                    playerCount === count
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg scale-105"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Name Inputs */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Enter your names
            </label>
            <div className="space-y-3">
              {Array(playerCount)
                .fill(0)
                .map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    value={names[i] || ""}
                    onChange={(e) => handleNameChange(i, e.target.value)}
                    placeholder={`Player ${i + 1}`}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                ))}
            </div>
          </div>

          {/* Relationship Mode */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Your relationship
            </label>
            <div className="flex gap-3">
              {(["friend", "partner"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 capitalize text-base ${
                    mode === m
                      ? "bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!allNamesFilled}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
              allNamesFilled
                ? "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
            }`}
          >
            {allNamesFilled ? "Start Exploring" : "Fill in names to continue"}
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
          Get ready to learn something new about each other
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
