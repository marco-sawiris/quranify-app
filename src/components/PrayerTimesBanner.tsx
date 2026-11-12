import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  PrayerService,
  PrayerData,
  CITIES_LIST,
  CityOption,
  NextPrayerInfo,
  PrayerTimings,
} from '../services/prayerService';

export const PrayerTimesBanner: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityOption>(CITIES_LIST[0]);
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);

  useEffect(() => {
    let isMounted = true;
    PrayerService.getPrayerTimes(selectedCity).then((data) => {
      if (isMounted) {
        setPrayerData(data);
        setNextPrayer(PrayerService.calculateNextPrayer(data.timings));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  // Live timer tick every second for real-time countdown
  useEffect(() => {
    if (!prayerData) return;

    const interval = window.setInterval(() => {
      setNextPrayer(PrayerService.calculateNextPrayer(prayerData.timings));
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerData]);

  if (!prayerData) return null;

  const prayersList: {
    key: keyof PrayerTimings;
    name: string;
    icon: React.ReactNode;
  }[] = [
    { key: 'Fajr', name: 'الفجر', icon: <Moon className="w-4 h-4 text-[var(--accent)]" /> },
    { key: 'Sunrise', name: 'الشروق', icon: <Sunrise className="w-4 h-4 text-sky-300" /> },
    { key: 'Dhuhr', name: 'الظهر', icon: <Sun className="w-4 h-4 text-[var(--accent)]" /> },
    { key: 'Asr', name: 'العصر', icon: <Sun className="w-4 h-4 text-[var(--primary)]" /> },
    { key: 'Maghrib', name: 'المغرب', icon: <Sunset className="w-4 h-4 text-[var(--violet)]" /> },
    { key: 'Isha', name: 'العشاء', icon: <Moon className="w-4 h-4 text-[var(--royal)]" /> },
  ];

  return (
    <div
      className="liquid-glass-card rounded-3xl p-5 sm:p-6 text-[var(--text)] relative overflow-hidden font-cairo"
      dir="rtl"
    >
      {/* Top subtle liquid reflection line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent pointer-events-none" />

      {/* Top Row: Location & Next Prayer Highlight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--glass-border)]">
        {/* City and Hijri Date */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[var(--glass-bg-3)] hover:bg-[var(--glass-bg-2)] border border-[var(--glass-border)] text-xs font-semibold text-[var(--text)] shadow-sm transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>{selectedCity.arabicName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </button>

            {/* City dropdown */}
            {showCityPicker && (
              <div className="absolute top-10 right-0 z-40 w-52 p-2 bg-[var(--bg-el)]/95 backdrop-blur-2xl border border-[var(--glass-border-2)] rounded-2xl shadow-2xl max-h-56 overflow-y-auto space-y-1">
                {CITIES_LIST.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city);
                      setShowCityPicker(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      city.id === selectedCity.id
                        ? 'bg-[var(--glass-bg-3)] text-[var(--accent)] font-bold border border-[var(--glass-border)]'
                        : 'text-[var(--text-secondary)] hover:bg-white/[0.06] hover:text-[var(--text)]'
                    }`}
                  >
                    <span>{city.arabicName}</span>
                    <span className="text-[10px] opacity-70 font-sans">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>
              {prayerData.hijri.weekday ? `${prayerData.hijri.weekday}، ` : ''}
              {prayerData.hijri.day} {prayerData.hijri.monthNameAr} {prayerData.hijri.year} هـ
            </span>
          </div>
        </div>

        {/* Next Prayer Countdown Callout */}
        {nextPrayer && (
          <div className="flex items-center gap-3 bg-[var(--glass-bg-3)] border border-[var(--glass-border-2)] px-4 py-2 rounded-2xl shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] animate-pulse" />
            <div className="text-xs">
              <span className="text-[var(--text-muted)]">الصلاة القادمة: </span>
              <span className="font-bold text-[var(--text)] font-cairo">
                صلاة {nextPrayer.name}
              </span>
              <span className="mx-1.5 opacity-30">·</span>
              <span className="font-mono text-[var(--accent)] font-bold">
                {nextPrayer.time12}
              </span>
            </div>
            <div className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-[var(--accent)]/20 text-[var(--accent)] font-bold border border-[var(--accent)]/30">
              المتبقي: {nextPrayer.remainingText}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row: 6 Prayer Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3 mt-4">
        {prayersList.map((p) => {
          const rawTime = prayerData.timings[p.key];
          const timeFormatted = PrayerService.formatTo12Hour(rawTime);
          const isNext = nextPrayer?.englishKey === p.key;

          return (
            <div
              key={p.key}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                isNext
                  ? 'bg-gradient-to-b from-[var(--primary)]/20 to-[var(--primary)]/05 border border-[var(--accent)]/60 shadow-[0_0_24px_rgba(32,199,232,0.2)] scale-[1.02]'
                  : 'bg-white/[0.02] border border-[var(--glass-border)] hover:bg-[var(--glass-bg-3)]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                {p.icon}
                <span
                  className={`text-xs font-semibold ${
                    isNext ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {p.name}
                </span>
              </div>

              <div className="font-mono text-sm sm:text-base font-bold text-[var(--text)]">
                {timeFormatted}
              </div>

              {isNext && (
                <span className="text-[9px] mt-1 px-2 py-0.5 rounded-full bg-[var(--accent)]/25 text-[var(--accent)] font-bold border border-[var(--accent)]/35 shadow-sm">
                  القادمة
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
