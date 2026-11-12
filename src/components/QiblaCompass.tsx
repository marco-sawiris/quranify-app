import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Compass, Navigation, MapPin, RefreshCw, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';

interface CityPreset {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

const CITY_PRESETS: CityPreset[] = [
  { name: 'مكة المكرمة', country: 'السعودية', lat: 21.4225, lng: 39.8262 },
  { name: 'المدينة المنورة', country: 'السعودية', lat: 24.4686, lng: 39.6142 },
  { name: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753 },
  { name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357 },
  { name: 'الإسكندرية', country: 'مصر', lat: 31.2001, lng: 29.9187 },
  { name: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708 },
  { name: 'أبوظبي', country: 'الإمارات', lat: 24.4539, lng: 54.3773 },
  { name: 'عَمّان', country: 'الأردن', lat: 31.9454, lng: 35.9284 },
  { name: 'القدس الشريف', country: 'فلسطين', lat: 31.7683, lng: 35.2137 },
  { name: 'بغداد', country: 'العراق', lat: 33.3152, lng: 44.3661 },
  { name: 'دمشق', country: 'سوريا', lat: 33.5138, lng: 36.2765 },
  { name: 'الكويت', country: 'الكويت', lat: 29.3759, lng: 47.9774 },
  { name: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310 },
  { name: 'مسقط', country: 'عُمان', lat: 23.5880, lng: 58.3829 },
  { name: 'المنامة', country: 'البحرين', lat: 26.2285, lng: 50.5860 },
  { name: 'الدار البيضاء', country: 'المغرب', lat: 33.5731, lng: -7.5898 },
  { name: 'الجزائر', country: 'الجزائر', lat: 36.7538, lng: 3.0588 },
  { name: 'تونس', country: 'تونس', lat: 36.8065, lng: 10.1815 },
  { name: 'إسطنبول', country: 'تركيا', lat: 41.0082, lng: 28.9784 },
  { name: 'لندن', country: 'بريطانيا', lat: 51.5074, lng: -0.1278 },
  { name: 'باريس', country: 'فرنسا', lat: 48.8566, lng: 2.3522 },
  { name: 'جاكرتا', country: 'إندونيسيا', lat: -6.2088, lng: 106.8456 },
  { name: 'كوالالمبور', country: 'ماليزيا', lat: 3.1390, lng: 101.6869 },
  { name: 'نيويورك', country: 'أمريكا', lat: 40.7128, lng: -74.0060 },
];

const KAABA_COORDS = { lat: 21.4225, lng: 39.8262 };

export function QiblaCompass() {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITY_PRESETS[3]); // Default Cairo
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Active coordinates
  const currentCoords = userCoords || { lat: selectedCity.lat, lng: selectedCity.lng };

  // Calculate Great-Circle Qibla Bearing (in degrees from North)
  const qiblaBearing = useMemo(() => {
    const lat1 = (currentCoords.lat * Math.PI) / 180;
    const lat2 = (KAABA_COORDS.lat * Math.PI) / 180;
    const dLng = ((KAABA_COORDS.lng - currentCoords.lng) * Math.PI) / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    bearing = (bearing + 360) % 360;
    return Math.round(bearing * 10) / 10;
  }, [currentCoords]);

