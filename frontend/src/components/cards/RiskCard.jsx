import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import Card from '../common/Card';

export const RiskCard = ({ risks = [] }) => {
  const [expanded, setExpanded] = useState({});

  const toggle = (i) => setExpanded(prev => ({...prev, [i]: !prev[i]}));

  const severityConfig = {
    High: { label: 'High', cls: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900' },
    Medium: { label: 'Medium', cls: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900' },
    Low: { label: 'Low', cls: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900' },
  };

  return (
    <Card glass className="p-6">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Risks & Blockers</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{risks.length} risk{risks.length !== 1 ? 's' : ''} identified</p>
        </div>
      </div>

      {risks.length === 0 ? (
        <p className="text-sm text-slate-400">No blockers flagged for this meeting.</p>
      ) : (
        <div className="space-y-3">
          {risks.map((risk, i) => {
            const title = typeof risk === 'string' ? risk : (risk.title || 'Risk');
            const desc = typeof risk === 'object' ? (risk.description || '') : '';
            const severity = typeof risk === 'object' ? (risk.severity || 'Medium') : 'Medium';
            const cfg = severityConfig[severity] || severityConfig.Medium;
            const isOpen = expanded[i];

            return (
              <div key={i} className="rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/10 overflow-hidden">
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-4 py-3 gap-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.cls}`}>{cfg.label}</span>
                    {desc && (isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />)}
                  </div>
                </button>
                {isOpen && desc && (
                  <div className="px-4 pb-3 text-xs text-slate-600 dark:text-slate-400 border-t border-red-100 dark:border-red-900/40 pt-2">
                    {desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RiskCard;
