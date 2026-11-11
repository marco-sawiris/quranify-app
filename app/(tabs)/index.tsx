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
import { useRouter } from 'expo-router';
import {
  Flame,
  Play,
  Heart,
  Headphones,
  Sparkles,
  CloudRain,
  ChevronLeft,
} from 'lucide-react-native';
import { usePlayerStore } from '../../src/store/usePlayerStore';
import { useStatsStore } from '../../src/store/useStatsStore';
import { QuranService } from '../../src/services/quranService';
import { RECITERS } from '../../src/constants/reciters';
import { AMBIENT_SOUNDS } from '../../src/constants/ambientSounds';
import { PLAYLISTS } from '../../src/constants/playlists';
import { AmbientSelectorModal } from '../../components/AmbientSelectorModal';
import { GlassSurface } from '../../components/GlassSurface';

export default function HomeScreen() {
  const router = useRouter();
  const { currentSurah, currentReciter, playSurah, toggleAmbient, activeAmbient, isAmbientPlaying } =
    usePlayerStore();
  const { streakDays, favoriteSurahs, toggleFavoriteSurah } = useStatsStore();
  const [showAmbientModal, setShowAmbientModal] = useState(false);

  const surahs = QuranService.getAllSurahs();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.streakBadge}>
            <Flame size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.streakText}>{streakDays} أيام متتالية</Text>
          </View>
          <View style={styles.brandTitleBox}>
            <Text style={styles.brandTitle}>Quranify</Text>
            <Text style={styles.brandSubtitle}>تلاوة، تدبر، وسكينة</Text>
          </View>
        </View>

        {/* Daily Verse Card */}
        <GlassSurface style={styles.dailyVerseCard} radius={20} intensity={38}>
          <View style={styles.dailyBadge}>
            <Sparkles size={14} color="#10B981" />
            <Text style={styles.dailyBadgeText}>آية اليوم وتدبر</Text>
          </View>
          <Text style={styles.dailyVerseText}>
            ﴿ أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ ﴾
          </Text>
          <Text style={styles.dailyVerseMeta}>سورة الرعد • الآية 28</Text>
          <TouchableOpacity
            style={styles.dailyPlayBtn}
            onPress={() => {
              const surahRad = QuranService.getSurahMeta(13);
              if (surahRad) playSurah(surahRad);
            }}
          >
            <Play size={16} color="#0F172A" fill="#0F172A" />
            <Text style={styles.dailyPlayText}>استمع للآية بصوت العفاسي</Text>
          </TouchableOpacity>
        </GlassSurface>

        {/* Ambient Sounds Quick Row */}
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={() => setShowAmbientModal(true)}>
            <Text style={styles.seeAllText}>عرض الكل</Text>
          </TouchableOpacity>
          <View style={styles.sectionTitleBox}>
            <CloudRain size={20} color="#38BDF8" />
            <Text style={styles.sectionTitle}>أصوات الأجواء والخلفيات</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ambientScroll}
        >
          {AMBIENT_SOUNDS.map((item) => {
            const isActive = activeAmbient?.id === item.id && isAmbientPlaying;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleAmbient(item)}
                style={[styles.ambientPill, isActive && styles.ambientPillActive]}
              >
                <Text
                  style={[styles.ambientPillText, isActive && styles.ambientPillTextActive]}
                >
                  {item.arabicTitle}
                </Text>
                {isActive && (
                  <View style={styles.ambientDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Reciters */}
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/reciters')}>
            <Text style={styles.seeAllText}>كل القراء</Text>
          </TouchableOpacity>
          <View style={styles.sectionTitleBox}>
            <Headphones size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>كبار القرّاء</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recitersScroll}
        >
          {RECITERS.map((reciter) => {
            const isSelected = currentReciter.id === reciter.id;
            return (
              <TouchableOpacity
                key={reciter.id}
                onPress={() => playSurah(currentSurah, reciter)}
                style={styles.reciterCard}
              >
                <Image source={{ uri: reciter.image }} style={styles.reciterImage} />
                <Text style={styles.reciterName} numberOfLines={1}>
                  {reciter.arabicName}
                </Text>
                <Text style={styles.reciterStyle} numberOfLines={1}>
                  {reciter.subname}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Playlists */}
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/playlists')}>
            <Text style={styles.seeAllText}>المزيد</Text>
          </TouchableOpacity>
          <View style={styles.sectionTitleBox}>
            <Text style={styles.sectionTitle}>قوائم تشغيل مختارة</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.playlistsScroll}
        >
          {PLAYLISTS.map((pl) => (
            <TouchableOpacity
              key={pl.id}
              style={[styles.playlistCard, { backgroundColor: pl.color }]}
              onPress={() => {
                const targetSurah = QuranService.getSurahMeta(pl.surahIds[0]);
                if (targetSurah) playSurah(targetSurah);
              }}
            >
              <Text style={styles.playlistTitle}>{pl.arabicTitle}</Text>
              <Text style={styles.playlistDesc} numberOfLines={2}>
                {pl.description}
              </Text>
              <View style={styles.playlistMeta}>
                <Play size={14} color="#F8FAFC" fill="#F8FAFC" />
                <Text style={styles.playlistSurahCount}>
                  {pl.surahIds.length} سور
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Surah List Preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.surahCountBadge}>114 سورة</Text>
          <Text style={styles.sectionTitle}>سور القرآن الكريم</Text>
        </View>

        <View style={styles.surahList}>
          {surahs.slice(0, 15).map((surah) => {
            const isFav = favoriteSurahs.includes(surah.number);
            const isCurrent = currentSurah.number === surah.number;
            return (
              <TouchableOpacity
                key={surah.number}
                style={[styles.surahRow, isCurrent && styles.surahRowActive]}
                onPress={() => playSurah(surah)}
              >
                <TouchableOpacity
                  onPress={() => toggleFavoriteSurah(surah.number)}
                  style={styles.favBtn}
                >
                  <Heart
                    size={18}
                    color={isFav ? '#EF4444' : '#64748B'}
                    fill={isFav ? '#EF4444' : 'none'}
                  />
                </TouchableOpacity>

                <View style={styles.surahInfo}>
                  <Text
                    style={[
                      styles.surahNameText,
                      isCurrent && { color: '#10B981' },
                    ]}
                  >
                    سورة {surah.name}
                  </Text>
                  <Text style={styles.surahMetaText}>
                    {surah.revelationType} • {surah.numberOfAyahs} آيات
                  </Text>
                </View>

                <View style={styles.surahIndexBox}>
                  <Text style={styles.surahIndexText}>{surah.number}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Ambient Modal */}
      <AmbientSelectorModal
        visible={showAmbientModal}
        onClose={() => setShowAmbientModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 120, // space for mini player
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitleBox: {
    alignItems: 'flex-end',
  },
  brandTitle: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  streakText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },
  dailyVerseCard: {
    backgroundColor: 'rgba(13, 25, 48, 0.38)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(160, 205, 255, 0.18)',
    marginBottom: 24,
    alignItems: 'center',
  },
  dailyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  dailyBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  dailyVerseText: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
  },
  dailyVerseMeta: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 16,
  },
  dailyPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
  },
  dailyPlayText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 10,
  },
  sectionTitleBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
  },
  ambientScroll: {
    gap: 8,
    paddingBottom: 8,
  },
  ambientPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ambientPillActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  ambientPillText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  ambientPillTextActive: {
    color: '#38BDF8',
  },
  ambientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  recitersScroll: {
    gap: 14,
    paddingBottom: 8,
  },
  reciterCard: {
    width: 100,
    alignItems: 'center',
  },
  reciterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E293B',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#334155',
  },
  reciterName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  reciterStyle: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  playlistsScroll: {
    gap: 14,
    paddingBottom: 8,
  },
  playlistCard: {
    width: 170,
    height: 140,
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  playlistTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  playlistDesc: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'right',
  },
  playlistMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playlistSurahCount: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
  },
  surahCountBadge: {
    color: '#64748B',
    fontSize: 12,
  },
  surahList: {
    gap: 8,
  },
  surahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  surahRowActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  favBtn: {
    padding: 6,
  },
  surahInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 14,
  },
  surahNameText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  surahMetaText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 3,
  },
  surahIndexBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  surahIndexText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
});
