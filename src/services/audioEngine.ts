import { AmbientSound } from '../types';

export interface PlaybackStatus {
  isLoaded: boolean;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  didJustFinish: boolean;
  isBuffering: boolean;
}

class AudioEngine {
  private recitationAudio: HTMLAudioElement | null = null;
  private ambientAudio: HTMLAudioElement | null = null;
  private onStatusUpdateCallback: ((status: PlaybackStatus) => void) | null = null;
  private statusInterval: number | null = null;

  private emitStatus(didJustFinish = false) {
    if (!this.onStatusUpdateCallback || !this.recitationAudio) return;
    this.onStatusUpdateCallback({
      isLoaded: true,
      isPlaying: !this.recitationAudio.paused,
      positionMillis: Math.floor(this.recitationAudio.currentTime * 1000),
      durationMillis: Math.floor((this.recitationAudio.duration || 0) * 1000),
      didJustFinish,
      isBuffering: this.recitationAudio.readyState < 3 && !this.recitationAudio.paused,
    });
  }

  // --- Recitation Audio Controls ---
  async loadAndPlayRecitation(
    url: string,
    onStatusUpdate: (status: PlaybackStatus) => void,
    initialVolume = 1.0
  ) {
    this.onStatusUpdateCallback = onStatusUpdate;

    if (this.recitationAudio) {
      this.recitationAudio.pause();
      this.recitationAudio.src = '';
      if (this.statusInterval) {
        clearInterval(this.statusInterval);
        this.statusInterval = null;
      }
    }

    const audio = new Audio();
    audio.src = url;
    audio.volume = Math.max(0, Math.min(1, initialVolume));
    audio.preload = 'auto';
    this.recitationAudio = audio;

    audio.addEventListener('timeupdate', () => this.emitStatus(false));
    audio.addEventListener('play', () => this.emitStatus(false));
    audio.addEventListener('pause', () => this.emitStatus(false));
    audio.addEventListener('ended', () => this.emitStatus(true));
    audio.addEventListener('waiting', () => this.emitStatus(false));
    audio.addEventListener('playing', () => this.emitStatus(false));
    audio.addEventListener('error', (e) => {
      console.warn('Audio playback error', e);
      this.emitStatus(false);
    });

    try {
      await audio.play();
    } catch (err) {
      console.warn('Autoplay may be waiting for user interaction', err);
    }

    if (this.statusInterval) clearInterval(this.statusInterval);
    this.statusInterval = window.setInterval(() => {
      if (this.recitationAudio && !this.recitationAudio.paused) {
        this.emitStatus(false);
      }
    }, 500);

    this.emitStatus(false);
    return audio;
  }

  async playRecitation() {
    if (this.recitationAudio) {
      try {
        await this.recitationAudio.play();
      } catch (err) {
        console.warn('Play error:', err);
      }
    }
  }

  async pauseRecitation() {
    if (this.recitationAudio) {
      this.recitationAudio.pause();
    }
  }

  async stopRecitation() {
    if (this.recitationAudio) {
      this.recitationAudio.pause();
      this.recitationAudio.currentTime = 0;
    }
  }

  async seekRecitation(positionMillis: number) {
    if (this.recitationAudio) {
      this.recitationAudio.currentTime = positionMillis / 1000;
      this.emitStatus(false);
    }
  }

  async setRecitationVolume(volume: number) {
    if (this.recitationAudio) {
      this.recitationAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  // --- Ambient Dual Audio Engine ---
  async loadAndPlayAmbient(ambient: AmbientSound, initialVolume = 0.5) {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.src = '';
    }

    try {
      const audio = new Audio();
      audio.src = typeof ambient.file === 'string' ? ambient.file : '';
      audio.loop = true;
      audio.volume = Math.max(0, Math.min(1, initialVolume));
      audio.preload = 'auto';
      this.ambientAudio = audio;

      await audio.play();
      return audio;
    } catch (error) {
      console.warn('Failed to load ambient sound', error);
      return null;
    }
  }

  async playAmbient(ambient: AmbientSound, initialVolume = 0.5) {
    return this.loadAndPlayAmbient(ambient, initialVolume);
  }

  async stopAmbient() {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.src = '';
      this.ambientAudio = null;
    }
  }

  async setAmbientVolume(volume: number) {
    if (this.ambientAudio) {
      this.ambientAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  async unloadAll() {
    if (this.statusInterval) clearInterval(this.statusInterval);
    if (this.recitationAudio) {
      this.recitationAudio.pause();
      this.recitationAudio.src = '';
      this.recitationAudio = null;
    }
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.src = '';
      this.ambientAudio = null;
    }
  }
}

export const audioEngine = new AudioEngine();
