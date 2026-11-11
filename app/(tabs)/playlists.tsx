import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, BookOpen, Clock, ListMusic } from 'lucide-react-native';
import { PLAYLISTS, AUDIO_STORIES } from '../../src/constants/playlists';
import { QuranService } from '../../src/services/quranService';
import { usePlayerStore } from '../../src/store/usePlayerStore';

export default function PlaylistsScreen() {
  const [activeTab, setActiveTab] = useState<'playlists' | 'stories'>('playlists');
  const { playSurah } = usePlayerStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>المكتبة الصوتية</Text>
        <Text style={styles.screenSubtitle}>
          قوائم مختارة للسكينة والتدبر وقصص من هدي القرآن الكريم
        </Text>
      </View>

      {/* Segment Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          onPress={() => setActiveTab('stories')}
          style={[styles.tabButton, activeTab === 'stories' && styles.tabButtonActive]}
        >
          <BookOpen
            size={16}
            color={activeTab === 'stories' ? '#0F172A' : '#94A3B8'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'stories' && styles.tabTextActive,
            ]}
          >
            القصص الصوتية
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('playlists')}
          style={[
            styles.tabButton,
            activeTab === 'playlists' && styles.tabButtonActive,
          ]}
        >
          <ListMusic
            size={16}
            color={activeTab === 'playlists' ? '#0F172A' : '#94A3B8'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'playlists' && styles.tabTextActive,
            ]}
          >
            قوائم التشغيل
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollList}>
        {activeTab === 'playlists' ? (
          <View style={styles.cardsContainer}>
            {PLAYLISTS.map((pl) => (
              <TouchableOpacity
                key={pl.id}
                style={[styles.playlistCard, { backgroundColor: pl.color }]}
                activeOpacity={0.8}
                onPress={() => {
                  const targetSurah = QuranService.getSurahMeta(pl.surahIds[0]);
                  if (targetSurah) playSurah(targetSurah);
                }}
              >
                <View style={styles.playlistContent}>
                  <Text style={styles.playlistTitle}>{pl.arabicTitle}</Text>
                  <Text style={styles.playlistEngTitle}>{pl.title}</Text>
                  <Text style={styles.playlistDesc}>{pl.description}</Text>

                  <View style={styles.playlistFooter}>
                    <View style={styles.playBadge}>
                      <Play size={14} color="#0F172A" fill="#0F172A" />
                      <Text style={styles.playBadgeText}>تشغيل القائمة</Text>
                    </View>
                    <Text style={styles.surahCountText}>
                      {pl.surahIds.length} سور مباركة
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.storiesContainer}>
            {AUDIO_STORIES.map((story) => (
              <View key={story.id} style={styles.storyCard}>
                <Image source={{ uri: story.image }} style={styles.storyImage} />
                <View style={styles.storyInfo}>
                  <View style={styles.storyCategoryBadge}>
                    <Text style={styles.storyCategoryText}>{story.category}</Text>
                  </View>
                  <Text style={styles.storyTitle}>{story.arabicTitle}</Text>
                  <Text style={styles.storyNarrator}>الراوي: {story.narrator}</Text>
                  <Text style={styles.storyDesc} numberOfLines={2}>
                    {story.description}
                  </Text>

                  <View style={styles.storyFooter}>
                    <View style={styles.durationBox}>
                      <Clock size={12} color="#94A3B8" />
                      <Text style={styles.durationText}>{story.duration}</Text>
                    </View>

                    <TouchableOpacity style={styles.storyPlayBtn}>
                      <Play size={14} color="#10B981" fill="#10B981" />
                      <Text style={styles.storyPlayText}>استمع للقصة</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    alignItems: 'flex-end',
  },
  screenTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
  },
  screenSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
    textAlign: 'right',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#10B981',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  scrollList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  cardsContainer: {
    gap: 16,
  },
  playlistCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  playlistContent: {
    alignItems: 'flex-end',
  },
  playlistTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  playlistEngTitle: {
    color: 'rgba(248, 250, 252, 0.6)',
    fontSize: 12,
    marginBottom: 10,
  },
  playlistDesc: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'right',
    marginBottom: 18,
  },
  playlistFooter: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playBadgeText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  surahCountText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  storiesContainer: {
    gap: 14,
  },
  storyCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  storyImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#0F172A',
  },
  storyInfo: {
    padding: 16,
    alignItems: 'flex-end',
  },
  storyCategoryBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  storyCategoryText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  storyTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'right',
  },
  storyNarrator: {
    color: '#A78BFA',
    fontSize: 12,
    marginBottom: 8,
  },
  storyDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'right',
    marginBottom: 14,
  },
  storyFooter: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  storyPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storyPlayText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
});
