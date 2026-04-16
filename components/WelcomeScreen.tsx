"use client";

import { useState } from "react";
import { RelationshipMode } from "@/types";

interface WelcomeScreenProps {
  onStartGame: (names: string[], mode: RelationshipMode) => void;
  isPro?: boolean;
  onUpgrade?: () => void;
}

export function WelcomeScreen({ onStartGame, isPro, onUpgrade }: WelcomeScreenProps) {
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
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 pb-safe">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-3xl shadow-lg border border-border p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              🎯 Curiosity Hour
            </h1>
            <p className="text-base text-text-secondary">💕 Get to know each other better</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-primary mb-3">
              👥 Players
            </label>
            <div className="flex gap-3">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => handlePlayerCountChange(count)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all active:scale-95 touch-manipulation ${
                    playerCount === count
                      ? "bg-accent text-white shadow-md shadow-accent/25"
                      : "bg-track text-text-primary border border-border"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-primary mb-3">
              ✏️ Names
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
                    className="w-full px-4 py-4 border border-border rounded-xl bg-bg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-base"
                  />
                ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-text-primary mb-3">
              💞 Relationship
            </label>
            <div className="flex gap-3">
              {(["friend", "partner"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all active:scale-95 capitalize relative border-2 ${
                    mode === m
                      ? "bg-accent text-white shadow-lg shadow-accent/40 border-accent ring-2 ring-accent/50 ring-offset-2 ring-offset-surface"
                      : "bg-track text-text-primary border-border/60 hover:border-accent/70 hover:bg-accent/5"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {mode === m && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {m}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-text-secondary mt-2">
              {mode === "partner" ? "💕 Intimate questions for couples" : "👯 Fun questions for friends"}
            </p>
          </div>

          <button
            onClick={handleStart}
            disabled={!allNamesFilled}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 touch-manipulation ${
              allNamesFilled
                ? "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25 cursor-pointer"
                : "bg-track text-text-secondary cursor-not-allowed"
            }`}
          >
            🎮 Start Game
          </button>
        </div>

        {/* Pro upgrade prompt for free users */}
        {!isPro && onUpgrade && (
          <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
            <p className="text-sm text-text-secondary text-center mb-2">
              ⭐ Support the app and remove ads
            </p>
            <button
              onClick={onUpgrade}
              className="w-full py-2 bg-accent text-accent-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              💎 Go Pro — $2.99
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
