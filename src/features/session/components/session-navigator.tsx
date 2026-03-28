'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useSessions } from '../hooks/use-sessions';
import { CreateSessionModal } from './create-session-modal';
import { Session } from '../types/session';
import { formatMonth } from '@/lib/utils/format';

type Props = {
  selectedSessionId: string | null;
  onSelectSession: (session: Session) => void;
};

export function SessionNavigator({ onSelectSession }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: sessions = [] } = useSessions();

  const currentSession = sessions[currentIndex] ?? null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      onSelectSession(sessions[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < sessions.length - 1) {
      setCurrentIndex((i) => i + 1);
      onSelectSession(sessions[currentIndex + 1]);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Plus size={12} />
          세션 추가
        </button>

        <div className="flex items-center gap-1 rounded border border-gray-200 px-2 py-1.5">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="min-w-[64px] text-center text-xs font-medium text-gray-700">
            {currentSession ? formatMonth(currentSession.date) : '-'}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === sessions.length - 1}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <CreateSessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
