import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout for audio processing
});

// Centralized response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'An unexpected network error occurred.';
    if (error.response) {
      errorMessage = error.response.data?.detail || error.response.data?.message || `Server returned error ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'Unable to connect to MeetingMind AI Backend. Please check if server is running.';
    } else {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export const api = {
  // Check backend health
  checkHealth: async () => {
    return await apiClient.get('/health');
  },

  // Upload meeting audio file + metadata (multipart/form-data)
  uploadAudio: async (formData) => {
    return await apiClient.post('/upload-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get all past meetings
  getHistory: async () => {
    return await apiClient.get('/history');
  },

  // Get detailed single meeting by ID
  getMeeting: async (id) => {
    return await apiClient.get(`/meeting/${id}`);
  },

  // Delete a meeting by ID
  deleteMeeting: async (id) => {
    return await apiClient.delete(`/meeting/${id}`);
  },

  // Trigger processing pipeline for a meeting
  processMeeting: async (meetingId) => {
    return await apiClient.post('/process-meeting', { meeting_id: meetingId });
  },
};

export default api;
