'use client';

import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { useAssignments } from '../hooks/use-assignments';
import { useUpdateAssignment } from '../hooks/use-update-assignment';
import { useSubmissions } from '@/features/submission/hooks/use-submissions';
import { useFeedback } from '@/features/feedback/hooks/use-feedback';
import { useCreateFeedback } from '@/features/feedback/hooks/use-create-feedback';
import { groupByDate } from '@/lib/utils/group-by-date';
import { AssignmentStatusBadge } from './assignment-status-badge';
import { CreateAssignmentModal } from './create-assignment-modal';
import { IncompleteReasonModal } from '@/features/submission/components/incomplete-reason-modal';
import { Loading } from '@/components/common/loading';
import { EmptyState } from '@/components/common/empty-state';
import { formatDateWithDay } from '@/lib/utils/format';
import { AssignmentStatus } from '@/types/common';
import { cn } from '@/lib/utils/cn';

type Props = {
  sessionId: string;
  studentId: string;
};

type IncompleteTarget = { assignmentId: string } | null;

export function DailySessionTable({ sessionId, studentId }: Props) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [incompleteTarget, setIncompleteTarget] =
    useState<IncompleteTarget>(null);
  const [feedbackDraftMap, setFeedbackDraftMap] = useState<
    Record<string, string>
  >({});
  const [savingMap, setSavingMap] = useState<Record<string, boolean>>({});

  const { data: assignments = [], isLoading } = useAssignments({
    sessionId,
    studentId,
  });
  const { data: submissions = [] } = useSubmissions({ studentId });
  const { data: feedbacks = [] } = useFeedback({ studentId });
  const { mutate: updateAssignment } = useUpdateAssignment({
    sessionId,
    studentId,
  });
  const { mutate: createFeedback } = useCreateFeedback(studentId);

  const submissionMap = submissions.reduce(
    (acc, s) => {
      acc[s.assignmentId] = s;
      return acc;
    },
    {} as Record<string, (typeof submissions)[0]>,
  );

  const feedbackByDateMap = feedbacks.reduce(
    (acc, f) => {
      const date = f.createdAt.slice(0, 10);
      if (!acc[date]) acc[date] = f;
      return acc;
    },
    {} as Record<string, (typeof feedbacks)[0]>,
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

  const handleFeedbackSave = (date: string, assignmentId: string) => {
    const content = feedbackDraftMap[date];
    if (!content?.trim()) return;
    if (content.length < 250) return;

    setSavingMap((prev) => ({ ...prev, [date]: true }));
    createFeedback(
      { studentId, assignmentId, content },
      {
        onSuccess: () => {
          setFeedbackDraftMap((prev) => ({ ...prev, [date]: '' }));
          setSavingMap((prev) => ({ ...prev, [date]: false }));
        },
        onError: () => {
          setSavingMap((prev) => ({ ...prev, [date]: false }));
        },
      },
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {dates.length === 0 ? (
        <EmptyState message="등록된 과제가 없습니다." />
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-[80px] px-4 py-3 text-left text-xs font-normal text-gray-400">
                  일자
                </th>
                <th className="w-[160px] px-4 py-3 text-left text-xs font-normal text-gray-400">
                  일별 과제
                </th>
                <th className="w-[60px] px-4 py-3 text-left text-xs font-normal text-gray-400">
                  플래너
                </th>
                <th className="w-[120px] px-4 py-3 text-left text-xs font-normal text-gray-400">
                  학생 톡
                </th>
                <th className="px-4 py-3 text-left text-xs font-normal text-gray-400">
                  강사 피드백 (250자)
                </th>
                <th className="w-[100px] px-4 py-3 text-left text-xs font-normal text-gray-400">
                  미이수 / 일정
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dates.map((date) => {
                const items = grouped[date];
                const dateLabel = formatDateWithDay(date).slice(5);
                const existingFeedback = feedbackByDateMap[date];
                const draftContent = feedbackDraftMap[date] ?? '';
                const isSaving = savingMap[date] ?? false;

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
                        className="border-r border-gray-100 px-4 py-5 align-top"
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
                        <div className="flex-shrink-0">
                          <AssignmentStatusBadge
                            status={assignment.status}
                            onChange={(status) =>
                              handleStatusChange(assignment.id, status)
                            }
                          />
                        </div>
                        <span className="truncate text-xs text-gray-700">
                          {assignment.title}
                        </span>
                      </div>
                    </td>

                    {/* 플래너 - 날짜 단위 */}
                    {idx === 0 && (
                      <td
                        rowSpan={items.length}
                        className="px-3 py-5 align-top"
                      >
                        <button className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-300 transition-colors hover:border-gray-300 hover:text-gray-400">
                          <Upload size={14} />
                        </button>
                      </td>
                    )}

                    {/* 학생 톡 - 날짜 단위 */}
                    {idx === 0 && (
                      <td
                        rowSpan={items.length}
                        className="px-3 py-5 align-top"
                      >
                        <textarea
                          rows={4}
                          className="h-24 w-full resize-none rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 outline-none transition-colors focus:border-gray-300 focus:bg-white"
                        />
                      </td>
                    )}

                    {/* 강사 피드백 - 날짜 단위 */}
                    {idx === 0 && (
                      <td
                        rowSpan={items.length}
                        className="px-3 py-5 align-top"
                      >
                        <div className="flex flex-col gap-1.5">
                          {existingFeedback ? (
                            <div
                              className="h-24 w-full cursor-pointer overflow-y-auto overflow-x-hidden break-all rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2 text-xs leading-relaxed text-gray-700 hover:border-gray-300"
                              onClick={() => {
                                setFeedbackDraftMap((prev) => ({
                                  ...prev,
                                  [date]: existingFeedback.content,
                                }));
                              }}
                            >
                              {existingFeedback.content}
                            </div>
                          ) : (
                            <textarea
                              value={draftContent}
                              onChange={(e) =>
                                setFeedbackDraftMap((prev) => ({
                                  ...prev,
                                  [date]: e.target.value,
                                }))
                              }
                              onBlur={() => {
                                if (
                                  draftContent.trim() &&
                                  draftContent.length >= 250
                                ) {
                                  handleFeedbackSave(date, assignment.id);
                                }
                              }}
                              className="h-24 w-full resize-none rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2 text-xs leading-relaxed text-gray-700 outline-none transition-colors focus:border-gray-300 focus:bg-white"
                            />
                          )}

                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                'text-xs transition-opacity',
                                !existingFeedback &&
                                  draftContent.length > 0 &&
                                  draftContent.length < 250
                                  ? 'text-red-400 opacity-100'
                                  : 'invisible',
                              )}
                            >
                              250자 이상 작성해주세요.
                            </span>
                            <span
                              className={cn(
                                'text-xs',
                                !existingFeedback &&
                                  draftContent.length > 0 &&
                                  draftContent.length < 250
                                  ? 'text-red-400'
                                  : 'text-gray-300',
                              )}
                            >
                              {existingFeedback
                                ? `${existingFeedback.content.length}자`
                                : `${draftContent.length}자`}
                            </span>
                          </div>

                          {isSaving && (
                            <span className="text-right text-xs text-blue-400">
                              저장 중...
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* 미이수/일정 - 과제 단위, 미이수일 때만 */}
                    <td className="px-3 py-3 align-middle">
                      {assignment.status === 'INCOMPLETE' && (
                        <div className="flex flex-col gap-1.5">
                          <span className="break-words text-xs text-gray-600">
                            {submissionMap[assignment.id]?.reason ?? '-'}
                          </span>
                          <span className="break-words text-xs text-gray-400">
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
