import { arabicNumerals, englishNumerals } from '../config/gameConfig';
import type { NumberFormat } from '../types';

/**
 * Convert a number to Arabic numerals string
 */
export function toArabicNumerals(num: number): string {
  return num
    .toString()
    .split('')
    .map((digit) => arabicNumerals[digit] || digit)
    .join('');
}

/**
 * Convert Arabic numerals string to number
 */
export function fromArabicNumerals(str: string): number {
  const converted = str
    .split('')
    .map((char) => englishNumerals[char] || char)
    .join('');
  return parseInt(converted, 10);
}

/**
 * Format number based on selected format
 */
export function formatNumber(num: number, format: NumberFormat): string {
  return format === 'arabic' ? toArabicNumerals(num) : num.toString();
}

/**
 * Parse user input to number (handles both Arabic and English numerals)
 */
export function parseUserInput(input: string): number {
  // First try to convert from Arabic numerals
  const converted = input
    .split('')
    .map((char) => englishNumerals[char] || char)
    .join('');
  return parseInt(converted, 10);
}

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate two numbers for addition
 */
export function generateAdditionNumbers(min: number, max: number): [number, number] {
  const num1 = randomInt(min, max);
  const num2 = randomInt(min, max);
  return [num1, num2];
}

/**
 * Generate two numbers for subtraction (ensures no negative result)
 */
export function generateSubtractionNumbers(min: number, max: number): [number, number] {
  let num1 = randomInt(min, max);
  let num2 = randomInt(min, max);

  // Ensure num1 >= num2 to avoid negative results
  if (num1 < num2) {
    [num1, num2] = [num2, num1];
  }

  return [num1, num2];
}

/**
 * Generate two numbers for multiplication
 */
export function generateMultiplicationNumbers(min: number, max: number): [number, number] {
  const num1 = randomInt(min, max);
  const num2 = randomInt(min, max);
  return [num1, num2];
}

/**
 * Generate two numbers for division (ensures integer result)
 */
export function generateDivisionNumbers(min: number, max: number): [number, number] {
  // Generate the divisor first (avoid 0)
  const divisor = randomInt(Math.max(1, Math.floor(Math.sqrt(min))), Math.floor(Math.sqrt(max)));

  // Generate a quotient
  const quotientMin = Math.max(1, Math.floor(min / divisor));
  const quotientMax = Math.floor(max / divisor);
  const quotient = randomInt(quotientMin, Math.max(quotientMin, quotientMax));

  // Calculate dividend
  const dividend = divisor * quotient;

  return [dividend, divisor];
}

/**
 * Generate a random fraction
 */
export function generateFraction(
  denominatorMin: number,
  denominatorMax: number,
  numeratorMin: number,
  numeratorMax: number
): { numerator: number; denominator: number } {
  const denominator = randomInt(denominatorMin, denominatorMax);
  // Numerator should be less than or equal to denominator
  const maxNumerator = Math.min(numeratorMax, denominator);
  const minNumerator = Math.min(numeratorMin, maxNumerator);
  const numerator = randomInt(minNumerator, maxNumerator);

  return { numerator, denominator };
}

/**
 * Generate wrong options for multiple choice that are close to the correct answer
 */
export function generateWrongOptions(
  correctAnswer: number,
  count: number,
  minDiff: number = 1,
  maxDiff: number = 10
): number[] {
  const options: Set<number> = new Set();

  // Try to generate unique wrong options
  let attempts = 0;
  const maxAttempts = count * 10;

  while (options.size < count && attempts < maxAttempts) {
    attempts++;

    // Generate a random difference
    const diff = randomInt(minDiff, maxDiff);
    const sign = Math.random() > 0.5 ? 1 : -1;
    const wrongOption = correctAnswer + (diff * sign);

    // Only add non-negative options that aren't the correct answer
    if (wrongOption >= 0 && wrongOption !== correctAnswer && !options.has(wrongOption)) {
      options.add(wrongOption);
    }
  }

  // If we couldn't generate enough options, fill with sequential numbers
  let fallback = 1;
  while (options.size < count) {
    const option = correctAnswer + fallback;
    if (option >= 0 && !options.has(option)) {
      options.add(option);
    }
    fallback = fallback > 0 ? -fallback : -fallback + 1;
  }

  return Array.from(options);
}

/**
 * Shuffle an array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate multiple choice options including the correct answer
 */
export function generateOptions(correctAnswer: number, totalOptions: number = 4): number[] {
  // Determine appropriate difficulty range based on the answer magnitude
  const magnitude = Math.max(1, Math.floor(Math.log10(Math.abs(correctAnswer) + 1)));
  const minDiff = Math.max(1, Math.pow(10, magnitude - 1));
  const maxDiff = Math.max(5, Math.pow(10, magnitude));

  const wrongOptions = generateWrongOptions(correctAnswer, totalOptions - 1, minDiff, maxDiff);
  const allOptions = [correctAnswer, ...wrongOptions];

  return shuffleArray(allOptions);
}

/**
 * Generate comparison numbers (two different numbers for comparing)
 */
export function generateComparisonNumbers(min: number, max: number): [number, number] {
  const num1 = randomInt(min, max);
  let num2 = randomInt(min, max);

  // Allow equal numbers sometimes (about 10% of the time)
  if (Math.random() > 0.1 && num1 === num2) {
    num2 = num1 + (Math.random() > 0.5 ? 1 : -1);
    if (num2 < min) num2 = num1 + 1;
    if (num2 > max) num2 = num1 - 1;
  }

  return [num1, num2];
}

/**
 * Get comparison result
 */
export function getComparisonResult(num1: number, num2: number): '>' | '<' | '=' {
  if (num1 > num2) return '>';
  if (num1 < num2) return '<';
  return '=';
}
