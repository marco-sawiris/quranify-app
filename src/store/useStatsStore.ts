import { create } from 'zustand';

interface StatsState {
  streakDays: number;
  dailyGoalMinutes: number;
  todayMinutesListened: number;
  totalHoursListened: number;
  favoriteSurahs: number[];
  favoriteReciters: string[];
  
  // Actions
  toggleFavoriteSurah: (surahNumber: number) => void;
  toggleFavoriteReciter: (reciterId: string) => void;
  addListenedSeconds: (seconds: number) => void;
  setDailyGoalMinutes: (minutes: number) => void;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  streakDays: 7,
  dailyGoalMinutes: 30,
  todayMinutesListened: 18,
  totalHoursListened: 46.5,
  favoriteSurahs: [1, 18, 36, 55, 67],
  favoriteReciters: ['mishary_alafasy', 'abdulbasit_murattal'],

  toggleFavoriteSurah: (surahNumber) => {
    const { favoriteSurahs } = get();
    if (favoriteSurahs.includes(surahNumber)) {
      set({ favoriteSurahs: favoriteSurahs.filter(id => id !== surahNumber) });
    } else {
      set({ favoriteSurahs: [...favoriteSurahs, surahNumber] });
    }
  },

  toggleFavoriteReciter: (reciterId) => {
    const { favoriteReciters } = get();
    if (favoriteReciters.includes(reciterId)) {
      set({ favoriteReciters: favoriteReciters.filter(id => id !== reciterId) });
    } else {
      set({ favoriteReciters: [...favoriteReciters, reciterId] });
    }
  },

  addListenedSeconds: (seconds) => {
    const addedMinutes = seconds / 60;
    set(state => ({
      todayMinutesListened: Math.round((state.todayMinutesListened + addedMinutes) * 10) / 10,
      totalHoursListened: Math.round((state.totalHoursListened + addedMinutes / 60) * 10) / 10,
    }));
  },

  setDailyGoalMinutes: (minutes) => {
    set({ dailyGoalMinutes: minutes });
  },
}));
