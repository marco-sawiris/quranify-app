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
  VolumeX,
  Disc,
  CloudRain,
  Clock,
  BookOpen,
  Sparkles,
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
    isAmbientPlaying,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[95vh] overflow-y-auto bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-sans">
              المشغل الذكي
            </span>
            <span className="text-stone-500">·</span>
            <span className="text-xs text-stone-400">سورة {currentSurah.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMushaf}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>قراءة السورة</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Spinning Vinyl Art */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Outer golden aura glow */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/10 to-amber-500/30 blur-2xl transition-opacity duration-1000 ${
                isPlaying ? 'opacity-100 scale-105' : 'opacity-40'
              }`}
            />

            {/* Spinning disc */}
            <div
              className={`w-full h-full rounded-full border-4 border-stone-800 bg-stone-950 shadow-2xl flex items-center justify-center relative overflow-hidden ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '20s' }}
            >
              {/* Vinyl concentric groove rings */}
              <div className="absolute inset-4 rounded-full border border-stone-800/60" />
              <div className="absolute inset-8 rounded-full border border-stone-800/40" />
              <div className="absolute inset-14 rounded-full border border-stone-800/30" />

              {/* Center Medallion */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border-2 border-amber-400/80 flex flex-col items-center justify-center shadow-lg text-center p-2 z-10">
                <Disc className="w-6 h-6 text-amber-200" />
                <span className="font-quran text-base text-amber-100 font-bold mt-1">
                  {currentSurah.name}
                </span>
              </div>
            </div>
          </div>

          {/* Surah Title & Reciter Switcher */}
          <div className="text-center mt-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-cairo">
              سورة {currentSurah.name}
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              {currentSurah.englishName} · {currentSurah.revelationType} · {currentSurah.numberOfAyahs} آية
            </p>

            <button
              onClick={() => setShowReciterPicker(!showReciterPicker)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-xs text-amber-400 font-medium transition-colors"
            >
              <span>القارئ: {currentReciter.arabicName}</span>
              <span className="text-stone-500">▼</span>
            </button>
          </div>

          {/* Reciter dropdown list */}
          {showReciterPicker && (
            <div className="w-full mt-3 p-2 bg-stone-800 border border-stone-700 rounded-2xl max-h-48 overflow-y-auto space-y-1">
              {RECITERS.map((r: Reciter) => (
                <button
                  key={r.id}
                  onClick={() => {
                    changeReciter(r);
                    setShowReciterPicker(false);
                  }}
                  className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    r.id === currentReciter.id
                      ? 'bg-amber-500/20 text-amber-400 font-bold'
                      : 'text-stone-300 hover:bg-stone-700/60'
                  }`}
                >
                  <span>{r.arabicName}</span>
                  <span className="text-[10px] text-stone-400 font-sans">{r.subname}</span>
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
            className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex items-center justify-between text-xs font-mono text-stone-400">
            <span>{formatTime(position)}</span>
            <span>{isBuffering ? 'جاري التحميل...' : formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 my-4">
          <button
            onClick={prevSurah}
            className="p-3 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-2xl transition-colors"
            title="السورة السابقة"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={() => seekTo(Math.max(0, position - 10000))}
            className="p-3 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-2xl transition-colors"
            title="إرجاع 10 ثوانٍ"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlayPause}
            disabled={isBuffering}
            className="w-16 h-16 rounded-3xl bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => seekTo(Math.min(duration, position + 10000))}
            className="p-3 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-2xl transition-colors"
            title="تقديم 10 ثوانٍ"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <button
            onClick={nextSurah}
            className="p-3 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-2xl transition-colors"
            title="السورة التالية"
          >
            <SkipBack className="w-5 h-5" />
          </button>
        </div>

        {/* Dual-Audio Engine Sliders */}
        <div className="mt-4 pt-4 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reciter Volume */}
          <div className="p-3 bg-stone-800/40 border border-stone-800 rounded-2xl">
            <div className="flex items-center justify-between text-xs mb-1.5 text-stone-300">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" />
                صوت التلاوة
              </span>
              <span className="font-mono text-amber-400">{Math.round(recitationVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={recitationVolume}
              onChange={(e) => setRecitationVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Ambient Volume & Trigger */}
          <div className="p-3 bg-stone-800/40 border border-stone-800 rounded-2xl">
            <div className="flex items-center justify-between text-xs mb-1.5 text-stone-300">
              <button
                onClick={onOpenAmbientModal}
                className="flex items-center gap-1.5 hover:text-sky-400 transition-colors"
              >
                <CloudRain className="w-4 h-4 text-sky-400" />
                <span>أصوات الطبيعة {activeAmbient ? `(${activeAmbient.arabicTitle})` : ''}</span>
              </button>
              <button
                onClick={onOpenAmbientModal}
                className="text-[10px] text-amber-400 hover:underline"
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
              className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>
        </div>

        {/* Bottom Utility Tools (Sleep Timer) */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-800 text-xs">
          <div className="relative">
            <button
              onClick={() => setShowSleepTimerMenu(!showSleepTimerMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                sleepTimerMinutes
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                {sleepTimerMinutes ? `مؤقت النوم: ${sleepTimerMinutes} د` : 'مؤقت النوم'}
              </span>
            </button>

            {showSleepTimerMenu && (
              <div className="absolute bottom-10 right-0 p-2 bg-stone-850 bg-stone-800 border border-stone-700 rounded-xl shadow-xl flex flex-col gap-1 z-20 w-36">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setSleepTimer(mins);
                      setShowSleepTimerMenu(false);
                    }}
                    className="px-3 py-1.5 text-right text-xs hover:bg-stone-700 rounded-lg text-stone-200"
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
            className="text-stone-400 hover:text-stone-200"
          >
            تصغير المشغل ↓
          </button>
        </div>
      </div>
    </div>
  );
};
