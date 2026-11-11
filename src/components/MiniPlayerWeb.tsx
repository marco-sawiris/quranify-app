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
      className="fixed bottom-0 inset-x-0 z-40 bg-stone-900/95 border-t border-stone-800 backdrop-blur-xl shadow-2xl cursor-pointer transition-transform hover:bg-stone-900"
      dir="rtl"
    >
      {/* Top progress hairline bar */}
      <div className="w-full h-1 bg-stone-800">
        <div
          className="h-full bg-gradient-to-l from-amber-500 to-amber-400 transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Track & Reciter Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center shrink-0 text-amber-500 shadow-md ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '8s' }}
          >
            <Disc className="w-6 h-6" />
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-100 text-sm sm:text-base font-cairo">
                سورة {currentSurah.name}
              </span>
              <span className="text-xs text-stone-400 font-sans hidden sm:inline">
                ({currentSurah.englishName})
              </span>
            </div>
            <p className="text-xs text-stone-400 truncate">
              {currentReciter.arabicName} · {currentSurah.numberOfAyahs} آية
            </p>
          </div>
        </div>

        {/* Ambient indicator badge */}
        {activeAmbient && isAmbientPlaying && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAmbient();
            }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs hover:bg-sky-500/20 transition-colors"
          >
            <CloudRain className="w-3.5 h-3.5 animate-pulse" />
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
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs border border-stone-700 transition-colors"
            title="فتح المصحف"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>المصحف</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSurah();
            }}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors hidden sm:block"
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
            className="w-10 h-10 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-md transition-transform active:scale-95"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSurah();
            }}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors hidden sm:block"
            title="السورة التالية"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onExpand}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors"
            title="تكبير المشغل"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
