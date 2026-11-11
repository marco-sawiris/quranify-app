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
import { Headphones, Heart, Play, Check } from 'lucide-react-native';
import { RECITERS } from '../../src/constants/reciters';
import { usePlayerStore } from '../../src/store/usePlayerStore';
import { useStatsStore } from '../../src/store/useStatsStore';

export default function RecitersScreen() {
  const { currentReciter, changeReciter, currentSurah, playSurah } = usePlayerStore();
  const { favoriteReciters, toggleFavoriteReciter } = useStatsStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', title: 'الكل' },
    { id: 'murattal', title: 'المرتل' },
    { id: 'haramain', title: 'الحرمين' },
    { id: 'khashia', title: 'خاشعة' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>القرّاء ومجموعاتهم</Text>
        <Text style={styles.screenSubtitle}>
          استمع إلى كتاب الله بأعذب وأشهر الأصوات في العالم الإسلامي
        </Text>
      </View>

      {/* Categories */}
      <View style={styles.categoriesRow}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[styles.catPill, isActive && styles.catPillActive]}
            >
              <Text
                style={[styles.catPillText, isActive && styles.catPillTextActive]}
              >
                {cat.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.recitersGrid}>
        {RECITERS.map((reciter) => {
          const isCurrent = currentReciter.id === reciter.id;
          const isFav = favoriteReciters.includes(reciter.id);

          return (
            <View
              key={reciter.id}
              style={[styles.reciterCard, isCurrent && styles.reciterCardActive]}
            >
              <View style={styles.cardHeader}>
                <TouchableOpacity
                  onPress={() => toggleFavoriteReciter(reciter.id)}
                  style={styles.favBtn}
                >
                  <Heart
                    size={20}
                    color={isFav ? '#EF4444' : '#64748B'}
                    fill={isFav ? '#EF4444' : 'none'}
                  />
                </TouchableOpacity>

                {isCurrent && (
                  <View style={styles.currentBadge}>
                    <Check size={12} color="#10B981" />
                    <Text style={styles.currentBadgeText}>المحدد حالياً</Text>
                  </View>
                )}
              </View>

              <Image source={{ uri: reciter.image }} style={styles.reciterAvatar} />

              <Text style={styles.reciterName}>{reciter.arabicName}</Text>
              <Text style={styles.reciterStyle}>{reciter.subname}</Text>

              <TouchableOpacity
                style={[styles.selectBtn, isCurrent && styles.selectBtnActive]}
                onPress={() => {
                  changeReciter(reciter);
                  playSurah(currentSurah, reciter);
                }}
              >
                <Play size={14} color={isCurrent ? '#0F172A' : '#F8FAFC'} />
                <Text
                  style={[
                    styles.selectBtnText,
                    isCurrent && styles.selectBtnTextActive,
                  ]}
                >
                  {isCurrent ? 'قيد التلاوة' : 'اختيار واستماع'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
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
  categoriesRow: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  catPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  catPillActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  catPillText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  catPillTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  recitersGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  reciterCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  reciterCardActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  cardHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  favBtn: {
    padding: 4,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  reciterAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#334155',
  },
  reciterName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  reciterStyle: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 12,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    width: '100%',
    justifyContent: 'center',
  },
  selectBtnActive: {
    backgroundColor: '#10B981',
  },
  selectBtnText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  selectBtnTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
});
