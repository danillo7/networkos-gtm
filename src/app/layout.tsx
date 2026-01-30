/**
 * NetworkOS - Root Layout
 * Integrates all providers (Theme and Language)
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MusicPlayer } from '@/components/music-player';
import { ThemedToaster } from '@/components/themed-toaster';

// Providers
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider, themeScript } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NetworkOS - AI-First GTM Platform',
  description: 'Plataforma de gestao de contatos com inteligencia artificial',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Script to prevent theme flash on load */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <LanguageProvider>
            <ThemedToaster />
            <div className="min-h-screen bg-background">
              {children}
            </div>
            <MusicPlayer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
