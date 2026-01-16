import { useState, useCallback, useEffect } from 'react';
import type { GameType, GameSettings } from './types';
import { useGame } from './hooks/useGame';
import {
  Header,
  GameSelector,
  GameSettings as GameSettingsComponent,
  GameScreen,
  ResultsScreen,
} from './components/layout';
import styles from './config/styles.json';

type AppScreen = 'home' | 'settings' | 'game' | 'results';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);

  const {
    state,
    settings,
    currentQuestion,
    startGame,
    submitAnswer,
    skipQuestion,
    nextQuestion,
    endGame,
    resetGame,
  } = useGame();

  // Handle game selection
  const handleSelectGame = useCallback((gameType: GameType) => {
    setSelectedGameType(gameType);
    setCurrentScreen('settings');
  }, []);

  // Handle starting the game
  const handleStartGame = useCallback(
    (gameSettings: GameSettings) => {
      if (selectedGameType) {
        startGame(selectedGameType, gameSettings);
        setCurrentScreen('game');
      }
    },
    [selectedGameType, startGame]
  );

  // Handle going back from settings
  const handleBackFromSettings = useCallback(() => {
    setSelectedGameType(null);
    setCurrentScreen('home');
  }, []);

  // Handle answer submission
  const handleAnswer = useCallback(
    (answer: string | number) => {
      submitAnswer(answer);
    },
    [submitAnswer]
  );

  // Handle skip
  const handleSkip = useCallback(() => {
    skipQuestion();
  }, [skipQuestion]);

  // Handle next question or show results
  const handleNext = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  // Handle ending game early
  const handleEndGame = useCallback(() => {
    endGame();
  }, [endGame]);

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    if (selectedGameType) {
      startGame(selectedGameType, settings);
      setCurrentScreen('game');
    }
  }, [selectedGameType, settings, startGame]);

  // Handle going home
  const handleGoHome = useCallback(() => {
    resetGame();
    setSelectedGameType(null);
    setCurrentScreen('home');
  }, [resetGame]);

  // Check if game is finished and switch to results screen
  useEffect(() => {
    if (state.isGameFinished && currentScreen === 'game') {
      setCurrentScreen('results');
    }
  }, [state.isGameFinished, currentScreen]);

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <>
            <Header />
            <GameSelector onSelectGame={handleSelectGame} />
          </>
        );

      case 'settings':
        return selectedGameType ? (
          <GameSettingsComponent
            gameType={selectedGameType}
            onStart={handleStartGame}
            onBack={handleBackFromSettings}
          />
        ) : null;

      case 'game':
        return currentQuestion && state.gameType ? (
          <GameScreen
            gameType={state.gameType}
            currentQuestion={currentQuestion}
            currentQuestionIndex={state.currentQuestionIndex}
            totalQuestions={state.questionsCount}
            score={state.score}
            numberFormat={state.numberFormat}
            questionMode={state.questionMode}
            difficulty={state.difficulty}
            timerEnabled={state.timerEnabled}
            showFeedback={state.showFeedback}
            lastAnswerCorrect={state.lastAnswerCorrect}
            onAnswer={handleAnswer}
            onSkip={handleSkip}
            onNext={handleNext}
            onBack={handleEndGame}
          />
        ) : null;

      case 'results':
        return (
          <ResultsScreen
            session={{
              correctAnswers: state.answers.filter((a) => a.isCorrect).length,
              wrongAnswers: state.answers.filter((a) => !a.isCorrect && !a.isSkipped).length,
              skippedQuestions: state.answers.filter((a) => a.isSkipped).length,
              totalScore: state.score,
              totalTime: state.answers.reduce((sum, a) => sum + a.timeSpent, 0),
              questionsCount: state.questionsCount,
            }}
            numberFormat={state.numberFormat}
            onPlayAgain={handlePlayAgain}
            onHome={handleGoHome}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.containers.main}>
      <div className="max-w-5xl mx-auto">{renderScreen()}</div>
    </div>
  );
}

export default App;
