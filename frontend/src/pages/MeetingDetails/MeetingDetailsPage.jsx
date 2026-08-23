import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DashboardPage from '../Dashboard/DashboardPage';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import { useMeetings } from '../../context/MeetingContext';

export const MeetingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMeetingById, setCurrentMeeting } = useMeetings();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (id) {
        const data = await getMeetingById(id);
        if (data) {
          setCurrentMeeting(data);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [id, getMeetingById, setCurrentMeeting]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-sm font-semibold text-slate-500">Loading meeting intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pt-4">
        <Button
          onClick={() => navigate('/history')}
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
        >
          Back to History
        </Button>
      </div>
      <DashboardPage />
    </div>
  );
};

export default MeetingDetailsPage;
