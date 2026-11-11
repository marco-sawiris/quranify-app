import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  hasCompletedOnboarding: boolean;
  userName: string;
  isReady: boolean;
  isPremium: boolean; // Always unlocked for all users for free
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setUserName: (name: string) => void;
  setReady: (ready: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      userName: 'محب القرآن',
      isReady: false,
      isPremium: true, // All features 100% unlocked for free without login or paywall
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
      setUserName: (name: string) => set({ userName: name }),
      setReady: (ready: boolean) => set({ isReady: ready }),
    }),
    {
      name: 'quranify-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setReady(true);
      },
    }
  )
);
