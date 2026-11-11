import React, { useState } from 'react';
import { RotateCcw, Sparkles, BookOpen, Check } from 'lucide-react';

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
    text: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ...',
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
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // ignore
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Switcher Tab */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-900 border border-stone-800 rounded-2xl max-w-sm mx-auto">
        <button
          onClick={() => setActiveTab('masbaha')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'masbaha'
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          السبحة الإلكترونية
        </button>
        <button
          onClick={() => setActiveTab('azkar')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'azkar'
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          الأذكار اليومية
        </button>
      </div>

      {activeTab === 'masbaha' ? (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Dhikr Pills Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DHIKR_LIST.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDhikr(d);
                  setCount(0);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedDhikr.id === d.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-md'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {d.arabic}
              </button>
            ))}
          </div>

          {/* Central Tasbeeh Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-stone-400">
              <span className="font-mono text-amber-400">{totalToday}</span>
              <span>تسبيحة اليوم</span>
            </div>

            <button
              onClick={handleReset}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-300 rounded-xl hover:bg-stone-800 transition-colors"
              title="إعادة التصفير"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="my-6">
              <span className="text-xs uppercase tracking-widest text-amber-500 font-sans">
                الذكر المختار
              </span>
              <h2 className="text-3xl font-extrabold font-quran text-stone-100 my-2">
                {selectedDhikr.arabic}
              </h2>
              <p className="text-xs text-stone-400 font-cairo">{selectedDhikr.meaning}</p>
            </div>

            {/* Click Counter Button */}
            <button
              onClick={handleIncrement}
              className="w-44 h-44 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-2xl shadow-amber-500/30 flex flex-col items-center justify-center transition-transform active:scale-95 select-none"
            >
              <span className="font-mono text-5xl font-black">{count}</span>
              <span className="text-xs font-bold mt-1 text-stone-900">
                الهدف: {selectedDhikr.target}
              </span>
            </button>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-stone-400">
              <span>انقر في أي مكان داخل الدائرة للتسبيح</span>
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
                className="p-5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-amber-400 text-base">{zekr.title}</h3>
                  <button
                    onClick={() =>
                      setCompletedAzkar((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                      isDone
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تمت القراءة</span>
                      </>
                    ) : (
                      <span>قراءة ({zekr.count} مرات)</span>
                    )}
                  </button>
                </div>
                <p className="font-quran text-lg leading-relaxed text-stone-200">{zekr.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