  // Calculate Distance to Kaaba in KM
  const distanceToKaaba = useMemo(() => {
    const R = 6371; // Earth radius in km
    const dLat = ((KAABA_COORDS.lat - currentCoords.lat) * Math.PI) / 180;
    const dLng = ((KAABA_COORDS.lng - currentCoords.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((currentCoords.lat * Math.PI) / 180) *
        Math.cos((KAABA_COORDS.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }, [currentCoords]);

  // Relative needle angle based on device compass heading
  // If compass sensor is active, the needle points to qibla relative to top of device
  const relativeQiblaAngle = useMemo(() => {
    return (qiblaBearing - deviceHeading + 360) % 360;
  }, [qiblaBearing, deviceHeading]);

  // Is aligned to Qibla within ±5 degrees
  const isAligned = useMemo(() => {
    if (!hasCompassSensor) return false;
    const diff = Math.abs(relativeQiblaAngle);
    return diff <= 5 || diff >= 355;
  }, [relativeQiblaAngle, hasCompassSensor]);

  // Device orientation listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // @ts-expect-error webkitCompassHeading exists on iOS WebKit
      const webkitHeading = e.webkitCompassHeading;
      if (typeof webkitHeading === 'number') {
        setDeviceHeading(webkitHeading);
        setHasCompassSensor(true);
      } else if (e.alpha !== null) {
        // Absolute orientation on Android Chrome
        const heading = (360 - e.alpha) % 360;
        setDeviceHeading(heading);
        setHasCompassSensor(true);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // Request GPS Location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('خاصية تحديد الموقع غير مدعومة في متصفحك');
      return;
    }

    setIsCalibrating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsGpsActive(true);
        setIsCalibrating(false);
      },
      (err) => {
        setIsCalibrating(false);
        setGpsError('تعذر الحصول على إذن الموقع، يُرجى تفعيل الموقع أو اختيار مدينتك من القائمة');
        console.warn('Geolocation error:', err.message);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 }
    );
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in font-cairo">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--glass-bg-3)] border border-[var(--glass-border)] text-xs font-bold text-[var(--accent)] mb-1 shadow-sm">
          <Compass className="w-4 h-4 text-[var(--accent)] animate-spin-slow" />
          <span>تحديد اتجاه المسجد الحرام بدقة جغرافية متناهية</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
          بوصلة اتجاه القبلة الشريفة
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
          احسب الزاوية والمسافة الدقيقة نحو الكعبة المشرفة من أي بقعة في العالم عبر مستشعر البوصلة وموقعك الجغرافي.
        </p>
      </div>

      {/* Main Liquid Glass Compass Display */}
      <div className="p-6 sm:p-10 rounded-3xl liquid-glass-card border-[var(--glass-border-2)] flex flex-col items-center relative overflow-hidden">
        {/* Subtle Background Glow behind Compass */}
        <div
          className={`absolute w-72 h-72 rounded-full transition-all duration-700 pointer-events-none filter blur-[70px] ${
            isAligned
              ? 'bg-[var(--accent)]/30 scale-125'
              : 'bg-[var(--primary)]/15'
          }`}
        />

        {/* Alignment Status Notification */}
        <div className="mb-6 h-8 flex items-center justify-center">
          {hasCompassSensor ? (
            isAligned ? (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)] text-xs font-bold text-[var(--accent)] shadow-[0_0_20px_rgba(32,199,232,0.4)] animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>أنت الآن باتجاه الكعبة المشرفة تماماً! تقبل الله طاعتكم</span>
              </div>
            ) : (
              <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                <span>وجّه جهازك حتى يتطابق المؤشر مع علامة الكعبة</span>
              </div>
            )
          ) : (
            <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <span>قم بتوجيه أعلى الجهاز باتجاه زاوية القبلة:</span>
              <span className="font-mono font-bold text-[var(--accent)]">{qiblaBearing}°</span>
            </div>
          )}
        </div>

