'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useSessions } from '../hooks/use-sessions';
import { CreateSessionModal } from './create-session-modal';
import { Session } from '../types/session';
import { formatMonth } from '@/lib/utils/format';

type Props = {
  onSelectSession: (session: Session) => void;
};

function getClosestIndex(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const closest = sessions.reduce((prev, curr) => {
    const prevDiff = Math.abs(
      new Date(prev.date).getTime() - new Date(today).getTime(),
    );
    const currDiff = Math.abs(
      new Date(curr.date).getTime() - new Date(today).getTime(),
    );
    return currDiff < prevDiff ? curr : prev;
  });
  return sessions.indexOf(closest);
}

export function SessionNavigator({ onSelectSession }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: sessions = [] } = useSessions();
  const prevLengthRef = useRef(0);

  const initialIndex = useMemo(() => getClosestIndex(sessions), [sessions]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSession = sessions[currentIndex] ?? null;

  useEffect(() => {
    if (sessions.length > 0 && prevLengthRef.current === 0) {
      setCurrentIndex(initialIndex);
      onSelectSession(sessions[initialIndex]);
    }
    prevLengthRef.current = sessions.length;
  }, [sessions.length, initialIndex, onSelectSession]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onSelectSession(sessions[newIndex]);
    }
  };

  const handleNext = () => {
    if (currentIndex < sessions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onSelectSession(sessions[newIndex]);
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
          <span className="min-w-20 text-center text-xs font-medium text-gray-700">
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
