import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Headphones,
  Search,
  Sparkles,
  Users,
  ListMusic,
  BarChart2,
  CloudRain,
  Flame,
  Play,
  Pause,
  Award,
  Clock,
  Compass,
  CheckCircle2,
  Sun,
  Moon,
  Sunset,
} from 'lucide-react';
import { QuranService, SurahMeta } from './services/quranService';
import { RECITERS } from './constants/reciters';
import { AMBIENT_SOUNDS } from './constants/ambientSounds';
import { PLAYLISTS, AUDIO_STORIES } from './constants/playlists';
import { Reciter, Playlist, AudioStory } from './types';
import { usePlayerStore } from './store/usePlayerStore';
import { useStatsStore } from './store/useStatsStore';
import { MiniPlayerWeb } from './components/MiniPlayerWeb';
import { FullPlayerModal } from './components/FullPlayerModal';
import { MushafReaderModal } from './components/MushafReaderModal';
import { AmbientSelectorModalWeb } from './components/AmbientSelectorModalWeb';
import { DhikrCounter } from './components/DhikrCounter';
import { PrayerTimesBanner } from './components/PrayerTimesBanner';
import { RecentlyActiveSection } from './components/RecentlyActiveSection';
import { QiblaCompass } from './components/QiblaCompass';
import { useRecentActivityStore } from './store/useRecentActivityStore';

