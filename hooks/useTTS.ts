"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseTTSOptions {
  autoTts?: boolean;
  autoAdvanceDelayMs?: number;
  onSpeechEnd?: () => void;
  rate?: number;
  pitch?: number;
}

export function useTTS({
  autoTts = false,
  autoAdvanceDelayMs = 1500,
  onSpeechEnd,
  rate = 0.9,
  pitch = 1,
}: UseTTSOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cancel any ongoing speech and clear timers
  const cancel = useCallback(() => {
    if (currentUtteranceRef.current) {
      window.speechSynthesis.cancel();
      currentUtteranceRef.current = null;
    }
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setIsSpeaking(false);
    setAutoAdvanceEnabled(false);
  }, []);

  // Speak text with optional auto-advance
  const speak = useCallback(
    (text: string, enableAutoAdvance = false) => {
      if (!text || typeof window === "undefined") return;

      // Cancel any ongoing speech first
      cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;

        if (enableAutoAdvance && onSpeechEnd) {
          setAutoAdvanceEnabled(true);
          autoAdvanceTimerRef.current = setTimeout(() => {
            setAutoAdvanceEnabled(false);
            onSpeechEnd();
          }, autoAdvanceDelayMs);
        }
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
        setAutoAdvanceEnabled(false);
        currentUtteranceRef.current = null;
        if (autoAdvanceTimerRef.current) {
          clearTimeout(autoAdvanceTimerRef.current);
          autoAdvanceTimerRef.current = null;
        }
      };

      currentUtteranceRef.current = utterance;
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [cancel, rate, pitch, autoAdvanceDelayMs, onSpeechEnd]
  );

  // Auto-speak when text changes and autoTts is enabled
  const autoSpeak = useCallback(
    (text: string) => {
      if (autoTts && text) {
        speak(text, true);
      }
    },
    [autoTts, speak]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    isSpeaking,
    autoAdvanceEnabled,
    speak,
    autoSpeak,
    cancel,
  };
}
