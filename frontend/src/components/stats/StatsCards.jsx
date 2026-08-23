import React, { useEffect, useRef } from 'react';
import { Clock, Users, AlignLeft, FileText, CheckSquare, Zap } from 'lucide-react';

const AnimatedCounter = ({ target, duration = 1200, suffix = '' }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = 0;
    const end = parseInt(target) || 0;
    if (end === 0) { el.textContent = `0${suffix}`; return; }
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      el.textContent = `${Math.floor(progress * (end - start) + start)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, suffix]);
  return <span ref={ref}>0{suffix}</span>;
};

const StatCard = ({ icon: Icon, label, value, suffix = '', gradient, description }) => (
  <div className="group relative overflow-hidden glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col gap-3">
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none" style={{background:`linear-gradient(135deg, ${gradient})`}} />
    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
        <AnimatedCounter target={value} suffix={suffix} />
      </div>
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
      {description && <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{description}</div>}
    </div>
  </div>
);

export const StatsCards = ({ meeting }) => {
  if (!meeting) return null;

  const stats = meeting.statistics || {};
  const wordCount = stats.word_count || (meeting.transcript || []).reduce((a, s) => a + (s.text||'').split(' ').length, 0);
  const actionCount = (meeting.action_items || []).length;
  const participantCount = [...new Set((meeting.transcript || []).map(s => s.speaker).filter(Boolean))].length || (meeting.participants ? meeting.participants.split(',').length : 1);
  const summaryWords = (meeting.summary || '').split(' ').filter(Boolean).length;
  const procTime = meeting.processing_time || '—';

  const cards = [
    { icon: Clock, label: 'Meeting Duration', value: meeting.audio_duration || '30:00', gradient: 'from-indigo-500 to-blue-600', suffix: '', description: 'Total audio length' },
    { icon: Users, label: 'Participants', value: participantCount, gradient: 'from-purple-500 to-pink-600', suffix: '', description: 'Unique speakers detected' },
    { icon: AlignLeft, label: 'Transcript Words', value: wordCount, gradient: 'from-emerald-500 to-teal-600', suffix: '', description: 'Total words transcribed' },
    { icon: FileText, label: 'Summary Length', value: summaryWords, gradient: 'from-amber-500 to-orange-600', suffix: ' wds', description: 'Executive summary size' },
    { icon: CheckSquare, label: 'Action Items', value: actionCount, gradient: 'from-rose-500 to-pink-600', suffix: '', description: 'Tasks auto-assigned' },
    { icon: Zap, label: 'Processing Time', value: procTime, gradient: 'from-cyan-500 to-blue-600', suffix: '', description: 'End-to-end pipeline' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <StatCard
          key={i}
          icon={card.icon}
          label={card.label}
          value={card.value}
          suffix={card.suffix}
          gradient={card.gradient}
          description={card.description}
        />
      ))}
    </div>
  );
};

export default StatsCards;
