import React, { useState, useEffect } from 'react';
import {
  Compass,
  Clock,
  MapPin,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Volume2,
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
  const [loading, setLoading] = useState(true);

  // Fetch timings when city changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    PrayerService.getPrayerTimes(selectedCity).then((data) => {
      if (isMounted) {
        setPrayerData(data);
        setNextPrayer(PrayerService.calculateNextPrayer(data.timings));
        setLoading(false);
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
    { key: 'Fajr', name: 'الفجر', icon: <Moon className="w-4 h-4 text-indigo-300" /> },
    { key: 'Sunrise', name: 'الشروق', icon: <Sunrise className="w-4 h-4 text-amber-300" /> },
    { key: 'Dhuhr', name: 'الظهر', icon: <Sun className="w-4 h-4 text-yellow-400" /> },
    { key: 'Asr', name: 'العصر', icon: <Sun className="w-4 h-4 text-orange-400" /> },
    { key: 'Maghrib', name: 'المغرب', icon: <Sunset className="w-4 h-4 text-rose-400" /> },
    { key: 'Isha', name: 'العشاء', icon: <Moon className="w-4 h-4 text-sky-300" /> },
  ];

  return (
    <div
      className="relative rounded-3xl border border-amber-500/25 bg-gradient-to-r from-stone-900/90 via-stone-900/80 to-stone-900/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl text-stone-100 overflow-hidden"
      dir="rtl"
    >
      {/* Subtle background arabesque glow */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Row: Location & Next Prayer Highlight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800/80">
        {/* City and Hijri Date */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-stone-800/90 hover:bg-stone-800 border border-stone-700/80 text-xs font-semibold text-stone-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{selectedCity.arabicName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {/* City dropdown */}
            {showCityPicker && (
              <div className="absolute top-10 right-0 z-30 w-52 p-2 bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl max-h-56 overflow-y-auto space-y-1">
                {CITIES_LIST.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city);
                      setShowCityPicker(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      city.id === selectedCity.id
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <span>{city.arabicName}</span>
                    <span className="text-[10px] opacity-70 font-sans">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-xs text-stone-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
            <span>
              {prayerData.hijri.weekday ? `${prayerData.hijri.weekday}، ` : ''}
              {prayerData.hijri.day} {prayerData.hijri.monthNameAr} {prayerData.hijri.year} هـ
            </span>
          </div>
        </div>

        {/* Next Prayer Countdown Callout */}
        {nextPrayer && (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-stone-400">الصلاة القادمة: </span>
              <span className="font-bold text-amber-400 font-cairo">
                صلاة {nextPrayer.name}
              </span>
              <span className="mx-1.5 text-stone-500">·</span>
              <span className="font-mono text-amber-300 font-bold">
                {nextPrayer.time12}
              </span>
            </div>
            <div className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold">
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
                  ? 'bg-gradient-to-b from-amber-500/25 to-amber-500/10 border border-amber-500/60 shadow-lg shadow-amber-500/10 scale-102'
                  : 'bg-stone-800/40 border border-stone-800 hover:bg-stone-800/70'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                {p.icon}
                <span
                  className={`text-xs font-semibold ${
                    isNext ? 'text-amber-300 font-bold' : 'text-stone-300'
                  }`}
                >
                  {p.name}
                </span>
              </div>

              <div className="font-mono text-sm sm:text-base font-bold text-stone-100">
                {timeFormatted}
              </div>

              {isNext && (
                <span className="text-[9px] mt-1 px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-bold">
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
