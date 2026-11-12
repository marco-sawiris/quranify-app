import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  BookOpen,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Info,
} from 'lucide-react';
import { SurahMeta, QuranService } from '../services/quranService';
import { SurahData } from '../types';
import { usePlayerStore } from '../store/usePlayerStore';
import { useAppStore } from '../store/useAppStore';

interface Props {
  surah: SurahMeta;
  isOpen: boolean;
  onClose: () => void;
}

export const MushafReaderModal: React.FC<Props> = ({ surah, isOpen, onClose }) => {
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [activeTafseerAyah, setActiveTafseerAyah] = useState<number | null>(null);

  const { fontSize, setFontSize } = useAppStore();
  const { isPlaying, currentSurah, togglePlayPause, playSurah, activeAyaNumber } = usePlayerStore();

  const isCurrentSurahPlaying = isPlaying && currentSurah.number === surah.number;

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    QuranService.getSurahContent(surah.number).then((data) => {
      setSurahData(data);
      setLoading(false);
    });
  }, [surah.number, isOpen]);

  if (!isOpen) return null;

  const versesList: { num: number; text: string }[] = [];
  if (surahData?.verse) {
    Object.entries(surahData.verse).forEach(([key, text]) => {
      const match = key.match(/\d+/);
      const num = match ? parseInt(match[0], 10) : 1;
      versesList.push({ num, text });
    });
    versesList.sort((a, b) => a.num - b.num);
  }

  const handleCopyAyah = (num: number, text: string) => {
    navigator.clipboard.writeText(`${text} ﴿${num}﴾ [سورة ${surah.name}]`);
    setCopiedAyah(num);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-2xl animate-fade-in font-cairo"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-[92vh] flex flex-col rounded-3xl glass-strong text-[var(--text)] relative overflow-hidden border-[var(--glass-border-2)] shadow-[0_20px_60px_rgba(3,7,17,0.95)]"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Top subtle reflection line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent pointer-events-none" />

        {/* Top Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)] bg-[var(--bg-el)]/90 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--glass-bg-3)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-cairo">سورة {surah.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--glass-bg-3)] border border-[var(--glass-border)] text-[var(--accent)] font-sans">
                  {surah.revelationType}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">· {surah.numberOfAyahs} آية</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">المصحف المرتل الشريف</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Play/Listen button */}
            <button
              onClick={() => {
                if (isCurrentSurahPlaying) {
                  togglePlayPause();
                } else {
                  playSurah(surah);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl btn--primary text-xs font-bold transition-all shadow-sm"
            >
              {isCurrentSurahPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current text-white" />
                  <span>إيقاف</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-white" />
                  <span>استماع</span>
                </>
              )}
            </button>

            {/* Font size controls */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-[var(--glass-border)]">
              <button
                onClick={() => setFontSize(Math.max(18, fontSize - 2))}
                className="p-1 hover:text-[var(--accent)] text-[var(--text-secondary)] transition-colors"
                title="تصغير الخط"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-1.5 text-[var(--text)]">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(38, fontSize + 2))}
                className="p-1 hover:text-[var(--accent)] text-[var(--text-secondary)] transition-colors"
                title="تكبير الخط"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reading Canvas */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_var(--accent)]" />
              <p className="text-sm text-[var(--text-secondary)]">جاري تحميل آيات سورة {surah.name}...</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Surah Ornamental Header Box */}
              <div className="text-center py-6 px-4 rounded-3xl border border-[var(--glass-border-2)] bg-gradient-to-b from-[var(--glass-bg-3)] to-transparent relative overflow-hidden shadow-lg">
                <div className="text-xs uppercase tracking-widest text-[var(--accent)] mb-1 font-sans font-bold">
                  الجزء {Math.ceil(surah.number / 4)} · سورة {surah.name} ({surah.englishName})
                </div>
                <h1 className="text-3xl font-extrabold font-quran text-[var(--text)] my-1">
                  سُورَةُ {surah.name}
                </h1>
                <div className="text-xs text-[var(--text-secondary)]">
                  {surah.revelationType === 'مكية' ? 'نزلت بمكة المكرمة' : 'نزلت بالمدينة المنورة'} · آياتها {surah.numberOfAyahs}
                </div>
              </div>

              {/* Bismillah (except for Surah At-Tawbah 9) */}
              {surah.number !== 9 && (
                <div className="text-center py-4">
                  <div
                    className="font-quran text-2xl sm:text-3xl font-medium tracking-wide text-[var(--accent)] drop-shadow-[0_0_15px_rgba(32,199,232,0.3)]"
                    style={{ fontSize: `${fontSize + 4}px` }}
                  >
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </div>
                </div>
              )}

              {/* Continuous Flow of Ayahs with Ornamental Numbers */}
              <div
                className="font-quran leading-loose text-justify space-y-4 text-[var(--text)]"
                style={{ fontSize: `${fontSize}px`, lineHeight: 2.3 }}
              >
                {versesList.map((v) => {
                  const isAyahActive =
                    isCurrentSurahPlaying && activeAyaNumber === v.num;
                  return (
                    <span
                      key={v.num}
                      className={`inline transition-all rounded-xl px-1.5 py-0.5 cursor-pointer hover:bg-[var(--glass-bg-3)] ${
                        isAyahActive
                          ? 'bg-[var(--accent)]/20 ring-1 ring-[var(--accent)] shadow-[0_0_16px_rgba(32,199,232,0.3)]'
                          : ''
                      }`}
                      onClick={() => setActiveTafseerAyah(activeTafseerAyah === v.num ? null : v.num)}
                      title={`آية ${v.num} - انقر لعرض التفسير والخيارات`}
                    >
                      <span className="text-inherit">{v.text}</span>
                      <span className="ayah-end-marker mx-2 inline-flex items-center justify-center font-bold select-none text-base">
                        ﴿{v.num}﴾
                      </span>
                    </span>
                  );
                })}
              </div>

              {/* Ayah Details / Tafseer drawer if clicked */}
              {activeTafseerAyah && (
                <div className="sticky bottom-4 my-6 p-5 rounded-2xl bg-[var(--bg-el)]/95 backdrop-blur-2xl border border-[var(--glass-border-2)] text-[var(--text)] shadow-2xl animate-slide-up">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border)]">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-[var(--accent)]" />
                      <span className="font-bold text-sm font-cairo">
                        خيارات الآية ({activeTafseerAyah}) من سورة {surah.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTafseerAyah(null)}
                      className="p-1 rounded-lg hover:bg-white/[0.08] text-[var(--text-muted)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-3 text-sm leading-relaxed text-[var(--text-secondary)] font-cairo">
                    <p className="font-quran text-lg text-[var(--text)] mb-2">
                      {versesList.find((v) => v.num === activeTafseerAyah)?.text}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] bg-white/[0.03] p-3 rounded-xl border border-[var(--glass-border)]">
                      <strong className="text-[var(--accent)]">التفسير الميسر:</strong> آية مباركة تذكر عظمة الله وتدعو إلى التدبر والعمل الصالح والتسليم لأمر الله ورسوله، والتوكل عليه في سائر الأمور.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        const target = versesList.find((v) => v.num === activeTafseerAyah);
                        if (target) handleCopyAyah(target.num, target.text);
                      }}
                      className="btn--glass !py-1.5 text-xs"
                    >
                      {copiedAyah === activeTafseerAyah ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
                          <span className="text-[var(--accent)]">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الآية</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
