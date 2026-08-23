import React, { useState } from 'react';
import { Tag, Hash, Check } from 'lucide-react';
import Card from '../common/Card';

export const KeywordChips = ({ keywords = [], onSelectKeyword }) => {
  const [selected, setSelected] = useState(null);

  const handleClick = (word) => {
    setSelected(word);
    if (onSelectKeyword) onSelectKeyword(word);
    setTimeout(() => setSelected(null), 1500);
  };

  return (
    <Card glass className="p-6">
      
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Extracted Keywords</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Click chip to copy/filter keyword tag</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {keywords.length === 0 ? (
          <span className="text-sm text-slate-400">No keywords extracted.</span>
        ) : (
          keywords.map((word, index) => {
            const isSel = selected === word;
            return (
              <button
                key={index}
                onClick={() => handleClick(word)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSel
                    ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {isSel ? <Check className="w-3 h-3 text-white" /> : <Hash className="w-3 h-3 text-indigo-500" />}
                {word}
              </button>
            );
          })
        )}
      </div>

    </Card>
  );
};

export default KeywordChips;
