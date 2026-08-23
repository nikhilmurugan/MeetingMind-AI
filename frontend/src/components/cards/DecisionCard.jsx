import React from 'react';
import { Gavel, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';

export const DecisionCard = ({ decisions = [] }) => (
  <Card glass className="p-6">
    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
        <Gavel className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Key Decisions</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{decisions.length} consensus item{decisions.length !== 1 ? 's' : ''} recorded</p>
      </div>
    </div>
    {decisions.length === 0 ? (
      <p className="text-sm text-slate-400">No explicit decisions recorded.</p>
    ) : (
      <ul className="space-y-2">
        {decisions.map((d, i) => (
          <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30">
            <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {typeof d === 'string' ? d : d.title || JSON.stringify(d)}
            </span>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

export default DecisionCard;
