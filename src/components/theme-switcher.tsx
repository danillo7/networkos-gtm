'use client';

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/cn';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-xl',
        'bg-[var(--fill-tertiary)] backdrop-blur-sm',
        className
      )}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'relative flex items-center justify-center',
            'w-9 h-9 rounded-lg transition-all duration-200',
            'hover:bg-[var(--bg-glass)]',
            theme === value && [
              'bg-[var(--bg-secondary)]',
              'shadow-sm',
              'text-[var(--system-blue)]',
            ],
            theme !== value && 'text-[var(--text-secondary)]'
          )}
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
        >
          <Icon className="w-4 h-4" strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}

// Compact version for smaller spaces
export function ThemeSwitcherCompact({ className }: ThemeSwitcherProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const Icon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;
  const label = theme === 'system' ? 'System' : resolvedTheme === 'dark' ? 'Dark' : 'Light';

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'flex items-center justify-center',
        'w-9 h-9 rounded-xl transition-all duration-200',
        'bg-[var(--fill-tertiary)] hover:bg-[var(--bg-glass)]',
        'text-[var(--text-secondary)] hover:text-[var(--text)]',
        className
      )}
      aria-label={`Current theme: ${label}. Click to change.`}
      title={`Theme: ${label}`}
    >
      <Icon className="w-4 h-4" strokeWidth={2} />
    </button>
  );
}
