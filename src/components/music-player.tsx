'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music2, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// YouTube Playlist - Lo-Fi/Chill Beats que funcionam
const YOUTUBE_PLAYLIST = [
  { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio', artist: 'Lofi Girl' },
  { id: '5qap5aO4i9A', title: 'lofi hip hop radio', artist: 'Chillhop Music' },
  { id: 'rUxyKA_-grg', title: 'Chill Lofi Mix', artist: 'The Bootleg Boy' },
];

// Declaracao de tipo para YouTube IFrame API
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          height?: string;
          width?: string;
          videoId?: string;
          playerVars?: {
            autoplay?: number;
            controls?: number;
            disablekb?: number;
            fs?: number;
            modestbranding?: number;
            rel?: number;
            showinfo?: number;
            iv_load_policy?: number;
            origin?: string;
          };
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  loadVideoById: (videoId: string) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

export function MusicPlayer() {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    // Load API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Callback when API is ready
    window.onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const initializePlayer = useCallback(() => {
    if (!window.YT || !window.YT.Player) return;

    const track = YOUTUBE_PLAYLIST[currentTrack];

    playerRef.current = new window.YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId: track.id,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        origin: typeof window !== 'undefined' ? window.location.origin : '',
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
    });
  }, [currentTrack]);

  const onPlayerReady = useCallback((event: { target: YTPlayer }) => {
    setIsReady(true);
    setIsLoading(false);
    setDuration(event.target.getDuration());
  }, []);

  const onPlayerStateChange = useCallback((event: { data: number; target: YTPlayer }) => {
    const state = event.data;

    if (state === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setIsLoading(false);
      setDuration(event.target.getDuration());

      // Start progress tracking
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 1000);
    } else if (state === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    } else if (state === window.YT.PlayerState.ENDED) {
      handleNext();
    } else if (state === window.YT.PlayerState.BUFFERING) {
      setIsLoading(true);
    }
  }, []);

  const onPlayerError = useCallback((event: { data: number }) => {
    console.error('YouTube Player Error:', event.data);
    setIsLoading(false);
    // Try next track on error
    handleNext();
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!playerRef.current || !isReady) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      setIsLoading(true);
      playerRef.current.playVideo();
    }
  }, [isPlaying, isReady]);

  const handlePrevious = useCallback(() => {
    const newIndex = currentTrack === 0 ? YOUTUBE_PLAYLIST.length - 1 : currentTrack - 1;
    setCurrentTrack(newIndex);
    setCurrentTime(0);
    setIsLoading(true);

    if (playerRef.current && isReady) {
      playerRef.current.loadVideoById(YOUTUBE_PLAYLIST[newIndex].id);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  }, [currentTrack, isPlaying, isReady]);

  const handleNext = useCallback(() => {
    const newIndex = currentTrack === YOUTUBE_PLAYLIST.length - 1 ? 0 : currentTrack + 1;
    setCurrentTrack(newIndex);
    setCurrentTime(0);
    setIsLoading(true);

    if (playerRef.current && isReady) {
      playerRef.current.loadVideoById(YOUTUBE_PLAYLIST[newIndex].id);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  }, [currentTrack, isPlaying, isReady]);

  const handleToggleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  const handleVolumeToggle = useCallback(() => {
    if (!playerRef.current || !isReady) return;

    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted, isReady]);

  const handleTrackSelect = useCallback((index: number) => {
    if (index === currentTrack) return;

    setCurrentTrack(index);
    setCurrentTime(0);
    setIsLoading(true);

    if (playerRef.current && isReady) {
      playerRef.current.loadVideoById(YOUTUBE_PLAYLIST[index].id);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  }, [currentTrack, isPlaying, isReady]);

  const formatTime = (time: number): string => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const track = YOUTUBE_PLAYLIST[currentTrack];

  // Hidden YouTube player container
  const hiddenPlayer = (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div id="youtube-player" />
    </div>
  );

  // Estado minimizado - botao circular
  if (isMinimized) {
    return (
      <>
        {hiddenPlayer}
        <button
          onClick={handleToggleMinimize}
          className="music-player-minimized"
          aria-label={t('player.expand') || 'Expandir player'}
        >
          <Music2 className="w-5 h-5" />
          {isPlaying && (
            <span className="music-player-pulse" />
          )}
        </button>
      </>
    );
  }

  // Estado expandido
  return (
    <>
      {hiddenPlayer}
      <div ref={containerRef} className={`music-player ${isPlaying ? 'playing' : ''}`}>
        {/* Header */}
        <div className="yt-player-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4 text-white/80" />
              <span className="text-xs font-medium text-white/80">
                {t('player.nowPlaying') || 'Now Playing'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleVolumeToggle}
                className="p-1 rounded-full transition-colors text-white/60 hover:text-white"
                aria-label={isMuted ? (t('player.unmute') || 'Ativar som') : (t('player.mute') || 'Silenciar')}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleToggleMinimize}
                className="yt-minimize-btn"
                aria-label={t('player.minimize') || 'Minimizar player'}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visualizer - 7 barras */}
          <div className="yt-visualizer">
            <div className="yt-visualizer-bar" />
            <div className="yt-visualizer-bar" />
            <div className="yt-visualizer-bar" />
            <div className="yt-visualizer-bar" />
            <div className="yt-visualizer-bar" />
            <div className="yt-visualizer-bar" />
            <div className="yt-visualizer-bar" />
          </div>

          {/* Track Info */}
          <div className="text-center">
            <h4 className="text-sm font-semibold text-white truncate">{track.title}</h4>
            <p className="text-xs text-white/60 truncate">{track.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="yt-player-controls">
          <button
            onClick={handlePrevious}
            className="yt-ctrl-btn"
            aria-label={t('player.previous') || 'Faixa anterior'}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayPause}
            className="yt-ctrl-btn play-btn"
            aria-label={isPlaying ? (t('player.pause') || 'Pausar') : (t('player.play') || 'Reproduzir')}
            disabled={!isReady}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="yt-ctrl-btn"
            aria-label={t('player.next') || 'Proxima faixa'}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="yt-progress-container">
          <div className="yt-progress-bar">
            <div className="yt-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="yt-progress-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playlist indicator */}
        <div className="yt-playlist-indicator">
          {YOUTUBE_PLAYLIST.map((_, index) => (
            <button
              key={index}
              onClick={() => handleTrackSelect(index)}
              className={`yt-playlist-dot ${index === currentTrack ? 'active' : ''}`}
              aria-label={`${t('player.track') || 'Faixa'} ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
