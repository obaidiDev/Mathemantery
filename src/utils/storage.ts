import type { GameSession } from '../types';

const STORAGE_KEY = 'mathemantery_sessions';

/**
 * Get all saved game sessions from localStorage
 */
export function getSavedSessions(): GameSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as GameSession[];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * Save a game session to localStorage
 */
export function saveSession(session: GameSession): void {
  try {
    const sessions = getSavedSessions();
    sessions.unshift(session); // Add to beginning (most recent first)

    // Keep only last 100 sessions to prevent localStorage from growing too large
    const trimmedSessions = sessions.slice(0, 100);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedSessions));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Get sessions by game type
 */
export function getSessionsByGameType(gameType: string): GameSession[] {
  const sessions = getSavedSessions();
  return sessions.filter(s => s.gameType === gameType);
}

/**
 * Get statistics for all games
 */
export function getOverallStatistics(): {
  totalGames: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageScore: number;
} {
  const sessions = getSavedSessions();

  if (sessions.length === 0) {
    return {
      totalGames: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      averageScore: 0,
    };
  }

  const totalQuestions = sessions.reduce((sum, s) => sum + s.questionsCount, 0);
  const correctAnswers = sessions.reduce((sum, s) => sum + s.correctAnswers, 0);
  const totalScore = sessions.reduce((sum, s) => sum + s.totalScore, 0);

  return {
    totalGames: sessions.length,
    totalQuestions,
    correctAnswers,
    accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
    averageScore: sessions.length > 0 ? totalScore / sessions.length : 0,
  };
}

/**
 * Clear all saved sessions
 */
export function clearAllSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
