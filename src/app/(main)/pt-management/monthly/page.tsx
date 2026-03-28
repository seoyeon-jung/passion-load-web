'use client';

import { useState, Suspense } from 'react';
import { StudentListPanel } from '@/features/student/components/student-list-panel';
import { SessionNavigator } from '@/features/session/components/session-navigator';
import { PageHeader } from '@/components/common/page-header';
import { Session } from '@/features/session/types/session';
import { useSearchParams } from 'next/navigation';

function MonthlyContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="공부 PT 관리"
        description="학생별 일별 과제 체크 및 학습 피드백을 관리합니다."
      />
      <div className="flex flex-1 overflow-hidden rounded-lg border bg-white">
        <StudentListPanel />
        <div className="flex flex-1 flex-col">
          {studentId ? (
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-sm font-semibold text-gray-900">
                일별 관리 세션
              </h2>
              <SessionNavigator
                selectedSessionId={selectedSession?.id ?? null}
                onSelectSession={setSelectedSession}
              />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
              학생을 선택하세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MonthlyPage() {
  return (
    <Suspense>
      <MonthlyContent />
    </Suspense>
  );
}
