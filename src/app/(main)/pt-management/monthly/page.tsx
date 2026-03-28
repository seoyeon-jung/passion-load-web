import { StudentListPanel } from '@/features/student/components/student-list-panel';
import { Suspense } from 'react';
import { PageHeader } from '@/components/common/page-header';

export default function MonthlyPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="공부 PT 관리"
        description="학생별 일별 과제 체크 및 학습 피드백을 관리합니다."
      />
      <div className="flex flex-1 overflow-hidden rounded-lg border bg-white">
        <Suspense>
          <StudentListPanel />
        </Suspense>
        <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
          학생을 선택하세요.
        </div>
      </div>
    </div>
  );
}