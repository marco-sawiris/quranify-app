import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  hasCompletedOnboarding: boolean;
  userName: string;
  isReady: boolean;
  isPremium: boolean;
  theme: 'dark' | 'sepia' | 'emerald' | 'light';
  fontSize: number;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setUserName: (name: string) => void;
  setReady: (ready: boolean) => void;
  setTheme: (theme: 'dark' | 'sepia' | 'emerald' | 'light') => void;
  setFontSize: (size: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: true,
      userName: 'محب القرآن',
      isReady: true,
      isPremium: true,
      theme: 'dark',
      fontSize: 24,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
      setUserName: (name: string) => set({ userName: name }),
      setReady: (ready: boolean) => set({ isReady: ready }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: 'quranify-app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
