/**
 * NetworkOS - i18n Module
 * Internationalization utilities and exports
 */

import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';
import es from './locales/es.json';

export type Locale = 'pt-BR' | 'en' | 'es';

export type TranslationKey = keyof typeof ptBR;

export const locales: Record<Locale, Record<string, string>> = {
  'pt-BR': ptBR,
  en: en,
  es: es,
};

export const localeNames: Record<Locale, string> = {
  'pt-BR': 'Português',
  en: 'English',
  es: 'Español',
};

export const localeFlags: Record<Locale, string> = {
  'pt-BR': 'BR',
  en: 'EN',
  es: 'ES',
};

export const DEFAULT_LOCALE: Locale = 'pt-BR';

export function getTranslation(locale: Locale, key: string): string {
  const translations = locales[locale];
  return translations[key] || key;
}

export { ptBR, en, es };
