'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/common/modal';
import { useCreateReport } from '../hooks/use-create-report';

const schema = z.object({
  fromAt: z.string().min(1, '시작일을 선택해주세요.'),
  toAt: z.string().min(1, '종료일을 선택해주세요.'),
  summary: z.string().min(1, '요약을 입력해주세요.'),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  studentId: string;
  sessionId?: string | null;
  onSuccess?: () => void;
};

export function CreateReportModal({
  open,
  onClose,
  studentId,
  sessionId,
  onSuccess,
}: Props) {
  const { mutate, isPending } = useCreateReport();

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
        studentId,
        sessionId: sessionId ?? null,
        fromAt: new Date(values.fromAt).toISOString(),
        toAt: new Date(values.toAt + 'T23:59:59').toISOString(),
        summary: values.summary,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
          onSuccess?.();
        },
      },
    );
  });

  return (
    <Modal open={open} onClose={onClose} title="리포트 전송">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              시작일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('fromAt')}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
            {errors.fromAt && (
              <p className="mt-1 text-xs text-red-500">
                {errors.fromAt.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              종료일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('toAt')}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
            {errors.toAt && (
              <p className="mt-1 text-xs text-red-500">{errors.toAt.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            요약 <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('summary')}
            rows={4}
            placeholder="이번 달 학습 현황 요약을 입력해주세요."
            className="w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
          {errors.summary && (
            <p className="mt-1 text-xs text-red-500">
              {errors.summary.message}
            </p>
          )}
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
            className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isPending ? '전송 중...' : '전송'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
