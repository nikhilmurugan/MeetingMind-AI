import React, { useState } from 'react';
import { FileText, Copy, Check, Sparkles, Clock, AlignLeft } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export const SummaryCard = ({ summary, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const wordCount = summary ? summary.split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMins = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    if (onCopy) onCopy(summary);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Card glass className="p-6 relative overflow-hidden border-indigo-500/20">
      
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Executive Summary</h3>
              <Badge variant="indigo" size="sm">
                <Sparkles className="w-3 h-3 text-indigo-500" /> AI Generated
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Synthesized high-level business report</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Summary' : 'Copy Summary'}
          </button>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
          {summary || "No executive summary generated yet."}
        </p>

        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-indigo-100/60 dark:border-indigo-900/40">
          <span className="flex items-center gap-1">
            <AlignLeft className="w-3.5 h-3.5 text-indigo-500" /> {wordCount} Words
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-500" /> {readingTimeMins} Min Read
          </span>
        </div>
      </div>

    </Card>
  );
};

export default SummaryCard;
