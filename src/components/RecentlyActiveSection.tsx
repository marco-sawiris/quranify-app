import React, { useState } from 'react';
import {
  Headphones,
  BookOpen,
  Play,
  Clock,
  Trash2,
  X,
} from 'lucide-react';
import {
  useRecentActivityStore,
  RecentActivity,
} from '../store/useRecentActivityStore';
import { QuranService, SurahMeta } from '../services/quranService';
import { RECITERS } from '../constants/reciters';
import { Reciter } from '../types';

interface Props {
  onResumeListen: (surah: SurahMeta, reciter?: Reciter) => void;
  onResumeRead: (surah: SurahMeta) => void;
}

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'الآن';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `منذ ${diffHour} ساعة`;
  const diffDays = Math.floor(diffHour / 24);
  if (diffDays === 1) return 'أمس';
  if (diffDays < 7) return `منذ ${diffDays} أيام`;
  return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
}

export const RecentlyActiveSection: React.FC<Props> = ({
  onResumeListen,
  onResumeRead,
}) => {
  const { activities, removeActivity, clearActivities } = useRecentActivityStore();
  const [filter, setFilter] = useState<'all' | 'listen' | 'read'>('all');

  if (activities.length === 0) return null;

  const filteredActivities = activities.filter((act) => {
    if (filter === 'all') return true;
    return act.type === filter;
  });

  const handleResume = (activity: RecentActivity) => {
    const meta = QuranService.getSurahMeta(activity.surahNumber);
    if (!meta) return;

    if (activity.type === 'listen') {
      const reciter = RECITERS.find((r) => r.id === activity.reciterId);
      onResumeListen(meta, reciter);
    } else {
      onResumeRead(meta);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in font-cairo" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[var(--glass-bg-3)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] shadow-sm">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">
              واصل من حيث توقفت
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              السور الأخيرة التي استمعت إليها أو قرأتها لتكمل بسهولة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Filter */}
          <div className="segmented-clay">
            <button
              onClick={() => setFilter('all')}
              className={`segmented-clay-btn ${filter === 'all' ? 'active' : ''}`}
            >
              الكل ({activities.length})
            </button>
            <button
              onClick={() => setFilter('listen')}
              className={`segmented-clay-btn ${filter === 'listen' ? 'active' : ''}`}
            >
              استماع
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`segmented-clay-btn ${filter === 'read' ? 'active' : ''}`}
            >
              قراءة
            </button>
          </div>

          {/* Clear button */}
          <button
            onClick={clearActivities}
            className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 hover:bg-white/[0.04] rounded-xl transition-colors text-xs flex items-center gap-1"
            title="مسح سجل النشاط"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">مسح</span>
          </button>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredActivities.slice(0, 6).map((item) => {
          const isListen = item.type === 'listen';
          return (
            <div
              key={item.id}
              className="p-5 rounded-3xl liquid-glass-card flex flex-col justify-between group relative overflow-hidden transition-all"
            >
              {/* Subtle top reflection */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent pointer-events-none" />

              {/* Remove item button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeActivity(item.id);
                }}
                className="absolute top-3.5 left-3.5 p-1 text-[var(--text-muted)] hover:text-rose-400 hover:bg-white/[0.06] rounded-lg transition-colors"
                title="إزالة من السجل"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div>
                {/* Header Badge & Timestamp */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                      isListen
                        ? 'bg-[var(--glass-bg-3)] border-[var(--glass-border-2)] text-[var(--accent)]'
                        : 'bg-[var(--primary)]/15 border-[var(--primary)]/35 text-[var(--primary)]'
                    }`}
                  >
                    {isListen ? (
                      <>
                        <Headphones className="w-3 h-3" />
                        <span>استماع</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3 h-3" />
                        <span>قراءة</span>
                      </>
                    )}
                  </span>

                  <span className="text-[11px] font-mono text-[var(--text-muted)] pl-6">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>

                {/* Surah Name & Metadata */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--bg-el)] border border-[var(--glass-border)] flex items-center justify-center font-mono text-xs font-bold text-[var(--accent)] shrink-0 shadow-inner">
                    {item.surahNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text)] font-quran group-hover:text-[var(--accent)] transition-colors">
                      سورة {item.surahName}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {item.surahEnglishName} · {item.revelationType} · {item.numberOfAyahs} آية
                    </p>
                  </div>
                </div>

                {/* Sub-detail */}
                <div className="mt-3 text-xs text-[var(--text-secondary)] bg-white/[0.02] p-2.5 rounded-xl border border-[var(--glass-border)]">
                  {isListen ? (
                    <div className="flex items-center justify-between">
                      <span>القارئ: {item.reciterName || 'مشاري العفاسي'}</span>
                      {item.progressPercent && (
                        <span className="font-mono text-[var(--accent)] font-bold">
                          {item.progressPercent}%
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>
                        {item.ayahNumber ? `توقفت عند الآية: ${item.ayahNumber}` : 'متابعة التلاوة'}
                      </span>
                      {item.progressPercent && (
                        <span className="font-mono text-[var(--accent)] font-bold">
                          {item.progressPercent}%
                        </span>
                      )}
                    </div>
                  )}

                  {/* Progress bar line */}
                  {item.progressPercent && (
                    <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-l from-[var(--accent)] to-[var(--primary)] rounded-full shadow-[0_0_8px_var(--accent)]"
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Resume Button */}
              <div className="mt-4 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)]">جاهز للمتابعة</span>

                <button
                  onClick={() => handleResume(item)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl btn--primary text-xs font-bold transition-all"
                >
                  {isListen ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-white" />
                      <span>متابعة الاستماع</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>متابعة القراءة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
