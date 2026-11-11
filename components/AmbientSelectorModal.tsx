import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  X,
  Volume2,
  CloudRain,
  Flame,
  Waves,
  Sun,
  Wind,
  Droplet,
  Heart,
  VolumeX,
} from 'lucide-react-native';
import { AMBIENT_SOUNDS } from '../src/constants/ambientSounds';
import { usePlayerStore } from '../src/store/usePlayerStore';
import { AmbientSound } from '../src/types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AmbientSelectorModal: React.FC<Props> = ({ visible, onClose }) => {
  const {
    activeAmbient,
    isAmbientPlaying,
    ambientVolume,
    toggleAmbient,
    setAmbientVolume,
    stopAmbient,
  } = usePlayerStore();

  const getIcon = (iconName: string, isSelected: boolean) => {
    const color = isSelected ? '#38BDF8' : '#94A3B8';
    switch (iconName) {
      case 'cloud-rain':
        return <CloudRain size={24} color={color} />;
      case 'flame':
        return <Flame size={24} color={color} />;
      case 'waves':
        return <Waves size={24} color={color} />;
      case 'sun':
        return <Sun size={24} color={color} />;
      case 'wind':
        return <Wind size={24} color={color} />;
      case 'droplet':
        return <Droplet size={24} color={color} />;
      case 'heart':
        return <Heart size={24} color={color} />;
      default:
        return <CloudRain size={24} color={color} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>أصوات الأجواء والخلفيات</Text>
            <View style={{ width: 32 }} />
          </View>

          <Text style={styles.subtitle}>
            شغّل مؤثرات الطبيعة في الخلفية مع القارئ لخلق جو من السكينة والتركيز
          </Text>

          {/* Volume control for ambient */}
          {activeAmbient && isAmbientPlaying && (
            <View style={styles.volumeCard}>
              <View style={styles.volumeHeader}>
                <Text style={styles.volumeTitle}>
                  صوت المؤثر ({activeAmbient.arabicTitle})
                </Text>
                <TouchableOpacity onPress={stopAmbient} style={styles.muteBtn}>
                  <VolumeX size={16} color="#EF4444" />
                  <Text style={styles.muteText}>إيقاف</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sliderRow}>
                <TouchableOpacity
                  onPress={() => setAmbientVolume(Math.max(0.1, ambientVolume - 0.1))}
                  style={styles.volStepBtn}
                >
                  <Text style={styles.volStepText}>-</Text>
                </TouchableOpacity>

                <View style={styles.volBar}>
                  <View
                    style={[
                      styles.volFill,
                      { width: `${Math.round(ambientVolume * 100)}%` },
                    ]}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setAmbientVolume(Math.min(1.0, ambientVolume + 0.1))}
                  style={styles.volStepBtn}
                >
                  <Text style={styles.volStepText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.volPercent}>
                  {Math.round(ambientVolume * 100)}%
                </Text>
              </View>
            </View>
          )}

          {/* Ambient Grid */}
          <ScrollView contentContainerStyle={styles.grid}>
            {AMBIENT_SOUNDS.map((item) => {
              const isSelected = activeAmbient?.id === item.id && isAmbientPlaying;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleAmbient(item)}
                  style={[styles.ambientCard, isSelected && styles.ambientCardActive]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      isSelected && styles.iconCircleActive,
                    ]}
                  >
                    {getIcon(item.icon, isSelected)}
                  </View>
                  <Text
                    style={[
                      styles.cardTitle,
                      isSelected && styles.cardTitleActive,
                    ]}
                  >
                    {item.arabicTitle}
                  </Text>
                  <Text style={styles.cardEngTitle}>{item.title}</Text>
                  {isSelected && (
                    <View style={styles.activeTag}>
                      <Text style={styles.activeTagText}>قيد التشغيل</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 19,
  },
  volumeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  volumeHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  volumeTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  muteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  muteText: {
    color: '#EF4444',
    fontSize: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  volStepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volStepText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  volBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  volFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
  },
  volPercent: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    width: 38,
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 20,
  },
  ambientCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  ambientCardActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCircleActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardTitleActive: {
    color: '#38BDF8',
  },
  cardEngTitle: {
    color: '#64748B',
    fontSize: 11,
  },
  activeTag: {
    backgroundColor: '#38BDF8',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 8,
  },
  activeTagText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '700',
  },
});
