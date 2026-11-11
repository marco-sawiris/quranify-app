export interface Verse {
  [key: string]: string;
}

export interface SurahData {
  index: string;
  name: string;
  arabicName?: string;
  englishName?: string;
  verse: Record<string, string>;
  count: number;
  juz: Array<{
    index: string;
    verse: {
      start: string;
      end: string;
    };
  }>;
}

export interface Reciter {
  id: string;
  name: string;
  subname: string;
  arabicName: string;
  image: string;
  audioServer: string; // Server base URL for 001.mp3 to 114.mp3
}

export interface AmbientSound {
  id: string;
  title: string;
  arabicTitle: string;
  icon: string;
  file: any;
  defaultVolume: number;
}

export interface Playlist {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  image: string;
  surahIds: number[];
  color: string;
}

export interface AudioStory {
  id: string;
  title: string;
  arabicTitle: string;
  category: string;
  duration: string;
  narrator: string;
  image: string;
  description: string;
}