type NavTab = 'home' | 'surahs' | 'reciters' | 'ambient' | 'playlists' | 'dhikr' | 'qibla' | 'stats';
type ThemeMode = 'dark' | 'dim' | 'light';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'مكية' | 'مدنية'>('all');

  // Theme Management (Marco Sawiris v2.0 Triple Theme)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('quranify-theme') as ThemeMode;
    return saved === 'dim' || saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('quranify-theme', theme);
  }, [theme]);

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

  const { streakDays, dailyGoalMinutes, todayMinutesListened, totalHoursListened } = useStatsStore();

  // Filtered surahs
  const filteredSurahs = useMemo(() => {
    let list = QuranService.searchSurahs(searchQuery);
    if (filterType !== 'all') {
      list = list.filter((s) => s.revelationType === filterType);
    }
    return list;
  }, [searchQuery, filterType]);

  const { recordActivity } = useRecentActivityStore();

  const handlePlaySurahWithHistory = (surah: SurahMeta, reciter?: Reciter) => {
    const targetReciter = reciter || currentReciter;
    recordActivity({
      type: 'listen',
      surahNumber: surah.number,
      surahName: surah.name,
      surahEnglishName: surah.englishName,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType,
      reciterId: targetReciter.id,
      reciterName: targetReciter.arabicName,
      progressPercent: 30,
    });
    playSurah(surah, targetReciter);
  };

  const handleOpenMushaf = (surah: SurahMeta, initialAyah?: number) => {
    recordActivity({
      type: 'read',
      surahNumber: surah.number,
      surahName: surah.name,
      surahEnglishName: surah.englishName,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType,
      ayahNumber: initialAyah || 1,
      progressPercent: Math.min(100, Math.round(((initialAyah || 1) / surah.numberOfAyahs) * 100)),
    });
    setMushafSurah(surah);
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    const firstSurah = QuranService.getSurahMeta(playlist.surahIds[0]);
    if (firstSurah) {
      handlePlaySurahWithHistory(firstSurah);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative font-cairo transition-colors duration-300 selection:bg-[var(--primary)]/30 selection:text-[var(--text)]" dir="rtl">
      {/* 0. Ambient Multi-Layer Orbs (Marco Sawiris v2.0 Lighting Architecture) */}
      <div className="ambient-lighting-container">
        <div className="ambient-orb-top" />
        <div className="ambient-orb-bottom" />
        <div className="ambient-orb-cyan" />
      </div>

      {/* 1. Universal Top Bar Contract with Floating Liquid Glass */}
      <header className="sticky top-0 z-30 glass-strong !rounded-none !border-x-0 !border-t-0 border-b border-[var(--glass-border-2)] flex items-center justify-between gap-4 px-4 sm:px-8 py-3.5 shadow-lg">
        {/* Zone 1: Single text wordmark with subtle liquid glow */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[var(--accent)] via-[var(--primary)] to-[var(--royal)] flex items-center justify-center text-white shadow-[0_0_20px_rgba(32,199,232,0.4)] group-hover:shadow-[0_0_28px_rgba(32,199,232,0.6)] transition-all">
            <BookOpen className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight font-cairo text-[var(--text)] flex items-center gap-1.5">
              <span>Quranify</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--glass-bg-3)] border border-[var(--accent)]/40 text-[var(--accent)] font-mono">v2.0</span>
            </div>
            <div className="text-[10px] text-[var(--accent)] font-bold -mt-0.5 font-quran">المصحف الشريف</div>
          </div>
        </div>

        {/* Zone 2: Navigation Links in Liquid Glass style */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap transition-all pb-1 ${
              activeTab === 'home'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] drop-shadow-[0_0_8px_rgba(32,199,232,0.5)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('surahs')}
            className={`whitespace-nowrap transition-all pb-1 ${
              activeTab === 'surahs'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] drop-shadow-[0_0_8px_rgba(32,199,232,0.5)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            المصحف والسور
          </button>
          <button
            onClick={() => setActiveTab('reciters')}
            className={`whitespace-nowrap transition-all pb-1 ${
              activeTab === 'reciters'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] drop-shadow-[0_0_8px_rgba(32,199,232,0.5)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            كبار القراء
          </button>
          <button
            onClick={() => setActiveTab('ambient')}
            className={`whitespace-nowrap transition-all pb-1 ${
              activeTab === 'ambient'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] drop-shadow-[0_0_8px_rgba(32,199,232,0.5)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            محرك الأجواء
          </button>
          <button
            onClick={() => setActiveTab('qibla')}
            className={`whitespace-nowrap transition-all pb-1 flex items-center gap-1.5 ${
              activeTab === 'qibla'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] drop-shadow-[0_0_8px_rgba(32,199,232,0.5)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>اتجاه القبلة</span>
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`whitespace-nowrap transition-all pb-1 ${
              activeTab === 'playlists'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] drop-shadow-[0_0_8px_rgba(32,199,232,0.5)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            القوائم والقصص
          </button>
          <button
            onClick={() => setActiveTab('dhikr')}
            className={`whitespace-nowrap transition-all pb-1 ${
              activeTab === 'dhikr'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] drop-shadow-[0_0_8px_rgba(32,199,232,0.5)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            السبحة والأذكار
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap transition-all pb-1 ${
              activeTab === 'stats'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] drop-shadow-[0_0_8px_rgba(32,199,232,0.5)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            الإحصاءات والختمة
          </button>
        </nav>

        {/* Zone 3: Quick Liquid Glass Actions & Triple Theme Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Ambient engine trigger */}
          <button
            onClick={() => setIsAmbientModalOpen(true)}
            className={`px-3 py-1.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-semibold ${
              activeAmbient && isAmbientPlaying
                ? 'bg-[var(--glass-bg-3)] border-[var(--accent)] text-[var(--accent)] shadow-[0_0_15px_rgba(32,199,232,0.3)]'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-[var(--glass-border)] text-[var(--text)]'
            }`}
            title="محرك أصوات الطبيعة"
          >
            <CloudRain className="w-4 h-4 text-[var(--accent)]" />
            <span className="hidden sm:inline">أصوات الطبيعة</span>
          </button>

          {/* Triple Theme Switcher Capsule (Dark / Dim / Light) */}
          <div className="segmented-clay !p-1 flex items-center gap-1" title="تبديل مظهر الواجهة">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-xl transition-all ${
                theme === 'dark'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
              title="الوضع الداكن العميق (Midnight)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dim')}
              className={`p-1.5 rounded-xl transition-all ${
                theme === 'dim'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
              title="الوضع الخافت الليلي (Deep Navy)"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-xl transition-all ${
                theme === 'light'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
              title="الوضع الفاتح الصباحي (Light)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation with Glass Pills */}
      <div className="xl:hidden flex items-center gap-2 px-4 py-2.5 overflow-x-auto border-b border-[var(--glass-border)] bg-[var(--bg)]/80 backdrop-blur-xl text-xs">
        {[
          { id: 'home', label: 'الرئيسية' },
          { id: 'surahs', label: 'المصحف' },
          { id: 'reciters', label: 'القراء' },
          { id: 'ambient', label: 'الأجواء' },
          { id: 'qibla', label: 'القبلة' },
          { id: 'playlists', label: 'القوائم' },
          { id: 'dhikr', label: 'السبحة' },
          { id: 'stats', label: 'الإحصاءات' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as NavTab)}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'btn--primary !text-xs !py-1.5 font-bold shadow-md'
                : 'bg-white/[0.03] border border-[var(--glass-border)] text-[var(--text-secondary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 pb-28">
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Prayer Times Banner in Liquid Glass */}
            <PrayerTimesBanner />

            {/* Hero Banner with Liquid Glass Framing & Specular Highlights */}
            <div className="relative rounded-3xl overflow-hidden liquid-glass-card min-h-[340px] flex items-center p-6 sm:p-10 border-[var(--glass-border-2)]">
              <img
                src="/src/assets/images/quran_mushaf_hero_1794397353123.jpg"
                alt="المصحف الشريف"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/75 to-transparent pointer-events-none" />

              <div className="relative max-w-2xl space-y-4 z-10">
                <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-sans font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  آية اليوم المباركة
                </span>
                <blockquote className="font-quran text-2xl sm:text-4xl text-[var(--text)] font-bold leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  ﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾
                </blockquote>
                <p className="text-xs text-[var(--text-secondary)]">
                  سورة الرعد · الآية 28 · استمع لتلاوة خاشعة بصوت {currentReciter.arabicName} مع أصوات الطبيعة الهادئة
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (isPlaying) {
                        togglePlayPause();
                      } else {
                        handlePlaySurahWithHistory(currentSurah);
                      }
                    }}
                    className="btn--lens text-sm"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current text-[var(--accent)]" /> : <Play className="w-4 h-4 fill-current text-[var(--accent)]" />}
                    <span>{isPlaying ? 'إيقاف التلاوة' : `استماع لسورة ${currentSurah.name}`}</span>
                  </button>

                  <button
                    onClick={() => handleOpenMushaf(currentSurah)}
                    className="btn--glass text-sm"
                  >
                    <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                    <span>قراءة المصحف</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('qibla')}
                    className="btn--glass text-sm flex items-center gap-1.5"
                  >
                    <Compass className="w-4 h-4 text-[var(--accent)]" />
                    <span>اتجاه القبلة</span>
                  </button>

                  <button
                    onClick={() => setIsAmbientModalOpen(true)}
                    className="btn--glass text-xs text-[var(--accent)]"
                  >
                    <CloudRain className="w-4 h-4" />
                    <span>تخصيص الأجواء</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recently Read & Listened Section with LocalStorage persistence */}
            <RecentlyActiveSection
              onResumeListen={handlePlaySurahWithHistory}
              onResumeRead={handleOpenMushaf}
            />

            {/* 3 Featured Pillars (Kaaba, Medina, Ambient) in Liquid Glass */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1: Kaaba Sanctuary */}
              <div
                onClick={() => {
                  const fatihah = QuranService.getSurahMeta(1);
                  if (fatihah) handlePlaySurahWithHistory(fatihah);
                }}
                className="group relative rounded-3xl overflow-hidden liquid-glass-card p-6 cursor-pointer"
              >
                <div className="h-44 -mx-6 -mt-6 mb-4 overflow-hidden relative">
                  <img
                    src="/src/assets/images/kaaba_mecca_sanctuary_1794397353491.jpg"
                    alt="الحرم المكي الشريف"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-el)] via-transparent to-transparent" />
                </div>
                <h3 className="font-bold text-lg text-[var(--text)] group-hover:text-[var(--accent)] transition-colors font-cairo">
                  تلاوات أئمة الحرم المكي
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  تلاوة الشيخ ماهر المعيقلي وياسر الدوسري من أطهر بقاع الأرض
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-[var(--accent)] font-semibold">
                  <span>استمع الآن</span>
                  <span>←</span>
                </div>
              </div>

              {/* Pillar 2: Prophet Mosque */}
              <div
                onClick={() => {
                  const mulk = QuranService.getSurahMeta(67);
                  if (mulk) handlePlaySurahWithHistory(mulk);
                }}
                className="group relative rounded-3xl overflow-hidden liquid-glass-card p-6 cursor-pointer"
              >
                <div className="h-44 -mx-6 -mt-6 mb-4 overflow-hidden relative">
                  <img
                    src="/src/assets/images/medina_prophet_mosque_1794397354033.jpg"
                    alt="المسجد النبوي الشريف"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-el)] via-transparent to-transparent" />
                </div>
                <h3 className="font-bold text-lg text-[var(--text)] group-hover:text-[var(--accent)] transition-colors font-cairo">
                  سكينة المسجد النبوي الشريف
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  سورة الملك وسور المساء بخشوع الشيخ مشاري العفاسي والمنشاوي
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-[var(--accent)] font-semibold">
                  <span>تشغيل سورة الملك</span>
                  <span>←</span>
                </div>
              </div>

              {/* Pillar 3: Ambient Dual Engine Showcase */}
              <div
                onClick={() => setIsAmbientModalOpen(true)}
                className="rounded-3xl liquid-glass-card p-6 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--glass-bg-3)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] mb-4 shadow-[0_0_20px_rgba(32,199,232,0.2)]">
                    <CloudRain className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text)] font-cairo">
                    محرك الصوتيات المزدوج الذكي
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                    ميزة حصرية تتيح لك دمج تلاوة القارئ مع أصوات الطبيعة الهادئة (أمطار هادئة، خرير النهر، حطب النار، طيور الصباح، أمواج البحر) مع تحكم مستقل في مستوى الصوت.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--accent)] font-semibold">تخصيص الأجواء</span>
                  <span className="text-[var(--text-muted)]">7 أصوات طبيعية</span>
                </div>
              </div>
            </div>

            {/* Quick Surahs Carousel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-cairo text-[var(--text)]">سور مختارة ومفضلة</h2>
                  <p className="text-xs text-[var(--text-secondary)]">ابدأ الاستماع أو القراءة بلمسة واحدة</p>
                </div>
                <button
                  onClick={() => setActiveTab('surahs')}
                  className="text-xs text-[var(--accent)] hover:underline font-semibold"
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
                      className="p-4 rounded-2xl liquid-glass-card flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
                          <span className="font-mono text-[var(--accent)]">#{item.num}</span>
                          <span>{meta.numberOfAyahs} آية</span>
                        </div>
                        <h4 className="font-bold text-lg text-[var(--text)] font-quran group-hover:text-[var(--accent)] transition-colors">
                          {meta.name}
                        </h4>
                        <p className="text-[11px] text-[var(--text-muted)]">{meta.englishName}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between gap-1">
                        <button
                          onClick={() => handlePlaySurahWithHistory(meta)}
                          className="p-2 rounded-xl btn--primary !p-2 transition-all"
                          title="استماع"
                        >
                          {isCur ? <Pause className="w-3.5 h-3.5 fill-current text-white" /> : <Play className="w-3.5 h-3.5 fill-current text-white" />}
                        </button>
                        <button
                          onClick={() => handleOpenMushaf(meta)}
                          className="px-2.5 py-1.5 rounded-xl btn--glass !py-1 text-xs font-medium"
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
            {/* Search and Filters Strip in Liquid Glass */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between liquid-glass-card p-4 rounded-3xl">
              {/* Search bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم السورة، المعنى، أو الرقم..."
                  className="w-full bg-[var(--bg-el)]/60 border border-[var(--glass-border)] rounded-2xl pr-10 pl-4 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_15px_rgba(32,199,232,0.25)] transition-all"
                />
              </div>

              {/* Segmented Filter */}
              <div className="segmented-clay self-stretch sm:self-auto">
                <button
                  onClick={() => setFilterType('all')}
                  className={`segmented-clay-btn ${filterType === 'all' ? 'active' : ''}`}
                >
                  جميع السور (114)
                </button>
                <button
                  onClick={() => setFilterType('مكية')}
                  className={`segmented-clay-btn ${filterType === 'مكية' ? 'active' : ''}`}
                >
                  مكية
                </button>
                <button
                  onClick={() => setFilterType('مدنية')}
                  className={`segmented-clay-btn ${filterType === 'مدنية' ? 'active' : ''}`}
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
                    className="p-4 rounded-2xl liquid-glass-card flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-[var(--bg-el)] border border-[var(--glass-border)] flex items-center justify-center font-mono text-xs font-bold text-[var(--accent)] shrink-0 shadow-inner">
                        {surah.number}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[var(--text)] font-cairo text-base group-hover:text-[var(--accent)] transition-colors">
                            سورة {surah.name}
                          </h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--glass-bg-3)] border border-[var(--glass-border)] text-[var(--text-secondary)]">
                            {surah.revelationType}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] truncate">
                          {surah.englishName} · {surah.numberOfAyahs} آية
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenMushaf(surah)}
                        className="px-3 py-1.5 rounded-xl btn--glass !py-1 text-xs font-medium"
                      >
                        قراءة
                      </button>
                      <button
                        onClick={() => handlePlaySurahWithHistory(surah)}
                        className={`p-2.5 rounded-xl transition-all ${
                          isCurrentPlaying
                            ? 'btn--primary !p-2'
                            : 'bg-[var(--glass-bg-3)] hover:bg-[var(--glass-bg-2)] text-[var(--accent)] border border-[var(--glass-border)]'
                        }`}
                        title="استماع"
                      >
                        {isCurrentPlaying ? (
                          <Pause className="w-4 h-4 fill-current text-white" />
                        ) : (
                          <Play className="w-4 h-4 fill-current" />
                        )}
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
              <h2 className="text-2xl font-bold font-cairo text-[var(--text)]">كبار قراء العالم الإسلامي</h2>
              <p className="text-xs text-[var(--text-secondary)]">
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
                        ? 'bg-gradient-to-b from-[var(--primary)]/20 to-[var(--primary)]/05 border-[var(--accent)] shadow-[0_0_30px_rgba(32,199,232,0.25)]'
                        : 'liquid-glass-card'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[var(--bg-el)] border border-[var(--glass-border)] shrink-0">
                        <img
                          src={reciter.image}
                          alt={reciter.arabicName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[var(--text)]">{reciter.arabicName}</h3>
                        <p className="text-xs text-[var(--accent)] font-sans mt-0.5">{reciter.subname}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{reciter.name}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                      {isActive ? (
                        <span className="text-xs font-bold text-[var(--accent)] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          القارئ النشط حالياً
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">114 سورة كاملة</span>
                      )}

                      <button
                        onClick={() => changeReciter(reciter)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'btn--primary font-bold'
                            : 'btn--glass'
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
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-sans font-bold">
                Dual Audio Engine
              </span>
              <h2 className="text-2xl font-bold font-cairo text-[var(--text)]">محرك الأجواء الصوتية المزدوج</h2>
              <p className="text-xs text-[var(--text-secondary)] max-w-lg mx-auto">
                شغّل أي صوت من أصوات الطبيعة الهادئة ليعمل في الخلفية بتزامن تام مع تلاوة القرآن الكريم.
              </p>
            </div>

            {/* Current Active Ambient Control Strip */}
            {activeAmbient && isAmbientPlaying && (
              <div className="p-6 rounded-3xl liquid-glass-card border-[var(--accent)]/50 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--glass-bg-3)] text-[var(--accent)] flex items-center justify-center">
                      <CloudRain className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text)]">{activeAmbient.arabicTitle} (نشط)</h4>
                      <p className="text-xs text-[var(--text-secondary)]">يعمل الآن مع تلاوة سورة {currentSurah.name}</p>
                    </div>
                  </div>

                  <span className="font-mono text-sm text-[var(--accent)] font-bold">
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
                  className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
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
                        ? 'bg-gradient-to-b from-[var(--primary)]/20 to-[var(--primary)]/05 border-[var(--accent)] shadow-[0_0_30px_rgba(32,199,232,0.25)]'
                        : 'liquid-glass-card'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            isActive ? 'btn--primary !p-0 text-white' : 'bg-[var(--glass-bg-3)] text-[var(--accent)]'
                          }`}
                        >
                          {sound.id === 'rain' && <CloudRain className="w-6 h-6" />}
                          {sound.id === 'bonfire' && <Flame className="w-6 h-6" />}
                          {sound.id === 'river' && <Sparkles className="w-6 h-6" />}
                          {sound.id === 'birds' && <Sparkles className="w-6 h-6" />}
                          {sound.id === 'wind' && <Sparkles className="w-6 h-6" />}
                          {sound.id === 'waves' && <Sparkles className="w-6 h-6" />}
                          {sound.id === 'cat' && <Sparkles className="w-6 h-6" />}
                        </div>

                        {isActive && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/40 text-[var(--accent)] font-bold">
                            يعمل الآن
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-lg text-[var(--text)]">{sound.arabicTitle}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{sound.title}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">مستوى الصوت: {sound.defaultVolume * 100}%</span>
                      <span className="font-semibold text-[var(--accent)]">
                        {isActive ? 'إيقاف' : 'تشغيل المؤثر'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 5: QIBLA DIRECTION (بوصلة القبلة) ================= */}
        {activeTab === 'qibla' && <QiblaCompass />}

        {/* ================= TAB 6: PLAYLISTS & STORIES ================= */}
        {activeTab === 'playlists' && (
          <div className="space-y-10 animate-fade-in">
            {/* Playlists */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold font-cairo text-[var(--text)]">قوائم السكينة المختارة</h2>
                <p className="text-xs text-[var(--text-secondary)]">مجموعات مختارة من السور تناسب مختلف أوقاتك اليومية</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PLAYLISTS.map((pl: Playlist) => (
                  <div
                    key={pl.id}
                    className="p-5 rounded-3xl liquid-glass-card flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      <div className="h-32 -mx-5 -mt-5 mb-4 rounded-t-3xl overflow-hidden relative">
                        <img
                          src={pl.image}
                          alt={pl.arabicTitle}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-el)] via-transparent to-transparent" />
                      </div>

                      <h3 className="font-bold text-lg text-[var(--text)] group-hover:text-[var(--accent)] transition-colors font-cairo">
                        {pl.arabicTitle}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{pl.description}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                      <span className="text-xs text-[var(--text-muted)]">{pl.surahIds.length} سور</span>
                      <button
                        onClick={() => handlePlayPlaylist(pl)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn--primary text-xs font-bold"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-white" />
                        <span>تشغيل القائمة</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Stories */}
            <div className="space-y-4 pt-6 border-t border-[var(--glass-border)]">
              <div>
                <h2 className="text-2xl font-bold font-cairo text-[var(--text)]">القصص الصوتية والعِبر القرآنية</h2>
                <p className="text-xs text-[var(--text-secondary)]">قصص الأنبياء وسير الصالحين المستفادة من كتاب الله</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AUDIO_STORIES.map((story: AudioStory) => (
                  <div
                    key={story.id}
                    className="p-5 rounded-3xl liquid-glass-card flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-[var(--bg-el)] shrink-0 border border-[var(--glass-border)]">
                      <img
                        src={story.image}
                        alt={story.arabicTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover filter brightness-90"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-[var(--accent)] font-semibold">
                        <span>{story.category}</span>
                        <span>·</span>
                        <span>{story.duration}</span>
                      </div>
                      <h4 className="font-bold text-base text-[var(--text)]">{story.arabicTitle}</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{story.description}</p>
                      <p className="text-[11px] text-[var(--text-muted)] font-medium">الراوي: {story.narrator}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: DHIKR & TASBEEH ================= */}
        {activeTab === 'dhikr' && <DhikrCounter />}

        {/* ================= TAB 8: STATS & KHATMAH ================= */}
        {activeTab === 'stats' && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-cairo text-[var(--text)]">إحصاءات الاستماع ومتابعة الختمة</h2>
              <p className="text-xs text-[var(--text-secondary)]">تتبع تقدمك اليومي وأيامك المتتالية في الاستماع لكتاب الله</p>
            </div>

            {/* KPI 4-Card Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl liquid-glass-card text-center">
                <span className="text-xs text-[var(--text-muted)]">الأيام المتتالية</span>
                <div className="font-mono text-3xl font-black text-[var(--accent)] my-1">{streakDays}</div>
                <span className="text-[10px] text-[var(--text-secondary)]">أيام متصلة</span>
              </div>

              <div className="p-5 rounded-3xl liquid-glass-card text-center">
                <span className="text-xs text-[var(--text-muted)]">استماع اليوم</span>
                <div className="font-mono text-3xl font-black text-[var(--text)] my-1">{todayMinutesListened}</div>
                <span className="text-[10px] text-[var(--text-secondary)]">دقيقة من {dailyGoalMinutes} د</span>
              </div>

              <div className="p-5 rounded-3xl liquid-glass-card text-center">
                <span className="text-xs text-[var(--text-muted)]">الهدف اليومي</span>
                <div className="font-mono text-3xl font-black text-[var(--primary)] my-1">{dailyGoalMinutes}</div>
                <span className="text-[10px] text-[var(--text-secondary)]">دقيقة يومياً</span>
              </div>

              <div className="p-5 rounded-3xl liquid-glass-card text-center">
                <span className="text-xs text-[var(--text-muted)]">إجمالي الاستماع</span>
                <div className="font-mono text-3xl font-black text-[var(--accent)] my-1">{totalHoursListened}</div>
                <span className="text-[10px] text-[var(--text-secondary)]">ساعة استماع</span>
              </div>
            </div>

            {/* Khatmah Progress Card */}
            <div className="p-8 rounded-3xl liquid-glass-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[var(--text)] font-cairo">ختمة القرآن الكريم الحالية</h3>
                  <p className="text-xs text-[var(--text-secondary)]">الهدف: ختمة كاملة بتدبر وخشوع</p>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--accent)]">الجزء 8 / 30</span>
              </div>

              <div className="w-full h-3 bg-white/[0.06] rounded-full overflow-hidden border border-[var(--glass-border)]">
                <div className="h-full bg-gradient-to-l from-[var(--accent)] to-[var(--primary)] rounded-full w-[26%] shadow-[0_0_15px_var(--accent)]" />
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>تم إنجاز 26% من الختمة</span>
                <span>المتبقي: 22 جزءاً</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Mini Player at Bottom with Liquid Glass Dock */}
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
