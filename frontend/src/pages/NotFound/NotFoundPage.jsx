import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <Card glass className="p-12 text-center max-w-md w-full space-y-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Page Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The page or meeting recording you are looking for does not exist or has been moved.
          </p>
        </div>
        <Button onClick={() => navigate('/')} variant="primary" icon={Home} className="w-full">
          Return to Landing Page
        </Button>
      </Card>
    </div>
  );
};

export default NotFoundPage;
