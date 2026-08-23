import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MeetingProvider } from './context/MeetingContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';

import LandingPage from './pages/Landing/LandingPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import HistoryPage from './pages/History/HistoryPage';
import ProcessingPage from './pages/Processing/ProcessingPage';
import MeetingDetailsPage from './pages/MeetingDetails/MeetingDetailsPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

export function App() {
  return (
    <ThemeProvider>
      <MeetingProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#09090B] dark:text-slate-100 transition-colors duration-300 font-sans">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/processing" element={<ProcessingPage />} />
                <Route path="/meeting/:id" element={<MeetingDetailsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <Toast />
          </div>
        </Router>
      </MeetingProvider>
    </ThemeProvider>
  );
}

export default App;
