import React from 'react';
import { Cpu, Sparkles, Brain } from 'lucide-react';

export const LoaderAnimation = ({ progress = 45, statusText = "Processing AI Meeting Intelligence..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
      
      {/* Circular Progress & Waveform Container */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        
        {/* Outer Pulsing Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 dark:border-indigo-400/20 animate-ping opacity-25" />
        
        {/* Rotating Circular Gradient Border */}
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-purple-600 border-b-emerald-500 border-l-transparent animate-spin" />

        {/* Center Waveform & AI Icon */}
        <div className="flex flex-col items-center justify-center z-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
            <Brain className="w-7 h-7 animate-pulse" />
          </div>

          {/* Audio Waveform Bars */}
          <div className="flex items-center gap-1 h-6">
            <span className="w-1 bg-indigo-500 rounded-full animate-wave h-3" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1 bg-purple-500 rounded-full animate-wave h-6" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 bg-emerald-500 rounded-full animate-wave h-4" style={{ animationDelay: '300ms' }}></span>
            <span className="w-1 bg-indigo-500 rounded-full animate-wave h-5" style={{ animationDelay: '450ms' }}></span>
            <span className="w-1 bg-purple-500 rounded-full animate-wave h-2" style={{ animationDelay: '600ms' }}></span>
          </div>
        </div>

        {/* Percentage Label */}
        <span className="absolute bottom-2 text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-1">
        <p className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          {statusText}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Extracting speech, transcript alignment & LLM decision intelligence
        </p>
      </div>

    </div>
  );
};

export default LoaderAnimation;
