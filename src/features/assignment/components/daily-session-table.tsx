'use client';

import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { useAssignments } from '../hooks/use-assignments';
import { useUpdateAssignment } from '../hooks/use-update-assignment';
import { useSubmissions } from '@/features/submission/hooks/use-submissions';
import { groupByDate } from '@/lib/utils/group-by-date';
import { AssignmentStatusBadge } from './assignment-status-badge';
import { CreateAssignmentModal } from './create-assignment-modal';
import { IncompleteReasonModal } from '@/features/submission/components/incomplete-reason-modal';
import { Loading } from '@/components/common/loading';
import { EmptyState } from '@/components/common/empty-state';
import { formatDateWithDay } from '@/lib/utils/format';
import { AssignmentStatus } from '@/types/common';

type Props = {
  sessionId: string;
  studentId: string;
};

type IncompleteTarget = { assignmentId: string } | null;

export function DailySessionTable({ sessionId, studentId }: Props) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [incompleteTarget, setIncompleteTarget] =
    useState<IncompleteTarget>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});

  const { data: assignments = [], isLoading } = useAssignments({
    sessionId,
    studentId,
  });
  const { data: submissions = [] } = useSubmissions({ studentId });
  const { mutate: updateAssignment } = useUpdateAssignment({
    sessionId,
    studentId,
  });

  const submissionMap = submissions.reduce(
    (acc, s) => {
      acc[s.assignmentId] = s;
      return acc;
    },
    {} as Record<string, (typeof submissions)[0]>,
  );

  const grouped = groupByDate(assignments);
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const handleStatusChange = (id: string, status: AssignmentStatus) => {
    if (status === 'INCOMPLETE') {
      setIncompleteTarget({ assignmentId: id });
      return;
    }
    updateAssignment({ id, data: { status } });
  };

  const handleIncompleteSuccess = (assignmentId: string) => {
    updateAssignment({ id: assignmentId, data: { status: 'INCOMPLETE' } });
    setIncompleteTarget(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {dates.length === 0 ? (
        <EmptyState message="등록된 과제가 없습니다." />
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse border-gray-50">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-24 px-5 py-3 text-left text-xs font-normal text-gray-400">
                  일자
                </th>
                <th className="px-4 py-3 text-left text-xs font-normal text-gray-400">
                  일별 과제
                </th>
                <th className="w-20 px-4 py-3 text-left text-xs font-normal text-gray-400">
                  플래너
                </th>
                <th className="w-44 px-4 py-3 text-left text-xs font-normal text-gray-400">
                  학생 특
                </th>
                <th className="w-64 px-4 py-3 text-left text-xs font-normal text-gray-400">
                  강사 피드백 (250자)
                </th>
                <th className="w-32 px-4 py-3 text-left text-xs font-normal text-gray-400">
                  미이수 / 일정
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dates.map((date) => {
                const items = grouped[date];
                const dateLabel = formatDateWithDay(date).slice(5);
                const feedbackKey = date;
                const feedbackValue = feedbackMap[feedbackKey] ?? '';
                const isOverLimit = feedbackValue.length > 250;

                return items.map((assignment, idx) => (
                  <tr
                    key={assignment.id}
                    className={
                      idx === items.length - 1 ? 'border-b border-gray-100' : ''
                    }
                  >
                    {/* 일자 */}
                    {idx === 0 && (
                      <td
                        rowSpan={items.length}
                        className="border-r border-gray-100 px-5 py-5 align-top"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800">
                            {dateLabel.split(' ')[0]}
                          </span>
                          <span className="text-xs text-gray-400">
                            {dateLabel.split(' ')[1]}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 일별 과제 */}
                    <td className="px-4 py-3 align-middle">
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

                    {/* 플래너 - 날짜 단위 */}
                    {idx === 0 && (
                      <td
                        rowSpan={items.length}
                        className="px-4 py-5 align-top"
                      >
                        <button className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-300 transition-colors hover:border-gray-300 hover:text-gray-400">
                          <Upload size={16} />
                        </button>
                      </td>
                    )}

                    {/* 학생 특 - 날짜 단위 */}
                    {idx === 0 && (
                      <td
                        rowSpan={items.length}
                        className="px-4 py-5 align-top"
                      >
                        <textarea
                          rows={4}
                          className="w-full resize-none rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 outline-none transition-colors placeholder:text-gray-300 focus:border-gray-300 focus:bg-white"
                        />
                      </td>
                    )}

                    {/* 강사 피드백 - 날짜 단위 */}
                    {idx === 0 && (
                      <td
                        rowSpan={items.length}
                        className="px-4 py-5 align-top"
                      >
                        <div className="flex flex-col gap-1.5">
                          <textarea
                            rows={4}
                            maxLength={250}
                            value={feedbackValue}
                            onChange={(e) =>
                              setFeedbackMap((prev) => ({
                                ...prev,
                                [feedbackKey]: e.target.value,
                              }))
                            }
                            className="w-full resize-none rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 outline-none transition-colors placeholder:text-gray-300 focus:border-gray-300 focus:bg-white"
                          />
                          <span
                            className={`text-right text-xs ${isOverLimit ? 'text-red-400' : 'text-gray-300'}`}
                          >
                            {feedbackValue.length}/250자
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 미이수/일정 - 과제 단위, 미이수일 때만 */}
                    <td className="px-4 py-3 align-middle">
                      {assignment.status === 'INCOMPLETE' && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs text-gray-600">
                            {submissionMap[assignment.id]?.reason ?? '-'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {submissionMap[assignment.id]?.scheduleNote ?? '-'}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t border-gray-100 px-5 py-3">
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-600"
        >
          <Plus size={12} />
          과제 추가
        </button>
      </div>

      <CreateAssignmentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        sessionId={sessionId}
        studentId={studentId}
      />

      <IncompleteReasonModal
        open={incompleteTarget !== null}
        onClose={() => setIncompleteTarget(null)}
        assignmentId={incompleteTarget?.assignmentId ?? ''}
        studentId={studentId}
        sessionId={sessionId}
        onSuccess={handleIncompleteSuccess}
      />
    </div>
  );
}
