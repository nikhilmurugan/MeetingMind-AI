import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, ArrowRight, Trash2, FileAudio, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export const HistoryCard = ({ meeting, onDelete, onView }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Card glass hover className="p-5 flex flex-col justify-between group relative overflow-hidden">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileAudio className="w-5 h-5" />
            </div>
            <div>
              <Badge variant="indigo" size="sm">{meeting.department || 'General'}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge variant="emerald" size="sm">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </Badge>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete(meeting.id);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Delete meeting"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
          {meeting.meeting_title}
        </h4>

        {/* Summary Snippet */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
          {meeting.summary || "AI meeting analysis ready for review."}
        </p>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{meeting.participants || 'Team'}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{meeting.audio_duration || '30:00'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formatDate(meeting.created_at)}
          </span>

          <Link
            to={`/meeting/${meeting.id}`}
            onClick={() => onView && onView(meeting)}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </Card>
  );
};

export default HistoryCard;
