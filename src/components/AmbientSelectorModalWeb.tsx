import React from 'react';
import {
  CloudRain,
  Flame,
  Waves,
  Sun,
  Wind,
  Droplet,
  Heart,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from 'lucide-react';
import { AMBIENT_SOUNDS } from '../constants/ambientSounds';
import { AmbientSound } from '../types';
import { usePlayerStore } from '../store/usePlayerStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  'cloud-rain': <CloudRain className="w-6 h-6 text-sky-400" />,
  flame: <Flame className="w-6 h-6 text-amber-500" />,
  waves: <Waves className="w-6 h-6 text-teal-400" />,
  sun: <Sun className="w-6 h-6 text-yellow-400" />,
  wind: <Wind className="w-6 h-6 text-indigo-300" />,
  droplet: <Droplet className="w-6 h-6 text-cyan-400" />,
  heart: <Heart className="w-6 h-6 text-rose-400" />,
};

export const AmbientSelectorModalWeb: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    activeAmbient,
    ambientVolume,
    isAmbientPlaying,
    toggleAmbient,
    setAmbientVolume,
    stopAmbient,
  } = usePlayerStore();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl text-stone-100 relative"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100">محرك الأجواء الصوتية المزدوج</h2>
              <p className="text-xs text-stone-400">استمع لأصوات الطبيعة الهادئة في الخلفية أثناء التلاوة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Volume Slider if active */}
        {activeAmbient && isAmbientPlaying && (
          <div className="my-5 p-4 bg-stone-800/60 border border-stone-700/50 rounded-2xl">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-stone-300 font-medium flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                مستوى صوت الأجواء: {activeAmbient.arabicTitle}
              </span>
              <span className="font-mono text-emerald-400">{Math.round(ambientVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        )}

        {/* Sounds Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 max-h-[380px] overflow-y-auto pr-1">
          {AMBIENT_SOUNDS.map((sound: AmbientSound) => {
            const isActive = activeAmbient?.id === sound.id && isAmbientPlaying;
            return (
              <button
                key={sound.id}
                onClick={() => toggleAmbient(sound)}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all text-center border ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500/80 shadow-lg shadow-amber-500/10'
                    : 'bg-stone-800/40 border-stone-800 hover:bg-stone-800/90 hover:border-stone-700'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl transition-transform ${
                    isActive ? 'scale-110 bg-amber-500/30' : 'bg-stone-800'
                  }`}
                >
                  {ICONS_MAP[sound.icon] || <CloudRain className="w-6 h-6 text-sky-400" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-100">{sound.arabicTitle}</div>
                  <div className="text-[11px] text-stone-400">{sound.title}</div>
                </div>
                {isActive && (
                  <span className="text-[10px] text-amber-400 font-medium">نشط الآن</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-800">
          {activeAmbient && isAmbientPlaying ? (
            <button
              onClick={stopAmbient}
              className="px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 transition-colors"
            >
              <VolumeX className="w-4 h-4" />
              إيقاف المؤثر الصوتي
            </button>
          ) : (
            <span className="text-xs text-stone-500">اختر صوتاً لتفعيله مع التلاوة</span>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};
