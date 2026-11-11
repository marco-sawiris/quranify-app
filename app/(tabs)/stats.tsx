import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Clock, Award, Target, Heart, CheckCircle2 } from 'lucide-react-native';
import { useStatsStore } from '../../src/store/useStatsStore';
import { QuranService } from '../../src/services/quranService';
import { RECITERS } from '../../src/constants/reciters';

export default function StatsScreen() {
  const {
    streakDays,
    dailyGoalMinutes,
    todayMinutesListened,
    totalHoursListened,
    favoriteSurahs,
    favoriteReciters,
  } = useStatsStore();

  const progress = Math.min(1, todayMinutesListened / dailyGoalMinutes);

  const weekDays = [
    { day: 'السبت', mins: 35, reached: true },
    { day: 'الأحد', mins: 40, reached: true },
    { day: 'الإثنين', mins: 25, reached: false },
    { day: 'الثلاثاء', mins: 50, reached: true },
    { day: 'الأربعاء', mins: 30, reached: true },
    { day: 'الخميس', mins: 45, reached: true },
    { day: 'الجمعة', mins: 60, reached: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>إحصاءات الاستماع</Text>
        <Text style={styles.screenSubtitle}>
          تابع وردك القرآني اليومي وحافظ على حبل السكينة متصلاً
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Highlight Cards */}
        <View style={styles.metricsRow}>
          {/* Streak Card */}
          <View style={styles.metricCard}>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Flame size={22} color="#F59E0B" fill="#F59E0B" />
            </View>
            <Text style={styles.metricValue}>{streakDays} أيام</Text>
            <Text style={styles.metricLabel}>أيام متواصلة</Text>
          </View>

          {/* Total Hours Card */}
          <View style={styles.metricCard}>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Award size={22} color="#10B981" />
            </View>
            <Text style={styles.metricValue}>{totalHoursListened} ساعة</Text>
            <Text style={styles.metricLabel}>إجمالي الاستماع</Text>
          </View>
        </View>

        {/* Daily Goal Card */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalBadge}>
              <Target size={14} color="#10B981" />
              <Text style={styles.goalBadgeText}>الهدف اليومي</Text>
            </View>
            <Text style={styles.goalNumbers}>
              <Text style={styles.goalActiveNum}>{todayMinutesListened}</Text> / {dailyGoalMinutes} دقيقة
            </Text>
          </View>

          <View style={styles.goalTrack}>
            <View style={[styles.goalFill, { width: `${progress * 100}%` }]} />
          </View>

          <Text style={styles.goalRemainingText}>
            {todayMinutesListened >= dailyGoalMinutes
              ? '🎉 رائع! حققت هدف الاستماع اليومي بالكامل اليوم'
              : `تبقى لك ${dailyGoalMinutes - todayMinutesListened} دقيقة لتحقيق هدف اليوم`}
          </Text>
        </View>

        {/* Weekly Activity Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>نشاط الأسبوع الحالي</Text>
          <View style={styles.chartBarsRow}>
            {weekDays.map((item, index) => {
              const heightPercent = Math.min(100, (item.mins / 60) * 100);
              return (
                <View key={index} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor: item.reached ? '#10B981' : '#F59E0B',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Favorites Summary */}
        <View style={styles.favSection}>
          <View style={styles.favSectionHeader}>
            <Heart size={18} color="#EF4444" fill="#EF4444" />
            <Text style={styles.favSectionTitle}>سورك وقراؤك المفضلون</Text>
          </View>

          <View style={styles.favGrid}>
            {favoriteSurahs.map((num) => {
              const s = QuranService.getSurahMeta(num);
              if (!s) return null;
              return (
                <View key={num} style={styles.favSurahPill}>
                  <Text style={styles.favSurahName}>سورة {s.name}</Text>
                </View>
              );
            })}
          </View>
        </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  goalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  goalBadgeText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  goalNumbers: {
    color: '#94A3B8',
    fontSize: 14,
  },
  goalActiveNum: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 18,
  },
  goalTrack: {
    height: 10,
    backgroundColor: '#0F172A',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  goalFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  goalRemainingText: {
    color: '#CBD5E1',
    fontSize: 12,
    textAlign: 'right',
  },
  chartCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  chartTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 16,
  },
  chartBarsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 4,
  },
  barCol: {
    alignItems: 'center',
    width: 36,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: '#0F172A',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barLabel: {
    color: '#94A3B8',
    fontSize: 10,
  },
  favSection: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  favSectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  favSectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  favGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  favSurahPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  favSurahName: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
});
