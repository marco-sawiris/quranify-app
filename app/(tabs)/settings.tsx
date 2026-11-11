import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Download,
  Bell,
  User,
  Shield,
  Smartphone,
  Info,
  ChevronLeft,
  Moon,
  Volume2,
  Trash2,
  RotateCcw,
} from 'lucide-react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { GlassSurface } from '../../components/GlassSurface';

export default function SettingsScreen() {
  const router = useRouter();
  const { resetOnboarding, userName } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoDownloadSurah, setAutoDownloadSurah] = useState(false);
  const [highQualityAudio, setHighQualityAudio] = useState(true);

  const handleResetSetup = () => {
    resetOnboarding();
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>الإعدادات والتخصيص</Text>
        <Text style={styles.screenSubtitle}>
          إدارة التنزيلات، الإشعارات، الحساب، وتفضيلات الاستماع
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Free & Completely Unlocked Banner */}
        <View style={styles.proBanner}>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>نسخة كاملة مجانية</Text>
          </View>
          <Text style={styles.proTitle}>Quranify — وقف لله تعالى</Text>
          <Text style={styles.proDesc}>
            جميع ميزات التطبيق مفتوحة بالكامل ومجانية بدون أي تسجيل دخول، ولا توجد أي اشتراكات أو مدفوعات. استمتع بكافة أصوات الأجواء والخلفيات والتلاوات.
          </Text>
          <View style={styles.freeBadgeBox}>
            <Text style={styles.freeBadgeBoxText}>✓ جميع الميزات مفعلة بالكامل مجاناً</Text>
          </View>
        </View>

        {/* Section: Downloads & Storage */}
        <Text style={styles.sectionHeader}>التنزيلات والذاكرة</Text>
        <GlassSurface style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.storageValue}>1.4 GB مستخدمة</Text>
            </View>
            <View style={styles.rowRight}>
              <View style={styles.iconBox}>
                <Download size={18} color="#10B981" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.rowTitle}>المواد المحملة بدون إنترنت</Text>
                <Text style={styles.rowSub}>14 سورة محملة للقارئ مشاري العفاسي</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Switch
              value={autoDownloadSurah}
              onValueChange={setAutoDownloadSurah}
              trackColor={{ false: '#334155', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
            <View style={styles.rowRight}>
              <View style={styles.iconBox}>
                <Smartphone size={18} color="#38BDF8" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.rowTitle}>تنزيل السور المكتملة تلقائياً</Text>
                <Text style={styles.rowSub}>حفظ السور التي تستمع إليها بانتظام</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row}>
            <ChevronLeft size={18} color="#EF4444" />
            <View style={styles.rowRight}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <Trash2 size={18} color="#EF4444" />
              </View>
              <View style={styles.textCol}>
                <Text style={[styles.rowTitle, { color: '#EF4444' }]}>
                  مسح الذاكرة المؤقتة (Cache)
                </Text>
                <Text style={styles.rowSub}>تفريغ مساحة التخزين المؤقتة للملفات الصوتية</Text>
              </View>
            </View>
          </TouchableOpacity>
        </GlassSurface>

        {/* Section: Audio & Playback Preferences */}
        <Text style={styles.sectionHeader}>تفضيلات الصوت والتلاوة</Text>
        <GlassSurface style={styles.card}>
          <View style={styles.row}>
            <Switch
              value={highQualityAudio}
              onValueChange={setHighQualityAudio}
              trackColor={{ false: '#334155', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
            <View style={styles.rowRight}>
              <View style={styles.iconBox}>
                <Volume2 size={18} color="#A78BFA" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.rowTitle}>جودة صوتية فائقة (High Bitrate)</Text>
                <Text style={styles.rowSub}>استهلاك بيانات أعلى لتجربة استماع أنقى</Text>
              </View>
            </View>
          </View>
        </GlassSurface>

        {/* Section: Notifications */}
        <Text style={styles.sectionHeader}>التنبيهات والإشعارات</Text>
        <GlassSurface style={styles.card}>
          <View style={styles.row}>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#334155', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
            <View style={styles.rowRight}>
              <View style={styles.iconBox}>
                <Bell size={18} color="#FBBF24" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.rowTitle}>تذكير الورد القرآني اليومي</Text>
                <Text style={styles.rowSub}>تنبيه لتحقيق هدف الدقائق اليومي</Text>
              </View>
            </View>
          </View>
        </GlassSurface>

        {/* Section: Account & Info */}
        <Text style={styles.sectionHeader}>الحساب والتطبيق</Text>
        <GlassSurface style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowRight}>
              <View style={styles.iconBox}>
                <User size={18} color="#10B981" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.rowTitle}>{userName}</Text>
                <Text style={styles.rowSub}>وضع محلي بدون إنترنت • لا يلزم تسجيل دخول</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={handleResetSetup}>
            <ChevronLeft size={18} color="#94A3B8" />
            <View style={styles.rowRight}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <RotateCcw size={18} color="#38BDF8" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.rowTitle}>إعادة ضبط التهيئة الأولى</Text>
                <Text style={styles.rowSub}>تغيير القارئ المفضل والورد اليومي</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row}>
            <ChevronLeft size={18} color="#64748B" />
            <View style={styles.rowRight}>
              <View style={styles.iconBox}>
                <Info size={18} color="#94A3B8" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.rowTitle}>عن Quranify</Text>
                <Text style={styles.rowSub}>الإصدار 1.0.0 • جميع المصادر مفتوحة وموثقة</Text>
              </View>
            </View>
          </TouchableOpacity>
        </GlassSurface>
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
  proBanner: {
    backgroundColor: '#1E1B4B',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4338CA',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  proBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
  },
  proBadgeText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
  },
  proTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  proDesc: {
    color: '#C7D2FE',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'right',
    marginBottom: 16,
  },
  freeBadgeBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  freeBadgeBoxText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 8,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    alignItems: 'flex-end',
    flex: 1,
  },
  rowTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  rowSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'right',
  },
  storageValue: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 6,
  },
});
