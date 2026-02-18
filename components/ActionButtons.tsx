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
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <button
        onClick={onMarkAnswered}
        disabled={disabled}
        className={`flex-1 py-3 px-4 rounded-lg font-sans font-semibold transition-colors text-base active:scale-95 ${
          disabled
            ? "bg-track text-text-secondary cursor-not-allowed"
            : "bg-accent hover:bg-accent-hover text-white cursor-pointer"
        }`}
      >
        Mark as Answered
      </button>
      <button
        onClick={onSkip}
        disabled={disabled}
        className={`flex-1 py-3 px-4 rounded-lg font-sans font-semibold border transition-colors text-base active:scale-95 ${
          disabled
            ? "border-track text-text-secondary cursor-not-allowed"
            : "border-accent text-accent hover:bg-track cursor-pointer"
        }`}
      >
        Skip
      </button>
    </div>
  );
}
