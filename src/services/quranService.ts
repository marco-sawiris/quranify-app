import surahNamesAr from '../../assets/data/surah_names_ar.json';

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  revelationType: 'مكية' | 'مدنية';
  numberOfAyahs: number;
}

// Meta table for the 114 Surahs
export const SURAH_METADATA: SurahMeta[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', revelationType: 'مكية', numberOfAyahs: 7 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', revelationType: 'مدنية', numberOfAyahs: 286 },
  { number: 3, name: 'آل عمران', englishName: 'Ali \'Imran', revelationType: 'مدنية', numberOfAyahs: 200 },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', revelationType: 'مدنية', numberOfAyahs: 176 },
  { number: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', revelationType: 'مدنية', numberOfAyahs: 120 },
  { number: 6, name: 'الأنعام', englishName: 'Al-An\'am', revelationType: 'مكية', numberOfAyahs: 165 },
  { number: 7, name: 'الأعراف', englishName: 'Al-A\'raf', revelationType: 'مكية', numberOfAyahs: 206 },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', revelationType: 'مدنية', numberOfAyahs: 75 },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', revelationType: 'مدنية', numberOfAyahs: 129 },
  { number: 10, name: 'يونس', englishName: 'Yunus', revelationType: 'مكية', numberOfAyahs: 109 },
  { number: 11, name: 'هود', englishName: 'Hud', revelationType: 'مكية', numberOfAyahs: 123 },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', revelationType: 'مكية', numberOfAyahs: 111 },
  { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', revelationType: 'مدنية', numberOfAyahs: 43 },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', revelationType: 'مكية', numberOfAyahs: 52 },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', revelationType: 'مكية', numberOfAyahs: 99 },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', revelationType: 'مكية', numberOfAyahs: 128 },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra', revelationType: 'مكية', numberOfAyahs: 111 },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', revelationType: 'مكية', numberOfAyahs: 110 },
  { number: 19, name: 'مريم', englishName: 'Maryam', revelationType: 'مكية', numberOfAyahs: 98 },
  { number: 20, name: 'طه', englishName: 'Ta-Ha', revelationType: 'مكية', numberOfAyahs: 135 },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', revelationType: 'مكية', numberOfAyahs: 112 },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', revelationType: 'مدنية', numberOfAyahs: 78 },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Mu\'minun', revelationType: 'مكية', numberOfAyahs: 118 },
  { number: 24, name: 'النور', englishName: 'An-Nur', revelationType: 'مدنية', numberOfAyahs: 64 },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', revelationType: 'مكية', numberOfAyahs: 77 },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shu\'ara', revelationType: 'مكية', numberOfAyahs: 227 },
  { number: 27, name: 'النمل', englishName: 'An-Naml', revelationType: 'مكية', numberOfAyahs: 93 },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', revelationType: 'مكية', numberOfAyahs: 88 },
  { number: 29, name: 'العنكبوت', englishName: 'Al-\'Ankabut', revelationType: 'مكية', numberOfAyahs: 69 },
  { number: 30, name: 'الروم', englishName: 'Ar-Rum', revelationType: 'مكية', numberOfAyahs: 60 },
  { number: 31, name: 'لقمان', englishName: 'Luqman', revelationType: 'مكية', numberOfAyahs: 34 },
  { number: 32, name: 'السجدة', englishName: 'As-Sajdah', revelationType: 'مكية', numberOfAyahs: 30 },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', revelationType: 'مدنية', numberOfAyahs: 73 },
  { number: 34, name: 'سبأ', englishName: 'Saba', revelationType: 'مكية', numberOfAyahs: 54 },
  { number: 35, name: 'فاطر', englishName: 'Fatir', revelationType: 'مكية', numberOfAyahs: 45 },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', revelationType: 'مكية', numberOfAyahs: 83 },
  { number: 37, name: 'الصافات', englishName: 'As-Saffat', revelationType: 'مكية', numberOfAyahs: 182 },
  { number: 38, name: 'ص', englishName: 'Sad', revelationType: 'مكية', numberOfAyahs: 88 },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', revelationType: 'مكية', numberOfAyahs: 75 },
  { number: 40, name: 'غافر', englishName: 'Ghafir', revelationType: 'مكية', numberOfAyahs: 85 },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', revelationType: 'مكية', numberOfAyahs: 54 },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', revelationType: 'مكية', numberOfAyahs: 53 },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', revelationType: 'مكية', numberOfAyahs: 89 },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', revelationType: 'مكية', numberOfAyahs: 59 },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', revelationType: 'مكية', numberOfAyahs: 37 },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', revelationType: 'مكية', numberOfAyahs: 35 },
  { number: 47, name: 'محمد', englishName: 'Muhammad', revelationType: 'مدنية', numberOfAyahs: 38 },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', revelationType: 'مدنية', numberOfAyahs: 29 },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', revelationType: 'مدنية', numberOfAyahs: 18 },
  { number: 50, name: 'ق', englishName: 'Qaf', revelationType: 'مكية', numberOfAyahs: 45 },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', revelationType: 'مكية', numberOfAyahs: 60 },
  { number: 52, name: 'الطور', englishName: 'At-Tur', revelationType: 'مكية', numberOfAyahs: 49 },
  { number: 53, name: 'النجم', englishName: 'An-Najm', revelationType: 'مكية', numberOfAyahs: 62 },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', revelationType: 'مكية', numberOfAyahs: 55 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', revelationType: 'مدنية', numberOfAyahs: 78 },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', revelationType: 'مكية', numberOfAyahs: 96 },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', revelationType: 'مدنية', numberOfAyahs: 29 },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', revelationType: 'مدنية', numberOfAyahs: 22 },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', revelationType: 'مدنية', numberOfAyahs: 24 },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', revelationType: 'مدنية', numberOfAyahs: 13 },
  { number: 61, name: 'الصف', englishName: 'As-Saff', revelationType: 'مدنية', numberOfAyahs: 14 },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'ah', revelationType: 'مدنية', numberOfAyahs: 11 },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', revelationType: 'مدنية', numberOfAyahs: 11 },
  { number: 64, name: 'التغابن', englishName: 'At-Taghabun', revelationType: 'مدنية', numberOfAyahs: 18 },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaq', revelationType: 'مدنية', numberOfAyahs: 12 },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', revelationType: 'مدنية', numberOfAyahs: 12 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', revelationType: 'مكية', numberOfAyahs: 30 },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', revelationType: 'مكية', numberOfAyahs: 52 },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', revelationType: 'مكية', numberOfAyahs: 52 },
  { number: 70, name: 'المعارج', englishName: 'Al-Ma\'arij', revelationType: 'مكية', numberOfAyahs: 44 },
  { number: 71, name: 'نوح', englishName: 'Nuh', revelationType: 'مكية', numberOfAyahs: 28 },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', revelationType: 'مكية', numberOfAyahs: 28 },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', revelationType: 'مكية', numberOfAyahs: 20 },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', revelationType: 'مكية', numberOfAyahs: 56 },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', revelationType: 'مكية', numberOfAyahs: 40 },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insan', revelationType: 'مدنية', numberOfAyahs: 31 },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', revelationType: 'مكية', numberOfAyahs: 50 },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', revelationType: 'مكية', numberOfAyahs: 40 },
  { number: 79, name: 'النازعات', englishName: 'An-Nazi\'at', revelationType: 'مكية', numberOfAyahs: 46 },
  { number: 80, name: 'عبس', englishName: '\'Abasa', revelationType: 'مكية', numberOfAyahs: 42 },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', revelationType: 'مكية', numberOfAyahs: 29 },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', revelationType: 'مكية', numberOfAyahs: 19 },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', revelationType: 'مكية', numberOfAyahs: 36 },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', revelationType: 'مكية', numberOfAyahs: 25 },
  { number: 85, name: 'البروج', englishName: 'Al-Buruj', revelationType: 'مكية', numberOfAyahs: 22 },
  { number: 86, name: 'الطارق', englishName: 'At-Tariq', revelationType: 'مكية', numberOfAyahs: 17 },
  { number: 87, name: 'الأعلى', englishName: 'Al-A\'la', revelationType: 'مكية', numberOfAyahs: 19 },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', revelationType: 'مكية', numberOfAyahs: 26 },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', revelationType: 'مكية', numberOfAyahs: 30 },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', revelationType: 'مكية', numberOfAyahs: 20 },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', revelationType: 'مكية', numberOfAyahs: 15 },
  { number: 92, name: 'الليل', englishName: 'Al-Layl', revelationType: 'مكية', numberOfAyahs: 21 },
  { number: 93, name: 'الضحى', englishName: 'Ad-Duha', revelationType: 'مكية', numberOfAyahs: 11 },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', revelationType: 'مكية', numberOfAyahs: 8 },
  { number: 95, name: 'التين', englishName: 'At-Tin', revelationType: 'مكية', numberOfAyahs: 8 },
  { number: 96, name: 'العلق', englishName: 'Al-\'Alaq', revelationType: 'مكية', numberOfAyahs: 19 },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', revelationType: 'مكية', numberOfAyahs: 5 },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', revelationType: 'مدنية', numberOfAyahs: 8 },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', revelationType: 'مدنية', numberOfAyahs: 8 },
  { number: 100, name: 'العاديات', englishName: 'Al-\'Adiyat', revelationType: 'مكية', numberOfAyahs: 11 },
  { number: 101, name: 'القارعة', englishName: 'Al-Qari\'ah', revelationType: 'مكية', numberOfAyahs: 11 },
  { number: 102, name: 'التكاثر', englishName: 'At-Takathur', revelationType: 'مكية', numberOfAyahs: 8 },
  { number: 103, name: 'العصر', englishName: 'Al-\'Asr', revelationType: 'مكية', numberOfAyahs: 3 },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', revelationType: 'مكية', numberOfAyahs: 9 },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil', revelationType: 'مكية', numberOfAyahs: 5 },
  { number: 106, name: 'قريش', englishName: 'Quraysh', revelationType: 'مكية', numberOfAyahs: 4 },
  { number: 107, name: 'الماعون', englishName: 'Al-Ma\'un', revelationType: 'مكية', numberOfAyahs: 7 },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', revelationType: 'مكية', numberOfAyahs: 3 },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', revelationType: 'مكية', numberOfAyahs: 6 },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', revelationType: 'مدنية', numberOfAyahs: 3 },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', revelationType: 'مكية', numberOfAyahs: 5 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', revelationType: 'مكية', numberOfAyahs: 4 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', revelationType: 'مكية', numberOfAyahs: 5 },
  { number: 114, name: 'الناس', englishName: 'An-Nas', revelationType: 'مكية', numberOfAyahs: 6 }
];

export class QuranService {
  static getAllSurahs(): SurahMeta[] {
    return SURAH_METADATA;
  }

  static getSurahMeta(surahNumber: number): SurahMeta | undefined {
    return SURAH_METADATA.find(s => s.number === surahNumber);
  }

  static searchSurahs(query: string): SurahMeta[] {
    if (!query.trim()) return SURAH_METADATA;
    const cleanQuery = query.trim().toLowerCase();
    return SURAH_METADATA.filter(s => 
      s.name.includes(cleanQuery) || 
      s.englishName.toLowerCase().includes(cleanQuery) ||
      s.number.toString() === cleanQuery
    );
  }

  static getSurahAudioUrl(audioServer: string, surahNumber: number): string {
    const formattedNum = surahNumber.toString().padStart(3, '0');
    return `${audioServer}${formattedNum}.mp3`;
  }
}
