import React, { useState } from 'react';
import { Download, Copy, Check, FileText, Calendar, Building, Info, ShieldCheck, ListChecks, CheckSquare, Smile, Frown, Meh, Cpu, Server } from 'lucide-react';
import StatsCards from '../../components/stats/StatsCards';
import AudioPlayer from '../../components/common/AudioPlayer';
import TranscriptCard from '../../components/transcript/TranscriptCard';
import SummaryCard from '../../components/summary/SummaryCard';
import DecisionCard from '../../components/cards/DecisionCard';
import ActionItemsTable from '../../components/actions/ActionItemsTable';
import RiskCard from '../../components/cards/RiskCard';
import KeywordChips from '../../components/cards/KeywordChips';
import AnalyticsCards from '../../components/analytics/AnalyticsCards';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { useMeetings } from '../../context/MeetingContext';

export const DashboardPage = () => {
  const { currentMeeting, meetings, addToast } = useMeetings();
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedActions, setCopiedActions] = useState(false);

  const meeting = currentMeeting || meetings[0];

  if (!meeting) {
    return <EmptyState title="No Active Meeting Selected" description="Upload a meeting audio from the landing page to view intelligence." />;
  }

  const getSentimentBadge = (sentimentStr) => {
    switch (sentimentStr?.toLowerCase()) {
      case 'positive':
        return <Badge variant="emerald"><Smile className="w-3.5 h-3.5" /> Positive Sentiment</Badge>;
      case 'negative':
        return <Badge variant="rose"><Frown className="w-3.5 h-3.5" /> Negative Sentiment</Badge>;
      default:
        return <Badge variant="indigo"><Meh className="w-3.5 h-3.5" /> Neutral Sentiment</Badge>;
    }
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank', 'height=800,width=900');
    if (!printWindow) {
      addToast('Please allow popups to generate PDF report.', 'error');
      return;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${meeting.meeting_title} - Executive PDF Report</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
        .header { border-bottom: 2px solid #6366f1; padding-bottom: 15px; margin-bottom: 25px; }
        .title { font-size: 24px; font-weight: bold; color: #0f172a; margin: 0 0 8px 0; }
        .meta { font-size: 12px; color: #64748b; margin-bottom: 5px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 16px; font-weight: bold; color: #4338ca; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 10px; uppercase; letter-spacing: 0.5px; }
        .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
        th { background: #f1f5f9; font-weight: bold; }
        .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">${meeting.meeting_title}</h1>
        <div class="meta"><strong>Meeting ID:</strong> ${meeting.id} | <strong>Department:</strong> ${meeting.department || 'Engineering'}</div>
        <div class="meta"><strong>Date:</strong> ${new Date(meeting.created_at || Date.now()).toLocaleString()} | <strong>Duration:</strong> ${meeting.audio_duration || '30:00'} | <strong>Sentiment:</strong> ${meeting.sentiment || 'Neutral'}</div>
        <div class="meta"><strong>LLM Router Provider:</strong> ${meeting.provider_used || 'OpenRouter'} | <strong>Model:</strong> ${meeting.model_used || 'liquid/lfm-2.5-2.6b:free'}</div>
      </div>

      <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="box">${meeting.summary || 'No summary available.'}</div>
      </div>

      <div class="section">
        <div class="section-title">Key Decisions</div>
        <ul>
          ${(meeting.decisions || []).map(d => `<li>${typeof d === 'string' ? d : d.title}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <div class="section-title">Action Items & Deliverables</div>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Task</th>
              <th>Owner</th>
              <th>Priority</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            ${(meeting.action_items || []).map(a => `
              <tr>
                <td>${a.status || 'Pending'}</td>
                <td>${a.task}</td>
                <td>${a.owner || 'Unassigned'}</td>
                <td>${a.priority || 'Medium'}</td>
                <td>${a.deadline || 'Not Mentioned'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Risks & Blockers</div>
        <ul>
          ${(meeting.risks || []).map(r => `<li><strong>${r.title || r}:</strong> ${r.description || ''}</li>`).join('')}
        </ul>
      </div>

      <div class="footer">
        Generated by <strong>MeetingMind AI</strong> — Modern AI Meeting Intelligence Platform
      </div>
    </body>
    </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);

    addToast('Prepared printable PDF report.', 'success');
  };

  const handleDownloadTXT = () => {
    const textContent = `
==================================================
MEETINGMIND AI - EXECUTIVE REPORT
==================================================
Title: ${meeting.meeting_title}
ID: ${meeting.id}
Department: ${meeting.department || 'General'}
Participants: ${meeting.participants || 'Team'}
Duration: ${meeting.audio_duration || '30:00'}
Sentiment: ${meeting.sentiment || 'Neutral'}
LLM Provider: ${meeting.provider_used || 'OpenRouter'}
Model: ${meeting.model_used || 'liquid/lfm-2.5-2.6b:free'}
Date: ${new Date(meeting.created_at || Date.now()).toLocaleString()}

--------------------------------------------------
EXECUTIVE SUMMARY
--------------------------------------------------
${meeting.summary || 'No summary available.'}

--------------------------------------------------
KEY DECISIONS
--------------------------------------------------
${(meeting.decisions || []).map((d, i) => `${i + 1}. ${typeof d === 'string' ? d : d.title}`).join('\n')}

--------------------------------------------------
ACTION ITEMS & DELIVERABLES
--------------------------------------------------
${(meeting.action_items || []).map(a => `[${a.status || 'Pending'}] ${a.task} (Owner: ${a.owner || 'Unassigned'}, Priority: ${a.priority || 'Medium'}, Deadline: ${a.deadline || 'Not Mentioned'})`).join('\n')}

--------------------------------------------------
RISKS & BLOCKERS
--------------------------------------------------
${(meeting.risks || []).map(r => `• ${r.title || r} (${r.severity || 'Medium'} Severity): ${r.description || ''}`).join('\n')}

--------------------------------------------------
TRANSCRIPT TIMELINE
--------------------------------------------------
${(meeting.transcript || []).map(t => `[${t.start || t.timestamp || '00:00'}${t.end ? ' - ' + t.end : ''}] ${t.speaker || 'Speaker'}:\n${t.text}`).join('\n\n')}
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${meeting.meeting_title.replace(/\s+/g, '_')}_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Downloaded TXT report.', 'success');
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(meeting, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${meeting.meeting_title.replace(/\s+/g, '_')}_Intelligence.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Downloaded JSON export.', 'success');
  };

  const handleCopyTranscript = () => {
    const fullText = (meeting.transcript || [])
      .map(item => `[${item.start || item.timestamp || '00:00'}] ${item.speaker || 'Speaker'}: ${item.text}`)
      .join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedTranscript(true);
    addToast('Transcript copied to clipboard.', 'success');
    setTimeout(() => setCopiedTranscript(false), 2500);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(meeting.summary || '');
    setCopiedSummary(true);
    addToast('Summary copied to clipboard.', 'success');
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleCopyActions = () => {
    const actionText = (meeting.action_items || [])
      .map((a, i) => `${i + 1}. [${a.status || 'Pending'}] ${a.task} - Owner: ${a.owner || 'Unassigned'} (Deadline: ${a.deadline || 'Not Mentioned'})`)
      .join('\n');
    navigator.clipboard.writeText(actionText);
    setCopiedActions(true);
    addToast('Action items copied to clipboard.', 'success');
    setTimeout(() => setCopiedActions(false), 2500);
  };

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      
      {/* Top Header Banner & Metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="indigo">{meeting.department || 'Engineering'}</Badge>
            {getSentimentBadge(meeting.sentiment)}
            <Badge variant="emerald">AI Processed</Badge>
            <span className="text-xs font-mono text-slate-400">ID: {meeting.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {meeting.meeting_title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              {new Date(meeting.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-purple-500" />
              Participants: {meeting.participants || 'Team Members'}
            </span>
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSummary ? 'Summary Copied' : 'Copy Summary'}
          </button>

          <button
            onClick={handleCopyTranscript}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
          >
            {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
            {copiedTranscript ? 'Transcript Copied' : 'Copy Transcript'}
          </button>

          <button
            onClick={handleCopyActions}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
          >
            {copiedActions ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <CheckSquare className="w-3.5 h-3.5" />}
            {copiedActions ? 'Actions Copied' : 'Copy Actions'}
          </button>

          <button
            onClick={handleDownloadTXT}
            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> TXT Report
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
        </div>
      </div>

      {/* AUDIO PLAYER */}
      <AudioPlayer
        filename={meeting.audio_filename}
        title={meeting.meeting_title}
      />

      {/* TOP STATS CARDS */}
      <StatsCards meeting={meeting} />

      {/* PARENT GRID LAYOUT (grid-cols-1 xl:grid-cols-[1.75fr_360px] items-start gap-6) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.75fr_360px] items-start gap-6">
        
        {/* LEFT COLUMN: Executive Summary -> Transcript Timeline -> Action Items -> Next Steps -> Keywords */}
        <div className="flex flex-col gap-6">
          
          {/* 1. Executive Summary */}
          <SummaryCard summary={meeting.summary} onCopy={handleCopySummary} />

          {/* 2. Transcript Timeline */}
          <div className="max-h-[380px] overflow-y-auto h-auto flex-none rounded-2xl">
            <TranscriptCard transcript={meeting.transcript || []} onCopy={handleCopyTranscript} />
          </div>

          {/* 3. Action Items & Deliverables */}
          <ActionItemsTable actionItems={meeting.action_items || []} />

          {/* 4. Next Steps Checklist */}
          {meeting.next_steps && (
            <Card glass className="p-5 rounded-2xl">
              <div className="flex items-center gap-2.5 pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  <ListChecks className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Next Steps Checklist</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Recommended follow-ups</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {meeting.next_steps.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{typeof step === 'string' ? step : step.text || JSON.stringify(step)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* 5. Extracted Keywords */}
          <KeywordChips keywords={meeting.keywords || []} />

        </div>

        {/* RIGHT COLUMN STICKY: Productivity & Participation -> Key Decisions -> Risks & Blockers -> Metadata */}
        <div className="flex flex-col gap-5 sticky top-24">
          
          {/* 1, 2, 3. Productivity Score, Speaking Participation, AI Confidence */}
          <AnalyticsCards meeting={meeting} />

          {/* 4. Key Decisions */}
          <DecisionCard decisions={meeting.decisions || []} />
          
          {/* 5. Risks & Blockers */}
          <RiskCard risks={meeting.risks || []} />

          {/* 6. Meeting Metadata & AI Router (ENDS RIGHT SIDEBAR) */}
          <Card glass className="p-5 rounded-xl">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Meeting Metadata & AI Router
            </h4>
            <div className="space-y-1 text-[11px] font-mono text-slate-600 dark:text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">LLM Provider:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Server className="w-3 h-3" /> {meeting.provider_used || 'OpenRouter'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Model Name:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> {meeting.model_used || 'liquid/lfm-2.5-2.6b:free'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Audio File:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">{meeting.audio_filename}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Meeting ID:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{meeting.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Processing Time:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{meeting.processing_time || '1.2 sec'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status:</span>
                <Badge variant="emerald" size="sm">{meeting.status}</Badge>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
