'use client';

import { useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudentListPanel } from '@/features/student/components/student-list-panel';
import { SessionNavigator } from '@/features/session/components/session-navigator';
import { DailySessionTable } from '@/features/assignment/components/daily-session-table';
import { PageHeader } from '@/components/common/page-header';
import { Session } from '@/features/session/types/session';
import { useAssignments } from '@/features/assignment/hooks/use-assignments';
import { useStudents } from '@/features/student/hooks/use-students';
import { CreateReportModal } from '@/features/report/components/create-report-modal';
import { Toast, useToast } from '@/components/common/toast';
import { TrendingUp, FileText } from 'lucide-react';
import dayjs from 'dayjs';

function KpiCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: 'blue' | 'green' | 'red' | 'purple';
}) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    red: { bg: 'bg-red-50', text: 'text-red-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  };

  return (
    <div className={`flex-1 rounded-xl p-5 ${colorMap[color].bg}`}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${colorMap[color].text}`}>
        {value}
        {sub && (
          <span className="ml-0.5 text-base font-normal text-gray-400">
            {sub}
          </span>
        )}
      </p>
    </div>
  );
}

function StudentContent({
  studentId,
  studentName,
  selectedSession,
  onSelectSession,
  onOpenReport,
}: {
  studentId: string;
  studentName: string;
  selectedSession: Session | null;
  onSelectSession: (session: Session) => void;
  onOpenReport: () => void;
}) {
  const { data: assignments = [] } = useAssignments({
    sessionId: selectedSession?.id,
    studentId,
  });

  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === 'COMPLETED').length;
  const achievementRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const enrollMonth = selectedSession
    ? `${dayjs(selectedSession.date).month() + 1}월`
    : '-';

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">{studentName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
            <TrendingUp size={12} />
            성적 확인 연동
          </button>
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 rounded bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600"
          >
            <FileText size={12} />
            리포트 전송
          </button>
        </div>
      </div>

      <div className="flex gap-3 border-b border-gray-100 px-6 py-4">
        <KpiCard
          label="과제 달성률"
          value={`${achievementRate}%`}
          color="blue"
        />
        <KpiCard
          label="과제 완료일"
          value={`${completed}`}
          sub={`/${total}일`}
          color="green"
        />
        <KpiCard label="피드백 누락" value="0건" color="red" />
        <KpiCard label="재등록 월" value={enrollMonth} color="purple" />
      </div>

      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3">
        <h2 className="text-sm font-semibold text-gray-900">일별 관리 세션</h2>
        <SessionNavigator onSelectSession={onSelectSession} />
      </div>

      {selectedSession ? (
        <DailySessionTable
          sessionId={selectedSession.id}
          studentId={studentId}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
          세션을 선택하세요.
        </div>
      )}
    </>
  );
}

function MonthlyContent({
  showToast,
}: {
  showToast: (message: string, type?: 'success' | 'error') => void;
}) {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const { data: students = [] } = useStudents({
    organizationId: '11111111-1111-1111-1111-111111111111',
  });

  const selectedStudent = students.find((s) => s.id === studentId);

  const handleSelectSession = useCallback((session: Session) => {
    setSelectedSession(session);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="공부 PT 관리"
        description="학생별 일별 과제 체크 및 학습 피드백을 관리합니다."
      />
      <div className="flex flex-1 overflow-hidden rounded-lg border border-gray-100 bg-white">
        <StudentListPanel />
        <div className="flex flex-1 flex-col overflow-hidden">
          {studentId ? (
            <StudentContent
              studentId={studentId}
              studentName={selectedStudent?.name ?? ''}
              selectedSession={selectedSession}
              onSelectSession={handleSelectSession}
              onOpenReport={() => setReportModalOpen(true)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
              학생을 선택하세요.
            </div>
          )}
        </div>
      </div>

      {studentId && (
        <CreateReportModal
          open={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          studentId={studentId}
          sessionId={selectedSession?.id ?? null}
          onSuccess={() => showToast('리포트 전송이 완료되었습니다.')}
        />
      )}
    </div>
  );
}

export default function MonthlyPage() {
  const { toast, showToast, hideToast } = useToast();

  return (
    <>
      <Suspense>
        <MonthlyContent showToast={showToast} />
      </Suspense>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </>
  );
}
