import React from 'react';
import { FolderOpen, SearchX, FileQuestion, CheckSquare } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  type = 'meetings', // 'meetings' | 'search' | 'transcript' | 'actions'
  title,
  description,
  actionText = "Upload Meeting Audio",
  onAction
}) => {
  const configs = {
    meetings: {
      icon: FolderOpen,
      defaultTitle: "No Meetings Found",
      defaultDesc: "Upload your first meeting audio to start generating AI transcripts, action items, and summaries.",
      color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50"
    },
    search: {
      icon: SearchX,
      defaultTitle: "No Matching Search Results",
      defaultDesc: "Try adjusting your search keywords, department filter, or date range to find relevant meeting logs.",
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50"
    },
    transcript: {
      icon: FileQuestion,
      defaultTitle: "No Transcript Available",
      defaultDesc: "Speech-to-text transcript is being generated or missing dialogue entries.",
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/50"
    },
    actions: {
      icon: CheckSquare,
      defaultTitle: "No Action Items Extracted",
      defaultDesc: "No explicit tasks or deliverables were assigned during this discussion.",
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50"
    }
  };

  const cfg = configs[type] || configs.meetings;
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner ${cfg.color}`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        {title || cfg.defaultTitle}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        {description || cfg.defaultDesc}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
