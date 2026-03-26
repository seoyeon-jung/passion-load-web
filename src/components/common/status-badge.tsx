import { cn } from '@/lib/utils/cn';
import { AssignmentStatus } from '@/types/common';

type Props = {
  status: AssignmentStatus;
  className?: string;
};

const STATUS_MAP: Record<AssignmentStatus, { label: string; className: string }> = {
  SCHEDULED: {
    label: '예정',
    className: 'bg-gray-100 text-gray-600',
  },
  COMPLETED: {
    label: '완료',
    className: 'bg-blue-50 text-blue-600',
  },
  INCOMPLETE: {
    label: '미이수',
    className: 'bg-red-50 text-red-500',
  },
};

export function StatusBadge({ status, className }: Props) {
  const { label, className: statusClassName } = STATUS_MAP[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        statusClassName,
        className,
      )}
    >
      {label}
    </span>
  );
}