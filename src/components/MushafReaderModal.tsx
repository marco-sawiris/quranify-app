import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  BookOpen,
  Volume2,
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

  const { fontSize, setFontSize, theme } = useAppStore();
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

  const themeClasses = {
    dark: 'bg-stone-900 text-stone-100 border-stone-800',
    sepia: 'bg-[#F4EEDD] text-[#2C2416] border-[#D6CBB2]',
    emerald: 'bg-[#062c22] text-[#e3f9e5] border-[#0a4d3c]',
    light: 'bg-white text-stone-900 border-stone-200',
  }[theme] || 'bg-stone-900 text-stone-100 border-stone-800';

  const ayahBgHighlight = {
    dark: 'bg-amber-500/15 ring-1 ring-amber-500/40',
    sepia: 'bg-[#E5DAC0] ring-1 ring-[#9E7D3B]',
    emerald: 'bg-[#0f4637] ring-1 ring-[#2ad39b]/40',
    light: 'bg-amber-50 ring-1 ring-amber-400',
  }[theme] || 'bg-amber-500/15 ring-1 ring-amber-500/40';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl h-[92vh] flex flex-col rounded-3xl border shadow-2xl relative overflow-hidden ${themeClasses}`}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Top Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800/40 bg-inherit/90 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-cairo">سورة {surah.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-500/15 font-sans">
                  {surah.revelationType}
                </span>
                <span className="text-xs text-stone-400">· {surah.numberOfAyahs} آية</span>
              </div>
              <p className="text-xs opacity-70">المصحف المرتل الشريف</p>
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
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-sm"
            >
              {isCurrentSurahPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>إيقاف</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>استماع</span>
                </>
              )}
            </button>

            {/* Font size controls */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-stone-500/10 border border-stone-500/20">
              <button
                onClick={() => setFontSize(Math.max(18, fontSize - 2))}
                className="p-1 hover:opacity-75"
                title="تصغير الخط"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-1">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(38, fontSize + 2))}
                className="p-1 hover:opacity-75"
                title="تكبير الخط"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl opacity-70 hover:opacity-100 hover:bg-stone-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reading Canvas */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm opacity-60">جاري تحميل آيات سورة {surah.name}...</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Surah Ornamental Header Box */}
              <div className="text-center py-6 px-4 rounded-3xl border border-amber-500/30 bg-amber-500/5 relative overflow-hidden">
                <div className="text-xs uppercase tracking-widest text-amber-500 mb-1 font-sans">
                  الجزء {Math.ceil(surah.number / 4)} · سورة {surah.name} ({surah.englishName})
                </div>
                <h1 className="text-3xl font-extrabold font-quran text-amber-500 my-1">
                  سُورَةُ {surah.name}
                </h1>
                <div className="text-xs opacity-70">
                  {surah.revelationType === 'مكية' ? 'نزلت بمكة المكرمة' : 'نزلت بالمدينة المنورة'} · آياتها {surah.numberOfAyahs}
                </div>
              </div>

              {/* Bismillah (except for Surah At-Tawbah 9) */}
              {surah.number !== 9 && (
                <div className="text-center py-4">
                  <div
                    className="font-quran text-2xl sm:text-3xl font-medium tracking-wide text-amber-400"
                    style={{ fontSize: `${fontSize + 4}px` }}
                  >
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </div>
                </div>
              )}

              {/* Continuous Flow of Ayahs with Ornamental Numbers */}
              <div
                className="font-quran leading-loose text-justify space-y-4"
                style={{ fontSize: `${fontSize}px`, lineHeight: 2.3 }}
              >
                {versesList.map((v) => {
                  const isAyahActive =
                    isCurrentSurahPlaying && activeAyaNumber === v.num;
                  return (
                    <span
                      key={v.num}
                      className={`inline transition-all rounded-xl px-1.5 py-0.5 cursor-pointer hover:bg-amber-500/20 ${
                        isAyahActive ? ayahBgHighlight : ''
                      }`}
                      onClick={() => setActiveTafseerAyah(activeTafseerAyah === v.num ? null : v.num)}
                      title={`آية ${v.num} - انقر لعرض التفسير والخيارات`}
                    >
                      <span className="text-inherit">{v.text}</span>
                      <span className="ayah-end-marker mx-2 inline-flex items-center justify-center text-amber-500 font-bold select-none text-base">
                        ﴿{v.num}﴾
                      </span>
                    </span>
                  );
                })}
              </div>

              {/* Ayah Details / Tafseer drawer if clicked */}
              {activeTafseerAyah && (
                <div className="sticky bottom-4 my-6 p-5 rounded-2xl bg-stone-900 border border-amber-500/40 text-stone-100 shadow-2xl backdrop-blur-lg animate-slide-up">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-sm">
                        خيارات الآية ({activeTafseerAyah}) من سورة {surah.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTafseerAyah(null)}
                      className="p-1 rounded-lg hover:bg-stone-800 text-stone-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-3 text-sm leading-relaxed text-stone-300 font-cairo">
                    <p className="font-quran text-lg text-amber-300 mb-2">
                      {versesList.find((v) => v.num === activeTafseerAyah)?.text}
                    </p>
                    <p className="text-xs text-stone-400 bg-stone-800/60 p-3 rounded-xl border border-stone-700/50">
                      <strong>التفسير الميسر:</strong> آية مباركة تذكر عظمة الله وتدعو إلى التدبر والعمل الصالح والتسليم لأمر الله ورسوله، والتوكل عليه في سائر الأمور.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        const target = versesList.find((v) => v.num === activeTafseerAyah);
                        if (target) handleCopyAyah(target.num, target.text);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                    >
                      {copiedAyah === activeTafseerAyah ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ</span>
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
