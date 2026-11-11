import { create } from 'zustand';
import { Reciter, AmbientSound, SurahData } from '../types';
import { RECITERS } from '../constants/reciters';
import { AMBIENT_SOUNDS } from '../constants/ambientSounds';
import { QuranService, SurahMeta } from '../services/quranService';
import { audioEngine } from '../services/audioEngine';

interface PlayerState {
  // Current track
  currentSurah: SurahMeta;
  currentReciter: Reciter;
  isPlaying: boolean;
  isBuffering: boolean;
  position: number;
  duration: number;
  recitationVolume: number;

  // Active Aya & Full Surah Content
  activeAyaNumber: number;
  surahContent: SurahData | null;

  // Ambient sound
  activeAmbient: AmbientSound | null;
  ambientVolume: number;
  isAmbientPlaying: boolean;

  // Sleep timer
  sleepTimerMinutes: number | null;
  sleepTimerRemaining: number | null;

  // Actions
  playSurah: (surah: SurahMeta, reciter?: Reciter) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setRecitationVolume: (volume: number) => Promise<void>;
  changeReciter: (reciter: Reciter) => Promise<void>;
  nextSurah: () => Promise<void>;
  prevSurah: () => Promise<void>;

  // Ambient Actions
  toggleAmbient: (ambient: AmbientSound) => Promise<void>;
  setAmbientVolume: (volume: number) => Promise<void>;
  stopAmbient: () => Promise<void>;

  // Sleep Timer
  setSleepTimer: (minutes: number | null) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSurah: QuranService.getAllSurahs()[0], // Al-Fatihah
  currentReciter: RECITERS[0], // Mishary Alafasy
  isPlaying: false,
  isBuffering: false,
  position: 0,
  duration: 0,
  recitationVolume: 1.0,

  activeAyaNumber: 1,
  surahContent: null,

  activeAmbient: null,
  ambientVolume: 0.5,
  isAmbientPlaying: false,

  sleepTimerMinutes: null,
  sleepTimerRemaining: null,

  playSurah: async (surah, reciter) => {
    const targetReciter = reciter || get().currentReciter;
    const audioUrl = QuranService.getSurahAudioUrl(targetReciter.audioServer, surah.number);

    set({
      currentSurah: surah,
      currentReciter: targetReciter,
      isBuffering: true,
      position: 0,
      activeAyaNumber: 1,
    });

    try {
      await audioEngine.loadAndPlayRecitation(
        audioUrl,
        (status) => {
          if (!status.isLoaded) {
            set({ isBuffering: true });
            return;
          }

          set({
            isPlaying: status.isPlaying,
            isBuffering: status.isBuffering,
            position: status.positionMillis,
            duration: status.durationMillis || 0,
          });

          // Sync active Aya estimation based on progress
          if (status.durationMillis && surah.numberOfAyahs > 0) {
            const progress = status.positionMillis / status.durationMillis;
            const estimatedAya = Math.min(
              surah.numberOfAyahs,
              Math.max(1, Math.ceil(progress * surah.numberOfAyahs))
            );
            set({ activeAyaNumber: estimatedAya });
          }

          if (status.didJustFinish) {
            get().nextSurah();
          }
        },
        get().recitationVolume
      );
      set({ isPlaying: true, isBuffering: false });
    } catch (error) {
      console.error('Playback failed', error);
      set({ isPlaying: false, isBuffering: false });
    }
  },

  togglePlayPause: async () => {
    const { isPlaying } = get();
    if (isPlaying) {
      await audioEngine.pauseRecitation();
      set({ isPlaying: false });
    } else {
      await audioEngine.playRecitation();
      set({ isPlaying: true });
    }
  },

  seekTo: async (position) => {
    set({ position });
    await audioEngine.seekRecitation(position);
  },

  setRecitationVolume: async (volume) => {
    set({ recitationVolume: volume });
    await audioEngine.setRecitationVolume(volume);
  },

  changeReciter: async (reciter) => {
    const { currentSurah, isPlaying } = get();
    set({ currentReciter: reciter });
    if (isPlaying) {
      await get().playSurah(currentSurah, reciter);
    }
  },

  nextSurah: async () => {
    const { currentSurah, currentReciter } = get();
    const nextNumber = currentSurah.number >= 114 ? 1 : currentSurah.number + 1;
    const next = QuranService.getSurahMeta(nextNumber);
    if (next) {
      await get().playSurah(next, currentReciter);
    }
  },

  prevSurah: async () => {
    const { currentSurah, currentReciter } = get();
    const prevNumber = currentSurah.number <= 1 ? 114 : currentSurah.number - 1;
    const prev = QuranService.getSurahMeta(prevNumber);
    if (prev) {
      await get().playSurah(prev, currentReciter);
    }
  },

  toggleAmbient: async (ambient) => {
    const { activeAmbient, isAmbientPlaying, ambientVolume } = get();
    if (activeAmbient?.id === ambient.id && isAmbientPlaying) {
      await audioEngine.stopAmbient();
      set({ activeAmbient: null, isAmbientPlaying: false });
    } else {
      await audioEngine.playAmbient(ambient, ambientVolume);
      set({ activeAmbient: ambient, isAmbientPlaying: true });
    }
  },

  setAmbientVolume: async (volume) => {
    set({ ambientVolume: volume });
    await audioEngine.setAmbientVolume(volume);
  },

  stopAmbient: async () => {
    await audioEngine.stopAmbient();
    set({ activeAmbient: null, isAmbientPlaying: false });
  },

  setSleepTimer: (minutes) => {
    set({ sleepTimerMinutes: minutes, sleepTimerRemaining: minutes ? minutes * 60 : null });
  },
}));
