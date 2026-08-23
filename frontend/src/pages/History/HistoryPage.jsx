import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Plus, Filter, PlayCircle, Calendar } from 'lucide-react';
import HistoryCard from '../../components/history/HistoryCard';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { useMeetings } from '../../context/MeetingContext';
import { SAMPLE_MEETINGS } from '../../utils/mockData';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const { meetings, deleteMeeting, setCurrentMeeting, addToast } = useMeetings();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [dateRange, setDateRange] = useState('All'); // 'All' | 'Today' | 'This Week' | 'This Month'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  const departments = ['All', 'Engineering', 'Product', 'Design', 'Executive', 'Marketing', 'Sales'];

  const filterByDateRange = (meetingDateStr) => {
    if (dateRange === 'All') return true;
    const meetingDate = new Date(meetingDateStr || Date.now());
    const now = new Date();

    if (dateRange === 'Today') {
      return meetingDate.toDateString() === now.toDateString();
    }
    if (dateRange === 'This Week') {
      const diffTime = Math.abs(now - meetingDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    if (dateRange === 'This Month') {
      return meetingDate.getMonth() === now.getMonth() && meetingDate.getFullYear() === now.getFullYear();
    }
    return true;
  };

  const filteredMeetings = meetings
    .filter(meeting => {
      const matchesSearch =
        meeting.meeting_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (meeting.participants && meeting.participants.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (meeting.summary && meeting.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (meeting.keywords && meeting.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesDept = selectedDept === 'All' || meeting.department === selectedDept;
      const matchesDate = filterByDateRange(meeting.created_at);

      return matchesSearch && matchesDept && matchesDate;
    })
    .sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));

  const confirmDelete = () => {
    if (targetDeleteId) {
      deleteMeeting(targetDeleteId);
      setDeleteModalOpen(false);
      setTargetDeleteId(null);
      addToast('Meeting session deleted.', 'info');
    }
  };

  const handleTryDemo = () => {
    const demoMeeting = SAMPLE_MEETINGS[0];
    setCurrentMeeting(demoMeeting);
    addToast('Loaded built-in demo meeting intelligence!', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HistoryIcon className="w-7 h-7 text-indigo-500" /> Meeting History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter by date range, and inspect all processed meeting sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleTryDemo} variant="outline" icon={PlayCircle}>
            Try Demo
          </Button>

          <Button onClick={() => navigate('/')} variant="primary" icon={Plus}>
            New Meeting Upload
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, participant, summary, or keyword..."
          className="flex-1"
        />

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Date Range Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {['All', 'Today', 'This Week', 'This Month'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  dateRange === range
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Department Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Meeting Cards Grid or Empty State */}
      {filteredMeetings.length === 0 ? (
        <EmptyState
          title="No Meetings Match Filter"
          description="Try clearing your search query, date range, or department filter to view archived meeting sessions."
          actionText="Try Demo Meeting"
          onAction={handleTryDemo}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => (
            <HistoryCard
              key={meeting.id}
              meeting={meeting}
              onDelete={(id) => {
                setTargetDeleteId(id);
                setDeleteModalOpen(true);
              }}
              onView={(m) => {
                setCurrentMeeting(m);
                navigate(`/meeting/${m.id}`);
              }}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Meeting Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete this meeting? This will remove the audio recording and all generated intelligence permanently.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default HistoryPage;
