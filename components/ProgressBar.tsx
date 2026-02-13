"use client";

interface ProgressBarProps {
  answered: number;
  total: number;
}

export function ProgressBar({ answered, total }: ProgressBarProps) {
  const percentage = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-sans font-medium text-text-primary">
          Progress
        </span>
        <span className="text-sm font-sans text-text-secondary">
          {answered} of {total}
        </span>
      </div>
      <div className="w-full bg-track rounded-full h-3 overflow-hidden">
        <div
          className="bg-accent h-full transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
