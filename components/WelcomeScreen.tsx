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
    <div className="min-h-screen bg-bg flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl sm:rounded-3xl shadow-lg border border-border p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary mb-2">
            Curiosity Hour
          </h1>
          <p className="text-sm sm:text-base text-text-secondary font-sans">Get to know each other better</p>
        </div>

        {/* Player Count Selector */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-sm font-semibold text-text-primary mb-3">
            How many players?
          </label>
          <div className="flex gap-2">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => handlePlayerCountChange(count)}
                className={`flex-1 py-2 px-3 rounded-lg font-sans font-medium transition-colors text-sm active:scale-95 ${
                  playerCount === count
                    ? "bg-accent text-white"
                    : "bg-track text-text-primary border border-border hover:bg-border"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Name Inputs */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-sm font-semibold text-text-primary mb-3">
            Player Names
          </label>
          <div className="space-y-2">
            {Array(playerCount)
              .fill(0)
              .map((_, i) => (
                <input
                  key={i}
                  type="text"
                  value={names[i] || ""}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  placeholder={`Player ${i + 1}`}
                  className="w-full px-4 py-3 sm:py-2 border border-border rounded-lg bg-bg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-base"
                />
              ))}
          </div>
        </div>

        {/* Relationship Mode */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-sm font-semibold text-text-primary mb-3">
            Relationship
          </label>
          <div className="flex gap-3">
            {(["friend", "partner"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 px-4 rounded-lg font-sans font-medium transition-colors capitalize text-sm active:scale-95 ${
                  mode === m
                    ? "bg-accent text-white"
                    : "bg-track text-text-primary border border-border hover:bg-border"
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
          className={`w-full py-3 rounded-lg font-sans font-semibold transition-colors text-base active:scale-95 ${
            allNamesFilled
              ? "bg-accent hover:bg-accent-hover text-white cursor-pointer"
              : "bg-track text-text-secondary cursor-not-allowed"
          }`}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
