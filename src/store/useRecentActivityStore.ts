import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface RecentActivity {
  id: string;
  type: 'read' | 'listen';
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  numberOfAyahs: number;
  revelationType: 'مكية' | 'مدنية';
  reciterId?: string;
  reciterName?: string;
  ayahNumber?: number;
  progressPercent?: number;
  timestamp: number;
}

interface RecentActivityState {
  activities: RecentActivity[];
  recordActivity: (item: Omit<RecentActivity, 'id' | 'timestamp'>) => void;
  removeActivity: (id: string) => void;
  clearActivities: () => void;
}

const INITIAL_ACTIVITIES: RecentActivity[] = [
  {
    id: 'listen-18',
    type: 'listen',
    surahNumber: 18,
    surahName: 'الكهف',
    surahEnglishName: 'Al-Kahf',
    numberOfAyahs: 110,
    revelationType: 'مكية',
    reciterId: 'mishary_alafasy',
    reciterName: 'مشاري راشد العفاسي',
    progressPercent: 35,
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
  },
  {
    id: 'read-2',
    type: 'read',
    surahNumber: 2,
    surahName: 'البقرة',
    surahEnglishName: 'Al-Baqarah',
    numberOfAyahs: 286,
    revelationType: 'مدنية',
    ayahNumber: 255, // Ayat al-Kursi
    progressPercent: 88,
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
  },
  {
    id: 'listen-67',
    type: 'listen',
    surahNumber: 67,
    surahName: 'الملك',
    surahEnglishName: 'Al-Mulk',
    numberOfAyahs: 30,
    revelationType: 'مكية',
    reciterId: 'maher_almuaiqly',
    reciterName: 'ماهر المعيقلي',
    progressPercent: 70,
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // yesterday
  },
];

export const useRecentActivityStore = create<RecentActivityState>()(
  persist(
    (set, get) => ({
      activities: INITIAL_ACTIVITIES,

      recordActivity: (item) => {
        const id = `${item.type}-${item.surahNumber}`;
        const currentList = get().activities.filter((a) => a.id !== id);
        const newActivity: RecentActivity = {
          ...item,
          id,
          timestamp: Date.now(),
        };
        // Keep the latest 10 activities at most
        const updated = [newActivity, ...currentList].slice(0, 10);
        set({ activities: updated });
      },

      removeActivity: (id) => {
        set({ activities: get().activities.filter((a) => a.id !== id) });
      },

      clearActivities: () => {
        set({ activities: [] });
      },
    }),
    {
      name: 'quranify-recent-activities-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
