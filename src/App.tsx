import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Headphones,
  Search,
  Sparkles,
  Users,
  ListMusic,
  BarChart2,
  Moon,
  Sun,
  Flame,
  CloudRain,
  Play,
  Pause,
  Award,
  Clock,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { QuranService, SurahMeta, SURAH_METADATA } from './services/quranService';
import { RECITERS } from './constants/reciters';
import { AMBIENT_SOUNDS } from './constants/ambientSounds';
import { PLAYLISTS, AUDIO_STORIES } from './constants/playlists';
import { Reciter, Playlist, AudioStory } from './types';
import { usePlayerStore } from './store/usePlayerStore';
import { useAppStore } from './store/useAppStore';
import { useStatsStore } from './store/useStatsStore';
import { MiniPlayerWeb } from './components/MiniPlayerWeb';
import { FullPlayerModal } from './components/FullPlayerModal';
import { MushafReaderModal } from './components/MushafReaderModal';
import { AmbientSelectorModalWeb } from './components/AmbientSelectorModalWeb';
import { DhikrCounter } from './components/DhikrCounter';
import { PrayerTimesBanner } from './components/PrayerTimesBanner';

type NavTab = 'home' | 'surahs' | 'reciters' | 'ambient' | 'playlists' | 'dhikr' | 'stats';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'مكية' | 'مدنية'>('all');

  // Modals state
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isAmbientModalOpen, setIsAmbientModalOpen] = useState(false);
  const [mushafSurah, setMushafSurah] = useState<SurahMeta | null>(null);

  // Stores
  const {
    currentSurah,
    currentReciter,
    isPlaying,
    activeAmbient,
    isAmbientPlaying,
    ambientVolume,
    playSurah,
    togglePlayPause,
    changeReciter,
    toggleAmbient,
    setAmbientVolume,
  } = usePlayerStore();

  const { theme, setTheme } = useAppStore();
  const { streakDays, dailyGoalMinutes, todayMinutesListened, totalHoursListened } = useStatsStore();

  // Filtered surahs
  const filteredSurahs = useMemo(() => {
    let list = QuranService.searchSurahs(searchQuery);
    if (filterType !== 'all') {
      list = list.filter((s) => s.revelationType === filterType);
    }
    return list;
  }, [searchQuery, filterType]);

  const handleOpenMushaf = (surah: SurahMeta) => {
    setMushafSurah(surah);
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    const firstSurah = QuranService.getSurahMeta(playlist.surahIds[0]);
    if (firstSurah) {
      playSurah(firstSurah);
    }
  };

  // Theme wrapper classes
  const themeContainerClass = {
    dark: 'bg-stone-950 text-stone-100',
    sepia: 'bg-[#FBF9F5] text-[#292524]',
    emerald: 'bg-[#042017] text-[#ecfdf5]',
    light: 'bg-stone-50 text-stone-900',
  }[theme] || 'bg-stone-950 text-stone-100';

  return (
    <div className={`min-h-screen flex flex-col ${themeContainerClass}`} dir="rtl">
      {/* 1. Universal Top Bar Contract */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-8 py-3.5 border-b border-stone-800/60 bg-inherit/90 backdrop-blur-md">
        {/* Zone 1: Single text wordmark */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer whitespace-nowrap shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-stone-950 shadow-md">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight font-cairo">Quranify</div>
            <div className="text-[10px] text-amber-500 font-bold -mt-1 font-quran">المصحف الذكي</div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'home' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('surahs')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'surahs' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            المصحف والسور
          </button>
          <button
            onClick={() => setActiveTab('reciters')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'reciters' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            كبار القراء
          </button>
          <button
            onClick={() => setActiveTab('ambient')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'ambient' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            محرك الأجواء
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'playlists' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            القوائم والقصص
          </button>
          <button
            onClick={() => setActiveTab('dhikr')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'dhikr' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            السبحة والأذكار
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap transition-colors pb-0.5 ${
              activeTab === 'stats' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            الإحصاءات والختمة
          </button>
        </nav>

        {/* Zone 3: Primary Action & Theme Control */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Ambient Button */}
          <button
            onClick={() => setIsAmbientModalOpen(true)}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              activeAmbient && isAmbientPlaying
                ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
            }`}
            title="محرك أصوات الطبيعة"
          >
            <CloudRain className="w-4 h-4" />
            <span className="hidden sm:inline">الأجواء</span>
          </button>

          {/* Theme switcher */}
          <div className="flex items-center p-1 rounded-xl bg-stone-900 border border-stone-800">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === 'dark' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="الوضع الليلي"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === 'sepia' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="الوضع الورقي المذهب"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('emerald')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                theme === 'emerald' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="الأخضر الكلاسيكي"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2.5 overflow-x-auto border-b border-stone-800/50 bg-stone-900/40 text-xs">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            activeTab === 'home' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
          }`}
        >
          الرئيسية
        </button>
        <button
          onClick={() => setActiveTab('surahs')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            activeTab === 'surahs' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
          }`}
        >
          المصحف
        </button>
        <button
          onClick={() => setActiveTab('reciters')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            activeTab === 'reciters' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
          }`}
        >
          القراء
        </button>
        <button
          onClick={() => setActiveTab('ambient')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            activeTab === 'ambient' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
          }`}
        >
          الأجواء
        </button>
        <button
          onClick={() => setActiveTab('playlists')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            activeTab === 'playlists' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
          }`}
        >
          القوائم والقصص
        </button>
        <button
          onClick={() => setActiveTab('dhikr')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            activeTab === 'dhikr' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
          }`}
        >
          السبحة والأذكار
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            activeTab === 'stats' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
          }`}
        >
          الإحصاءات
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 pb-28">
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            {/* Elegant Top Prayer Times Banner with Live Countdown */}
            <PrayerTimesBanner />

            {/* Hero Banner with Generated Mushaf Artwork */}
            <div className="relative rounded-3xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-900 min-h-[320px] flex items-center">
              <img
                src="/src/assets/images/quran_mushaf_hero_1794397353123.jpg"
                alt="المصحف الشريف"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />

              <div className="relative p-6 sm:p-10 max-w-2xl space-y-4">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-sans font-bold">
                  آية اليوم المباركة
                </span>
                <blockquote className="font-quran text-2xl sm:text-4xl text-amber-100 font-bold leading-relaxed">
                  ﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾
                </blockquote>
                <p className="text-xs text-stone-300">
                  سورة الرعد · الآية 28 · استمع لتلاوة خاشعة بصوت {currentReciter.arabicName} مع أصوات الطبيعة الهادئة
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (isPlaying) {
                        togglePlayPause();
                      } else {
                        playSurah(currentSurah);
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    <span>{isPlaying ? 'إيقاف التلاوة' : `استماع لسورة ${currentSurah.name}`}</span>
                  </button>

                  <button
                    onClick={() => handleOpenMushaf(currentSurah)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700 text-sm font-semibold transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>قراءة المصحف</span>
                  </button>

                  <button
                    onClick={() => setIsAmbientModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-sm font-semibold transition-colors"
                  >
                    <CloudRain className="w-4 h-4" />
                    <span>تفعيل أصوات الطبيعة</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Featured Pillars (Kaaba, Medina, Ambient) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1: Kaaba Sanctuary */}
              <div
                onClick={() => {
                  const fatihah = QuranService.getSurahMeta(1);
                  if (fatihah) playSurah(fatihah);
                }}
                className="group relative rounded-3xl overflow-hidden border border-stone-800 p-6 bg-stone-900 cursor-pointer shadow-lg hover:border-amber-500/50 transition-all"
              >
                <div className="h-44 -mx-6 -mt-6 mb-4 overflow-hidden relative">
                  <img
                    src="/src/assets/images/kaaba_mecca_sanctuary_1794397353491.jpg"
                    alt="الحرم المكي الشريف"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                </div>
                <h3 className="font-bold text-lg text-stone-100 group-hover:text-amber-400 transition-colors">
                  تلاوات أئمة الحرم المكي
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  تلاوة الشيخ ماهر المعيقلي وياسر الدوسري من أطهر بقاع الأرض
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-500 font-semibold">
                  <span>استمع الآن</span>
                  <span>←</span>
                </div>
              </div>

              {/* Pillar 2: Prophet Mosque */}
              <div
                onClick={() => {
                  const mulk = QuranService.getSurahMeta(67);
                  if (mulk) playSurah(mulk);
                }}
                className="group relative rounded-3xl overflow-hidden border border-stone-800 p-6 bg-stone-900 cursor-pointer shadow-lg hover:border-amber-500/50 transition-all"
              >
                <div className="h-44 -mx-6 -mt-6 mb-4 overflow-hidden relative">
                  <img
                    src="/src/assets/images/medina_prophet_mosque_1794397354033.jpg"
                    alt="المسجد النبوي الشريف"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                </div>
                <h3 className="font-bold text-lg text-stone-100 group-hover:text-amber-400 transition-colors">
                  سكينة المسجد النبوي الشريف
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  سورة الملك وسور المساء بخشوع الشيخ مشاري العفاسي والمنشاوي
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-500 font-semibold">
                  <span>تشغيل سورة الملك</span>
                  <span>←</span>
                </div>
              </div>

              {/* Pillar 3: Ambient Dual Engine Showcase */}
              <div
                onClick={() => setIsAmbientModalOpen(true)}
                className="rounded-3xl border border-stone-800 p-6 bg-gradient-to-br from-stone-900 via-stone-900 to-sky-950/40 shadow-lg flex flex-col justify-between cursor-pointer hover:border-sky-500/50 transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                    <CloudRain className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-stone-100">
                    محرك الصوتيات المزدوج الذكي
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    ميزة حصرية تتيح لك دمج تلاوة القارئ مع أصوات الطبيعة الهادئة (أمطار هادئة، خرير النهر، حطب النار، طيور الصباح، أمواج البحر) مع تحكم مستقل في مستوى الصوت.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-sky-400 font-semibold">تخصيص الأجواء</span>
                  <span className="text-stone-500">7 أصوات طبيعية</span>
                </div>
              </div>
            </div>

            {/* Quick Surahs Carousel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-cairo">سور مختارة ومفضلة</h2>
                  <p className="text-xs text-stone-400">ابدأ الاستماع أو القراءة بلمسة واحدة</p>
                </div>
                <button
                  onClick={() => setActiveTab('surahs')}
                  className="text-xs text-amber-400 hover:underline font-semibold"
                >
                  عرض جميع السور (114) ←
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { num: 1, name: 'الفاتحة' },
                  { num: 18, name: 'الكهف' },
                  { num: 36, name: 'يس' },
                  { num: 55, name: 'الرحمن' },
                  { num: 56, name: 'الواقعة' },
                  { num: 67, name: 'الملك' },
                ].map((item) => {
                  const meta = QuranService.getSurahMeta(item.num);
                  if (!meta) return null;
                  const isCur = isPlaying && currentSurah.number === item.num;
                  return (
                    <div
                      key={item.num}
                      className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                          <span className="font-mono">#{item.num}</span>
                          <span>{meta.numberOfAyahs} آية</span>
                        </div>
                        <h4 className="font-bold text-lg text-stone-100 font-quran">{meta.name}</h4>
                        <p className="text-[11px] text-stone-400">{meta.englishName}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-1">
                        <button
                          onClick={() => playSurah(meta)}
                          className="p-2 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors"
                          title="استماع"
                        >
                          {isCur ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        </button>
                        <button
                          onClick={() => handleOpenMushaf(meta)}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors"
                          title="قراءة"
                        >
                          قراءة
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: SURAHS INDEX ================= */}
        {activeTab === 'surahs' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search and Filters Strip */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-stone-900/60 border border-stone-800 p-4 rounded-3xl">
              {/* Search bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم السورة، المعنى، أو الرقم..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Segmented Filter */}
              <div className="flex items-center gap-1 p-1 bg-stone-950 border border-stone-800 rounded-2xl text-xs font-semibold self-stretch sm:self-auto">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    filterType === 'all' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  جميع السور (114)
                </button>
                <button
                  onClick={() => setFilterType('مكية')}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    filterType === 'مكية' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  مكية
                </button>
                <button
                  onClick={() => setFilterType('مدنية')}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    filterType === 'مدنية' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  مدنية
                </button>
              </div>
            </div>

            {/* Surahs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSurahs.map((surah) => {
                const isCurrentPlaying = isPlaying && currentSurah.number === surah.number;
                return (
                  <div
                    key={surah.number}
                    className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center font-mono text-xs font-bold text-amber-500 shrink-0">
                        {surah.number}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-stone-100 font-cairo text-base group-hover:text-amber-400 transition-colors">
                            سورة {surah.name}
                          </h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                            {surah.revelationType}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 truncate">
                          {surah.englishName} · {surah.numberOfAyahs} آية
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenMushaf(surah)}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-colors"
                      >
                        قراءة
                      </button>
                      <button
                        onClick={() => playSurah(surah)}
                        className={`p-2.5 rounded-xl transition-colors ${
                          isCurrentPlaying
                            ? 'bg-amber-500 text-stone-950'
                            : 'bg-stone-800 hover:bg-stone-700 text-amber-400'
                        }`}
                        title="استماع"
                      >
                        {isCurrentPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: RECITERS ================= */}
        {activeTab === 'reciters' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold font-cairo">كبار قراء العالم الإسلامي</h2>
              <p className="text-xs text-stone-400">
                استمع لأعذب التلاوات الخاشعة برواية حفص عن عاصم من مشاهير القراء
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {RECITERS.map((reciter: Reciter) => {
                const isActive = currentReciter.id === reciter.id;
                return (
                  <div
                    key={reciter.id}
                    className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/80 shadow-xl'
                        : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-950 border border-stone-700 shrink-0">
                        <img
                          src={reciter.image}
                          alt={reciter.arabicName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-stone-100">{reciter.arabicName}</h3>
                        <p className="text-xs text-amber-400 font-sans mt-0.5">{reciter.subname}</p>
                        <p className="text-[11px] text-stone-500">{reciter.name}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                      {isActive ? (
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          القارئ النشط حالياً
                        </span>
                      ) : (
                        <span className="text-xs text-stone-500">114 سورة كاملة</span>
                      )}

                      <button
                        onClick={() => changeReciter(reciter)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                        }`}
                      >
                        {isActive ? 'تشغيل' : 'اختيار القارئ'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: AMBIENT ENGINE ================= */}
        {activeTab === 'ambient' && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-sky-400 font-sans font-bold">
                Dual Audio Engine
              </span>
              <h2 className="text-2xl font-bold font-cairo">محرك الأجواء الصوتية المزدوج</h2>
              <p className="text-xs text-stone-400 max-w-lg mx-auto">
                شغّل أي صوت من أصوات الطبيعة الهادئة ليعمل في الخلفية بتزامن تام مع تلاوة القرآن الكريم.
              </p>
            </div>

            {/* Current Active Ambient Control Strip */}
            {activeAmbient && isAmbientPlaying && (
              <div className="p-6 rounded-3xl bg-sky-950/40 border border-sky-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <CloudRain className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-100">{activeAmbient.arabicTitle} (نشط)</h4>
                      <p className="text-xs text-stone-400">يعمل الآن مع تلاوة سورة {currentSurah.name}</p>
                    </div>
                  </div>

                  <span className="font-mono text-sm text-sky-400 font-bold">
                    {Math.round(ambientVolume * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>
            )}

            {/* Ambient Sounds Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AMBIENT_SOUNDS.map((sound) => {
                const isActive = activeAmbient?.id === sound.id && isAmbientPlaying;
                return (
                  <div
                    key={sound.id}
                    onClick={() => toggleAmbient(sound)}
                    className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-500/80 shadow-xl'
                        : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            isActive ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-amber-400'
                          }`}
                        >
                          {sound.id === 'rain' && <CloudRain className="w-6 h-6" />}
                          {sound.id === 'bonfire' && <Flame className="w-6 h-6" />}
                          {sound.id === 'river' && <Sparkles className="w-6 h-6" />}
                          {sound.id === 'birds' && <Sun className="w-6 h-6" />}
                          {sound.id === 'wind' && <Sparkles className="w-6 h-6" />}
                          {sound.id === 'waves' && <Sparkles className="w-6 h-6" />}
                          {sound.id === 'cat' && <Sparkles className="w-6 h-6" />}
                        </div>

                        {isActive && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                            يعمل الآن
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-lg text-stone-100">{sound.arabicTitle}</h3>
                      <p className="text-xs text-stone-400 mt-1">{sound.title}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                      <span className="text-stone-500">حجم الصوت الافتراضي: {sound.defaultVolume * 100}%</span>
                      <span className="font-semibold text-amber-400">
                        {isActive ? 'إيقاف' : 'تشغيل المؤثر'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 5: PLAYLISTS & STORIES ================= */}
        {activeTab === 'playlists' && (
          <div className="space-y-10 animate-fade-in">
            {/* Playlists */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold font-cairo">قوائم السكينة المختارة</h2>
                <p className="text-xs text-stone-400">مجموعات مختارة من السور تناسب مختلف أوقاتك اليومية</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PLAYLISTS.map((pl: Playlist) => (
                  <div
                    key={pl.id}
                    className="p-5 rounded-3xl border border-stone-800 bg-stone-900 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      <div className="h-32 -mx-5 -mt-5 mb-4 rounded-t-3xl overflow-hidden relative">
                        <img
                          src={pl.image}
                          alt={pl.arabicTitle}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
                      </div>

                      <h3 className="font-bold text-lg text-stone-100 group-hover:text-amber-400 transition-colors">
                        {pl.arabicTitle}
                      </h3>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">{pl.description}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                      <span className="text-xs text-stone-500">{pl.surahIds.length} سور</span>
                      <button
                        onClick={() => handlePlayPlaylist(pl)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>تشغيل القائمة</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Stories */}
            <div className="space-y-4 pt-6 border-t border-stone-800">
              <div>
                <h2 className="text-2xl font-bold font-cairo">القصص الصوتية والعِبر القرآنية</h2>
                <p className="text-xs text-stone-400">قصص الأنبياء وسير الصالحين المستفادة من كتاب الله</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AUDIO_STORIES.map((story: AudioStory) => (
                  <div
                    key={story.id}
                    className="p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-stone-950 shrink-0">
                      <img
                        src={story.image}
                        alt={story.arabicTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-amber-500 font-semibold">
                        <span>{story.category}</span>
                        <span>·</span>
                        <span>{story.duration}</span>
                      </div>
                      <h4 className="font-bold text-base text-stone-100">{story.arabicTitle}</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">{story.description}</p>
                      <p className="text-[11px] text-stone-500 font-medium">الراوي: {story.narrator}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: DHIKR & TASBEEH ================= */}
        {activeTab === 'dhikr' && <DhikrCounter />}

        {/* ================= TAB 7: STATS & KHATMAH ================= */}
        {activeTab === 'stats' && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-cairo">إحصاءات الاستماع ومتابعة الختمة</h2>
              <p className="text-xs text-stone-400">تتبع تقدمك اليومي وأيامك المتتالية في الاستماع لكتاب الله</p>
            </div>

            {/* KPI 4-Card Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 text-center">
                <span className="text-xs text-stone-400">الأيام المتتالية</span>
                <div className="font-mono text-3xl font-black text-amber-400 my-1">{streakDays}</div>
                <span className="text-[10px] text-stone-500">أيام متصلة 🔥</span>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 text-center">
                <span className="text-xs text-stone-400">استماع اليوم</span>
                <div className="font-mono text-3xl font-black text-stone-100 my-1">{todayMinutesListened}</div>
                <span className="text-[10px] text-stone-500">دقيقة من {dailyGoalMinutes} د</span>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 text-center">
                <span className="text-xs text-stone-400">الهدف اليومي</span>
                <div className="font-mono text-3xl font-black text-emerald-400 my-1">{dailyGoalMinutes}</div>
                <span className="text-[10px] text-stone-500">دقيقة يومياً</span>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 text-center">
                <span className="text-xs text-stone-400">إجمالي الاستماع</span>
                <div className="font-mono text-3xl font-black text-sky-400 my-1">{totalHoursListened}</div>
                <span className="text-[10px] text-stone-500">ساعة استماع</span>
              </div>
            </div>

            {/* Khatmah Progress Card */}
            <div className="p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-stone-100">ختمة القرآن الكريم الحالية</h3>
                  <p className="text-xs text-stone-400">الهدف: ختمة كاملة خلال شهر رمضان المبارك</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">الجزء 8 / 30</span>
              </div>

              <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-l from-amber-500 to-amber-400 rounded-full w-[26%]" />
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>تم إنجاز 26% من الختمة</span>
                <span>المتبقي: 22 جزءاً</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Mini Player at Bottom */}
      <MiniPlayerWeb
        onExpand={() => setIsFullPlayerOpen(true)}
        onOpenMushaf={() => handleOpenMushaf(currentSurah)}
        onOpenAmbient={() => setIsAmbientModalOpen(true)}
      />

      {/* Modals */}
      <FullPlayerModal
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
        onOpenMushaf={() => {
          setIsFullPlayerOpen(false);
          handleOpenMushaf(currentSurah);
        }}
        onOpenAmbientModal={() => setIsAmbientModalOpen(true)}
      />

      <AmbientSelectorModalWeb
        isOpen={isAmbientModalOpen}
        onClose={() => setIsAmbientModalOpen(false)}
      />

      {mushafSurah && (
        <MushafReaderModal
          surah={mushafSurah}
          isOpen={!!mushafSurah}
          onClose={() => setMushafSurah(null)}
        />
      )}
    </div>
  );
}
