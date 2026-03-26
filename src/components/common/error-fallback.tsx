type Props = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorFallback({
  message = '데이터를 불러오지 못했습니다.',
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <p className="text-sm text-gray-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}