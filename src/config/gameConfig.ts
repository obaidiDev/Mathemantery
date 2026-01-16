// Game Configuration File
// This file contains all configurable settings for the math games

export type DifficultyLevel = 'low' | 'medium' | 'high' | 'custom';
export type GameType =
  | 'addition'
  | 'subtraction'
  | 'additionSubtraction'
  | 'multiplication'
  | 'division'
  | 'multiplicationDivision'
  | 'arithmetic'
  | 'readingNumbers'
  | 'comparingNumbers'
  | 'fractions';

export type QuestionMode = 'multipleChoice' | 'written';
export type NumberFormat = 'arabic' | 'english';

// Number ranges for each difficulty level
export interface NumberRange {
  min: number;
  max: number;
}

export interface DifficultyRanges {
  low: NumberRange;
  medium: NumberRange;
  high: NumberRange;
}

// Game-specific configurations
export const gameConfig = {
  // Default number of questions per game session
  defaultQuestionsCount: 10,

  // Multiple choice options count
  multipleChoiceOptionsCount: 4,

  // Scoring configuration
  scoring: {
    correctAnswer: 10,
    wrongAnswer: 0, // Can be negative for penalty
    skipQuestion: 0,
    bonusTimeMultiplier: 1.5, // Bonus multiplier for fast answers
    bonusTimeThreshold: 0.5, // Answer within 50% of time limit for bonus
  },

  // Timer configuration (in seconds)
  timers: {
    addition: {
      low: 30,
      medium: 45,
      high: 60,
      custom: 45,
    },
    subtraction: {
      low: 30,
      medium: 45,
      high: 60,
      custom: 45,
    },
    additionSubtraction: {
      low: 30,
      medium: 45,
      high: 60,
      custom: 45,
    },
    multiplication: {
      low: 30,
      medium: 60,
      high: 90,
      custom: 60,
    },
    division: {
      low: 45,
      medium: 75,
      high: 120,
      custom: 75,
    },
    multiplicationDivision: {
      low: 45,
      medium: 75,
      high: 120,
      custom: 75,
    },
    arithmetic: {
      low: 45,
      medium: 60,
      high: 90,
      custom: 60,
    },
    readingNumbers: {
      low: 45,
      medium: 60,
      high: 90,
      custom: 60,
    },
    comparingNumbers: {
      low: 20,
      medium: 30,
      high: 45,
      custom: 30,
    },
    fractions: {
      low: 45,
      medium: 60,
      high: 90,
      custom: 60,
    },
  },

  // Number ranges for each game type and difficulty
  ranges: {
    addition: {
      low: { min: 0, max: 9 },
      medium: { min: 10, max: 99 },
      high: { min: 100, max: 999 },
    } as DifficultyRanges,

    subtraction: {
      low: { min: 0, max: 9 },
      medium: { min: 10, max: 99 },
      high: { min: 100, max: 999 },
    } as DifficultyRanges,

    multiplication: {
      low: { min: 0, max: 10 },
      medium: { min: 10, max: 99 },
      high: { min: 100, max: 999 },
    } as DifficultyRanges,

    division: {
      low: { min: 0, max: 100 },
      medium: { min: 100, max: 10000 },
      high: { min: 10000, max: 1000000 },
    } as DifficultyRanges,

    readingNumbers: {
      low: { min: 0, max: 99 },
      medium: { min: 100, max: 999 },
      high: { min: 1000, max: 9999 },
    } as DifficultyRanges,

    comparingNumbers: {
      low: { min: 0, max: 9 },
      medium: { min: 10, max: 99 },
      high: { min: 100, max: 999 },
    } as DifficultyRanges,

    fractions: {
      default: {
        denominatorMin: 2,
        denominatorMax: 9,
        numeratorMin: 1, // numerator should be less than denominator
        numeratorMax: 8,
      },
    },
  },

  // UI Labels in Arabic
  labels: {
    gameNames: {
      addition: 'لعبة الجمع',
      subtraction: 'لعبة الطرح',
      additionSubtraction: 'الجمع والطرح',
      multiplication: 'لعبة الضرب',
      division: 'لعبة القسمة',
      multiplicationDivision: 'الضرب والقسمة',
      arithmetic: 'العمليات الحسابية',
      readingNumbers: 'قراءة الأعداد',
      comparingNumbers: 'مقارنة الأعداد',
      fractions: 'الكسور',
    },
    difficulties: {
      low: 'سهل',
      medium: 'متوسط',
      high: 'صعب',
      custom: 'مخصص',
    },
    modes: {
      multipleChoice: 'اختيار من متعدد',
      written: 'كتابة الإجابة',
    },
    numberFormats: {
      arabic: 'أرقام عربية',
      english: 'أرقام إنجليزية',
    },
    buttons: {
      start: 'ابدأ اللعبة',
      next: 'التالي',
      skip: 'تخطي',
      submit: 'تأكيد',
      back: 'رجوع',
      home: 'الرئيسية',
      playAgain: 'العب مرة أخرى',
      settings: 'الإعدادات',
    },
    feedback: {
      correct: 'صحيح! أحسنت',
      wrong: 'خطأ! الإجابة الصحيحة هي',
      skipped: 'تم تخطي السؤال',
      timeUp: 'انتهى الوقت!',
    },
    results: {
      title: 'النتيجة النهائية',
      score: 'النقاط',
      correct: 'إجابات صحيحة',
      wrong: 'إجابات خاطئة',
      skipped: 'أسئلة متخطاة',
      time: 'الوقت المستغرق',
      excellent: 'ممتاز!',
      good: 'جيد جداً!',
      average: 'جيد!',
      needsPractice: 'تحتاج للمزيد من التمرين',
    },
    questions: {
      addition: 'ما ناتج جمع',
      subtraction: 'ما ناتج طرح',
      multiplication: 'ما ناتج ضرب',
      division: 'ما ناتج قسمة',
      readingNumbers: 'اكتب الرقم التالي بالحروف العربية',
      comparingNumbers: 'قارن بين الرقمين التاليين',
      fractions: 'لون الكسر التالي على البيتزا',
    },
    comparison: {
      greaterThan: 'أكبر من',
      lessThan: 'أصغر من',
      equalTo: 'يساوي',
      symbols: {
        greaterThan: '>',
        lessThan: '<',
        equalTo: '=',
      },
    },
    timer: {
      enabled: 'تفعيل المؤقت',
      disabled: 'إيقاف المؤقت',
      timeRemaining: 'الوقت المتبقي',
    },
    questionsCount: {
      label: 'عدد الأسئلة',
      question: 'سؤال',
    },
    customRange: {
      min: 'الحد الأدنى',
      max: 'الحد الأقصى',
      additionRange: 'نطاق أرقام الجمع',
      subtractionRange: 'نطاق أرقام الطرح',
      multiplicationRange: 'نطاق أرقام الضرب',
      divisionRange: 'نطاق أرقام القسمة',
      denominatorRange: 'نطاق المقام',
      numeratorRange: 'نطاق البسط',
    },
  },

  // Result thresholds (percentage)
  resultThresholds: {
    excellent: 90,
    good: 70,
    average: 50,
  },
};

