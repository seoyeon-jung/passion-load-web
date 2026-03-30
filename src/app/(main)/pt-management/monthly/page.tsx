'use client';

import { useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudentListPanel } from '@/features/student/components/student-list-panel';
import { SessionNavigator } from '@/features/session/components/session-navigator';
import { DailySessionTable } from '@/features/assignment/components/daily-session-table';
import { PageHeader } from '@/components/common/page-header';
import { Session } from '@/features/session/types/session';
import { TrendingUp, FileText } from 'lucide-react';

// 임시 더미 데이터 - API 연동 후 제거
const DUMMY_STUDENT_INFO = {
  name: '박지은',
  school: '반포고',
  grade: '3학년',
  kpi: {
    achievementRate: 92,
    completedDays: 18,
    totalDays: 20,
    feedbackMissing: 3,
    enrollMonth: '4월',
  },
};

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
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-500',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className={`flex-1 rounded-lg p-5 ${colorMap[color].split(' ')[0]}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${colorMap[color].split(' ')[1]}`}>
        {value}
        {sub && <span className="text-lg text-gray-400">{sub}</span>}
      </p>
    </div>
  );
}

function MonthlyContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const handleSelectSession = useCallback((session: Session) => {
    setSelectedSession(session);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="공부 PT 관리"
        description="학생별 일별 과제 체크 및 학습 피드백을 관리합니다."
      />
      <div className="flex flex-1 overflow-hidden rounded-lg border bg-white">
        <StudentListPanel />
        <div className="flex flex-1 flex-col overflow-hidden">
          {studentId ? (
            <>
              {/* 학생 정보 헤더 */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">
                    {DUMMY_STUDENT_INFO.name}
                  </span>
                  <span className="text-sm text-gray-400">
                    {DUMMY_STUDENT_INFO.school} {DUMMY_STUDENT_INFO.grade}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                    <TrendingUp size={12} />
                    성적 확인 연동
                  </button>
                  <button className="flex items-center gap-1.5 rounded bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600">
                    <FileText size={12} />
                    리포트 전송
                  </button>
                </div>
              </div>

              {/* KPI 카드 */}
              <div className="flex gap-4 border-b px-6 py-4">
                <KpiCard
                  label="과제 달성률"
                  value={`${DUMMY_STUDENT_INFO.kpi.achievementRate}%`}
                  color="blue"
                />
                <KpiCard
                  label="과제 완료일"
                  value={`${DUMMY_STUDENT_INFO.kpi.completedDays}`}
                  sub={`/${DUMMY_STUDENT_INFO.kpi.totalDays}일`}
                  color="green"
                />
                <KpiCard
                  label="피드백 누락"
                  value={`${DUMMY_STUDENT_INFO.kpi.feedbackMissing}건`}
                  color="red"
                />
                <KpiCard
                  label="자동록 월"
                  value={DUMMY_STUDENT_INFO.kpi.enrollMonth}
                  color="purple"
                />
              </div>

              {/* 세션 네비게이터 */}
              <div className="flex items-center justify-between border-b px-6 py-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  일별 관리 세션
                </h2>
                <SessionNavigator onSelectSession={handleSelectSession} />
              </div>

              {/* 과제 테이블 */}
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
