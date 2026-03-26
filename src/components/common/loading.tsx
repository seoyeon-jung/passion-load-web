import { cn } from "@/lib/utils/cn";

type Props = {
    className?: string;
}

export function Loading({ className }: Props) {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
    </div>
  );
}

export function SkeletonRow({ className }: Props) {
  return (
    <div className={cn('flex gap-3', className)}>
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
      <div className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
    </div>
  );
}