import React, { useState } from 'react';
import { MessageSquare, Search, Copy, Check, Clock } from 'lucide-react';
import Card from '../common/Card';

export const TranscriptCard = ({ transcript = [], onCopy }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedItemIndex, setCopiedItemIndex] = useState(null);

  const filteredTranscript = transcript.filter(item => {
    const text = item.text || '';
    const speaker = item.speaker || '';
    const ts = (item.start || item.timestamp || '') + (item.end || '');
    const q = searchQuery.toLowerCase();
    return text.toLowerCase().includes(q) || speaker.toLowerCase().includes(q) || ts.toLowerCase().includes(q);
  });

  const handleCopyAll = () => {
    const fullText = transcript
      .map(item => `[${item.start || item.timestamp || '00:00'}${item.end ? ' - ' + item.end : ''}] ${item.speaker || 'Speaker'}:\n${item.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    if (onCopy) onCopy(fullText);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleCopyItem = (item, idx) => {
    const text = `[${item.start || item.timestamp || '00:00'}] ${item.speaker}: ${item.text}`;
    navigator.clipboard.writeText(text);
    setCopiedItemIndex(idx);
    setTimeout(() => setCopiedItemIndex(null), 2000);
  };

  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-500/60 text-slate-900 dark:text-white px-0.5 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getAvatarInitials = (name) => {
    if (!name) return 'SP';
    const parts = name.split(' ');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };

  return (
    <Card glass className="rounded-2xl border p-5">
      <div className="flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Transcript Timeline</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Timestamped speaker turns</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAll ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcript..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Dynamic Shrinking Dialogue List with max-h-[260px] */}
        <div className="space-y-3 overflow-y-auto max-h-[260px] pr-2 scrollbar-thin">
          {filteredTranscript.length === 0 ? (
            <div className="py-6 flex flex-col items-center justify-center text-center text-slate-400">
              <p className="text-xs font-medium">No matching dialogue entries found.</p>
            </div>
          ) : (
            filteredTranscript.map((item, index) => {
              const timeLabel = item.start ? `${item.start}${item.end ? ' - ' + item.end : ''}` : item.timestamp || '00:00';
              const speakerName = item.speaker || 'Speaker';
              const initials = getAvatarInitials(speakerName);

              return (
                <div key={index} className="flex items-start gap-3 group w-full">
                  
                  {/* Speaker Avatar Circle */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-[10px] shrink-0 shadow-sm mt-0.5">
                    {initials}
                  </div>

                  {/* Speech Bubble */}
                  <div className="flex-1 min-w-0 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 group-hover:border-indigo-500/30 transition-all space-y-1 relative">
                    
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                        {speakerName}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {timeLabel}
                        </span>

                        <button
                          onClick={() => handleCopyItem(item, index)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-opacity"
                          title="Copy dialogue line"
                        >
                          {copiedItemIndex === index ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                      {highlightText(item.text, searchQuery)}
                    </p>

                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer info & action */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Total Turns: {transcript.length}</span>
          <button
            onClick={handleCopyAll}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> Copy Transcript
          </button>
        </div>

      </div>
    </Card>
  );
};

export default TranscriptCard;
