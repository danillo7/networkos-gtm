'use client';

import { Toaster } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text)',
        },
        className: 'glassmorphism',
      }}
      theme={resolvedTheme}
    />
  );
}
