export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface HijriDate {
  date: string;
  day: string;
  weekday: string;
  monthNameAr: string;
  monthNameEn: string;
  year: string;
}

export interface CityOption {
  id: string;
  arabicName: string;
  englishCity: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export const CITIES_LIST: CityOption[] = [
  { id: 'makkah', arabicName: 'مكة المكرمة', englishCity: 'Makkah', country: 'Saudi Arabia' },
  { id: 'madinah', arabicName: 'المدينة المنورة', englishCity: 'Medina', country: 'Saudi Arabia' },
  { id: 'riyadh', arabicName: 'الرياض', englishCity: 'Riyadh', country: 'Saudi Arabia' },
  { id: 'jerusalem', arabicName: 'القدس الشريف', englishCity: 'Jerusalem', country: 'Palestine' },
  { id: 'cairo', arabicName: 'القاهرة', englishCity: 'Cairo', country: 'Egypt' },
  { id: 'dubai', arabicName: 'دبي', englishCity: 'Dubai', country: 'United Arab Emirates' },
  { id: 'istanbul', arabicName: 'إسطنبول', englishCity: 'Istanbul', country: 'Turkey' },
  { id: 'amman', arabicName: 'عمّان', englishCity: 'Amman', country: 'Jordan' },
  { id: 'doha', arabicName: 'الدوحة', englishCity: 'Doha', country: 'Qatar' },
  { id: 'casablanca', arabicName: 'الدار البيضاء', englishCity: 'Casablanca', country: 'Morocco' },
];

export interface PrayerData {
  timings: PrayerTimings;
  hijri: HijriDate;
  city: CityOption;
}

export interface NextPrayerInfo {
  name: string;
  englishKey: keyof PrayerTimings;
  time: string;
  time12: string;
  remainingSeconds: number;
  remainingText: string;
}

export class PrayerService {
  private static cachedData: Record<string, PrayerData> = {};

  static async getPrayerTimes(city: CityOption): Promise<PrayerData> {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `${city.id}-${today}`;

    if (this.cachedData[cacheKey]) {
      return this.cachedData[cacheKey];
    }

    try {
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
        city.englishCity
      )}&country=${encodeURIComponent(city.country)}&method=4`;

      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        if (json.data && json.data.timings) {
          const h = json.data.date?.hijri;
          const data: PrayerData = {
            timings: {
              Fajr: json.data.timings.Fajr.split(' ')[0],
              Sunrise: json.data.timings.Sunrise.split(' ')[0],
              Dhuhr: json.data.timings.Dhuhr.split(' ')[0],
              Asr: json.data.timings.Asr.split(' ')[0],
              Maghrib: json.data.timings.Maghrib.split(' ')[0],
              Isha: json.data.timings.Isha.split(' ')[0],
            },
            hijri: {
              date: typeof h?.date === 'string' ? h.date : '',
              day: typeof h?.day === 'string' ? h.day : String(h?.day || ''),
              weekday: typeof h?.weekday === 'object' && h.weekday?.ar ? h.weekday.ar : '',
              monthNameAr: typeof h?.month === 'object' && h.month?.ar ? h.month.ar : 'جُمادى الآخرة',
              monthNameEn: typeof h?.month === 'object' && h.month?.en ? h.month.en : 'Jumada al-Akhirah',
              year: typeof h?.year === 'string' ? h.year : String(h?.year || '1448'),
            },
            city,
          };
          this.cachedData[cacheKey] = data;
          return data;
        }
      }
    } catch (e) {
      console.warn('Aladhan API fetch failed, falling back to offline defaults', e);
    }

    // Default fallback timings
    const fallback: PrayerData = {
      timings: {
        Fajr: '05:10',
        Sunrise: '06:29',
        Dhuhr: '12:05',
        Asr: '15:18',
        Maghrib: '17:40',
        Isha: '19:10',
      },
      hijri: {
        date: '01-06-1448',
        day: '1',
        weekday: 'الاربعاء',
        monthNameAr: 'جُمادى الآخرة',
        monthNameEn: 'Jumada al-Akhirah',
        year: '1448',
      },
      city,
    };
    return fallback;
  }

  static formatTo12Hour(time24: string): string {
    if (!time24) return '';
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'م' : 'ص';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  }

  static calculateNextPrayer(timings: PrayerTimings): NextPrayerInfo {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();

    const prayers: { key: keyof PrayerTimings; name: string }[] = [
      { key: 'Fajr', name: 'الفجر' },
      { key: 'Sunrise', name: 'الشروق' },
      { key: 'Dhuhr', name: 'الظهر' },
      { key: 'Asr', name: 'العصر' },
      { key: 'Maghrib', name: 'المغرب' },
      { key: 'Isha', name: 'العشاء' },
    ];

    for (const prayer of prayers) {
      const timeStr = timings[prayer.key];
      if (!timeStr) continue;
      const [h, m] = timeStr.split(':').map(Number);
      const prayerMinutes = h * 60 + m;

      if (prayerMinutes > currentMinutes) {
        const diffSeconds = (prayerMinutes - currentMinutes) * 60 - currentSeconds;
        return {
          name: prayer.name,
          englishKey: prayer.key,
          time: timeStr,
          time12: this.formatTo12Hour(timeStr),
          remainingSeconds: Math.max(0, diffSeconds),
          remainingText: this.formatRemainingTime(diffSeconds),
        };
      }
    }

    // If past Isha, next is Fajr tomorrow
    const [fajrH, fajrM] = timings.Fajr.split(':').map(Number);
    const fajrMinutesTomorrow = 24 * 60 + (fajrH * 60 + fajrM);
    const diffSeconds = (fajrMinutesTomorrow - currentMinutes) * 60 - currentSeconds;

    return {
      name: 'الفجر',
      englishKey: 'Fajr',
      time: timings.Fajr,
      time12: this.formatTo12Hour(timings.Fajr),
      remainingSeconds: Math.max(0, diffSeconds),
      remainingText: this.formatRemainingTime(diffSeconds),
    };
  }

  static formatRemainingTime(secondsTotal: number): string {
    const s = Math.max(0, secondsTotal);
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    if (hours > 0) {
      return `${hours} س و ${minutes} د`;
    }
    return `${minutes} د و ${seconds} ث`;
  }
}
