"use client";

import { useState, useEffect } from "react";
import { AppState, GameSession, Question, RelationshipMode, Category } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { GameSwitcher } from "@/components/GameSwitcher";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { ActionButtons } from "@/components/ActionButtons";
import { CustomQuestions } from "@/components/CustomQuestions";
import { ResetDialog } from "@/components/ResetDialog";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { getAllQuestions } from "@/lib/questions";
import { getAvailableQuestions, pickRandomQuestion } from "@/lib/game";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const hasGames = appState.games.length > 0;
  const activeGame = appState.games.find((g) => g.id === appState.activeGameId);
  const allQuestions = getAllQuestions(appState.customQuestions);
  const availableQuestions = activeGame
    ? getAvailableQuestions(activeGame, allQuestions)
    : [];
  const currentQuestion = allQuestions.find((q) => q.id === activeGame?.currentId);

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
            currentId: null,
            activeCategories: "all",
            createdAt: Date.now(),
          };

          const updatedState = {
            ...appState,
            activeGameId: newGame.id,
            games: [...appState.games, newGame],
          };

          // Pick first random question
          const allQuestionsFiltered = getAllQuestions(appState.customQuestions);
          const available = getAvailableQuestions(newGame, allQuestionsFiltered);
          if (available.length > 0) {
            const firstQuestionId = pickRandomQuestion(available);
            newGame.currentId = firstQuestionId;
          }

          setAppState(updatedState);
        }}
      />
    );
  }

  // Game screen
  const handleMarkAnswered = () => {
    if (!currentQuestion || !activeGame) return;

    const updatedGame = {
      ...activeGame,
      answeredIds: [...activeGame.answeredIds, currentQuestion.id],
      globalAnsweredIds: [...appState.globalAnsweredIds, currentQuestion.id],
    };

    const available = getAvailableQuestions(updatedGame, allQuestions);
    const nextQuestionId = pickRandomQuestion(available);

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

    const available = getAvailableQuestions(activeGame, allQuestions).filter(
      (q) => q.id !== currentQuestion.id
    );
    const nextQuestionId = pickRandomQuestion(available);

    const updatedGames = appState.games.map((g) =>
      g.id === activeGame.id
        ? {
            ...g,
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

    const available = getAvailableQuestions(updatedGame, allQuestions);
    const nextQuestionId = available.length > 0 ? pickRandomQuestion(available) : null;

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

    const updatedGame = {
      ...activeGame,
      answeredIds: [],
      currentId: null,
    };

    const available = getAvailableQuestions(updatedGame, allQuestions);
    const firstQuestionId = available.length > 0 ? pickRandomQuestion(available) : null;
    updatedGame.currentId = firstQuestionId;

    const updatedGames = appState.games.map((g) =>
      g.id === activeGame.id ? updatedGame : g
    );

    setAppState({
      ...appState,
      games: updatedGames,
    });
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top Bar */}
      <div className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <GameSwitcher
              games={appState.games}
              activeGameId={appState.activeGameId}
              onSelectGame={handleSelectGame}
              onNewGame={handleNewGame}
            />
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8">
        {/* Progress */}
        <div className="mb-6 sm:mb-8">
          <ProgressBar
            answered={activeGame.answeredIds.length}
            total={availableQuestions.length + activeGame.answeredIds.length}
          />
        </div>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 sm:-mx-4 px-3 sm:px-4">
          <div className="inline-flex gap-2 min-w-min">
            <CategoryFilter
              activeCategories={activeGame.activeCategories}
              onCategoryChange={handleCategoryChange}
              relationshipMode={activeGame.relationshipMode}
              customQuestionsExist={appState.customQuestions.length > 0}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-6 sm:mb-8">
          <QuestionCard question={currentQuestion || null} />
        </div>

        {/* Action Buttons */}
        <div className="mb-6 sm:mb-8">
          <ActionButtons
            onMarkAnswered={handleMarkAnswered}
            onSkip={handleSkip}
            disabled={availableQuestions.length === 0}
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <button
            onClick={() => setCustomQuestionsOpen(true)}
            className="flex-1 sm:flex-none px-4 py-3 sm:py-2 bg-track hover:bg-border text-text-primary rounded-lg font-sans font-medium transition-colors text-sm active:bg-border"
          >
            My Questions
          </button>
          <button
            onClick={() => setResetDialogOpen(true)}
            className="flex-1 sm:flex-none px-4 py-3 sm:py-2 bg-track hover:bg-border text-text-primary rounded-lg font-sans font-medium transition-colors text-sm active:bg-border"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Dialogs */}
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
    </div>
  );
}
