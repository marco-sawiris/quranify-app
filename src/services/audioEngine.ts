import { Audio, AVPlaybackStatus } from 'expo-av';
import { AmbientSound } from '../types';

class AudioEngine {
  private recitationSound: Audio.Sound | null = null;
  private ambientSound: Audio.Sound | null = null;
  private isInitialized = false;

  async init() {
    if (this.isInitialized) return;
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioEngine init error', e);
    }
  }

  // --- Recitation Audio Controls ---
  async loadAndPlayRecitation(
    url: string,
    onStatusUpdate: (status: AVPlaybackStatus) => void,
    initialVolume = 1.0
  ) {
    await this.init();

    if (this.recitationSound) {
      try {
        await this.recitationSound.stopAsync();
        await this.recitationSound.unloadAsync();
      } catch (e) {
        // ignore
      }
      this.recitationSound = null;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, volume: initialVolume },
        onStatusUpdate
      );
      this.recitationSound = sound;
      return sound;
    } catch (error) {
      console.error('Failed to load recitation', error);
      throw error;
    }
  }

  async playRecitation() {
    if (this.recitationSound) {
      await this.recitationSound.playAsync();
    }
  }

  async pauseRecitation() {
    if (this.recitationSound) {
      await this.recitationSound.pauseAsync();
    }
  }

  async seekRecitation(positionMillis: number) {
    if (this.recitationSound) {
      await this.recitationSound.setPositionAsync(positionMillis);
    }
  }

  async setRecitationVolume(volume: number) {
    if (this.recitationSound) {
      await this.recitationSound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    }
  }

  // --- Ambient Background Sound Controls ---
  async playAmbient(ambient: AmbientSound, volume = 0.5) {
    await this.init();

    if (this.ambientSound) {
      try {
        await this.ambientSound.stopAsync();
        await this.ambientSound.unloadAsync();
      } catch (e) {
        // ignore
      }
      this.ambientSound = null;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        ambient.file,
        {
          isLooping: true,
          shouldPlay: true,
          volume: Math.max(0, Math.min(1, volume)),
        }
      );
      this.ambientSound = sound;
    } catch (error) {
      console.error('Failed to play ambient sound', error);
    }
  }

  async stopAmbient() {
    if (this.ambientSound) {
      try {
        await this.ambientSound.stopAsync();
        await this.ambientSound.unloadAsync();
      } catch (e) {
        // ignore
      }
      this.ambientSound = null;
    }
  }

  async setAmbientVolume(volume: number) {
    if (this.ambientSound) {
      await this.ambientSound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    }
  }

  async stopAll() {
    await this.pauseRecitation();
    await this.stopAmbient();
  }
}

export const audioEngine = new AudioEngine();
