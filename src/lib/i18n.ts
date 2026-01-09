import en from '../i18n/en.json';
import es from '../i18n/es.json';

type TranslationKey = string;
type TranslationValue = string | { [key: string]: TranslationValue };

const translations: Record<string, Record<string, TranslationValue>> = {
  en,
  es,
};

/**
 * Get a translation value by key path (e.g., "common.home" or "home.title")
 * Supports nested keys using dot notation
 */
export function getTranslation(
  locale: string,
  key: string
): string {
  const localeTranslations = translations[locale] || translations.en;
  const keys = key.split('.');
  
  let value: TranslationValue = localeTranslations;
  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      const enValue = translations.en;
      let fallback: TranslationValue = enValue;
      for (const fallbackKey of keys) {
        if (typeof fallback === 'object' && fallback !== null && fallbackKey in fallback) {
          fallback = fallback[fallbackKey];
        } else {
          return key; // Return key if not found even in English
        }
      }
      return typeof fallback === 'string' ? fallback : key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Get all translations for a specific locale
 */
export function getTranslations(locale: string = 'en'): Record<string, TranslationValue> {
  return translations[locale] || translations.en;
}

/**
 * Get a nested translation object (e.g., getTranslationObject('en', 'home') returns all home translations)
 */
export function getTranslationObject(
  locale: string,
  key: string
): Record<string, TranslationValue> | null {
  const localeTranslations = translations[locale] || translations.en;
  const keys = key.split('.');
  
  let value: TranslationValue = localeTranslations;
  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = value[k];
    } else {
      return null;
    }
  }
  
  return typeof value === 'object' && value !== null ? value as Record<string, TranslationValue> : null;
}