// Arabic numerals mapping
export const arabicNumerals: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
};

export const englishNumerals: Record<string, string> = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};

// Arabic number words (0-9999)
export const arabicNumberWords = {
  // Units - masculine form
  units: {
    masculine: ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'],
    feminine: ['صفر', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثمان', 'تسع'],
  },

  // Tens
  tens: ['', 'عشر', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'],

  // Teens (11-19) - masculine
  teens: {
    masculine: ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'],
    feminine: ['عشر', 'إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة', 'سبع عشرة', 'ثماني عشرة', 'تسع عشرة'],
  },

  // Hundreds
  hundreds: ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'],

  // Thousands
  thousands: {
    one: 'ألف',
    two: 'ألفان',
    plural: 'آلاف', // 3-10
    many: 'ألف', // 11+
  },

  // Connector
  connector: 'و',
};

// Game icons for UI
export const gameIcons: Record<GameType, string> = {
  addition: '+',
  subtraction: '-',
  additionSubtraction: '+-',
  multiplication: '×',
  division: '÷',
  multiplicationDivision: '×÷',
  arithmetic: '+-×÷',
  readingNumbers: '123',
  comparingNumbers: '<>',
  fractions: '½',
};

// Color scheme for each game (Tailwind classes)
export const gameColors: Record<GameType, { bg: string; text: string; accent: string }> = {
  addition: { bg: 'bg-green-100', text: 'text-green-700', accent: 'bg-green-500' },
  subtraction: { bg: 'bg-red-100', text: 'text-red-700', accent: 'bg-red-500' },
  additionSubtraction: { bg: 'bg-amber-100', text: 'text-amber-700', accent: 'bg-amber-500' },
  multiplication: { bg: 'bg-blue-100', text: 'text-blue-700', accent: 'bg-blue-500' },
  division: { bg: 'bg-purple-100', text: 'text-purple-700', accent: 'bg-purple-500' },
  multiplicationDivision: { bg: 'bg-indigo-100', text: 'text-indigo-700', accent: 'bg-indigo-500' },
  arithmetic: { bg: 'bg-pink-100', text: 'text-pink-700', accent: 'bg-pink-500' },
  readingNumbers: { bg: 'bg-cyan-100', text: 'text-cyan-700', accent: 'bg-cyan-500' },
  comparingNumbers: { bg: 'bg-orange-100', text: 'text-orange-700', accent: 'bg-orange-500' },
  fractions: { bg: 'bg-teal-100', text: 'text-teal-700', accent: 'bg-teal-500' },
};

export default gameConfig;
