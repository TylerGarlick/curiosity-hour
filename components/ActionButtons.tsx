"use client";

interface ActionButtonsProps {
  onMarkAnswered: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

export function ActionButtons({
  onMarkAnswered,
  onSkip,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onMarkAnswered}
        disabled={disabled}
        className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all active:scale-95 ${
          disabled
            ? "bg-track text-text-secondary opacity-50 cursor-not-allowed"
            : "bg-accent text-white hover:bg-accent-hover cursor-pointer"
        }`}
      >
        ✓ Done
      </button>
      <button
        onClick={onSkip}
        disabled={disabled}
        className={`flex-1 py-4 px-6 rounded-xl font-medium border-2 border-border transition-all active:scale-95 ${
          disabled
            ? "bg-transparent text-text-secondary opacity-50 cursor-not-allowed"
            : "bg-transparent border-border text-text-primary hover:bg-track cursor-pointer"
        }`}
      >
        Skip →
      </button>
    </div>
  );
}
