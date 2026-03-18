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
        className={`flex-1 py-5 px-6 rounded-2xl font-semibold text-lg transition-all active:scale-95 touch-manipulation ${
          disabled
            ? "bg-track text-text-secondary opacity-50 cursor-not-allowed"
            : "bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/25 cursor-pointer"
        }`}
      >
        ✓ Done
      </button>
      <button
        onClick={onSkip}
        disabled={disabled}
        className={`flex-1 py-5 px-6 rounded-2xl font-semibold text-lg border-2 transition-all active:scale-95 touch-manipulation ${
          disabled
            ? "bg-transparent text-text-secondary opacity-50 cursor-not-allowed"
            : "bg-surface border-border text-text-primary hover:bg-track cursor-pointer"
        }`}
      >
        Skip
      </button>
    </div>
  );
}
