import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { SAMPLE_MEETINGS } from '../utils/mockData';

const MeetingContext = createContext();

export const MeetingProvider = ({ children }) => {
  const [meetings, setMeetings] = useState(SAMPLE_MEETINGS);
  const [currentMeeting, setCurrentMeeting] = useState(SAMPLE_MEETINGS[0]);
  const [loading, setLoading] = useState(false);
  const [processingState, setProcessingState] = useState({
    isProcessing: false,
    step: 0,
    progress: 0,
    statusText: '',
    meetingId: null
  });
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      if (Array.isArray(data) && data.length > 0) {
        setMeetings(data);
        if (!currentMeeting) {
          setCurrentMeeting(data[0]);
        }
      }
    } catch (error) {
      console.warn("Using sample mock data fallback:", error.message);
      // Keep sample meetings if offline
    } finally {
      setLoading(false);
    }
  }, [currentMeeting]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const getMeetingById = useCallback(async (id) => {
    try {
      const data = await api.getMeeting(id);
      setCurrentMeeting(data);
      return data;
    } catch (error) {
      // Fallback search in local state
      const local = meetings.find(m => m.id === id);
      if (local) {
        setCurrentMeeting(local);
        return local;
      }
      addToast(`Meeting ${id} not found in live database.`, 'error');
      return null;
    }
  }, [meetings, addToast]);

  const deleteMeeting = useCallback(async (id) => {
    try {
      await api.deleteMeeting(id);
      addToast('Meeting deleted successfully.', 'success');
    } catch (error) {
      addToast(`Deleted locally (${error.message})`, 'info');
    } finally {
      setMeetings(prev => prev.filter(m => m.id !== id));
      if (currentMeeting && currentMeeting.id === id) {
        const remaining = meetings.filter(m => m.id !== id);
        setCurrentMeeting(remaining[0] || null);
      }
    }
  }, [currentMeeting, meetings, addToast]);

  return (
    <MeetingContext.Provider value={{
      meetings,
      currentMeeting,
      setCurrentMeeting,
      loading,
      processingState,
      setProcessingState,
      fetchMeetings,
      getMeetingById,
      deleteMeeting,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeetings = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeetings must be used within a MeetingProvider');
  }
  return context;
};
