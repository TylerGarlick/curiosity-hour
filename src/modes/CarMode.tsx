'use strict';

import React, { useState, useEffect } from 'react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useStore } from '../store/useStore';
import './car-mode.css';

interface CarModeProps {
  question: string;
  category: string;
  onDone: () => void;
  onSkip: () => void;
  onReplay: () => void;
}

export function CarMode({ question, category, onDone, onSkip, onReplay }: CarModeProps) {
  const [hasPlayed, setHasPlayed] = useState(false);

  const {
    isSpeaking,
    hasFinished,
    speak,
    cancel,
  } = useSpeechSynthesis({
    text: question,
    autoPlay: true,
    onEnd: () => {
      setHasPlayed(true);
    },
  });

  // Auto-replay handler
  const handleReplay = () => {
    setHasPlayed(false);
    speak();
    if (onReplay) onReplay();
  };

  // Done handler - saves empty response
  const handleDone = () => {
    cancel();
    onDone();
  };

  // Skip handler - no save
  const handleSkip = () => {
    cancel();
    onSkip();
  };

  return (
    <div className="car-mode-container">
      <div className="car-mode-header">
        <span className="car-mode-category">{category}</span>
        <span className="car-mode-badge">Car Mode</span>
      </div>

      <div className="car-mode-question">
        {question}
      </div>

      {/* Replay button - always visible, pulses when audio ends */}
      <button
        className={`replay-button ${hasFinished ? 'pulse-active' : ''}`}
        onClick={handleReplay}
        aria-label="Replay question"
        disabled={isSpeaking}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 4v6h6" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        <span className="replay-label">Replay</span>
      </button>

      {/* Big action buttons */}
      <div className="car-mode-actions">
        <button
          className="action-button done-button"
          onClick={handleDone}
          aria-label="Mark as done"
        >
          <span className="button-icon">✓</span>
          <span className="button-text">Done</span>
        </button>

        <button
          className="action-button skip-button"
          onClick={handleSkip}
          aria-label="Skip question"
        >
          <span className="button-icon">✕</span>
          <span className="button-text">Skip</span>
        </button>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="speaking-indicator">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
        </div>
      )}
    </div>
  );
}
