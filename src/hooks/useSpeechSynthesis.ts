import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisProps {
  text: string;
  autoPlay?: boolean;
  onEnd?: () => void;
}

export function useSpeechSynthesis({ text, autoPlay = false, onEnd }: UseSpeechSynthesisProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const speak = useCallback(() => {
    if (!text || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for car mode
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setHasFinished(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setHasFinished(true);
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [text, onEnd]);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  useEffect(() => {
    if (autoPlay && text) {
      speak();
    }
  }, [autoPlay, text, speak]);

  // Load voices on mount (Chrome needs this)
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return {
    isSpeaking,
    isPaused,
    hasFinished,
    speak,
    cancel,
    pause,
    resume,
  };
}
