import React from 'react';
import {
  Play,
  Pause,
  Disc,
  CloudRain,
  ChevronUp,
  SkipBack,
  SkipForward,
  BookOpen,
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

interface Props {
  onExpand: () => void;
  onOpenMushaf: () => void;
  onOpenAmbient: () => void;
}

export const MiniPlayerWeb: React.FC<Props> = ({
  onExpand,
  onOpenMushaf,
  onOpenAmbient,
}) => {
  const {
    currentSurah,
    currentReciter,
    isPlaying,
    isBuffering,
    togglePlayPause,
    position,
    duration,
    activeAmbient,
    isAmbientPlaying,
    nextSurah,
    prevSurah,
  } = usePlayerStore();

  const progress = duration > 0 ? Math.min(1, Math.max(0, position / duration)) : 0;

  return (
    <div
      onClick={onExpand}
      className="fixed bottom-0 inset-x-0 z-40 glass-strong rounded-none border-t border-[var(--glass-border-2)] cursor-pointer transition-transform shadow-[0_-12px_40px_rgba(3,7,17,0.85)]"
      dir="rtl"
    >
      {/* Top progress hairline bar with cyan/electric blue glow */}
      <div className="w-full h-1 bg-white/[0.06] relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-l from-[var(--accent)] via-[var(--primary)] to-[var(--accent)] transition-all duration-300 shadow-[0_0_12px_var(--accent)]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-4 font-cairo">
        {/* Track & Reciter Info */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-11 h-11 rounded-2xl bg-[var(--bg-el)] border border-[var(--glass-border-2)] flex items-center justify-center shrink-0 text-[var(--accent)] shadow-[0_0_18px_rgba(32,199,232,0.25)] ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          >
            <Disc className="w-6 h-6 text-[var(--accent)]" />
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--text)] text-sm sm:text-base">
                سورة {currentSurah.name}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-sans hidden sm:inline">
                ({currentSurah.englishName})
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] truncate">
              {currentReciter.arabicName} · {currentSurah.numberOfAyahs} آية
            </p>
          </div>

          {/* 7 Animated Waveform Bars (Marco Sawiris v2.0 Signature) */}
          {isPlaying && (
            <div className="hidden lg:flex items-center audio-bars-container mr-2" title="تلاوة جارية">
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
            </div>
          )}
        </div>

        {/* Ambient indicator badge */}
        {activeAmbient && isAmbientPlaying && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAmbient();
            }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg-3)] border border-[var(--accent)]/40 text-[var(--accent)] text-xs hover:bg-[var(--glass-bg-2)] transition-all shadow-sm"
          >
            <CloudRain className="w-3.5 h-3.5 animate-pulse text-[var(--accent)]" />
            <span>أجواء: {activeAmbient.arabicTitle}</span>
          </button>
        )}

        {/* Playback Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenMushaf();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--glass-bg-3)] hover:bg-[var(--glass-bg-2)] text-[var(--text)] text-xs border border-[var(--glass-border)] transition-colors"
            title="فتح المصحف"
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>المصحف</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSurah();
            }}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/[0.06] rounded-xl transition-colors hidden sm:block"
            title="السورة السابقة"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            disabled={isBuffering}
            className="w-10 h-10 rounded-2xl btn--primary !p-0 flex items-center justify-center transition-transform active:scale-95 shadow-[0_0_20px_rgba(38,122,255,0.4)]"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current text-white" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSurah();
            }}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/[0.06] rounded-xl transition-colors hidden sm:block"
            title="السورة التالية"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onExpand}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/[0.06] rounded-xl transition-colors"
            title="تكبير المشغل"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
