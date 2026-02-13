"use client";

import { GameSession } from "@/types";
import { useState, useRef, useEffect } from "react";

interface GameSwitcherProps {
  games: GameSession[];
  activeGameId: string | null;
  onSelectGame: (gameId: string) => void;
  onNewGame: () => void;
}

export function GameSwitcher({
  games,
  activeGameId,
  onSelectGame,
  onNewGame,
}: GameSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeGame = games.find((g) => g.id === activeGameId);
  const gameLabel = activeGame
    ? activeGame.playerNames.join(" & ")
    : "Select a game";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-surface border border-border rounded-lg text-text-primary hover:bg-track transition-colors font-sans flex items-center gap-2"
      >
        {gameLabel}
        <span className="text-sm">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-48 bg-surface border border-border rounded-lg shadow-lg z-50">
          <div className="p-2">
            {games.length === 0 ? (
              <p className="text-text-secondary text-sm px-3 py-2">No games yet</p>
            ) : (
              games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    onSelectGame(game.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    game.id === activeGameId
                      ? "bg-accent text-white"
                      : "text-text-primary hover:bg-track"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {game.id === activeGameId && <span>✓</span>}
                    {game.playerNames.join(" & ")}
                  </div>
                </button>
              ))
            )}
            <button
              onClick={() => {
                onNewGame();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded text-sm text-text-primary hover:bg-track transition-colors border-t border-border mt-2 pt-2"
            >
              + New Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
