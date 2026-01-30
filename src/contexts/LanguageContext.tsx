'use client';

/**
 * NetworkOS - Language Context
 * Provides internationalization support across the application
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Locale, locales, DEFAULT_LOCALE } from '@/i18n';

const STORAGE_KEY = 'networkos-locale';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLocale?: Locale;
}

export function LanguageProvider({
  children,
  defaultLocale = DEFAULT_LOCALE,
}: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (savedLocale && locales[savedLocale]) {
      setLocaleState(savedLocale);
    }
    setIsHydrated(true);
  }, []);

  // Update localStorage when locale changes
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);

    // Update html lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale;
    }
  }, []);

  // Translation function
  const t = useCallback(
    (key: string): string => {
      const translations = locales[locale];
      return translations[key] || key;
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t]
  );

  // Prevent hydration mismatch by rendering children only after hydration
  if (!isHydrated) {
    return (
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { LanguageContext };
export type { LanguageContextType, LanguageProviderProps };
