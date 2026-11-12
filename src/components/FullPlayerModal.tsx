import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Volume2,
  Disc,
  CloudRain,
  Clock,
  BookOpen,
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { RECITERS } from '../constants/reciters';
import { Reciter } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenMushaf: () => void;
  onOpenAmbientModal: () => void;
}

function formatTime(millis: number): string {
  if (!millis || isNaN(millis)) return '00:00';
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const FullPlayerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenMushaf,
  onOpenAmbientModal,
}) => {
  const {
    currentSurah,
    currentReciter,
    isPlaying,
    isBuffering,
    position,
    duration,
    recitationVolume,
    ambientVolume,
    activeAmbient,
    sleepTimerMinutes,
    togglePlayPause,
    seekTo,
    setRecitationVolume,
    setAmbientVolume,
    changeReciter,
    nextSurah,
    prevSurah,
    setSleepTimer,
  } = usePlayerStore();

  const [showReciterPicker, setShowReciterPicker] = useState(false);
  const [showSleepTimerMenu, setShowSleepTimerMenu] = useState(false);

  if (!isOpen) return null;

  const progress = duration > 0 ? Math.min(1, Math.max(0, position / duration)) : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo(val * duration);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in font-cairo"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[95vh] overflow-y-auto glass-strong rounded-3xl p-6 sm:p-8 text-[var(--text)] relative flex flex-col border-[var(--glass-border-2)] shadow-[0_20px_60px_rgba(3,7,17,0.9)]"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Top subtle reflection line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-sans font-bold">
              المشغل الذكي
            </span>
            <span className="opacity-30">·</span>
            <span className="text-xs text-[var(--text-secondary)]">سورة {currentSurah.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMushaf}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[var(--glass-bg-3)] hover:bg-[var(--glass-bg-2)] text-[var(--accent)] border border-[var(--glass-border-2)] shadow-sm transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>قراءة السورة</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.06] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Spinning Vinyl Art with Cyan & Royal Blue Glow */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Outer aura glow */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--royal)]/30 via-[var(--primary)]/20 to-[var(--accent)]/35 blur-3xl transition-opacity duration-1000 ${
                isPlaying ? 'opacity-100 scale-110' : 'opacity-30'
              }`}
            />

            {/* Spinning disc */}
            <div
              className={`w-full h-full rounded-full border border-[var(--glass-border-2)] bg-[var(--bg-el)] shadow-2xl flex items-center justify-center relative overflow-hidden ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
            >
              {/* Vinyl concentric groove rings */}
              <div className="absolute inset-4 rounded-full border border-white/[0.06]" />
              <div className="absolute inset-8 rounded-full border border-white/[0.04]" />
              <div className="absolute inset-14 rounded-full border border-white/[0.03]" />

              {/* Center Medallion */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--navy)] via-[var(--bg)] to-[var(--midnight)] border-2 border-[var(--accent)]/70 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(32,199,232,0.35)] text-center p-2 z-10">
                <Disc className="w-6 h-6 text-[var(--accent)]" />
                <span className="font-quran text-base text-[var(--text)] font-bold mt-1">
                  {currentSurah.name}
                </span>
              </div>
            </div>
          </div>

          {/* 7 Animated Waveform Bars in Full Player */}
          {isPlaying && (
            <div className="mt-5 flex items-center audio-bars-container">
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
            </div>
          )}

          {/* Surah Title & Reciter Switcher */}
          <div className="text-center mt-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-cairo">
              سورة {currentSurah.name}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {currentSurah.englishName} · {currentSurah.revelationType} · {currentSurah.numberOfAyahs} آية
            </p>

            <button
              onClick={() => setShowReciterPicker(!showReciterPicker)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--glass-bg-3)] hover:bg-[var(--glass-bg-2)] border border-[var(--glass-border)] text-xs text-[var(--accent)] font-medium transition-colors shadow-sm"
            >
              <span>القارئ: {currentReciter.arabicName}</span>
              <span className="text-[var(--text-muted)] text-[10px]">▼</span>
            </button>
          </div>

          {/* Reciter dropdown list */}
          {showReciterPicker && (
            <div className="w-full mt-3 p-2 bg-[var(--bg-el)]/95 backdrop-blur-2xl border border-[var(--glass-border-2)] rounded-2xl max-h-48 overflow-y-auto space-y-1 shadow-2xl">
              {RECITERS.map((r: Reciter) => (
                <button
                  key={r.id}
                  onClick={() => {
                    changeReciter(r);
                    setShowReciterPicker(false);
                  }}
                  className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    r.id === currentReciter.id
                      ? 'bg-[var(--glass-bg-3)] text-[var(--accent)] font-bold border border-[var(--glass-border)]'
                      : 'text-[var(--text-secondary)] hover:bg-white/[0.05] hover:text-[var(--text)]'
                  }`}
                >
                  <span>{r.arabicName}</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-sans">{r.subname}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time Scrubber */}
        <div className="space-y-1.5 my-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
          />
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
            <span>{formatTime(position)}</span>
            <span>{isBuffering ? 'جاري التحميل...' : formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 my-4">
          <button
            onClick={prevSurah}
            className="p-3 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/[0.06] rounded-2xl transition-colors"
            title="السورة السابقة"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={() => seekTo(Math.max(0, position - 10000))}
            className="p-3 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/[0.06] rounded-2xl transition-colors"
            title="إرجاع 10 ثوانٍ"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlayPause}
            disabled={isBuffering}
            className="w-16 h-16 rounded-3xl btn--primary flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current text-white" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-0.5 text-white" />
            )}
          </button>

          <button
            onClick={() => seekTo(Math.min(duration, position + 10000))}
            className="p-3 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/[0.06] rounded-2xl transition-colors"
            title="تقديم 10 ثوانٍ"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <button
            onClick={nextSurah}
            className="p-3 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/[0.06] rounded-2xl transition-colors"
            title="السورة التالية"
          >
            <SkipBack className="w-5 h-5" />
          </button>
        </div>

        {/* Dual-Audio Engine Sliders */}
        <div className="mt-4 pt-4 border-t border-[var(--glass-border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reciter Volume */}
          <div className="p-3.5 bg-white/[0.02] border border-[var(--glass-border)] rounded-2xl">
            <div className="flex items-center justify-between text-xs mb-2 text-[var(--text)]">
              <span className="flex items-center gap-1.5 font-medium">
                <Volume2 className="w-4 h-4 text-[var(--accent)]" />
                صوت التلاوة
              </span>
              <span className="font-mono text-[var(--accent)] font-bold">{Math.round(recitationVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={recitationVolume}
              onChange={(e) => setRecitationVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
          </div>

          {/* Ambient Volume & Trigger */}
          <div className="p-3.5 bg-white/[0.02] border border-[var(--glass-border)] rounded-2xl">
            <div className="flex items-center justify-between text-xs mb-2 text-[var(--text)]">
              <button
                onClick={onOpenAmbientModal}
                className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors font-medium"
              >
                <CloudRain className="w-4 h-4 text-[var(--accent)]" />
                <span>أصوات الطبيعة {activeAmbient ? `(${activeAmbient.arabicTitle})` : ''}</span>
              </button>
              <button
                onClick={onOpenAmbientModal}
                className="text-[10px] text-[var(--accent)] hover:underline"
              >
                تغيير
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
          </div>
        </div>

        {/* Bottom Utility Tools (Sleep Timer) */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--glass-border)] text-xs">
          <div className="relative">
            <button
              onClick={() => setShowSleepTimerMenu(!showSleepTimerMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                sleepTimerMinutes
                  ? 'bg-[var(--glass-bg-3)] border-[var(--accent)] text-[var(--accent)]'
                  : 'bg-white/[0.03] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                {sleepTimerMinutes ? `مؤقت النوم: ${sleepTimerMinutes} د` : 'مؤقت النوم'}
              </span>
            </button>

            {showSleepTimerMenu && (
              <div className="absolute bottom-10 right-0 p-2 bg-[var(--bg-el)] border border-[var(--glass-border-2)] rounded-xl shadow-2xl flex flex-col gap-1 z-30 w-36">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setSleepTimer(mins);
                      setShowSleepTimerMenu(false);
                    }}
                    className="px-3 py-1.5 text-right text-xs hover:bg-white/[0.06] rounded-lg text-[var(--text)]"
                  >
                    {mins} دقيقة
                  </button>
                ))}
                {sleepTimerMinutes && (
                  <button
                    onClick={() => {
                      setSleepTimer(null);
                      setShowSleepTimerMenu(false);
                    }}
                    className="px-3 py-1.5 text-right text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    إلغاء المؤقت
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
          >
            تصغير المشغل ↓
          </button>
        </div>
      </div>
    </div>
  );
};
