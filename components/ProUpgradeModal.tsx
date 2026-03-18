"use client";

import { useState } from "react";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (email?: string) => void;
}

const PRO_PRICE = "$2.99";
const PRO_FEATURES = [
  "Remove all advertisements",
  "Unlimited custom questions",
  "Exclusive Pro-only question categories",
  "Priority support",
  "Early access to new features",
];

export function ProUpgradeModal({ isOpen, onClose, onUpgrade }: ProUpgradeModalProps) {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    // In production, this would redirect to Stripe Checkout or similar
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    onUpgrade(email || undefined);
    setIsProcessing(false);
    onClose();
  };

  const handleStripeCheckout = async () => {
    // In production: redirect to Stripe Checkout
    // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    // await stripe.redirectToCheckout({ sessionId: ... });
    
    // For now, simulate the flow
    alert("In production, this would redirect to Stripe Checkout.\n\nPrice: $2.99 one-time purchase.\n\nThe purchase would be processed via Stripe and verified on the backend.");
    
    // Complete the mock purchase
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onUpgrade();
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-accent to-accent/80 px-6 py-8 text-center">
          <div className="inline-block bg-accent-foreground/20 px-3 py-1 rounded-full text-xs font-medium text-accent-foreground mb-3">
            ONE-TIME PURCHASE
          </div>
          <h2 className="text-2xl font-bold text-white">Go Pro</h2>
          <p className="text-accent-foreground/80 text-sm mt-1">
            Remove ads, unlock premium features
          </p>
        </div>

        {/* Price */}
        <div className="text-center -mt-4">
          <div className="inline-block bg-surface border-2 border-accent rounded-2xl px-8 py-4 shadow-lg">
            <span className="text-4xl font-bold text-text-primary">{PRO_PRICE}</span>
            <span className="text-text-secondary text-sm ml-1">one-time</span>
          </div>
        </div>

        {/* Features */}
        <div className="px-6 py-4">
          <ul className="space-y-3">
            {PRO_FEATURES.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-text-primary">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Email input (optional, for receipt) */}
        <div className="px-6 pb-4">
          <label className="block text-xs text-text-secondary mb-1">
            Email for receipt (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2 bg-track rounded-lg border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col gap-3">
          <button
            onClick={handleStripeCheckout}
            disabled={isProcessing}
            className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Pay {PRO_PRICE}
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Maybe later
          </button>
        </div>

        {/* Footer */}
        <div className="bg-track/50 px-6 py-3 text-center">
          <p className="text-xs text-text-secondary">
            Secure payment via Stripe • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

// Simple inline upgrade button for headers/toolbars
export function ProButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
      Pro
    </button>
  );
}