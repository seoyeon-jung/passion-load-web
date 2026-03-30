'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStudents } from '../hooks/use-students';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useIsAdmin } from '@/features/auth/hooks/use-role';
import { Loading } from '@/components/common/loading';
import { EmptyState } from '@/components/common/empty-state';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function StudentListPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedStudentId = searchParams.get('studentId');

  const auth = useAuth();
  const isAdmin = useIsAdmin();
  const [keyword, setKeyword] = useState('');

  const { data: students = [], isLoading } = useStudents({
    organizationId: '11111111-1111-1111-1111-111111111111',
    teacherId: isAdmin ? undefined : auth?.id,
  });

  const filtered = students.filter((s) => s.name.includes(keyword));

  const handleSelect = (studentId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('studentId', studentId);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex w-[220px] flex-shrink-0 flex-col border-r border-gray-100 bg-white">
      {/* 헤더 */}
      <div className="border-b border-gray-100 px-4 py-4">
        <h2 className="text-sm font-semibold text-gray-900">PT 학생 목록</h2>
        <p className="mt-0.5 truncate text-xs text-gray-400">
          학생을 선택하여 상세 이력을 확인하세요.
        </p>
      </div>

      {/* 검색 */}
      <div className="border-b border-gray-100 px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5">
          <Search size={13} className="text-gray-300" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="학생명 / 강사명 검색"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* 테이블 헤더 */}
      <div className="grid grid-cols-3 border-b border-gray-100 px-3 py-2">
        <span className="text-xs text-gray-400">학생</span>
        <span className="text-xs text-gray-400">담당 강사</span>
        <span className="text-xs text-gray-400">등록기간</span>
      </div>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <EmptyState message="학생이 없습니다." />
        ) : (
          <div className="flex flex-col">
            {filtered.map((student) => (
              <button
                key={student.id}
                onClick={() => handleSelect(student.id)}
                className={cn(
                  'grid grid-cols-3 border-b border-gray-50 px-3 py-2.5 text-left transition-colors hover:bg-gray-50',
                  selectedStudentId === student.id ? 'bg-blue-50' : '',
                )}
              >
                <span
                  className={cn(
                    'truncate text-xs font-medium',
                    selectedStudentId === student.id
                      ? 'text-blue-600'
                      : 'text-gray-800',
                  )}
                >
                  {student.name}
                </span>
                <span className="truncate text-xs text-gray-500">
                  {student.teacherName ?? '-'}
                </span>
                <span className="truncate text-xs text-gray-400">
                  {student.enrollmentStartDate
                    ? student.enrollmentStartDate
                        .slice(2, 10)
                        .replace(/-/g, '.') + ' ~'
                    : '-'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
