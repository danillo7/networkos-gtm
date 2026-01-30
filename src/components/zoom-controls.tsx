'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ZOOM_LEVELS = [50, 75, 90, 100, 110, 125, 150, 175, 200];
const DEFAULT_ZOOM = 100;
const STORAGE_KEY = 'networkos-zoom';

export function ZoomControls() {
  const { t } = useLanguage();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  // Load zoom from localStorage on mount
  useEffect(() => {
    const savedZoom = localStorage.getItem(STORAGE_KEY);
    if (savedZoom) {
      const parsedZoom = parseInt(savedZoom, 10);
      if (ZOOM_LEVELS.includes(parsedZoom)) {
        setZoom(parsedZoom);
        applyZoom(parsedZoom);
      }
    }
  }, []);

  // Apply zoom using only body.style.zoom (remove duplicate fontSize approach)
  const applyZoom = useCallback((zoomLevel: number) => {
    document.body.style.zoom = `${zoomLevel / 100}`;
  }, []);

  const handleZoomIn = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      const newZoom = ZOOM_LEVELS[currentIndex + 1];
      setZoom(newZoom);
      applyZoom(newZoom);
      localStorage.setItem(STORAGE_KEY, newZoom.toString());
    }
  }, [zoom, applyZoom]);

  const handleZoomOut = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex > 0) {
      const newZoom = ZOOM_LEVELS[currentIndex - 1];
      setZoom(newZoom);
      applyZoom(newZoom);
      localStorage.setItem(STORAGE_KEY, newZoom.toString());
    }
  }, [zoom, applyZoom]);

  const handleReset = useCallback(() => {
    setZoom(DEFAULT_ZOOM);
    applyZoom(DEFAULT_ZOOM);
    localStorage.setItem(STORAGE_KEY, DEFAULT_ZOOM.toString());
  }, [applyZoom]);

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'var(--fill-tertiary)' }}>
      <button
        onClick={handleZoomOut}
        disabled={zoom === ZOOM_LEVELS[0]}
        className="p-1.5 rounded-md transition-colors disabled:opacity-30"
        style={{ color: 'var(--text-secondary)' }}
        title={t('zoom.zoomOut') || 'Diminuir zoom'}
        aria-label={t('zoom.zoomOut') || 'Diminuir zoom'}
      >
        <ZoomOut className="h-4 w-4" />
      </button>

      <button
        onClick={handleReset}
        className="px-2 py-1 text-xs font-medium rounded-md transition-colors min-w-[44px]"
        style={{ color: 'var(--text)' }}
        title={t('zoom.reset') || 'Resetar zoom'}
        aria-label={`${t('zoom.reset') || 'Resetar zoom'} 100%`}
      >
        {zoom}%
      </button>

      <button
        onClick={handleZoomIn}
        disabled={zoom === ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
        className="p-1.5 rounded-md transition-colors disabled:opacity-30"
        style={{ color: 'var(--text-secondary)' }}
        title={t('zoom.zoomIn') || 'Aumentar zoom'}
        aria-label={t('zoom.zoomIn') || 'Aumentar zoom'}
      >
        <ZoomIn className="h-4 w-4" />
      </button>
    </div>
  );
}
