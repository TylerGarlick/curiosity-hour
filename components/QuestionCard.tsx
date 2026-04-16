"use client";

import { useState, useCallback, useEffect } from "react";
import { Question } from "@/types";
import { useTTS } from "@/hooks/useTTS";

interface QuestionCardProps {
  question: Question | null;
  autoTts?: boolean;
  autoAdvanceDelayMs?: number;
  onAutoAdvance?: () => void;
}

export function QuestionCard({ 
  question, 
  autoTts = false,
  autoAdvanceDelayMs = 1500,
  onAutoAdvance,
}: QuestionCardProps) {
  const [manualSpeak, setManualSpeak] = useState(false);
  
  const { isSpeaking, speak, cancel, autoSpeak } = useTTS({
    autoTts,
    autoAdvanceDelayMs,
    onSpeechEnd: onAutoAdvance,
  });

  // Auto-speak when question changes and autoTts is enabled
  useEffect(() => {
    if (question && autoTts && !manualSpeak) {
      autoSpeak(question.text);
    }
  }, [question?.id, autoTts, manualSpeak, autoSpeak]);

  const handleSpeak = useCallback(() => {
    if (!question) return;
    
    if (isSpeaking) {
      cancel();
      setManualSpeak(false);
    } else {
      setManualSpeak(true);
      speak(question.text, false); // Don't auto-advance on manual speak
    }
  }, [question, isSpeaking, cancel, speak]);

  // Stop speaking when question changes (prevent overlap)
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [question?.id, cancel]);

  if (!question) {
    return (
      <div className="card-style card-texture p-8 text-center w-full max-w-md mx-auto">
        <p className="text-lg text-text-primary font-medium">
          No more questions available!
        </p>
        <p className="text-sm text-text-secondary mt-2 opacity-70">
          Try adjusting your filters or reset progress
        </p>
      </div>
    );
  }

  return (
    <div className="card-style card-texture p-6 sm:p-8 w-full max-w-md mx-auto min-h-48 flex flex-col items-center justify-center relative">
      <button
        onClick={handleSpeak}
        className="absolute top-4 right-4 p-3 rounded-full bg-track/80 hover:bg-border transition-all touch-manipulation shadow-md hover:shadow-lg active:scale-95"
        aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
      >
        {isSpeaking ? (
          <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text-primary text-center leading-relaxed">
        {question.text}
      </h2>
    </div>
  );
}
