import { useEffect, useMemo, useRef, useState } from 'react';
import LiquidGlass from 'liquid-glass-react';
import {
  AudioLines, BookOpen, ChevronLeft, CirclePlay, Clock3, Headphones,
  Heart, Home, ListMusic, Pause, Play, Search, SkipBack, SkipForward,
  Sparkles, Volume2, X,
} from 'lucide-react';
import { SURAH_METADATA } from '../../src/services/quranService';

const RECITERS = [
  { id: 'afs', name: 'مشاري راشد العفاسي', server: 'https://server8.mp3quran.net/afs/' },
  { id: 'basit', name: 'عبد الباسط عبد الصمد', server: 'https://server7.mp3quran.net/basit/' },
  { id: 's_gmd', name: 'سعد الغامدي', server: 'https://server7.mp3quran.net/s_gmd/' },
  { id: 'maher', name: 'ماهر المعيقلي', server: 'https://server12.mp3quran.net/maher/' },
  { id: 'yasser', name: 'ياسر الدوسري', server: 'https://server11.mp3quran.net/yasser/' },
  { id: 'husr', name: 'محمود خليل الحصري', server: 'https://server13.mp3quran.net/husr/' },
  { id: 'islam', name: 'إسلام صبحي', server: 'https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/' },
];

type Section = 'home' | 'quran' | 'reciters' | 'favorites';

