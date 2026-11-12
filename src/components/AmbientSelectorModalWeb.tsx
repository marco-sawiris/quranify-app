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
  'cloud-rain': <CloudRain className="w-6 h-6 text-[var(--accent)]" />,
  flame: <Flame className="w-6 h-6 text-sky-300" />,
  waves: <Waves className="w-6 h-6 text-[var(--accent)]" />,
  sun: <Sun className="w-6 h-6 text-sky-200" />,
  wind: <Wind className="w-6 h-6 text-[var(--primary)]" />,
  droplet: <Droplet className="w-6 h-6 text-[var(--accent)]" />,
  heart: <Heart className="w-6 h-6 text-[var(--violet)]" />,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in font-cairo"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg glass-strong rounded-3xl p-6 shadow-2xl text-[var(--text)] relative border-[var(--glass-border-2)]"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Top subtle reflection line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--glass-bg-3)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)] font-cairo">محرك الأجواء الصوتية المزدوج</h2>
              <p className="text-xs text-[var(--text-secondary)]">استمع لأصوات الطبيعة الهادئة في الخلفية أثناء التلاوة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.06] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Volume Slider if active */}
        {activeAmbient && isAmbientPlaying && (
          <div className="my-5 p-4 bg-white/[0.02] border border-[var(--glass-border)] rounded-2xl shadow-inner">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[var(--text)] font-medium flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[var(--accent)]" />
                مستوى صوت الأجواء: {activeAmbient.arabicTitle}
              </span>
              <span className="font-mono text-[var(--accent)] font-bold">{Math.round(ambientVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
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
                    ? 'bg-gradient-to-b from-[var(--primary)]/20 to-[var(--primary)]/08 border-[var(--accent)] shadow-[0_0_24px_rgba(32,199,232,0.25)]'
                    : 'bg-white/[0.02] border-[var(--glass-border)] hover:bg-[var(--glass-bg-3)]'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl transition-transform ${
                    isActive ? 'scale-110 bg-[var(--glass-bg-3)] shadow-[0_0_15px_var(--accent)]' : 'bg-white/[0.04]'
                  }`}
                >
                  {ICONS_MAP[sound.icon] || <CloudRain className="w-6 h-6 text-[var(--accent)]" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">{sound.arabicTitle}</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">{sound.title}</div>
                </div>
                {isActive && (
                  <span className="text-[10px] text-[var(--accent)] font-bold px-2 py-0.5 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30">
                    نشط الآن
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
          {activeAmbient && isAmbientPlaying ? (
            <button
              onClick={stopAmbient}
              className="px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 transition-colors"
            >
              <VolumeX className="w-4 h-4" />
              إيقاف المؤثر الصوتي
            </button>
          ) : (
            <span className="text-xs text-[var(--text-muted)]">اختر صوتاً لتفعيله مع التلاوة</span>
          )}
          <button
            onClick={onClose}
            className="btn--primary !text-xs !py-2 font-bold transition-all"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};
