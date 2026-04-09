'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { CheckCircle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

type Props = {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
};

export function Toast({
  message,
  type = 'success',
  duration = 3000,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg',
        type === 'success'
          ? 'border-gray-200 bg-white text-gray-800'
          : 'border-red-200 bg-red-50 text-red-700',
      )}
    >
      {type === 'success' ? (
        <CheckCircle size={16} className="text-blue-500" />
      ) : (
        <XCircle size={16} className="text-red-500" />
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  return { toast, showToast, hideToast };
}
