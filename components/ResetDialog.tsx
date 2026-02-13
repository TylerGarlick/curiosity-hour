"use client";

import { useState } from "react";

interface ResetDialogProps {
  onResetProgress: () => void;
  onNewGame: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ResetDialog({
  onResetProgress,
  onNewGame,
  isOpen,
  onClose,
}: ResetDialogProps) {
  const [action, setAction] = useState<"none" | "reset" | "new">("none");
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (action === "reset") {
      onResetProgress();
      onClose();
    } else if (action === "new") {
      onNewGame();
      onClose();
    }
    setAction("none");
    setConfirmed(false);
  };

  if (action === "none") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-surface rounded-3xl border border-border max-w-sm w-full">
          <div className="p-6">
            <h2 className="text-xl font-serif font-bold text-text-primary mb-4">
              What would you like to do?
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setAction("reset")}
                className="w-full px-4 py-3 bg-track hover:bg-border text-text-primary rounded-lg font-sans font-medium transition-colors text-left"
              >
                Reset Progress
              </button>
              <button
                onClick={() => setAction("new")}
                className="w-full px-4 py-3 bg-track hover:bg-border text-text-primary rounded-lg font-sans font-medium transition-colors text-left"
              >
                Start New Game
              </button>
            </div>
          </div>
          <div className="border-t border-border p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg font-sans font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const title =
    action === "reset"
      ? "Reset progress for this game?"
      : "Start a new game with different people?";
  const message =
    action === "reset"
      ? "All answered questions for this game will be cleared. This cannot be undone."
      : "You will start a new game from the welcome screen.";
  const confirmText = action === "reset" ? "Reset" : "Start New Game";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-3xl border border-border max-w-sm w-full">
        <div className="p-6">
          <h2 className="text-xl font-serif font-bold text-text-primary mb-2">
            {title}
          </h2>
          <p className="text-text-secondary text-sm mb-6">{message}</p>

          <label className="flex items-center gap-2 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm text-text-primary">
              I understand this action.
            </span>
          </label>
        </div>

        <div className="border-t border-border p-4 flex gap-3 justify-end">
          <button
            onClick={() => {
              setAction("none");
              setConfirmed(false);
            }}
            className="px-4 py-2 bg-track text-text-primary rounded-lg font-sans font-medium hover:bg-border transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmed}
            className={`px-4 py-2 rounded-lg font-sans font-medium transition-colors ${
              confirmed
                ? "bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
                : "bg-track text-text-secondary cursor-not-allowed"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
