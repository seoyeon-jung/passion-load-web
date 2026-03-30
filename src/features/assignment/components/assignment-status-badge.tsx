'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { AssignmentStatus } from '@/types/common';

const STATUS_MAP: Record<
  AssignmentStatus,
  { label: string; className: string }
> = {
  SCHEDULED: { label: '예정', className: 'bg-gray-100 text-gray-600' },
  COMPLETED: { label: '완료', className: 'bg-blue-50 text-blue-600' },
  INCOMPLETE: { label: '미이수', className: 'bg-red-50 text-red-500' },
};

type Props = {
  status: AssignmentStatus;
  onChange: (status: AssignmentStatus) => void;
  disabled?: boolean;
};

export function AssignmentStatusBadge({ status, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { label, className } = STATUS_MAP[status];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium',
          className,
          disabled ? 'cursor-default opacity-60' : 'cursor-pointer',
        )}
      >
        {label}
        {!disabled && <ChevronDown size={10} />}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 w-20 rounded border border-gray-200 bg-white shadow-sm">
          {(Object.keys(STATUS_MAP) as AssignmentStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center px-2 py-1.5 text-xs hover:bg-gray-50',
                s === status ? 'font-medium' : '',
              )}
            >
              {STATUS_MAP[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
