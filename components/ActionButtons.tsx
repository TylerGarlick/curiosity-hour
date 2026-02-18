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
            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
            : "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <span>✓</span>
          <span>Answered</span>
        </span>
      </button>
      <button
        onClick={onSkip}
        disabled={disabled}
        className={`flex-1 py-3 px-4 rounded-lg font-sans font-semibold border transition-colors text-base active:scale-95 ${
          disabled
            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
            : "bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95"
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <span>→</span>
          <span>Skip</span>
        </span>
      </button>
    </div>
  );
}
