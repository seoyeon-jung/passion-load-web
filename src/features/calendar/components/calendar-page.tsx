'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStudents } from '@/features/student/hooks/use-students';
import { useAssignments } from '@/features/assignment/hooks/use-assignments';
import { PageHeader } from '@/components/common/page-header';
import { cn } from '@/lib/utils/cn';
import dayjs, { Dayjs } from 'dayjs';
import { Assignment } from '@/features/assignment/types/assignment';

const ORG_ID = '11111111-1111-1111-1111-111111111111';
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function CalendarPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [currentMonth, setCurrentMonth] = useState<Dayjs | null>(null);
  const [todayStr, setTodayStr] = useState<string>('');
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  useEffect(() => {
    setCurrentMonth(dayjs().startOf('month'));
    setTodayStr(dayjs().format('YYYY-MM-DD'));
  }, []);

  const { data: students = [] } = useStudents({ organizationId: ORG_ID });
  const { data: assignments = [] } = useAssignments({
    studentId: selectedStudentId ?? undefined,
    date: undefined,
  });

  if (!currentMonth) return null;

  const assignmentByDate = assignments
    .filter((a) => dayjs(a.assignmentDate).isSame(currentMonth, 'month'))
    .reduce(
      (acc, a) => {
        const key = a.assignmentDate;
        if (!acc[key]) acc[key] = [];
        acc[key].push(a);
        return acc;
      },
      {} as Record<string, typeof assignments>,
    );

  const startDow = currentMonth.day();
  const daysInMonth = currentMonth.daysInMonth();
  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = `${currentMonth.year()}. ${currentMonth.month() + 1}`;

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="공부 PT 관리"
        description="학생별 월간 학습 캘린더를 통해 과제 수행 여부를 확인합니다."
      />
      <div className="flex flex-1 overflow-hidden rounded-lg border border-gray-100 bg-white">
        {/* 학생 선택 패널 */}
        <div className="flex w-[200px] flex-shrink-0 flex-col border-r border-gray-100">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-800">학생 선택</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={cn(
                  'flex w-full flex-col border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50',
                  selectedStudentId === student.id ? 'bg-blue-50' : '',
                )}
              >
                <span
                  className={cn(
                    'text-sm font-medium',
                    selectedStudentId === student.id
                      ? 'text-blue-600'
                      : 'text-gray-800',
                  )}
                >
                  {student.name}
                </span>
                {student.teacherName && (
                  <span className="mt-0.5 text-xs text-gray-400">
                    {student.teacherName}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 캘린더 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 월 네비게이터 */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-3">
            <button
              onClick={() => setCurrentMonth((m) => m!.subtract(1, 'month'))}
              className="rounded p-1 text-gray-400 hover:bg-gray-100"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="min-w-[64px] text-center text-sm font-semibold text-gray-800">
              {monthLabel}
            </span>
            <button
              onClick={() => setCurrentMonth((m) => m!.add(1, 'month'))}
              className="rounded p-1 text-gray-400 hover:bg-gray-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {DAYS.map((day, i) => (
              <div
                key={day}
                className={cn(
                  'py-2.5 text-center text-xs font-medium',
                  i === 0 ? 'text-red-400' : '',
                  i === 6 ? 'text-blue-400' : '',
                  i !== 0 && i !== 6 ? 'text-gray-500' : '',
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-7 border-l border-t border-gray-200">
              {cells.map((day, idx) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[120px] border-b border-r border-gray-200 bg-gray-50/50"
                    />
                  );
                }

                const dateStr = currentMonth.date(day).format('YYYY-MM-DD');
                const dayAssignments = assignmentByDate[dateStr] ?? [];
                const isToday = todayStr === dateStr;
                const dow = idx % 7;

                return (
                  <div
                    key={dateStr}
                    className="min-h-[120px] border-b border-r border-gray-200 p-2"
                  >
                    {/* 날짜 숫자 */}
                    <div
                      className={cn(
                        'mb-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                        isToday
                          ? 'bg-blue-500 font-bold text-white'
                          : dow === 0
                            ? 'text-red-400'
                            : dow === 6
                              ? 'text-blue-400'
                              : 'text-gray-700',
                      )}
                    >
                      {day}
                    </div>

                    {/* 과제 뱃지 */}
                    <div className="flex flex-col gap-0.5">
                      {dayAssignments.slice(0, 3).map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setSelectedAssignment(a)}
                          className={cn(
                            'w-full truncate rounded px-1.5 py-0.5 text-left text-xs transition-opacity hover:opacity-80',
                            a.status === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-700'
                              : a.status === 'INCOMPLETE'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-amber-100 text-amber-700',
                          )}
                        >
                          {a.title}
                        </button>
                      ))}
                      {dayAssignments.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{dayAssignments.length - 3}개
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 과제 상세 팝업 */}
      {selectedAssignment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setSelectedAssignment(null)}
        >
          <div
            className="w-[400px] rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium',
                    selectedAssignment.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-700'
                      : selectedAssignment.status === 'INCOMPLETE'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-amber-100 text-amber-700',
                  )}
                >
                  {selectedAssignment.status === 'COMPLETED'
                    ? '완료'
                    : selectedAssignment.status === 'INCOMPLETE'
                      ? '미이수'
                      : '예정'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {selectedAssignment.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* 내용 */}
            <div className="flex flex-col gap-3">
              {selectedAssignment.body && (
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-400">내용</p>
                  <p className="text-sm text-gray-700">
                    {selectedAssignment.body}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-400">
                    과제 날짜
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedAssignment.assignmentDate}
                  </p>
                </div>
                {selectedAssignment.dueDate && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-400">
                      마감일
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedAssignment.dueDate}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {selectedAssignment.subject && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-400">
                      과목
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedAssignment.subject}
                    </p>
                  </div>
                )}
                {selectedAssignment.difficulty && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-400">
                      난이도
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedAssignment.difficulty}
                    </p>
                  </div>
                )}
                {selectedAssignment.estimatedMinutes && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-400">
                      예상 시간
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedAssignment.estimatedMinutes}분
                    </p>
                  </div>
                )}
                {selectedAssignment.categoryType && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-400">
                      유형
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedAssignment.categoryType}
                    </p>
                  </div>
                )}
              </div>

              {selectedAssignment.incompletionReason && (
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-400">
                    미이수 사유
                  </p>
                  <p className="text-sm text-red-500">
                    {selectedAssignment.incompletionReason}
                  </p>
                </div>
              )}
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedAssignment(null)}
              className="mt-5 w-full rounded-lg bg-gray-100 py-2 text-sm text-gray-600 hover:bg-gray-200"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
