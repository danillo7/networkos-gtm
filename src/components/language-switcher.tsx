'use client';

/**
 * NetworkOS - Language Switcher Component
 * Dropdown to switch between available languages
 */

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Locale, localeNames, localeFlags } from '@/i18n';
import { cn } from '@/utils/cn';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'compact';
}

const languages: { code: Locale; name: string; flag: string }[] = [
  { code: 'pt-BR', name: localeNames['pt-BR'], flag: localeFlags['pt-BR'] },
  { code: 'en', name: localeNames.en, flag: localeFlags.en },
  { code: 'es', name: localeNames.es, flag: localeFlags.es },
];

export function LanguageSwitcher({
  className,
  variant = 'default',
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          variant === 'compact' && 'px-2 py-1.5'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('header.language')}
      >
        <Globe className="h-4 w-4" />
        {variant === 'default' && (
          <>
            <span>{currentLanguage?.flag}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md border border-input bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="listbox"
          aria-label={t('header.language')}
        >
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => handleSelect(language.code)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                  locale === language.code && 'bg-accent/50'
                )}
                role="option"
                aria-selected={locale === language.code}
              >
                <span className="flex items-center gap-2">
                  <span className="font-medium">{language.flag}</span>
                  <span>{language.name}</span>
                </span>
                {locale === language.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
