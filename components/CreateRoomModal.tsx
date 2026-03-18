"use client";

import { useState } from "react";
import { createRoom, Room } from "@/lib/graphql/client";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: (code: string, playerId: string, room: Room) => void;
  onSwitchToJoin: () => void;
  isPro?: boolean;
  onUpgrade?: () => void;
}

export function CreateRoomModal({ isOpen, onClose, onRoomCreated, onSwitchToJoin, isPro, onUpgrade }: CreateRoomModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Use a placeholder question for now - could be enhanced to pick a question first
      const result = await createRoom(playerName.trim(), "shared_1", "Shared question");
      onRoomCreated(result.createRoom.code, result.createRoom.playerId, result.createRoom.room);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Create Room</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-track border border-border text-text-primary rounded-lg font-medium hover:bg-border/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !playerName.trim()}
              className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Room"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-text-secondary mt-4">
          Already have a room?{" "}
          <button onClick={onSwitchToJoin} className="text-primary hover:underline">
            Join Room
          </button>
        </p>
      </div>
    </div>
  );
}