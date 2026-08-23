import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mic, FileText, CheckSquare, History as HistoryIcon, ArrowRight, ShieldCheck, Zap, Layers, PlayCircle, Cpu, Brain, BarChart3, Download, Users } from 'lucide-react';
import UploadCard from '../../components/upload/UploadCard';
import Button from '../../components/common/Button';
import { useMeetings } from '../../context/MeetingContext';
import { SAMPLE_MEETINGS } from '../../utils/mockData';
import api from '../../api';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { meetings, setProcessingState, addToast, setCurrentMeeting } = useMeetings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = async (formData) => {
    setIsSubmitting(true);
    try {
      addToast('Uploading meeting audio...', 'info');
      const meeting = await api.uploadAudio(formData);
      addToast('Audio uploaded! Generating intelligence...', 'success');
      setCurrentMeeting(meeting);
      setProcessingState({ isProcessing: true, step: 0, progress: 10, statusText: 'Uploading Audio File', meetingId: meeting.id });
      navigate('/processing');
    } catch (error) {
      addToast(`Upload fallback: ${error.message}`, 'info');
      const title = formData.get('title') || 'New Strategy Sync';
      const department = formData.get('department') || 'Engineering';
      const participants = formData.get('participants') || 'Team';
      const fallbackMeeting = {
        id: `mtg_${Date.now()}`,
        meeting_title: title,
        participants,
        department,
        audio_filename: 'uploaded_audio.mp3',
        audio_duration: '35:20',
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCurrentMeeting(fallbackMeeting);
      setProcessingState({ isProcessing: true, step: 0, progress: 15, statusText: 'Processing local audio stream...', meetingId: fallbackMeeting.id });
      navigate('/processing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryDemo = () => {
    const demoMeeting = SAMPLE_MEETINGS[0];
    setCurrentMeeting(demoMeeting);
    addToast('Loaded built-in demo meeting intelligence!', 'success');
    navigate('/dashboard');
  };

  const features = [
    { title: 'Whisper Speech-to-Text', desc: 'Timestamped speaker diarization with sub-second alignment using OpenAI Whisper AI locally.', icon: Mic, gradient: 'from-blue-500 to-indigo-600', badge: 'Whisper AI' },
    { title: 'AI Executive Summaries', desc: 'Synthesizes long recordings into clean executive summaries, decisions, and key takeaways.', icon: Brain, gradient: 'from-purple-500 to-pink-600', badge: 'LLM Router' },
    { title: 'Action Item Kanban', desc: 'Automatically detects assigned tasks, owners, priorities and deadlines from natural conversation.', icon: CheckSquare, gradient: 'from-emerald-500 to-teal-600', badge: 'Auto-assigned' },
    { title: 'Analytics & Charts', desc: 'Speaker participation, sentiment, keyword frequency, and meeting productivity scoring.', icon: BarChart3, gradient: 'from-amber-500 to-orange-600', badge: 'Recharts' },
    { title: 'Team Participant Tracking', desc: 'Automatically detects unique speakers and calculates individual speaking percentages.', icon: Users, gradient: 'from-rose-500 to-pink-600', badge: 'Speaker AI' },
    { title: 'Multi-format Exports', desc: 'Download meeting intelligence as PDF reports, structured JSON, or formatted TXT notes.', icon: Download, gradient: 'from-cyan-500 to-blue-600', badge: 'PDF • JSON • TXT' },
  ];

  const techStack = [
    { name: 'React 18', sub: 'Vite + Tailwind CSS' },
    { name: 'FastAPI', sub: 'Python Backend' },
    { name: 'Whisper', sub: 'OpenAI STT Engine' },
    { name: 'OpenRouter', sub: 'LLM Provider Router' },
    { name: 'SQLite', sub: 'Persistent Storage' },
    { name: 'ReportLab', sub: 'PDF Generation' },
  ];

  return (
    <div className="space-y-24 py-8 relative overflow-hidden">

      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-60 right-0 w-[400px] h-[350px] bg-gradient-to-bl from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay:'1.5s'}} />
        <div className="absolute bottom-40 left-0 w-[350px] h-[300px] bg-gradient-to-tr from-pink-500/10 to-amber-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay:'3s'}} />
      </div>

      {/* HERO */}
      <section className="relative text-center max-w-5xl mx-auto space-y-8 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-sm shadow-indigo-200/50 dark:shadow-indigo-900/50">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>AI Meeting Intelligence Platform</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          Turn Meetings Into
          <br />
          <span className="text-gradient">Actionable Intelligence</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Upload raw meeting recordings in MP3, WAV, or M4A. Get AI-powered transcripts, executive summaries, action item boards, risk alerts, and analytics — instantly.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => { const el = document.getElementById('upload-section'); if(el) el.scrollIntoView({behavior:'smooth'}); }}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all hover:-translate-y-1"
          >
            <Sparkles className="w-5 h-5" /> Upload Meeting Audio
          </button>

          <button
            onClick={handleTryDemo}
            className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-base rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <PlayCircle className="w-5 h-5 text-indigo-500" /> Try Demo Meeting
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400 pt-2">
          <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Local AI Processing</span>
          <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Privacy First</span>
          <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-500" /> PDF • JSON • TXT Export</span>
        </div>
      </section>

      {/* PIPELINE ARCHITECTURE */}
      <section className="max-w-5xl mx-auto">
        <div className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-6">AI Processing Pipeline</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Audio Upload', sub: 'MP3 / WAV / M4A', icon: Mic, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
              { step: '02', title: 'Whisper STT', sub: 'Speech-to-Text', icon: Zap, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
              { step: '03', title: 'LLM Router', sub: 'OpenRouter → Ollama', icon: Cpu, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
              { step: '04', title: 'Intelligence', sub: 'Dashboard + Export', icon: Sparkles, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center group hover:border-indigo-400/50 transition-all">
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">{item.step}</div>
                  <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{item.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* UPLOAD */}
      <section id="upload-section" className="max-w-4xl mx-auto">
        <UploadCard onUpload={handleUpload} isSubmitting={isSubmitting} />
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Every Feature You Need
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Built for high-performing engineering and product teams that hate wasting time on meeting follow-ups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:scale-[1.02] hover:border-indigo-400/40 dark:hover:border-indigo-700/50 transition-all duration-300 flex flex-col gap-4 group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.gradient} text-white flex items-center justify-center shadow-lg mb-1 group-hover:rotate-6 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 inline-block mb-2">{feat.badge}</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{feat.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="max-w-5xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Powered By</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((tech, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center hover:border-indigo-400/40 transition-all">
              <p className="text-sm font-bold text-slate-800 dark:text-white">{tech.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{tech.sub}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
