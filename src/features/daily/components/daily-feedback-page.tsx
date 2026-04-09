'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Bell,
  Flame,
  TrendingUp,
} from 'lucide-react';
import { useAssignments } from '@/features/assignment/hooks/use-assignments';
import { useStudents } from '@/features/student/hooks/use-students';
import { useFeedback } from '@/features/feedback/hooks/use-feedback';
import { useSubmissions } from '@/features/submission/hooks/use-submissions';
import { useCreateFeedback } from '@/features/feedback/hooks/use-create-feedback';
import { AssignmentStatusBadge } from '@/features/assignment/components/assignment-status-badge';
import { PageHeader } from '@/components/common/page-header';
import { Loading } from '@/components/common/loading';
import { EmptyState } from '@/components/common/empty-state';
import { formatDateWithDay, today } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import dayjs from 'dayjs';

const ORG_ID = '11111111-1111-1111-1111-111111111111';

export function DailyFeedbackPage() {
  const [currentDate, setCurrentDate] = useState(today());
  const [feedbackDraftMap, setFeedbackDraftMap] = useState<
    Record<string, string>
  >({});
  const [savingMap, setSavingMap] = useState<Record<string, boolean>>({});

  const { data: students = [] } = useStudents({ organizationId: ORG_ID });
  const { data: assignments = [], isLoading } = useAssignments({
    date: currentDate,
  });
  const { data: feedbacks = [] } = useFeedback({ studentId: undefined });
  const { data: submissions = [] } = useSubmissions({ studentId: undefined });
  const { mutate: createFeedback } = useCreateFeedback('');

  // 프론트 계산
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(
    (a) => a.status === 'COMPLETED',
  ).length;
  const incompleteStudentIds = new Set(
    assignments
      .filter((a) => a.status === 'INCOMPLETE')
      .map((a) => a.studentId),
  );
  const needCheckCount = assignments.filter(
    (a) => a.status !== 'COMPLETED',
  ).length;
  const achievementRate =
    totalAssignments > 0
      ? Math.round((completedAssignments / totalAssignments) * 100)
      : 0;

  const studentMap = students.reduce(
    (acc, s) => {
      acc[s.id] = s;
      return acc;
    },
    {} as Record<string, (typeof students)[0]>,
  );

  const feedbackMap = feedbacks.reduce(
    (acc, f) => {
      acc[`${f.studentId}-${f.assignmentId}`] = f;
      return acc;
    },
    {} as Record<string, (typeof feedbacks)[0]>,
  );

  const submissionMap = submissions.reduce(
    (acc, s) => {
      acc[s.assignmentId] = s;
      return acc;
    },
    {} as Record<string, (typeof submissions)[0]>,
  );

  const handleFeedbackSave = (
    studentId: string,
    assignmentId: string,
    content: string,
  ) => {
    if (!content.trim() || content.length < 250) return;
    const key = `${studentId}-${assignmentId}`;
    setSavingMap((prev) => ({ ...prev, [key]: true }));
    createFeedback(
      { studentId, assignmentId, content },
      {
        onSuccess: () => {
          setFeedbackDraftMap((prev) => ({ ...prev, [key]: '' }));
          setSavingMap((prev) => ({ ...prev, [key]: false }));
        },
        onError: () => {
          setSavingMap((prev) => ({ ...prev, [key]: false }));
        },
      },
    );
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title="공부 PT 관리"
        description="오늘의 전체 학생 학습 수행 현황을 점검하고 피드백을 남깁니다."
      />

      {/* 날짜 네비게이터 + 완료 현황 */}
      <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-5 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentDate(
                dayjs(currentDate).subtract(1, 'day').format('YYYY-MM-DD'),
              )
            }
            className="rounded p-1 text-gray-400 hover:bg-gray-100"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-blue-400" />
            <span className="text-sm font-semibold text-gray-800">
              {formatDateWithDay(currentDate)}
            </span>
          </div>
          <button
            onClick={() =>
              setCurrentDate(
                dayjs(currentDate).add(1, 'day').format('YYYY-MM-DD'),
              )
            }
            className="rounded p-1 text-gray-400 hover:bg-gray-100"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setCurrentDate(today())}
            className="rounded border border-gray-200 px-2.5 py-1 text-xs text-blue-500 hover:bg-blue-50"
          >
            오늘
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          완료 {completedAssignments}명
        </div>
      </div>

      {/* 통계 배너 */}
      <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-5 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
              <Bell size={16} className="text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">관리 필요</p>
              <p className="text-sm font-medium text-gray-800">
                오늘 확인 필요 학생:{' '}
                <span className="font-bold text-red-500">
                  {needCheckCount}명
                </span>
              </p>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-100" />

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
              <Flame size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">집중 케어 대상</p>
              <p className="text-sm font-medium text-gray-800">
                연속 미이수 학생:{' '}
                <span className="font-bold text-red-500">
                  {incompleteStudentIds.size}명
                </span>
              </p>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100">
          <TrendingUp size={13} />
          전체 학습 이행률 {achievementRate}%
        </button>
      </div>

      {/* 전체 학생 학습 점검 */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3">
          <span className="text-sm font-semibold text-gray-800">
            전체 학생 학습 점검
          </span>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <Loading />
          ) : assignments.length === 0 ? (
            <EmptyState message="이 날짜에 등록된 과제가 없습니다." />
          ) : (
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="w-[130px] px-4 py-3 text-left text-xs font-normal text-gray-400">
                    학생명
                  </th>
                  <th className="w-[80px] px-4 py-3 text-left text-xs font-normal text-gray-400">
                    선생님
                  </th>
                  <th className="w-[170px] px-4 py-3 text-left text-xs font-normal text-gray-400">
                    일별 과제
                  </th>
                  <th className="w-[160px] px-4 py-3 text-left text-xs font-normal text-gray-400">
                    학생 톡
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-normal text-gray-400">
                    강사 피드백
                  </th>
                  <th className="w-[110px] px-4 py-3 text-left text-xs font-normal text-gray-400">
                    사유/일정
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assignments.map((assignment) => {
                  const student = studentMap[assignment.studentId];
                  const feedbackKey = `${assignment.studentId}-${assignment.id}`;
                  const draftContent = feedbackDraftMap[feedbackKey] ?? '';
                  const existingFeedback = feedbackMap[feedbackKey];
                  const submission = submissionMap[assignment.id];
                  const isSaving = savingMap[feedbackKey] ?? false;
                  const isIncomplete = incompleteStudentIds.has(
                    assignment.studentId,
                  );

                  return (
                    <tr key={assignment.id} className="border-b border-gray-50">
                      {/* 학생명 */}
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-gray-800">
                              {student?.name ?? assignment.studentId}
                            </span>
                            {isIncomplete && (
                              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            공부PT-Basic
                          </span>
                        </div>
                      </td>

                      {/* 선생님 */}
                      <td className="px-4 py-4 align-top">
                        <span className="text-xs text-gray-500">
                          {student?.teacherName ?? '-'}
                        </span>
                      </td>

                      {/* 일별 과제 */}
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            <AssignmentStatusBadge
                              status={assignment.status}
                              onChange={() => {}}
                            />
                          </div>
                          <span className="truncate text-xs text-gray-700">
                            {assignment.title}
                          </span>
                        </div>
                      </td>

                      {/* 학생 톡 */}
                      <td className="px-3 py-3 align-top">
                        <textarea
                          rows={3}
                          className="h-20 w-full resize-none rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2 text-xs text-gray-700 outline-none transition-colors focus:border-gray-300 focus:bg-white"
                        />
                      </td>

                      {/* 강사 피드백 */}
                      <td className="px-3 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          {existingFeedback ? (
                            <div
                              className="h-20 w-full cursor-pointer overflow-y-auto break-all rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2 text-xs leading-relaxed text-gray-700 hover:border-gray-300"
                              onClick={() =>
                                setFeedbackDraftMap((prev) => ({
                                  ...prev,
                                  [feedbackKey]: existingFeedback.content,
                                }))
                              }
                            >
                              {existingFeedback.content}
                            </div>
                          ) : (
                            <textarea
                              value={draftContent}
                              onChange={(e) =>
                                setFeedbackDraftMap((prev) => ({
                                  ...prev,
                                  [feedbackKey]: e.target.value,
                                }))
                              }
                              onBlur={() =>
                                handleFeedbackSave(
                                  assignment.studentId,
                                  assignment.id,
                                  draftContent,
                                )
                              }
                              className="h-20 w-full resize-none rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2 text-xs leading-relaxed text-gray-700 outline-none transition-colors focus:border-gray-300 focus:bg-white"
                            />
                          )}
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                'text-xs',
                                !existingFeedback &&
                                  draftContent.length > 0 &&
                                  draftContent.length < 250
                                  ? 'text-red-400'
                                  : 'invisible',
                              )}
                            >
                              250자 이상
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

                      {/* 사유/일정 */}
                      <td className="px-3 py-4 align-top">
                        {assignment.status === 'INCOMPLETE' && (
                          <div className="flex flex-col gap-1">
                            <span className="break-all text-xs text-gray-600">
                              {submission?.reason ?? '미이수 사유'}
                            </span>
                            <span className="break-all text-xs text-gray-400">
                              {submission?.scheduleNote ?? '일정 조정'}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
