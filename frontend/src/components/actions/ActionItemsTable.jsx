import React, { useState } from 'react';
import { CheckSquare, Calendar, User, CheckCircle2, Clock, AlertCircle, LayoutGrid, Table as TableIcon } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export const ActionItemsTable = ({ actionItems = [] }) => {
  const [items, setItems] = useState(actionItems);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'

  const toggleStatus = (id) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === 'Completed' ? 'In Progress' : 'Completed';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <Badge variant="rose">High Priority</Badge>;
      case 'medium':
        return <Badge variant="amber">Medium Priority</Badge>;
      default:
        return <Badge variant="indigo">Low Priority</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge variant="emerald"><CheckCircle2 className="w-3 h-3" /> Completed</Badge>;
      case 'in progress':
        return <Badge variant="amber"><Clock className="w-3 h-3" /> In Progress</Badge>;
      default:
        return <Badge variant="slate"><AlertCircle className="w-3 h-3" /> Pending</Badge>;
    }
  };

  const highItems = items.filter(i => i.priority?.toLowerCase() === 'high');
  const mediumItems = items.filter(i => i.priority?.toLowerCase() === 'medium');
  const lowItems = items.filter(i => i.priority?.toLowerCase() === 'low' || (!i.priority || (i.priority?.toLowerCase() !== 'high' && i.priority?.toLowerCase() !== 'medium')));

  return (
    <Card glass className="p-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Action Items & Deliverables</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Assigned task owner, priority & deadline tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 font-semibold">
            {items.filter(i => i.status === 'Completed').length} / {items.length} Completed
          </span>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title="Kanban Priority Columns"
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban
            </button>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="pb-3 px-3 font-bold">Status</th>
                <th className="pb-3 px-3 font-bold">Task & Deliverable</th>
                <th className="pb-3 px-3 font-bold">Owner</th>
                <th className="pb-3 px-3 font-bold">Priority</th>
                <th className="pb-3 px-3 font-bold">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400 text-sm">
                    No action items extracted.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => toggleStatus(item.id || index)}
                  >
                    <td className="py-4 px-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(item.id || index);
                        }}
                      >
                        {getStatusBadge(item.status)}
                      </button>
                    </td>

                    <td className="py-4 px-3 font-medium text-slate-800 dark:text-slate-200 max-w-xs sm:max-w-md">
                      <span className={item.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                        {item.task}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        {item.owner || 'Unassigned'}
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      {getPriorityBadge(item.priority)}
                    </td>

                    <td className="py-4 px-3 text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.deadline || 'Not Mentioned'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* KANBAN VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* HIGH PRIORITY COLUMN */}
          <div className="space-y-3 bg-rose-50/40 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-200/50 dark:border-rose-900/30">
            <div className="flex items-center justify-between pb-2 border-b border-rose-200/60 dark:border-rose-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> High Priority
              </span>
              <span className="text-xs font-mono bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full text-rose-700 dark:text-rose-300 font-bold">
                {highItems.length}
              </span>
            </div>
            <div className="space-y-2">
              {highItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => toggleStatus(item.id || idx)}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-400 transition-all cursor-pointer space-y-2"
                >
                  <p className={`text-xs font-semibold ${item.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.task}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                      <User className="w-3 h-3" /> {item.owner || 'Unassigned'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.deadline || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MEDIUM PRIORITY COLUMN */}
          <div className="space-y-3 bg-amber-50/40 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/50 dark:border-amber-900/30">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-amber-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium Priority
              </span>
              <span className="text-xs font-mono bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full text-amber-700 dark:text-amber-300 font-bold">
                {mediumItems.length}
              </span>
            </div>
            <div className="space-y-2">
              {mediumItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => toggleStatus(item.id || idx)}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 transition-all cursor-pointer space-y-2"
                >
                  <p className={`text-xs font-semibold ${item.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.task}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                      <User className="w-3 h-3" /> {item.owner || 'Unassigned'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.deadline || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOW PRIORITY COLUMN */}
          <div className="space-y-3 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-200/50 dark:border-indigo-900/30">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60 dark:border-indigo-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Low Priority
              </span>
              <span className="text-xs font-mono bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full text-indigo-700 dark:text-indigo-300 font-bold">
                {lowItems.length}
              </span>
            </div>
            <div className="space-y-2">
              {lowItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => toggleStatus(item.id || idx)}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all cursor-pointer space-y-2"
                >
                  <p className={`text-xs font-semibold ${item.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.task}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                      <User className="w-3 h-3" /> {item.owner || 'Unassigned'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.deadline || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </Card>
  );
};

export default ActionItemsTable;
