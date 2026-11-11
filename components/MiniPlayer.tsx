import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Pause, Disc, CloudRain } from 'lucide-react-native';
import { usePlayerStore } from '../src/store/usePlayerStore';

export const MiniPlayer: React.FC = () => {
  const router = useRouter();
  const {
    currentSurah,
    currentReciter,
    isPlaying,
    togglePlayPause,
    position,
    duration,
    activeAmbient,
  } = usePlayerStore();

  const progress = duration > 0 ? Math.min(1, position / duration) : 0;

  return (
    <Pressable
      onPress={() => router.push('/player')}
      style={styles.container}
    >
      {/* Progress line */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.content}>
        {/* Disc Icon */}
        <View style={styles.iconContainer}>
          <Disc size={26} color="#10B981" />
        </View>

        {/* Track Info */}
        <View style={styles.textContainer}>
          <Text style={styles.surahTitle} numberOfLines={1}>
            سورة {currentSurah.name}
          </Text>
          <Text style={styles.reciterName} numberOfLines={1}>
            {currentReciter.arabicName}
          </Text>
        </View>

        {/* Ambient Badge if active */}
        {activeAmbient && (
          <View style={styles.ambientBadge}>
            <CloudRain size={14} color="#38BDF8" />
            <Text style={styles.ambientText}>{activeAmbient.arabicTitle}</Text>
          </View>
        )}

        {/* Play/Pause Button */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
          style={styles.playButton}
          activeOpacity={0.8}
        >
          {isPlaying ? (
            <Pause size={20} color="#FFFFFF" />
          ) : (
            <Play size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
          )}
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 56, // Above standard tab bar
    left: 12,
    right: 12,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: '#334155',
    width: '100%',
  },
  progressBarFill: {
    height: 3,
    backgroundColor: '#10B981',
  },
  content: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surahTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  reciterName: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  ambientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
    gap: 4,
  },
  ambientText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
  },
  playButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
