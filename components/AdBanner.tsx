"use client";

interface AdBannerProps {
  onUpgrade?: () => void;
}

export function AdBanner({ onUpgrade }: AdBannerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-3 z-40">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        {/* Ad placeholder - in production this would be Google AdMob or similar */}
        <div className="flex-1 bg-track rounded-lg px-3 py-2 text-center">
          <span className="text-xs text-text-secondary">📺 Advertisement</span>
        </div>
        
        {/* Upgrade prompt */}
        <button
          onClick={onUpgrade}
          className="shrink-0 bg-accent text-accent-foreground px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-opacity flex items-center gap-2"
        >
          <span>⭐</span>
          <span>Go Pro</span>
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
        📺 Ad-supported free tier
      </span>
      <button
        onClick={onUpgrade}
        className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
      >
        <span>⭐</span>
        <span>Remove ads — $2.99</span>
      </button>
    </div>
  );
}