        {/* The Circular Liquid Glass Compass Dial */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center p-3 select-none">
          {/* Outer Glass Bezel with Inset Specular Rim */}
          <div className="absolute inset-0 rounded-full border border-[var(--glass-border-2)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),0_12px_40px_rgba(3,7,17,0.85)] bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

          {/* Compass Rose Dial Rotating with Device Heading */}
          <div
            className="w-full h-full rounded-full relative transition-transform duration-300 ease-out flex items-center justify-center"
            style={{
              transform: `rotate(${-deviceHeading}deg)`,
            }}
          >
            {/* Cardinal Markers */}
            <span className="absolute top-3 font-mono font-bold text-xs text-[var(--accent)]">
              شمال (N)
            </span>
            <span className="absolute bottom-3 font-mono text-[10px] text-[var(--text-muted)]">
              جنوب (S)
            </span>
            <span className="absolute left-3 font-mono text-[10px] text-[var(--text-muted)]">
              غرب (W)
            </span>
            <span className="absolute right-3 font-mono text-[10px] text-[var(--text-muted)]">
              شرق (E)
            </span>

            {/* 360 Degree Tick Marks */}
            <svg className="w-full h-full absolute inset-0 text-[var(--glass-border)]" viewBox="0 0 100 100">
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = i * 10;
                const isMajor = angle % 30 === 0;
                return (
                  <line
                    key={i}
                    x1="50"
                    y1={isMajor ? "6" : "8"}
                    x2="50"
                    y2="10"
                    transform={`rotate(${angle} 50 50)`}
                    stroke="currentColor"
                    strokeWidth={isMajor ? "1.2" : "0.5"}
                    opacity={isMajor ? 0.9 : 0.4}
                  />
                );
              })}
            </svg>

            {/* Target Kaaba Icon Marker placed at Qibla Bearing angle */}
            <div
              className="absolute w-full h-full inset-0 flex items-start justify-center pointer-events-none"
              style={{
                transform: `rotate(${qiblaBearing}deg)`,
              }}
            >
              <div className="flex flex-col items-center -mt-2 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--royal)] via-[var(--primary)] to-[var(--accent)] border border-white/60 flex items-center justify-center shadow-[0_0_16px_var(--accent)] text-white">
                  <span className="text-[13px] font-bold">🕋</span>
                </div>
                <span className="text-[9px] font-bold text-[var(--accent)] bg-[var(--bg-el)]/90 px-1.5 py-0.5 rounded-full border border-[var(--accent)]/40 mt-1 shadow-sm font-cairo">
                  القبلة
                </span>
              </div>
            </div>

            {/* Center Axis Pin */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--navy)] to-[var(--bg-high)] border border-[var(--glass-border-2)] flex items-center justify-center shadow-lg z-20">
              <div className="w-4 h-4 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
            </div>

            {/* Glowing Pointer Needle pointing directly to Kaaba */}
            <div
              className="absolute w-full h-full inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300"
              style={{
                transform: `rotate(${qiblaBearing}deg)`,
              }}
            >
              {/* North / Kaaba Half Needle */}
              <div className="w-2 h-28 absolute top-8 bg-gradient-to-t from-[var(--primary)] to-[var(--accent)] rounded-t-full shadow-[0_0_14px_var(--accent)] flex items-start justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[14px] border-b-[var(--accent)] -mt-3 filter drop-shadow-[0_0_6px_var(--accent)]" />
              </div>
              {/* South / Opposite Half Needle */}
              <div className="w-1.5 h-20 absolute bottom-12 bg-white/10 rounded-b-full" />
            </div>
          </div>
        </div>

        {/* Degrees and Bearing Metrics Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg">
          <div className="p-4 rounded-2xl bg-[var(--glass-bg-2)] border border-[var(--glass-border)] text-center">
            <span className="text-[11px] text-[var(--text-muted)]">زاوية القبلة</span>
            <div className="font-mono text-2xl font-black text-[var(--accent)] mt-0.5">
              {qiblaBearing}°
            </div>
            <span className="text-[10px] text-[var(--text-secondary)]">من اتجاه الشمال الحقيقي</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--glass-bg-2)] border border-[var(--glass-border)] text-center">
            <span className="text-[11px] text-[var(--text-muted)]">المسافة إلى مكة</span>
            <div className="font-mono text-2xl font-black text-[var(--text)] mt-0.5">
              {distanceToKaaba.toLocaleString()}
            </div>
            <span className="text-[10px] text-[var(--text-secondary)]">كيلومتر</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-[var(--glass-bg-2)] border border-[var(--glass-border)] text-center">
            <span className="text-[11px] text-[var(--text-muted)]">الموقع النشط</span>
            <div className="text-base font-bold text-[var(--primary)] truncate mt-0.5">
              {isGpsActive ? 'موقعك عبر GPS' : selectedCity.name}
            </div>
            <span className="text-[10px] text-[var(--text-secondary)]">
              {isGpsActive ? `${currentCoords.lat.toFixed(2)}°, ${currentCoords.lng.toFixed(2)}°` : selectedCity.country}
            </span>
          </div>
        </div>

        {/* GPS Location Button and Manual Heading Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={requestLocation}
            disabled={isCalibrating}
            className="btn--lens text-xs"
          >
            <Navigation className={`w-4 h-4 text-[var(--accent)] ${isCalibrating ? 'animate-spin' : ''}`} />
            <span>{isCalibrating ? 'جارٍ تحديد موقعك...' : isGpsActive ? 'تحديث موقع GPS' : 'تحديد موقعي تلقائياً (GPS)'}</span>
          </button>

          {!hasCompassSensor && (
            <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
              <span>للحصول على البوصلة الدوارة الحية، افتح التطبيق على الهاتف المحمول المزود بمستشعر حركة.</span>
            </div>
          )}
        </div>

        {gpsError && (
          <p className="text-xs text-amber-400 mt-3 text-center">{gpsError}</p>
        )}
      </div>

      {/* City Presets Picker (24 Major Islamic & Global Cities) */}
      <div className="p-6 rounded-3xl liquid-glass-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-bold text-base text-[var(--text)]">أو اختر مدينتك لحساب القبلة فوراً:</h3>
          </div>
          <span className="text-xs text-[var(--text-muted)]">24 عاصمة ومدينة</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {CITY_PRESETS.map((city) => {
            const isSelected = !isGpsActive && selectedCity.name === city.name;
            return (
              <button
                key={city.name}
                onClick={() => {
                  setSelectedCity(city);
                  setUserCoords(null);
                  setIsGpsActive(false);
                }}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[var(--glass-bg-3)] border-[var(--accent)] shadow-[0_0_16px_rgba(32,199,232,0.25)]'
                    : 'bg-white/[0.02] border-white/5 hover:border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
              >
                <div className="font-bold text-xs truncate text-[var(--text)]">{city.name}</div>
                <div className="text-[10px] text-[var(--text-muted)] mt-1">{city.country}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
