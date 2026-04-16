"use client";

import { useState, useEffect } from "react";
import { AppState, GameSession, Question, RelationshipMode, Category } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useProStatus } from "@/hooks/useProStatus";
import { useCarMode } from "@/hooks/useCarMode";
import { useSettings } from "@/hooks/useSettings";
import { CarModeView } from "@/components/CarModeView";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { GameSwitcher } from "@/components/GameSwitcher";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { ActionButtons } from "@/components/ActionButtons";
import { CustomQuestions } from "@/components/CustomQuestions";
import { ResetDialog } from "@/components/ResetDialog";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SettingsPanel } from "@/components/SettingsPanel";
import { MiniAdBanner } from "@/components/AdBanner";
import { ProUpgradeModal, ProButton } from "@/components/ProUpgradeModal";
import { getAllQuestions } from "@/lib/questions";
import { getAvailableQuestions, getAvailableQuestionsSorted, initializeShuffledQuestions, getNextQuestionFromShuffled, advanceQuestionIndex } from "@/lib/game";

const EMPTY_STATE: AppState = {
  activeGameId: null,
  games: [],
  globalAnsweredIds: [],
  customQuestions: [],
};

export default function Home() {
  const [appState, setAppState] = useLocalStorage<AppState>("curiosity_hour_app", EMPTY_STATE);
  const [mounted, setMounted] = useState(false);
  const [customQuestionsOpen, setCustomQuestionsOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Settings (Auto-TTS)
  const { settings: appSettings, updateSettings } = useSettings();

  // Pro/ monetization state
  const { isPro, upgradeToPro, isLoading: isProLoading } = useProStatus();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Car Mode state
  const [carMode, setCarMode] = useCarMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading until we've checked Pro status
  if (!mounted || isProLoading) return null;

  const hasGames = appState.games.length > 0;
  const activeGame = appState.games.find((g) => g.id === appState.activeGameId);
  const allQuestions = getAllQuestions(appState.customQuestions);
  const availableQuestions = activeGame
    ? getAvailableQuestions(activeGame, allQuestions)
    : [];
  const currentQuestion = allQuestions.find((q) => q.id === activeGame?.currentId);

  // Game screen handlers
  const handleMarkAnswered = () => {
    if (!currentQuestion || !activeGame) return;

    // Advance the question index
    const updatedGame = advanceQuestionIndex({
      ...activeGame,
      answeredIds: [...activeGame.answeredIds, currentQuestion.id],
    });

    // Get next question from shuffled list
    const nextQuestionId = getNextQuestionFromShuffled(updatedGame);

    const updatedGames = appState.games.map((g) =>
      g.id === activeGame.id
        ? {
            ...updatedGame,
            currentId: nextQuestionId,
          }
        : g
    );

    setAppState({
      ...appState,
      games: updatedGames,
      globalAnsweredIds: [...appState.globalAnsweredIds, currentQuestion.id],
    });
  };

  const handleSkip = () => {
    if (!currentQuestion || !activeGame) return;

    // Add current question to skipped list and advance index
    const updatedGame = advanceQuestionIndex({
      ...activeGame,
      skippedIds: [...activeGame.skippedIds, currentQuestion.id],
    });

    // Get next question from shuffled list
    const nextQuestionId = getNextQuestionFromShuffled(updatedGame);

    const updatedGames = appState.games.map((g) =>
      g.id === activeGame.id
        ? {
            ...updatedGame,
            currentId: nextQuestionId,
          }
        : g
    );

    setAppState({
      ...appState,
      games: updatedGames,
    });
  };

  const handleCategoryChange = (categories: Category[] | "all") => {
    if (!activeGame) return;

    const updatedGame = {
      ...activeGame,
      activeCategories: categories,
    };

    // Reinitialize shuffled questions when categories change
    const shuffledGame = initializeShuffledQuestions(updatedGame, allQuestions);
    const nextQuestionId = getNextQuestionFromShuffled(shuffledGame);

    const updatedGames = appState.games.map((g) =>
      g.id === activeGame.id
        ? {
            ...shuffledGame,
            currentId: nextQuestionId,
          }
        : g
    );

    setAppState({
      ...appState,
      games: updatedGames,
    });
  };

  const handleAddCustomQuestion = (text: string) => {
    const newQuestion: Question = {
      id: `custom_${Date.now()}`,
      text,
      category: "custom",
    };

    setAppState({
      ...appState,
      customQuestions: [...appState.customQuestions, newQuestion],
    });
  };

  const handleEditCustomQuestion = (id: string, text: string) => {
    setAppState({
      ...appState,
      customQuestions: appState.customQuestions.map((q) =>
        q.id === id ? { ...q, text } : q
      ),
    });
  };

  const handleDeleteCustomQuestion = (id: string) => {
    setAppState({
      ...appState,
      customQuestions: appState.customQuestions.filter((q) => q.id !== id),
    });
  };

  const handleSelectGame = (gameId: string) => {
    setAppState({
      ...appState,
      activeGameId: gameId,
    });
  };

  const handleNewGame = () => {
    setAppState({
      ...appState,
      activeGameId: null,
    });
  };

  const handleResetProgress = () => {
    if (!activeGame) return;

    const updatedGame: GameSession = {
      ...activeGame,
      answeredIds: [],
      skippedIds: [],
      currentId: null,
    };

    // Reinitialize shuffled questions on reset
    const shuffledGame = initializeShuffledQuestions(updatedGame, allQuestions);
    const firstQuestionId = getNextQuestionFromShuffled(shuffledGame);
    shuffledGame.currentId = firstQuestionId;

    const updatedGames = appState.games.map((g) =>
      g.id === activeGame.id ? shuffledGame : g
    );

    setAppState({
      ...appState,
      games: updatedGames,
    });
  };

  // Car Mode view
  if (carMode && hasGames && activeGame) {
    return (
      <CarModeView
        question={currentQuestion || null}
        onNext={handleMarkAnswered}
        onPrevious={() => {
          // Go back to previous question (simplified: just pick a new random one from answered)
          if (activeGame.answeredIds.length > 0) {
            const prevQuestionId = activeGame.answeredIds[activeGame.answeredIds.length - 1];
            const updatedGames = appState.games.map((g) =>
              g.id === activeGame.id ? { ...g, currentId: prevQuestionId } : g
            );
            setAppState({ ...appState, games: updatedGames });
          }
        }}
        onStop={() => setCarMode(false)}
        disabled={availableQuestions.length === 0}
      />
    );
  }

  // Welcome screen
  if (!hasGames || !activeGame) {
    return (
      <WelcomeScreen
        onStartGame={(names, mode) => {
          const newGame: GameSession = {
            id: `game_${Date.now()}`,
            playerNames: names,
            relationshipMode: mode,
            answeredIds: [],
            skippedIds: [],
            currentId: null,
            activeCategories: "all",
            createdAt: Date.now(),
          };

          const updatedState = {
            ...appState,
            activeGameId: newGame.id,
            games: [...appState.games, newGame],
          };

          // Initialize shuffled questions and pick first
          const allQuestionsFiltered = getAllQuestions(appState.customQuestions);
          const shuffledGame = initializeShuffledQuestions(newGame, allQuestionsFiltered);
          const firstQuestionId = getNextQuestionFromShuffled(shuffledGame);
          shuffledGame.currentId = firstQuestionId;

          // Update the game in the state
          updatedState.games = updatedState.games.map((g) =>
            g.id === newGame.id ? shuffledGame : g
          );

          setAppState(updatedState);
        }}
      />
    );
  }

  // Game screen
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Simple Header - compact for mobile */}
      <header className="bg-surface border-b border-border px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-base font-semibold text-text-primary">Curiosity Hour</h1>
        <div className="flex items-center gap-2">
          {!isPro && (
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-lg text-xs font-medium hover:bg-accent/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Pro
            </button>
          )}
          {isPro && (
            <span className="inline-flex items-center gap-1 text-accent text-xs font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Pro
            </span>
          )}
          <GameSwitcher
            games={appState.games}
            activeGameId={appState.activeGameId}
            onSelectGame={handleSelectGame}
            onNewGame={handleNewGame}
          />
        </div>
      </header>

      {/* Main Content - mobile-first layout */}
      <main className="flex-1 flex flex-col w-full">
        {/* Progress indicator - minimal on mobile */}
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
            <span>{activeGame.answeredIds.length} answered</span>
            <span>{availableQuestions.length} remaining</span>
          </div>
          <div className="h-1.5 bg-track rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ 
                width: `${availableQuestions.length + activeGame.answeredIds.length > 0 
                  ? (activeGame.answeredIds.length / (availableQuestions.length + activeGame.answeredIds.length)) * 100 
                  : 0}%` 
              }}
            />
          </div>
        </div>

        {/* Question Card - takes most of the screen on mobile */}
        <div className="flex-1 flex items-center justify-center p-4">
          <QuestionCard 
            question={currentQuestion || null} 
            autoTts={appSettings.autoTts}
            autoAdvanceDelayMs={appSettings.autoAdvanceDelayMs}
            onAutoAdvance={handleMarkAnswered}
          />
        </div>

        {/* Action Buttons - bottom anchored, thumb-friendly */}
        <div className="p-4 pb-safe bg-surface border-t border-border space-y-3">
          <ActionButtons
            onMarkAnswered={handleMarkAnswered}
            onSkip={handleSkip}
            disabled={availableQuestions.length === 0}
          />

          {/* Secondary actions - subtle on mobile */}
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setCustomQuestionsOpen(true)}
              className="text-text-secondary hover:text-text-primary py-2 px-3 -mx-3 rounded-lg transition-colors"
            >
              My Questions
            </button>
            
            {/* Car Mode toggle */}
            <button
              onClick={() => setCarMode(true)}
              className="text-text-secondary hover:text-text-primary py-2 px-3 -mx-3 rounded-lg transition-colors flex items-center gap-1"
              title="Enable Car Mode for driving"
            >
              🚗 Car Mode
            </button>
            
            {/* Settings toggle */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-text-secondary hover:text-text-primary py-2 px-3 -mx-3 rounded-lg transition-colors flex items-center gap-1"
              title="Settings"
            >
              ⚙️ Settings
            </button>
            
            {/* Category filter trigger - mobile optimized */}
            <details className="relative">
              <summary className="list-none cursor-pointer text-text-secondary hover:text-text-primary py-2 px-3 -mx-3 rounded-lg transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filter
              </summary>
              <div className="absolute bottom-full right-0 mb-2 bg-surface border border-border rounded-xl shadow-lg p-3 min-w-48">
                <CategoryFilter
                  activeCategories={activeGame.activeCategories}
                  onCategoryChange={handleCategoryChange}
                  relationshipMode={activeGame.relationshipMode}
                  customQuestionsExist={appState.customQuestions.length > 0}
                />
              </div>
            </details>

            <button
              onClick={() => setResetDialogOpen(true)}
              className="text-text-secondary hover:text-text-primary py-2 px-3 -mx-3 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </main>

      {/* Ad banner for free users */}
      {!isPro && (
        <MiniAdBanner onUpgrade={() => setUpgradeModalOpen(true)} />
      )}

      {/* Dialogs */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <CustomQuestions
        questions={appState.customQuestions}
        onAdd={handleAddCustomQuestion}
        onEdit={handleEditCustomQuestion}
        onDelete={handleDeleteCustomQuestion}
        isOpen={customQuestionsOpen}
        onClose={() => setCustomQuestionsOpen(false)}
      />

      <ResetDialog
        onResetProgress={handleResetProgress}
        onNewGame={handleNewGame}
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
      />

      <ProUpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onUpgrade={upgradeToPro}
      />
    </div>
  );
}
