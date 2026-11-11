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
import { Sparkles, Headphones, Target, ArrowLeft, Check } from 'lucide-react-native';
import { RECITERS } from '../src/constants/reciters';
import { usePlayerStore } from '../src/store/usePlayerStore';
import { useStatsStore } from '../src/store/useStatsStore';
import { useAppStore } from '../src/store/useAppStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const { changeReciter } = usePlayerStore();
  const { setDailyGoalMinutes } = useStatsStore();
  const { completeOnboarding } = useAppStore();

  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [selectedGoal, setSelectedGoal] = useState(30);

  const goals = [15, 30, 45, 60];

  const handleFinishSetup = () => {
    changeReciter(selectedReciter);
    setDailyGoalMinutes(selectedGoal);
    completeOnboarding();
    // Navigate directly to Home
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Sparkles size={32} color="#10B981" />
          </View>
          <Text style={styles.welcomeTitle}>مرحباً بك في Quranify</Text>
          <Text style={styles.welcomeSub}>
            تهيئة سريعة لمرة واحدة لتخصيص تجربتك ثم الانتقال مباشرة لكتاب الله
          </Text>
        </View>

        {/* Step 1: Favorite Reciter */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Headphones size={20} color="#10B981" />
            <Text style={styles.stepTitle}>1. اختر قارئك المفضل للبدء</Text>
          </View>
          <Text style={styles.stepSub}>يمكنك تغيير القارئ في أي وقت أثناء الاستماع</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recitersRow}
          >
            {RECITERS.slice(0, 5).map((r) => {
              const isSelected = selectedReciter.id === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.reciterItem,
                    isSelected && styles.reciterItemActive,
                  ]}
                  onPress={() => setSelectedReciter(r)}
                >
                  <View style={styles.avatarWrapper}>
                    <Image source={{ uri: r.image }} style={styles.avatar} />
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Check size={12} color="#0F172A" />
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.reciterName,
                      isSelected && { color: '#10B981' },
                    ]}
                    numberOfLines={1}
                  >
                    {r.arabicName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Step 2: Daily Goal */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Target size={20} color="#38BDF8" />
            <Text style={styles.stepTitle}>2. حدد وردك اليومي بالدقائق</Text>
          </View>
          <Text style={styles.stepSub}>
            حافز يومي يعينك على الاستمرار وبناء عادة الاستماع للقرآن
          </Text>

          <View style={styles.goalsRow}>
            {goals.map((g) => {
              const isSelected = selectedGoal === g;
              return (
                <TouchableOpacity
                  key={g}
                  style={[styles.goalPill, isSelected && styles.goalPillActive]}
                  onPress={() => setSelectedGoal(g)}
                >
                  <Text
                    style={[
                      styles.goalPillText,
                      isSelected && styles.goalPillTextActive,
                    ]}
                  >
                    {g} دقيقة
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Finish Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={handleFinishSetup}
            activeOpacity={0.8}
          >
            <ArrowLeft size={20} color="#0F172A" />
            <Text style={styles.finishBtnText}>ابدأ الاستماع الآن</Text>
          </TouchableOpacity>
          <Text style={styles.noLoginNote}>
            ✓ لا يلزم إنشاء حساب أو تسجيل دخول بجوجل، بياناتك محفوظة محلياً
          </Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  welcomeTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  welcomeSub: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  stepCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stepTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  stepSub: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 14,
  },
  recitersRow: {
    gap: 12,
    paddingBottom: 4,
  },
  reciterItem: {
    width: 90,
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reciterItemActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E293B',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reciterName: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  goalsRow: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  goalPill: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  goalPillActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  goalPillText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  goalPillTextActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  finishBtn: {
    width: '100%',
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 22,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  finishBtnText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  noLoginNote: {
    color: '#10B981',
    fontSize: 12,
    marginTop: 14,
    textAlign: 'center',
  },
});
