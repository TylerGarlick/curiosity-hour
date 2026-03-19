"use client";

import { useState } from "react";
import { joinRoom, Room } from "@/lib/graphql/client";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomJoined: (code: string, playerId: string, room: Room) => void;
  onSwitchToCreate: () => void;
}

export function JoinRoomModal({ isOpen, onClose, onRoomJoined, onSwitchToCreate }: JoinRoomModalProps) {
  const [code, setCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !playerName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await joinRoom(code.trim().toUpperCase(), playerName.trim());
      onRoomJoined(result.joinRoom.code, result.joinRoom.playerId, result.joinRoom.room);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Join Room</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Room Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="Enter 6-character code"
              className="w-full px-4 py-3.5 min-h-11 bg-bg border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary uppercase tracking-widest text-center text-lg"
              maxLength={6}
              required
            />
          </div>

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
              disabled={loading || !code.trim() || !playerName.trim()}
              className="flex-1 py-3.5 min-h-11 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Room"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-text-secondary mt-4">
          Don't have a room?{" "}
          <button onClick={onSwitchToCreate} className="text-primary hover:underline">
            Create Room
          </button>
        </p>
      </div>
    </div>
  );
}