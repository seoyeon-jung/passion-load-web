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
    //organizationId: auth?.organizationId ?? '',
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
    <div className="flex w-[220px] flex-shrink-0 flex-col border-r bg-white">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold text-gray-900">PT 학생 목록</h2>
        <p className="mt-0.5 text-xs text-gray-400">
          학생을 선택하여 상세 이력을 확인하세요.
        </p>
      </div>

      <div className="border-b p-3">
        <div className="flex items-center gap-2 rounded border border-gray-200 px-2 py-1.5">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="학생명 / 강사명 검색"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <EmptyState message="학생이 없습니다." />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-3 py-2 text-left text-xs text-gray-500">
                  학생
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => handleSelect(student.id)}
                  className={cn(
                    'cursor-pointer border-b transition-colors hover:bg-gray-50',
                    selectedStudentId === student.id ? 'bg-gray-100' : '',
                  )}
                >
                  <td className="px-3 py-2.5 text-xs font-medium text-gray-900">
                    {student.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
