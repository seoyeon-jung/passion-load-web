'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/common/modal';
import { useUpsertSubmission } from '../hooks/use-upsert-submission';

const schema = z.object({
  reason: z.string().min(1, '미이수 사유를 입력해주세요.'),
  scheduleNote: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  assignmentId: string;
  studentId: string;
  sessionId: string;
  onSuccess: (assignmentId: string) => void;
};

export function IncompleteReasonModal({
  open,
  onClose,
  assignmentId,
  studentId,
  sessionId,
  onSuccess,
}: Props) {
  const { mutate, isPending } = useUpsertSubmission({
    sessionId,
    studentId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((values) => {
    mutate(
      {
        assignmentId,
        studentId,
        status: 'HOLD',
        reason: values.reason,
        scheduleNote: values.scheduleNote ?? null,
      },
      {
        onSuccess: () => {
          reset();
          onSuccess(assignmentId);
        },
      },
    );
  });

  return (
    <Modal open={open} onClose={onClose} title="미이수 사유 입력">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            미이수 사유 <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('reason')}
            placeholder="예) 컨디션 난조로 인해 미완료"
            rows={3}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
          {errors.reason && (
            <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            일정 조정 (선택)
          </label>
          <input
            {...register('scheduleNote')}
            placeholder="예) 2/20까지 보충 예정"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
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
            className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
