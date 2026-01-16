import { arabicNumberWords } from '../config/gameConfig';

/**
 * Convert a number (0-9999) to Arabic words
 * Returns multiple valid forms (masculine and feminine)
 */
export function numberToArabicWords(num: number): string[] {
  if (num < 0 || num > 9999) {
    return [num.toString()];
  }

  const results: string[] = [];

  // Add both masculine and feminine forms
  results.push(convertToArabic(num, 'masculine'));
  const feminineForm = convertToArabic(num, 'feminine');
  if (feminineForm !== results[0]) {
    results.push(feminineForm);
  }

  // Add common variations and alternative spellings
  addVariations(results, num);

  return [...new Set(results)]; // Remove duplicates
}

function convertToArabic(num: number, gender: 'masculine' | 'feminine'): string {
  const { units, tens, teens, hundreds, thousands, connector } = arabicNumberWords;

  if (num === 0) return units[gender][0];

  const parts: string[] = [];

  // Thousands
  const thousandsDigit = Math.floor(num / 1000);
  if (thousandsDigit > 0) {
    if (thousandsDigit === 1) {
      parts.push(thousands.one);
    } else if (thousandsDigit === 2) {
      parts.push(thousands.two);
    } else if (thousandsDigit >= 3 && thousandsDigit <= 10) {
      parts.push(`${units.masculine[thousandsDigit]} ${thousands.plural}`);
    } else {
      parts.push(`${units.masculine[thousandsDigit]} ${thousands.many}`);
    }
  }

  // Hundreds
  const hundredsDigit = Math.floor((num % 1000) / 100);
  if (hundredsDigit > 0) {
    parts.push(hundreds[hundredsDigit]);
  }

  // Tens and units
  const remainder = num % 100;
  if (remainder > 0) {
    if (remainder < 10) {
      parts.push(units[gender][remainder]);
    } else if (remainder >= 10 && remainder < 20) {
      parts.push(teens[gender][remainder - 10]);
    } else {
      const tensDigit = Math.floor(remainder / 10);
      const unitsDigit = remainder % 10;

      if (unitsDigit > 0) {
        // In Arabic, units come before tens (e.g., "واحد وعشرون" = 21)
        parts.push(`${units[gender][unitsDigit]} ${connector}${tens[tensDigit]}`);
      } else {
        parts.push(tens[tensDigit]);
      }
    }
  }

  // Join parts with connector
  return parts.join(` ${connector}`);
}

/**
 * Add common variations and alternative spellings
 */
function addVariations(results: string[], num: number): void {
  // Add variations for common numbers
  const variations: Record<number, string[]> = {
    0: ['صفر'],
    1: ['واحد', 'واحدة', 'احد', 'احدى'],
    2: ['اثنان', 'اثنين', 'اثنتان', 'اثنتين'],
    3: ['ثلاثة', 'ثلاث', 'تلاتة', 'تلاث'],
    4: ['أربعة', 'اربعة', 'أربع', 'اربع'],
    5: ['خمسة', 'خمس'],
    6: ['ستة', 'ست'],
    7: ['سبعة', 'سبع'],
    8: ['ثمانية', 'ثماني', 'ثمان', 'تمانية', 'تماني'],
    9: ['تسعة', 'تسع'],
    10: ['عشرة', 'عشر'],
    11: ['أحد عشر', 'احد عشر', 'إحدى عشرة', 'احدى عشرة'],
    12: ['اثنا عشر', 'اثني عشر', 'اثنتا عشرة', 'اثنتي عشرة'],
    20: ['عشرون', 'عشرين'],
    30: ['ثلاثون', 'ثلاثين', 'تلاتون', 'تلاتين'],
    40: ['أربعون', 'اربعون', 'أربعين', 'اربعين'],
    50: ['خمسون', 'خمسين'],
    60: ['ستون', 'ستين'],
    70: ['سبعون', 'سبعين'],
    80: ['ثمانون', 'ثمانين', 'تمانون', 'تمانين'],
    90: ['تسعون', 'تسعين'],
    100: ['مائة', 'مئة', 'ميه', 'ميا'],
    200: ['مائتان', 'مئتان', 'مائتين', 'مئتين', 'ميتين'],
    1000: ['ألف', 'الف'],
    2000: ['ألفان', 'الفان', 'ألفين', 'الفين'],
  };

  if (variations[num]) {
    results.push(...variations[num]);
  }

  // For compound numbers, add variations without "و"
  results.forEach(result => {
    if (result.includes(' و')) {
      results.push(result.replace(/ و/g, ' '));
    }
  });
}

/**
 * Normalize Arabic text for comparison
 * Removes diacritics, normalizes characters
 */
export function normalizeArabic(text: string): string {
  return text
    // Remove diacritics (tashkeel)
    .replace(/[\u064B-\u065F]/g, '')
    // Normalize alef variations
    .replace(/[أإآا]/g, 'ا')
    // Normalize taa marbuta
    .replace(/ة/g, 'ه')
    // Normalize yaa
    .replace(/ى/g, 'ي')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Get all valid Arabic word representations for a number
 */
export function getAllValidForms(num: number): string[] {
  const forms = numberToArabicWords(num);
  const normalized = forms.map(normalizeArabic);
  return [...new Set([...forms, ...normalized])];
}
