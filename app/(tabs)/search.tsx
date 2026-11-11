import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Play, Headphones, Heart } from 'lucide-react-native';
import { QuranService, SurahMeta } from '../../src/services/quranService';
import { RECITERS } from '../../src/constants/reciters';
import { usePlayerStore } from '../../src/store/usePlayerStore';
import { useStatsStore } from '../../src/store/useStatsStore';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'surahs' | 'reciters'>('all');

  const { playSurah, currentSurah, changeReciter } = usePlayerStore();
  const { favoriteSurahs, toggleFavoriteSurah } = useStatsStore();

  const filteredSurahs = QuranService.searchSurahs(query);
  const filteredReciters = RECITERS.filter(
    (r) =>
      r.arabicName.includes(query) ||
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.subname.includes(query)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>البحث الشامل</Text>
        <Text style={styles.screenSubtitle}>ابحث عن السور، القراء، والآيات</Text>
      </View>

      {/* Search Input Box */}
      <View style={styles.searchBar}>
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <X size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
        <TextInput
          style={styles.input}
          placeholder="ابحث باسم السورة، رقمها، أو اسم القارئ..."
          placeholderTextColor="#64748B"
          value={query}
          onChangeText={setQuery}
          textAlign="right"
        />
        <Search size={20} color="#10B981" />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'surahs', 'reciters'] as const).map((tab) => {
          const titles = { all: 'الكل', surahs: 'السور', reciters: 'القراء' };
          const isActive = activeFilter === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveFilter(tab)}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isActive && styles.filterPillTextActive,
                ]}
              >
                {titles[tab]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.resultsScroll}>
        {/* Reciters Result Section */}
        {(activeFilter === 'all' || activeFilter === 'reciters') &&
          filteredReciters.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                القرّاء ({filteredReciters.length})
              </Text>
              <View style={styles.recitersList}>
                {filteredReciters.map((reciter) => (
                  <TouchableOpacity
                    key={reciter.id}
                    style={styles.reciterItem}
                    onPress={() => {
                      changeReciter(reciter);
                      playSurah(currentSurah, reciter);
                    }}
                  >
                    <Headphones size={20} color="#10B981" />
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 12 }}>
                      <Text style={styles.reciterName}>{reciter.arabicName}</Text>
                      <Text style={styles.reciterSub}>{reciter.subname}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

        {/* Surahs Result Section */}
        {(activeFilter === 'all' || activeFilter === 'surahs') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              السور ({filteredSurahs.length})
            </Text>
            <View style={styles.surahList}>
              {filteredSurahs.map((surah) => {
                const isFav = favoriteSurahs.includes(surah.number);
                return (
                  <TouchableOpacity
                    key={surah.number}
                    style={styles.surahCard}
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
                      <Text style={styles.surahName}>سورة {surah.name}</Text>
                      <Text style={styles.surahMeta}>
                        {surah.revelationType} • {surah.numberOfAyahs} آيات
                      </Text>
                    </View>

                    <View style={styles.numberBox}>
                      <Text style={styles.numberText}>{surah.number}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
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
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    marginRight: 10,
  },
  clearBtn: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  filterPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterPillActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterPillText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  resultsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 10,
  },
  recitersList: {
    gap: 8,
  },
  reciterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reciterName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  reciterSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  surahList: {
    gap: 8,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  favBtn: {
    padding: 6,
  },
  surahInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 12,
  },
  surahName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  surahMeta: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  numberBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  numberText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
});
