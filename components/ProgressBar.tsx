"use client";

interface ProgressBarProps {
  answered: number;
  total: number;
}

export function ProgressBar({ answered, total }: ProgressBarProps) {
  const percentage = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          Questions Explored
        </span>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          <span className="text-lg font-bold text-amber-500">{answered}</span> / {total}
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden shadow-sm">
        <div
          className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-500 rounded-full shadow-lg"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
