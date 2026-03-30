'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAssignments } from '../hooks/use-assignments';
import { useUpdateAssignment } from '../hooks/use-update-assignment';
import { groupByDate } from '@/lib/utils/group-by-date';
import { AssignmentStatusBadge } from './assignment-status-badge';
import { CreateAssignmentModal } from './create-assignment-modal';
import { Loading } from '@/components/common/loading';
import { EmptyState } from '@/components/common/empty-state';
import { formatDateWithDay } from '@/lib/utils/format';
import { AssignmentStatus } from '@/types/common';

type Props = {
  sessionId: string;
  studentId: string;
};

export function DailySessionTable({ sessionId, studentId }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: assignments = [], isLoading } = useAssignments({
    sessionId,
    studentId,
  });

  const { mutate: updateAssignment } = useUpdateAssignment({
    sessionId,
    studentId,
  });

  const grouped = groupByDate(assignments);
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const handleStatusChange = (id: string, status: AssignmentStatus) => {
    updateAssignment({ id, data: { status } });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* + 과제 추가 버튼 */}
      <div className="flex justify-end border-b px-6 py-2">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Plus size={12} />
          과제 추가
        </button>
      </div>

      {dates.length === 0 ? (
        <EmptyState message="등록된 과제가 없습니다." />
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="border-b">
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500">
                  일자
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  일별 과제
                </th>
                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500">
                  플래너
                </th>
                <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500">
                  학생 특
                </th>
                <th className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500">
                  강사 피드백 (250자)
                </th>
                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500">
                  미이수 / 일정
                </th>
              </tr>
            </thead>
            <tbody>
              {dates.map((date) => {
                const items = grouped[date];
                return items.map((assignment, idx) => (
                  <tr key={assignment.id} className="border-b hover:bg-gray-50">
                    {idx === 0 && (
                      <td
                        rowSpan={items.length}
                        className="border-r px-4 py-3 align-top"
                      >
                        <div className="text-xs font-medium text-gray-900">
                          {formatDateWithDay(date).slice(5)}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <AssignmentStatusBadge
                          status={assignment.status}
                          onChange={(status) =>
                            handleStatusChange(assignment.id, status)
                          }
                        />
                        <span className="text-xs text-gray-700">
                          {assignment.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {/* 플래너 업로드 - 이슈 #11 */}
                    </td>
                    <td className="px-4 py-3">{/* 학생 특 - 이슈 #10 */}</td>
                    <td className="px-4 py-3">
                      {/* 강사 피드백 - 이슈 #12 */}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400">
                          미이수 사유
                        </span>
                        <span className="text-xs text-gray-400">일정 조정</span>
                      </div>
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateAssignmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sessionId={sessionId}
        studentId={studentId}
      />
    </div>
  );
}
