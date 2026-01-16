import { normalizeArabic, getAllValidForms } from './arabicNumbers';

/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  // Create a matrix to store distances
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Initialize first column
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  // Initialize first row
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // deletion
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity ratio between two strings (0 to 1)
 */
export function similarityRatio(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;

  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
}

/**
 * Check if user input matches any of the valid answers with typo tolerance
 * @param userInput - The user's input
 * @param validAnswers - Array of valid answers
 * @param threshold - Minimum similarity ratio to accept (default 0.7 = 70% similar)
 */
export function isAnswerCorrect(
  userInput: string,
  validAnswers: string[],
  threshold: number = 0.7
): boolean {
  // Normalize user input
  const normalizedInput = normalizeArabic(userInput);

  // Check each valid answer
  for (const answer of validAnswers) {
    const normalizedAnswer = normalizeArabic(answer);

    // Exact match after normalization
    if (normalizedInput === normalizedAnswer) {
      return true;
    }

    // Check similarity ratio
    const ratio = similarityRatio(normalizedInput, normalizedAnswer);
    if (ratio >= threshold) {
      return true;
    }
  }

  return false;
}

/**
 * Check if the user's written number answer is correct
 * @param userInput - The user's input (Arabic words)
 * @param correctNumber - The number that should be written
 * @param threshold - Minimum similarity ratio to accept
 */
export function isNumberWrittenCorrectly(
  userInput: string,
  correctNumber: number,
  threshold: number = 0.7
): boolean {
  const validForms = getAllValidForms(correctNumber);
  return isAnswerCorrect(userInput, validForms, threshold);
}

/**
 * Find the best matching answer and its similarity score
 */
export function findBestMatch(
  userInput: string,
  validAnswers: string[]
): { match: string | null; score: number } {
  const normalizedInput = normalizeArabic(userInput);

  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const answer of validAnswers) {
    const normalizedAnswer = normalizeArabic(answer);
    const score = similarityRatio(normalizedInput, normalizedAnswer);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = answer;
    }
  }

  return { match: bestMatch, score: bestScore };
}

/**
 * Provide a hint about what might be wrong with the user's answer
 */
export function getAnswerHint(
  userInput: string,
  validAnswers: string[]
): string | null {
  const { match, score } = findBestMatch(userInput, validAnswers);

  if (!match) return null;

  if (score >= 0.9) {
    return 'قريب جداً! تحقق من الإملاء';
  } else if (score >= 0.7) {
    return 'قريب! راجع الكتابة';
  } else if (score >= 0.5) {
    return 'حاول مرة أخرى';
  }

  return null;
}
