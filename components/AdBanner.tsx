"use client";

interface AdBannerProps {
  onUpgrade?: () => void;
}

export function AdBanner({ onUpgrade }: AdBannerProps) {
  return (
    <div className="bg-surface border-t border-border px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Ad placeholder - in production this would be Google AdMob or similar */}
        <div className="flex-1 bg-track rounded-lg px-3 py-2 text-center">
          <span className="text-xs text-text-secondary">Advertisement</span>
        </div>
        
        {/* Upgrade prompt */}
        <button
          onClick={onUpgrade}
          className="shrink-0 bg-accent text-accent-foreground px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Go Pro
        </button>
      </div>
    </div>
  );
}

// Simplified banner for less intrusive ad experience
export function MiniAdBanner({ onUpgrade }: AdBannerProps) {
  return (
    <div className="bg-track/50 border-t border-border px-4 py-2 flex items-center justify-between gap-2">
      <span className="text-xs text-text-secondary">
        Ad-supported free tier
      </span>
      <button
        onClick={onUpgrade}
        className="text-xs font-medium text-accent hover:underline"
      >
        Remove ads — $2.99
      </button>
    </div>
  );
}