'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/common/modal';
import { useCreateAssignment } from '../hooks/use-create-assignment';
import { AssignmentStatus } from '@/types/common';

const schema = z.object({
  title: z.string().min(1, '과제 제목을 입력해주세요.'),
  body: z.string().min(1, '과제 내용을 입력해주세요.'),
  assignmentDate: z.string().min(1, '날짜를 선택해주세요.'),
  dueDate: z.string().optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'INCOMPLETE']),
  subject: z.string().optional(),
  categoryType: z.string().optional(),
  difficulty: z.string().optional(),
  estimatedMinutes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  studentId: string;
};

export function CreateAssignmentModal({
  open,
  onClose,
  sessionId,
  studentId,
}: Props) {
  const { mutate, isPending } = useCreateAssignment({ sessionId, studentId });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'SCHEDULED' as AssignmentStatus,
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(
      {
        sessionId,
        studentId,
        title: values.title,
        body: values.body,
        assignmentDate: values.assignmentDate,
        dueDate:
          values.dueDate && values.dueDate.trim() !== ''
            ? values.dueDate
            : null,
        status: values.status as AssignmentStatus,
        subject: values.subject ?? null,
        categoryType: values.categoryType ?? null,
        difficulty: values.difficulty ?? null,
        estimatedMinutes: values.estimatedMinutes
          ? parseInt(values.estimatedMinutes, 10)
          : null,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  });

  return (
    <Modal open={open} onClose={onClose} title="과제 추가" className="max-w-lg">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {' '}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            과제 제목 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title')}
            placeholder="예) 수학 정석 p.30-35"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            과제 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('body')}
            placeholder="예) 교재 p.30-35 풀기"
            rows={3}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
          {errors.body && (
            <p className="mt-1 text-xs text-red-500">{errors.body.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              과제 날짜 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('assignmentDate')}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
            {errors.assignmentDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.assignmentDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              마감일 (선택)
            </label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            상태
          </label>
          <select
            {...register('status')}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="SCHEDULED">예정</option>
            <option value="COMPLETED">완료</option>
            <option value="INCOMPLETE">미이수</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              과목 (선택)
            </label>
            <input
              {...register('subject')}
              placeholder="예) 수학"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              유형 (선택)
            </label>
            <input
              {...register('categoryType')}
              placeholder="예) 문제풀이"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              난이도 (선택)
            </label>
            <input
              {...register('difficulty')}
              placeholder="예) 상"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              예상 시간(분) (선택)
            </label>
            <input
              type="number"
              {...register('estimatedMinutes')}
              placeholder="예) 30"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
