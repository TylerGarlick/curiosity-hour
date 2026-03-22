// TTS Service for Car Mode
// Uses expo-speech for text-to-speech functionality

import * as Speech from 'expo-speech';

export interface TTSOptions {
  rate?: number;      // 0.75 | 1 | 1.25 - from settings
  language?: string;  // default 'en-US'
}

let isSpeaking = false;

export const speak = async (text: string, options: TTSOptions = {}): Promise<void> => {
  const { rate = 1, language = 'en-US' } = options;
  
  // Stop any ongoing speech first
  if (isSpeaking) {
    await stop();
  }
  
  return new Promise((resolve, reject) => {
    isSpeaking = true;
    
    Speech.speak(text, {
      rate,
      language,
      onDone: () => {
        isSpeaking = false;
        resolve();
      },
      onError: (error) => {
        isSpeaking = false;
        reject(error);
      },
      onStopped: () => {
        isSpeaking = false;
      },
    });
  });
};

export const stop = (): Promise<void> => {
  isSpeaking = false;
  return Speech.stop();
};

export const isTTSSpeaking = (): boolean => {
  return isSpeaking;
};

// Get available voices (for future enhancement)
export const getVoices = async (): Promise<Speech.Voice[]> => {
  return Speech.getAvailableVoicesAsync();
};
