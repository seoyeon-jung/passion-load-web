type Props = {
  message?: string;
};

export function EmptyState({ message = '데이터가 없습니다.' }: Props) {
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}