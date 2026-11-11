declare module 'lucide-react-native' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';

  export interface LucideProps extends SvgProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    style?: any;
    fill?: string;
  }

  export type Icon = React.FC<LucideProps>;

  export const Home: Icon;
  export const Search: Icon;
  export const Users: Icon;
  export const ListMusic: Icon;
  export const BarChart2: Icon;
  export const Settings: Icon;
  export const Play: Icon;
  export const Pause: Icon;
  export const Disc: Icon;
  export const CloudRain: Icon;
  export const Flame: Icon;
  export const Waves: Icon;
  export const Sun: Icon;
  export const Wind: Icon;
  export const Droplet: Icon;
  export const Heart: Icon;
  export const VolumeX: Icon;
  export const Volume2: Icon;
  export const X: Icon;
  export const ChevronDown: Icon;
  export const ChevronLeft: Icon;
  export const ArrowLeft: Icon;
  export const SkipBack: Icon;
  export const SkipForward: Icon;
  export const RotateCcw: Icon;
  export const RotateCw: Icon;
  export const BookOpen: Icon;
  export const User: Icon;
  export const Clock: Icon;
  export const Headphones: Icon;
  export const Sparkles: Icon;
  export const Check: Icon;
  export const CheckCircle2: Icon;
  export const Award: Icon;
  export const Target: Icon;
  export const Download: Icon;
  export const Bell: Icon;
  export const Shield: Icon;
  export const Smartphone: Icon;
  export const Info: Icon;
  export const Moon: Icon;
  export const Trash2: Icon;
}
