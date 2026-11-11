import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronDown,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  CloudRain,
  BookOpen,
  User,
  Clock,
  Volume2,
} from 'lucide-react-native';
import { usePlayerStore } from '../src/store/usePlayerStore';
import { useStatsStore } from '../src/store/useStatsStore';
import { RECITERS } from '../src/constants/reciters';
import { AmbientSelectorModal } from '../components/AmbientSelectorModal';

export default function PlayerScreen() {
  const router = useRouter();
  const {
    currentSurah,
    currentReciter,
    isPlaying,
    togglePlayPause,
    position,
    duration,
    seekTo,
    nextSurah,
    prevSurah,
    activeAyaNumber,
    activeAmbient,
    changeReciter,
    recitationVolume,
    setRecitationVolume,
    setSleepTimer,
    sleepTimerMinutes,
  } = usePlayerStore();

  const { favoriteSurahs, toggleFavoriteSurah } = useStatsStore();
  const isFavorite = favoriteSurahs.includes(currentSurah.number);

  const [showReciterModal, setShowReciterModal] = useState(false);
  const [showAmbientModal, setShowAmbientModal] = useState(false);
  const [showTafsirModal, setShowTafsirModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);

  // Format milliseconds to mm:ss
  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = duration > 0 ? Math.min(1, position / duration) : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <ChevronDown size={28} color="#F8FAFC" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerSurah}>سورة {currentSurah.name}</Text>
          <Text style={styles.headerType}>
            {currentSurah.revelationType} • {currentSurah.numberOfAyahs} آيات
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => toggleFavoriteSurah(currentSurah.number)}
          style={styles.iconButton}
        >
          <Heart
            size={24}
            color={isFavorite ? '#EF4444' : '#94A3B8'}
            fill={isFavorite ? '#EF4444' : 'none'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Center Artwork / Vinyl Plate */}
        <View style={styles.artworkContainer}>
          <View style={styles.vinylPlate}>
            <View style={styles.vinylRing}>
              <View style={styles.vinylCenter}>
                <Text style={styles.vinylSurahText}>{currentSurah.name}</Text>
                <Text style={styles.vinylReciterText}>{currentReciter.arabicName}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Synchronized Aya Banner */}
        <View style={styles.ayaBanner}>
          <View style={styles.ayaHeader}>
            <Text style={styles.ayaBadge}>الآية {activeAyaNumber}</Text>
            <Text style={styles.ayaTotal}>من {currentSurah.numberOfAyahs}</Text>
          </View>
          <Text style={styles.ayaText}>
            {/* Contextual placeholder or active aya */}
            {currentSurah.number === 1 && activeAyaNumber === 1
              ? 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
              : `تلاوة الآية رقم (${activeAyaNumber}) من سورة ${currentSurah.name} بصوت ${currentReciter.arabicName}`}
          </Text>
        </View>

        {/* Action Pills (Reciter, Ambient, Tafsir, Timer) */}
        <View style={styles.actionPills}>
          <TouchableOpacity
            style={styles.pill}
            onPress={() => setShowReciterModal(true)}
          >
            <User size={16} color="#10B981" />
            <Text style={styles.pillText}>{currentReciter.arabicName}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, activeAmbient && styles.pillActive]}
            onPress={() => setShowAmbientModal(true)}
          >
            <CloudRain size={16} color={activeAmbient ? '#38BDF8' : '#94A3B8'} />
            <Text
              style={[styles.pillText, activeAmbient && { color: '#38BDF8' }]}
            >
              {activeAmbient ? activeAmbient.arabicTitle : 'أصوات الأجواء'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pill}
            onPress={() => setShowTafsirModal(true)}
          >
            <BookOpen size={16} color="#A78BFA" />
            <Text style={styles.pillText}>التفسير</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pill}
            onPress={() => setShowTimerModal(true)}
          >
            <Clock size={16} color="#FBBF24" />
            <Text style={styles.pillText}>
              {sleepTimerMinutes ? `${sleepTimerMinutes} د` : 'مؤقت'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar & Seek */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarTrack}>
            <View
              style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Main Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={prevSurah} style={styles.controlBtn}>
            <SkipForward size={28} color="#F8FAFC" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => seekTo(Math.max(0, position - 10000))}
            style={styles.controlBtn}
          >
            <RotateCcw size={22} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePlayPause}
            style={styles.mainPlayBtn}
            activeOpacity={0.8}
          >
            {isPlaying ? (
              <Pause size={34} color="#0F172A" />
            ) : (
              <Play size={34} color="#0F172A" style={{ marginLeft: 3 }} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => seekTo(Math.min(duration, position + 10000))}
            style={styles.controlBtn}
          >
            <RotateCw size={22} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity onPress={nextSurah} style={styles.controlBtn}>
            <SkipBack size={28} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        {/* Recitation Volume Slider */}
        <View style={styles.volumeRow}>
          <Volume2 size={18} color="#94A3B8" />
          <View style={styles.volumeTrack}>
            <View
              style={[
                styles.volumeFill,
                { width: `${Math.round(recitationVolume * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.volumeText}>
            صوت القارئ {Math.round(recitationVolume * 100)}%
          </Text>
        </View>
      </ScrollView>

      {/* Reciter Picker Modal */}
      <Modal
        visible={showReciterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReciterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>اختر القارئ</Text>
            <ScrollView style={{ maxHeight: 360 }}>
              {RECITERS.map((r) => {
                const isSelected = r.id === currentReciter.id;
                return (
                  <TouchableOpacity
                    key={r.id}
                    style={[
                      styles.reciterItem,
                      isSelected && styles.reciterItemActive,
                    ]}
                    onPress={() => {
                      changeReciter(r);
                      setShowReciterModal(false);
                    }}
                  >
                    <View style={styles.reciterBadge}>
                      <Text style={styles.reciterBadgeText}>{r.arabicName[0]}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text
                        style={[
                          styles.reciterNameText,
                          isSelected && { color: '#10B981' },
                        ]}
                      >
                        {r.arabicName}
                      </Text>
                      <Text style={styles.reciterSubText}>{r.subname}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowReciterModal(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseBtnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Ambient Sound Selector Modal */}
      <AmbientSelectorModal
        visible={showAmbientModal}
        onClose={() => setShowAmbientModal(false)}
      />

      {/* Tafsir Modal */}
      <Modal
        visible={showTafsirModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTafsirModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>تفسير الآية ({activeAyaNumber})</Text>
            <Text style={styles.tafsirSource}>المختصر في التفسير</Text>
            <ScrollView style={{ maxHeight: 280, marginVertical: 12 }}>
              <Text style={styles.tafsirContent}>
                تفسير وتدبر معاني الآية المباركة من سورة {currentSurah.name}: توجيه
                المسلم للتدبر في مقاصد الآيات والعمل بما جاء فيها من أوامر ونواهٍ
                والاستزادة من السكينة والطمأنينة.
              </Text>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowTafsirModal(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseBtnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sleep Timer Modal */}
      <Modal
        visible={showTimerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>مؤقت النوم والاستماع</Text>
            <View style={styles.timerGrid}>
              {[15, 30, 45, 60, null].map((m) => (
                <TouchableOpacity
                  key={m === null ? 'off' : m}
                  style={[
                    styles.timerOption,
                    sleepTimerMinutes === m && styles.timerOptionActive,
                  ]}
                  onPress={() => {
                    setSleepTimer(m);
                    setShowTimerModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.timerOptionText,
                      sleepTimerMinutes === m && styles.timerOptionTextActive,
                    ]}
                  >
                    {m === null ? 'إيقاف' : `${m} دقيقة`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerSurah: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  headerType: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  artworkContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylPlate: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#334155',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  vinylRing: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 2,
    borderColor: '#475569',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylCenter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 3,
    borderColor: '#10B981',
  },
  vinylSurahText: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  vinylReciterText: {
    color: '#10B981',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  ayaBanner: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  ayaHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ayaBadge: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  ayaTotal: {
    color: '#64748B',
    fontSize: 12,
  },
  ayaText: {
    color: '#F8FAFC',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    fontFamily: 'System',
  },
  actionPills: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  pillText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  controlBtn: {
    padding: 12,
  },
  mainPlayBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  volumeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingHorizontal: 10,
  },
  volumeTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#94A3B8',
  },
  volumeText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  reciterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingHorizontal: 8,
  },
  reciterItemActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
  },
  reciterBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reciterBadgeText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
  },
  reciterNameText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  reciterSubText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  modalCloseBtn: {
    marginTop: 16,
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  tafsirSource: {
    color: '#A78BFA',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  tafsirContent: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 26,
    textAlign: 'right',
  },
  timerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginVertical: 16,
  },
  timerOption: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timerOptionActive: {
    borderColor: '#FBBF24',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  timerOptionText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  timerOptionTextActive: {
    color: '#FBBF24',
  },
});
