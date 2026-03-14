"use client";

interface ProgressBarProps {
  answered: number;
  total: number;
}

export function ProgressBar({ answered, total }: ProgressBarProps) {
  const percentage = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-text-secondary">Progress</span>
        <span className="text-text-primary font-medium">{answered} / {total}</span>
      </div>
      <div className="w-full bg-track rounded-full h-2">
        <div
          className="bg-accent h-full rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
