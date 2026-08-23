import React from 'react';
import { BrainCircuit, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#09090B]/50 backdrop-blur-md py-10 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-800 dark:text-white text-base tracking-tight block">MeetingMind AI</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block -mt-0.5">AI Meeting Intelligence Platform</span>
            </div>
          </div>

          <div className="text-center space-y-0.5">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Developed by <span className="text-indigo-600 dark:text-indigo-400">Nikhil Murugan D P</span>
            </p>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Built for <strong className="text-slate-700 dark:text-slate-300">Unthinkable Internship Assignment</strong>
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Powered by React • FastAPI • Whisper • OpenRouter • SQLite
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
