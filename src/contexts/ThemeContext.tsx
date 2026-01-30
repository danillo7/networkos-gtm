'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'networkos-theme';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }, []);

  // Resolve the actual theme based on preference
  const resolveTheme = useCallback(
    (themePreference: Theme): ResolvedTheme => {
      if (themePreference === 'system') {
        return getSystemTheme();
      }
      return themePreference;
    },
    [getSystemTheme]
  );

  // Apply theme to document
  const applyTheme = useCallback((resolved: ResolvedTheme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);

    // Also update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolved === 'dark' ? '#000000' : '#f2f2f7'
      );
    }
  }, []);

  // Set theme and persist to localStorage
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      const resolved = resolveTheme(newTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);

      // Persist to localStorage
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    },
    [resolveTheme, applyTheme]
  );

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);

    // Try to get theme from localStorage
    let savedTheme: Theme = defaultTheme;
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        savedTheme = stored as Theme;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }

    setThemeState(savedTheme);
    const resolved = resolveTheme(savedTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [defaultTheme, resolveTheme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        applyTheme(resolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, theme, getSystemTheme, applyTheme]);

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: defaultTheme,
          resolvedTheme: 'dark',
          setTheme: () => {},
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Script to prevent flash of wrong theme (can be added to head)
export const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('${THEME_STORAGE_KEY}') || 'system';
      var resolved = theme;
      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', resolved);
    } catch (e) {}
  })();
`;
