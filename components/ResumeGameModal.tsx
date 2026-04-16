"use client";

import { GameSession } from "@/types";

interface ResumeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: GameSession[];
  activeGameId: string | null;
  onResumeGame: (gameId: string) => void;
  onDeleteGame: (gameId: string) => void;
}

export function ResumeGameModal({
  isOpen,
  onClose,
  games,
  activeGameId,
  onResumeGame,
  onDeleteGame,
}: ResumeGameModalProps) {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getModeEmoji = (mode: string) => {
    switch (mode) {
      case 'partner': return '💕';
      case 'friend': return '👯';
      default: return '🎮';
    }
  };

  const activeGame = games.find(g => g.id === activeGameId);

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-surface/95 backdrop-blur-md rounded-2xl border border-border/50 w-full max-w-md shadow-2xl shadow-black/30 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">📋 Saved Sessions</h2>
            <p className="text-sm text-text-secondary mt-1">
              {games.length} {games.length === 1 ? 'session' : 'sessions'} saved
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-track transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {games.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-text-secondary">No saved sessions yet</p>
              <p className="text-sm text-text-secondary mt-1">
                Start a game to create your first session
              </p>
            </div>
          ) : (
            games.map((game) => {
              const isActive = game.id === activeGameId;
              const progress = game.answeredIds.length;
              const totalQuestions = (game.shuffledQuestionIds?.length || 0) || progress + 10;
              const progressPercent = totalQuestions > 0 
                ? Math.round((progress / totalQuestions) * 100) 
                : 0;

              return (
                <div
                  key={game.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-accent/10 border-accent/30'
                      : 'bg-track/50 border-border hover:bg-track'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getModeEmoji(game.relationshipMode)}</span>
                        <span className="font-medium text-text-primary">
                          {game.playerNames.length === 1 
                            ? `${game.playerNames[0]} (Solo)`
                            : game.playerNames.slice(0, 2).join(' & ')}
                          {game.playerNames.length > 2 && ` +${game.playerNames.length - 2}`}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        {formatDate(game.createdAt)}
                      </p>
                    </div>
                    {isActive && (
                      <span className="text-xs font-medium text-accent px-2 py-1 bg-accent/10 rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                      <span>{progress} answered</span>
                      <span>{progressPercent}% complete</span>
                    </div>
                    <div className="h-1.5 bg-track rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${isActive ? 'bg-accent' : 'bg-text-secondary/50'}`}
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <button
                        onClick={() => onResumeGame(game.id)}
                        className="flex-1 py-2 px-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>▶️</span>
                        <span>Resume</span>
                      </button>
                    )}
                    {isActive && (
                      <button
                        disabled
                        className="flex-1 py-2 px-3 bg-track text-text-secondary text-sm font-medium rounded-lg cursor-default flex items-center justify-center gap-2"
                      >
                        <span>▶️</span>
                        <span>Currently Playing</span>
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteGame(game.id)}
                      className="py-2 px-3 bg-rose-500/10 text-rose-500 text-sm font-medium rounded-lg hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2"
                      title="Delete session"
                      aria-label="Delete session"
                    >
                      <span>🗑️</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
            <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-track text-text-primary rounded-lg font-medium hover:bg-border transition-colors"
          >
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
}
