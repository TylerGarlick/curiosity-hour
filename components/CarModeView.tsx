"use client";

import { Question } from "@/types";
import { useTTS } from "@/hooks/useTTS";
import { useEffect, useState } from "react";

interface CarModeViewProps {
  question: Question | null;
  onNext: () => void;
  onPrevious: () => void;
  onStop: () => void;
  disabled?: boolean;
  autoTts?: boolean;
}

type CarModeTheme = "midnight" | "sunset" | "ocean" | "forest";

const THEME_BACKGROUNDS: Record<CarModeTheme, string> = {
  midnight: "bg-gradient-to-b from-black via-zinc-950 to-black",
  sunset: "bg-gradient-to-b from-orange-950 via-red-950 to-purple-950",
  ocean: "bg-gradient-to-b from-slate-950 via-blue-950 to-cyan-950",
  forest: "bg-gradient-to-b from-green-950 via-emerald-950 to-teal-950",
};

const THEME_ACCENTS: Record<CarModeTheme, string> = {
  midnight: "white",
  sunset: "orange-300",
  ocean: "cyan-300",
  forest: "emerald-300",
};

export function CarModeView({
  question,
  onNext,
  onPrevious,
  onStop,
  disabled = false,
  autoTts = false,
}: CarModeViewProps) {
  const [theme, setTheme] = useState<CarModeTheme>("midnight");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [buttonPulse, setButtonPulse] = useState<string | null>(null);
  
  const { isSpeaking, speak, cancel, autoSpeak } = useTTS({
    autoTts,
    autoAdvanceDelayMs: 0, // No auto-advance in car mode
  });

  // Cycle through themes on triple-tap to header
  const handleThemeCycle = () => {
    const themes: CarModeTheme[] = ["midnight", "sunset", "ocean", "forest"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Auto-speak when question changes
  useEffect(() => {
    if (question?.text && autoTts) {
      autoSpeak(question.text);
    }
    // Cancel speech when question changes or component unmounts
    return () => {
      cancel();
    };
  }, [question?.text, autoTts, autoSpeak, cancel]);

  // Handle repeat speech
  const handleRepeat = () => {
    if (question?.text) {
      cancel(); // Cancel any ongoing speech first
      speak(question.text);
    }
  };

  // Visual feedback handler for buttons
  const handleButtonPress = (buttonId: string) => {
    setButtonPulse(buttonId);
    setTimeout(() => setButtonPulse(null), 300);
  };

  const accentColor = THEME_ACCENTS[theme];
  const backgroundGradient = THEME_BACKGROUNDS[theme];

  return (
    <div className={`min-h-screen ${backgroundGradient} text-white flex flex-col p-4 sm:p-6 overflow-hidden`}>
      {/* Animated background particles effect */}
      <div className="fixed inset-0 opacity-20 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {/* Header with enhanced animation */}
      <header 
        className="flex items-center justify-between mb-8 animate-slideDown"
        style={{ animationDelay: "0ms" }}
      >
        <button
          onClick={handleThemeCycle}
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 active:scale-95 touch-manipulation"
          title="Triple-tap to change theme"
          aria-label="Curiosity Hour - Tap to change theme"
        >
          <div className="relative">
            <div className={`w-3 h-3 rounded-full bg-${accentColor} animate-ping absolute`} />
            <div className={`w-3 h-3 rounded-full bg-${accentColor} relative`} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg group-hover:scale-105 transition-transform">
            Curiosity Hour
          </h1>
        </button>
        <button
          onClick={() => handleButtonPress("exit")}
          className={`bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-8 py-5 rounded-3xl font-bold text-xl transition-all duration-300 active:scale-90 touch-manipulation shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 active:shadow-red-600/80 ${
            buttonPulse === "exit" ? "scale-95 brightness-125" : ""
          }`}
          aria-label="Exit Car Mode"
        >
          ✕ Exit
        </button>
      </header>

      {/* Question Card - Enhanced with smooth entrance and glow effect */}
      <div 
        className="flex-1 flex items-center justify-center mb-8 animate-scaleIn"
        style={{ animationDelay: "150ms" }}
      >
        <div 
          className={`w-full max-w-3xl bg-zinc-900/90 backdrop-blur-md border-2 border-${accentColor}/50 rounded-[2.5rem] p-10 sm:p-14 text-center shadow-2xl shadow-${accentColor}/20 transition-all duration-500 ${
            isTransitioning ? "scale-95 opacity-80" : "scale-100 opacity-100"
          }`}
        >
          {question ? (
            <>
              <div className={`inline-block mb-4 px-4 py-2 rounded-full bg-${accentColor}/20 border border-${accentColor}/30`}>
                <span className={`text-${accentColor} text-sm font-semibold tracking-wide uppercase`}>Question</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-2xl animate-fadeIn">
                {question.text}
              </h2>
              {isSpeaking && (
                <div className="mt-6 flex items-center justify-center gap-2 text-white/80">
                  <div className="flex gap-1">
                    <span className="w-2 h-8 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-8 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-8 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-lg font-medium">Speaking...</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-3xl sm:text-4xl text-zinc-400">
              🎉 No more questions available!
            </p>
          )}
        </div>
      </div>

      {/* Giant Action Buttons - Enhanced for drivers with ripple effect */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 animate-slideUp"
        style={{ animationDelay: "300ms" }}
      >
        <button
          onClick={() => {
            handleButtonPress("previous");
            onPrevious();
          }}
          disabled={disabled}
          className={`relative overflow-hidden py-12 px-8 rounded-[2rem] font-bold text-4xl transition-all duration-300 active:scale-85 touch-manipulation ${
            disabled
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
              : `bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-2xl shadow-blue-600/50 active:shadow-blue-600/80 hover:shadow-blue-600/70 ${
                  buttonPulse === "previous" ? "scale-90 brightness-125" : ""
                }`
          }`}
          aria-label="Previous Question"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-5xl">⏮</span>
            <span>Previous</span>
          </span>
          {buttonPulse === "previous" && (
            <span className="absolute inset-0 bg-white/30 rounded-[2rem] animate-ping" />
          )}
        </button>

        <button
          onClick={() => {
            handleButtonPress("next");
            setIsTransitioning(true);
            setTimeout(() => {
              onNext();
              setIsTransitioning(false);
            }, 150);
          }}
          disabled={disabled || !question}
          className={`relative overflow-hidden py-12 px-8 rounded-[2rem] font-bold text-4xl transition-all duration-300 active:scale-85 touch-manipulation ${
            disabled || !question
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
              : `bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-2xl shadow-green-600/50 active:shadow-green-600/80 hover:shadow-green-600/70 ${
                  buttonPulse === "next" ? "scale-90 brightness-125" : ""
                }`
          }`}
          aria-label="Next Question"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-5xl">✓</span>
            <span>Next</span>
          </span>
          {buttonPulse === "next" && (
            <span className="absolute inset-0 bg-white/30 rounded-[2rem] animate-ping" />
          )}
        </button>

        <button
          onClick={() => {
            handleButtonPress("repeat");
            handleRepeat();
          }}
          disabled={!question}
          className={`relative overflow-hidden py-12 px-8 rounded-[2rem] font-bold text-4xl transition-all duration-300 active:scale-85 touch-manipulation ${
            !question
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
              : isSpeaking
                ? `bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-2xl shadow-purple-600/50 active:shadow-purple-600/80 hover:shadow-purple-600/70 ${
                    buttonPulse === "repeat" ? "scale-90 brightness-125" : ""
                  }`
                : `bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 text-white shadow-2xl shadow-zinc-700/50 active:shadow-zinc-700/80 hover:shadow-zinc-700/70 ${
                    buttonPulse === "repeat" ? "scale-90 brightness-125" : ""
                  }`
          }`}
          aria-label="Repeat Question"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-5xl">{isSpeaking ? "🔊" : "🔁"}</span>
            <span>{isSpeaking ? "Speaking..." : "Repeat"}</span>
          </span>
          {buttonPulse === "repeat" && (
            <span className="absolute inset-0 bg-white/30 rounded-[2rem] animate-ping" />
          )}
        </button>
      </div>

      {/* Stop button - Enhanced with danger styling */}
      <div 
        className="grid grid-cols-1 gap-4 sm:gap-6 mt-6 animate-slideUp"
        style={{ animationDelay: "450ms" }}
      >
        <button
          onClick={() => {
            handleButtonPress("stop");
            onStop();
          }}
          className={`relative overflow-hidden py-12 px-8 rounded-[2rem] font-bold text-4xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-all duration-300 active:scale-85 touch-manipulation shadow-2xl shadow-red-600/50 active:shadow-red-600/80 hover:shadow-red-600/70 ${
            buttonPulse === "stop" ? "scale-90 brightness-125" : ""
          }`}
          aria-label="Stop Car Mode"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-5xl">⏹</span>
            <span>Stop Car Mode</span>
          </span>
          {buttonPulse === "stop" && (
            <span className="absolute inset-0 bg-white/30 rounded-[2rem] animate-ping" />
          )}
        </button>
      </div>

      {/* Safety reminder with theme accent */}
      <p className="text-center text-white/50 text-base mt-8 mb-4 animate-fadeIn" style={{ animationDelay: "600ms" }}>
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${accentColor}/10 border border-${accentColor}/20`}>
          <span>⚠️</span>
          <span className="font-medium">Use responsibly while driving</span>
        </span>
      </p>
      
      {/* Theme indicator */}
      <p className="text-center text-white/30 text-xs">
        Triple-tap header to change theme · {theme.charAt(0).toUpperCase() + theme.slice(1)}
      </p>
    </div>
  );
}
