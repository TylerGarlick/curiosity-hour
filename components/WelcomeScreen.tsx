"use client";

import { useState } from "react";
import { RelationshipMode } from "@/types";

interface WelcomeScreenProps {
  onStartGame: (names: string[], mode: RelationshipMode) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  isPro?: boolean;
  onUpgrade?: () => void;
}

export function WelcomeScreen({ onStartGame, onCreateRoom, onJoinRoom, isPro, onUpgrade }: WelcomeScreenProps) {
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
              Curiosity Hour
            </h1>
            <p className="text-base text-text-secondary">Get to know each other better</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-primary mb-3">
              Players
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
              Names
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
              Relationship
            </label>
            <div className="flex gap-3">
              {(["friend", "partner"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all active:scale-95 capitalize ${
                    mode === m
                      ? "bg-accent text-white shadow-md shadow-accent/25"
                      : "bg-track text-text-primary border border-border"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
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
            Start Game
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary mb-3">or play remotely</p>
          <div className="flex gap-3">
            <button
              onClick={onCreateRoom}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 active:scale-95 touch-manipulation"
            >
              Create Room
            </button>
            <button
              onClick={onJoinRoom}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 active:scale-95 touch-manipulation"
            >
              Join Room
            </button>
          </div>
        </div>

        {/* Pro upgrade prompt for free users */}
        {!isPro && onUpgrade && (
          <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
            <p className="text-sm text-text-secondary text-center mb-2">
              Support the app and remove ads
            </p>
            <button
              onClick={onUpgrade}
              className="w-full py-2 bg-accent text-accent-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Go Pro — $2.99
            </button>
          </div>
        )}
      </div>
    </div>
  );
}