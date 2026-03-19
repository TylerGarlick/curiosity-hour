"use client";

import { useState, useEffect, useCallback } from "react";
import { Room, getRoom, submitResponse } from "@/lib/graphql/client";

interface SharedRoomScreenProps {
  code: string;
  playerId: string;
  onBack: () => void;
}

export function SharedRoomScreen({ code, playerId, onBack }: SharedRoomScreenProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchRoom = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRoom(code);
      if (!result.room) {
        setError("Room not found");
        return;
      }
      setRoom(result.room);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch room");
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  // Poll for updates every 2 seconds
  useEffect(() => {
    if (!room?.revealed) {
      const interval = setInterval(fetchRoom, 2000);
      return () => clearInterval(interval);
    }
  }, [room?.revealed, fetchRoom]);

  const handleSubmitResponse = async () => {
    if (!response.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await submitResponse(code, playerId, response.trim());
      setRoom(result.submitResponse.room);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && !room) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-secondary">Loading room...</p>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={onBack} className="text-primary hover:underline">
          Back to Home
        </button>
      </div>
    );
  }

  if (!room) return null;

  const myPlayer = room.players.find(p => p.id === playerId);
  const otherPlayer = room.players.find(p => p.id !== playerId);
  const hasAnswered = myPlayer?.response !== null;
  const bothAnswered = room.revealed;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="text-text-secondary hover:text-text-primary">
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Room:</span>
          <button
            onClick={copyCode}
            className="font-mono text-lg font-bold text-primary hover:underline"
          >
            {copied ? "Copied!" : code}
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full p-4 space-y-6">
        {/* Players Status */}
        <div className="bg-surface rounded-xl p-4 border border-border">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Players</h3>
          <div className="space-y-2">
            {room.players.map((player) => (
              <div key={player.id} className="flex items-center justify-between">
                <span className="text-text-primary">
                  {player.name} {player.id === playerId ? "(You)" : ""}
                </span>
                <span className={`text-sm ${player.response !== null ? "text-green-500" : "text-text-secondary"}`}>
                  {player.response !== null ? "✓ Answered" : "⏳ Waiting..."}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 border border-border/50">
          <p className="text-sm text-text-secondary mb-2">Question</p>
          <h2 className="text-2xl font-semibold text-text-primary">{room.questionText}</h2>
        </div>

        {/* Response Area */}
        {bothAnswered ? (
          /* Revealed Responses */
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary text-center">Both Answers</h3>
            <div className="space-y-3">
              {room.players.map((player) => (
                <div key={player.id} className="bg-surface rounded-xl p-4 border border-border">
                  <p className="text-sm text-text-secondary mb-1">{player.name}</p>
                  <p className="text-lg text-text-primary">{player.response}</p>
                </div>
              ))}
            </div>
            <button
              onClick={onBack}
              className="w-full py-3.5 min-h-11 bg-primary text-white rounded-lg font-medium hover:opacity-90"
            >
              Back to Solo Play
            </button>
          </div>
        ) : hasAnswered ? (
          /* Waiting for other player */
          <div className="text-center space-y-4">
            <p className="text-text-primary">Your answer has been submitted!</p>
            <p className="text-text-secondary">
              Waiting for {otherPlayer?.name || "the other player"} to answer...
            </p>
            <div className="animate-pulse text-4xl">⏳</div>
          </div>
        ) : (
          /* Submit response form */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Your Answer
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleSubmitResponse}
              disabled={submitting || !response.trim()}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Answer"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}