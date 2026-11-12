import React, { useState } from 'react';
import { RotateCcw, Check, Sparkles } from 'lucide-react';

interface DhikrItem {
  id: string;
  arabic: string;
  meaning: string;
  target: number;
}

const DHIKR_LIST: DhikrItem[] = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ ٱللَّهِ', meaning: 'سبحان الله وبحمده', target: 33 },
  { id: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّهِ', meaning: 'الحمد لله رب العالمين', target: 33 },
  { id: 'allahuakbar', arabic: 'ٱللَّهُ أَكْبَرُ', meaning: 'الله أكبر كبيراً', target: 34 },
  { id: 'istighfar', arabic: 'أَسْتَغْفِرُ ٱللَّهَ', meaning: 'أستغفر الله العظيم وأتوب إليه', target: 100 },
  { id: 'tahlil', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّهُ', meaning: 'لا إله إلا الله وحده لا شريك له', target: 100 },
  { id: 'salawat', arabic: 'ٱللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', meaning: 'اللهم صل وسلم على نبينا محمد', target: 100 },
];

const DAILY_AZKAR = [
  {
    title: 'آية الكرسي',
    text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...',
    count: 1,
  },
  {
    title: 'سيد الاستغفار',
    text: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عهدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ...',
    count: 1,
  },
  {
    title: 'دعاء الصباح والمساء',
    text: 'أَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ...',
    count: 1,
  },
  {
    title: 'الاستعاذة من الهم والحزن',
    text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ.',
    count: 3,
  },
];

export const DhikrCounter: React.FC = () => {
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrItem>(DHIKR_LIST[0]);
  const [count, setCount] = useState(0);
  const [totalToday, setTotalToday] = useState(128);
  const [activeTab, setActiveTab] = useState<'masbaha' | 'azkar'>('masbaha');
  const [completedAzkar, setCompletedAzkar] = useState<Record<number, boolean>>({});

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
    setTotalToday((prev) => prev + 1);

    // Audio click feedback via Web Audio API synth
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext not supported
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Switcher Tab */}
      <div className="segmented-clay max-w-sm mx-auto flex items-center">
        <button
          onClick={() => setActiveTab('masbaha')}
          className={`flex-1 segmented-clay-btn ${activeTab === 'masbaha' ? 'active' : ''}`}
        >
          السبحة الإلكترونية
        </button>
        <button
          onClick={() => setActiveTab('azkar')}
          className={`flex-1 segmented-clay-btn ${activeTab === 'azkar' ? 'active' : ''}`}
        >
          الأذكار اليومية
        </button>
      </div>

      {activeTab === 'masbaha' ? (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Dhikr Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {DHIKR_LIST.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDhikr(d);
                  setCount(0);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedDhikr.id === d.id
                    ? 'bg-[var(--glass-bg-3)] border-[var(--accent)] text-[var(--accent)] shadow-[0_0_20px_rgba(32,199,232,0.25)]'
                    : 'bg-white/[0.03] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
              >
                {d.arabic}
              </button>
            ))}
          </div>

          {/* Central Tasbeeh Card */}
          <div className="liquid-glass-card rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden border-[var(--glass-border-2)]">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="font-mono text-[var(--accent)] font-bold">{totalToday}</span>
              <span>تسبيحة اليوم</span>
            </div>

            <button
              onClick={handleReset}
              className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text)] rounded-xl hover:bg-white/[0.06] transition-colors"
              title="إعادة التصفير"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="my-6">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-sans font-bold flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                الذكر المختار
              </span>
              <h2 className="text-3xl font-extrabold font-quran text-[var(--text)] my-2">
                {selectedDhikr.arabic}
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">{selectedDhikr.meaning}</p>
            </div>

            {/* Click Counter Button with Liquid Glass Lens Glow */}
            <button
              onClick={handleIncrement}
              className="w-44 h-44 mx-auto rounded-full bg-gradient-to-tr from-[var(--royal)] via-[var(--primary)] to-[var(--accent)] text-white shadow-[0_0_50px_rgba(32,199,232,0.45)] border-2 border-white/50 flex flex-col items-center justify-center transition-transform active:scale-95 select-none cursor-pointer"
            >
              <span className="font-mono text-5xl font-black">{count}</span>
              <span className="text-xs font-bold mt-1 text-white/90">
                الهدف: {selectedDhikr.target}
              </span>
            </button>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
              <span>انقر داخل الدائرة للتسبيح مع نقرة صوتية ذكية</span>
            </div>
          </div>
        </div>
      ) : (
        /* Daily Azkar List */
        <div className="max-w-2xl mx-auto space-y-4">
          {DAILY_AZKAR.map((zekr, idx) => {
            const isDone = completedAzkar[idx];
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl liquid-glass-card text-[var(--text)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[var(--accent)] text-base">{zekr.title}</h3>
                  <button
                    onClick={() =>
                      setCompletedAzkar((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                      isDone
                        ? 'bg-[var(--glass-bg-3)] border-[var(--accent)] text-[var(--accent)] shadow-[0_0_12px_rgba(32,199,232,0.25)]'
                        : 'bg-white/[0.03] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text)]'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>تمت القراءة</span>
                      </>
                    ) : (
                      <span>قراءة ({zekr.count} مرات)</span>
                    )}
                  </button>
                </div>
                <p className="font-quran text-lg leading-relaxed text-[var(--text)]">{zekr.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