export default function App() {
  const [section, setSection] = useState<Section>('home');
  const [query, setQuery] = useState('');
  const [reciter, setReciter] = useState(RECITERS[0]);
  const [surah, setSurah] = useState(SURAH_METADATA[0]);
  const [playing, setPlaying] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('quranify-favorites') || '[]'); } catch { return []; }
  });
  const [showReciters, setShowReciters] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const filteredSurahs = useMemo(() => SURAH_METADATA.filter(s =>
    s.name.includes(query.trim()) ||
    s.englishName.toLowerCase().includes(query.trim().toLowerCase()) ||
    String(s.number) === query.trim()
  ), [query]);

  useEffect(() => { localStorage.setItem('quranify-favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setPosition(audio.currentTime);
    const onDuration = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  const playSurah = async (item = surah, selectedReciter = reciter) => {
    const audio = audioRef.current;
    if (!audio) return;
    const url = selectedReciter.server + String(item.number).padStart(3, '0') + '.mp3';
    if (item.number !== surah.number || selectedReciter.id !== reciter.id || audio.src !== url) {
      setSurah(item);
      setReciter(selectedReciter);
      audio.src = url;
      audio.load();
    }
    try { await audio.play(); setPlaying(true); } catch { setPlaying(false); }
  };
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { if (!audio.src) await playSurah(); else { try { await audio.play(); setPlaying(true); } catch {} } }
    else { audio.pause(); setPlaying(false); }
  };
  const toggleFavorite = (number: number) => setFavorites(old => old.includes(number) ? old.filter(n => n !== number) : [...old, number]);
  const selectSurah = (item: typeof SURAH_METADATA[number]) => { setSurah(item); void playSurah(item); };
  const time = (value: number) => {
    if (!Number.isFinite(value)) return '0:00';
    return Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2, '0');
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="ambient ambient-three" />
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><BookOpen size={23}/></div><div><strong>Quranify</strong><span>تلاوة، تدبر، وسكينة</span></div></div>
        <div className="side-label">القائمة الرئيسية</div>
        <nav className="side-nav">
          <button className={section === 'home' ? 'active' : ''} onClick={() => setSection('home')}><Home size={18}/> الرئيسية</button>
          <button className={section === 'quran' ? 'active' : ''} onClick={() => setSection('quran')}><BookOpen size={18}/> القرآن الكريم</button>
          <button className={section === 'reciters' ? 'active' : ''} onClick={() => setSection('reciters')}><Headphones size={18}/> القرّاء</button>
          <button className={section === 'favorites' ? 'active' : ''} onClick={() => setSection('favorites')}><Heart size={18}/> المفضلة <span className="nav-count">{favorites.length}</span></button>
        </nav>
        <div className="sidebar-bottom">
          <LiquidGlass displacementScale={35} blurAmount={0.12} saturation={135} aberrationIntensity={1} elasticity={0.12} cornerRadius={20} padding="16px" className="sidebar-quote">
            <Sparkles size={17}/><p>«ألا بذكر الله تطمئن القلوب»</p><small>سورة الرعد · ٢٨</small>
          </LiquidGlass>
          <div className="profile-row"><div className="profile-avatar">ق</div><div><b>مساحة السكينة</b><span>رحلتك مع القرآن</span></div><span className="profile-dot"/></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><span className="eyebrow">مساحة هادئة لقلبك</span><h1>{section === 'home' ? 'أهلاً بك في Quranify' : section === 'quran' ? 'القرآن الكريم' : section === 'reciters' ? 'أصوات تحب أن تسمعها' : 'سورك المفضلة'}</h1></div><div className="top-actions"><span className="live-dot"/> <span>استمع بخشوع</span><div className="top-avatar">ق</div></div></header>

        {section === 'home' && <div className="home-grid">
          <section className="hero-area">
            <LiquidGlass displacementScale={55} blurAmount={0.13} saturation={145} aberrationIntensity={1.5} elasticity={0.16} cornerRadius={28} padding="0" className="verse-card">
              <div className="verse-orb orb-a"/><div className="verse-orb orb-b"/>
              <div className="verse-top"><span><Sparkles size={15}/> آية اليوم</span><span className="verse-date">وقفة تدبّر</span></div>
              <div className="verse-calligraphy">﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾</div>
              <div className="verse-reference">سورة الرعد <i/> الآية ٢٨</div>
              <button className="verse-play" onClick={() => playSurah(SURAH_METADATA[12])}><Play size={16} fill="currentColor"/> استمع إلى سورة الرعد</button>
            </LiquidGlass>
            <div className="section-heading"><div><span className="eyebrow">اختيارات مميزة</span><h2>ابدأ رحلتك</h2></div><button className="text-action" onClick={() => setSection('quran')}>كل السور <ChevronLeft size={16}/></button></div>
            <div className="quick-grid">
              <LiquidGlass displacementScale={38} blurAmount={0.1} saturation={130} aberrationIntensity={1} cornerRadius={22} padding="18px" className="quick-card" onClick={() => setSection('quran')}><div className="quick-icon blue"><BookOpen size={21}/></div><b>تصفح السور</b><span>114 سورة من القرآن الكريم</span><ChevronLeft className="quick-arrow" size={17}/></LiquidGlass>
              <LiquidGlass displacementScale={38} blurAmount={0.1} saturation={130} aberrationIntensity={1} cornerRadius={22} padding="18px" className="quick-card" onClick={() => setSection('reciters')}><div className="quick-icon violet"><Headphones size={21}/></div><b>القرّاء</b><span>استمع لأصواتك المفضلة</span><ChevronLeft className="quick-arrow" size={17}/></LiquidGlass>
              <LiquidGlass displacementScale={38} blurAmount={0.1} saturation={130} aberrationIntensity={1} cornerRadius={22} padding="18px" className="quick-card" onClick={() => setSection('favorites')}><div className="quick-icon rose"><Heart size={21}/></div><b>المفضلة</b><span>{favorites.length} سورة محفوظة</span><ChevronLeft className="quick-arrow" size={17}/></LiquidGlass>
            </div>
          </section>
          <aside className="right-column">
            <LiquidGlass displacementScale={42} blurAmount={0.12} saturation={140} aberrationIntensity={1} cornerRadius={24} padding="20px" className="now-card">
              <div className="card-heading"><span>يُشغّل الآن</span><AudioLines size={18}/></div>
              <div className="record-art"><div className="record-ring"><div className="record-center"><BookOpen size={30}/></div></div><div className="record-glow"/></div>
              <h3>سورة {surah.name}</h3><p>{reciter.name}</p>
              <div className="mini-progress"><span style={{width: duration ? (position / duration * 100) + '%' : '0%'}}/></div>
              <div className="mini-time"><span>{time(position)}</span><span>{time(duration)}</span></div>
              <div className="mini-controls"><button onClick={() => playSurah(SURAH_METADATA[Math.max(0, surah.number - 2)])}><SkipForward size={19}/></button><button className="play-main" onClick={togglePlay}>{playing ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor"/>}</button><button onClick={() => playSurah(SURAH_METADATA[Math.min(113, surah.number)])}><SkipBack size={19}/></button></div>
              <button className="reciter-select" onClick={() => setShowReciters(true)}><Headphones size={15}/> تغيير القارئ <ChevronLeft size={15}/></button>
            </LiquidGlass>
            <LiquidGlass displacementScale={30} blurAmount={0.1} saturation={130} aberrationIntensity={0.8} cornerRadius={20} padding="18px" className="listen-note"><Clock3 size={18}/><div><b>لحظات من السكينة</b><span>اجعل للقرآن وقتاً في يومك</span></div></LiquidGlass>
          </aside>
        </div>}

        {(section === 'quran' || section === 'favorites') && <section className="list-section">
          <div className="list-toolbar"><div><span className="eyebrow">{section === 'favorites' ? 'ما احتفظت به' : 'كلام الله'}</span><h2>{section === 'favorites' ? 'السور المحفوظة' : 'تصفّح سور القرآن'}</h2></div><label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث باسم السورة أو رقمها..."/>{query && <button onClick={() => setQuery('')}><X size={15}/></button>}</label></div>
          <div className="surah-grid">{(section === 'favorites' ? filteredSurahs.filter(s => favorites.includes(s.number)) : filteredSurahs).map(item => <LiquidGlass key={item.number} displacementScale={24} blurAmount={0.08} saturation={120} aberrationIntensity={0.5} cornerRadius={18} padding="0" className="surah-item"><button className="surah-main" onClick={() => selectSurah(item)}><span className="surah-number">{String(item.number).padStart(2,'0')}</span><span className="surah-info"><b>سورة {item.name}</b><small>{item.revelationType} · {item.numberOfAyahs} آيات</small></span><Play size={16} className="surah-play"/></button><button className={'fav-toggle ' + (favorites.includes(item.number) ? 'is-fav' : '')} onClick={() => toggleFavorite(item.number)}><Heart size={17} fill={favorites.includes(item.number) ? 'currentColor' : 'none'}/></button></LiquidGlass>)}</div>
          {filteredSurahs.length === 0 && <div className="empty-state">مفيش نتائج مطابقة للبحث.</div>}
        </section>}

        {section === 'reciters' && <section className="list-section"><div className="section-heading"><div><span className="eyebrow">أصوات قرآنية</span><h2>اختر القارئ المفضل</h2></div></div><div className="reciter-grid">{RECITERS.map((r, i) => <LiquidGlass key={r.id} displacementScale={30} blurAmount={0.1} saturation={130} aberrationIntensity={0.8} cornerRadius={20} padding="18px" className="reciter-card"><div className="reciter-avatar"><Headphones size={23}/></div><b>{r.name}</b><span>رواية حفص عن عاصم</span><button onClick={() => { setReciter(r); void playSurah(surah, r); }}> <CirclePlay size={16}/> استمع الآن</button></LiquidGlass>)}</div></section>}
      </main>

      <div className="bottom-player"><div className="bottom-track"><div className="bottom-cover"><BookOpen size={19}/></div><div><b>سورة {surah.name}</b><span>{reciter.name}</span></div></div><div className="bottom-controls"><button onClick={() => playSurah(SURAH_METADATA[Math.max(0, surah.number - 2)])}><SkipForward size={18}/></button><button className="bottom-play" onClick={togglePlay}>{playing ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}</button><button onClick={() => playSurah(SURAH_METADATA[Math.min(113, surah.number)])}><SkipBack size={18}/></button></div><div className="bottom-timeline"><span>{time(position)}</span><input aria-label="موضع التلاوة" type="range" min="0" max={duration || 1} value={Math.min(position, duration || 1)} onChange={e => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }}/><span>{time(duration)}</span></div><div className="bottom-volume"><Volume2 size={17}/><span>Quranify</span></div></div>
      <audio ref={audioRef} preload="none"/>
      {showReciters && <div className="modal-backdrop" onClick={() => setShowReciters(false)}><div className="reciter-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setShowReciters(false)}><X size={18}/></button><span className="eyebrow">صوت التلاوة</span><h2>اختر القارئ</h2>{RECITERS.map(r => <button className={'modal-reciter ' + (r.id === reciter.id ? 'selected' : '')} key={r.id} onClick={() => { setShowReciters(false); void playSurah(surah, r); }}><Headphones size={17}/>{r.name}{r.id === reciter.id && <span>الحالي</span>}</button>)}</div></div>}
    </div>
  );
}
