'use client';

import { usePathname } from 'next/navigation';
import { NAV_GROUPS } from '@/lib/constants/navigation';

function useBreadcrumb() {
  const pathname = usePathname();

  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (pathname.startsWith(item.href)) {
        return [{ label: group.label }, { label: item.label }];
      }
    }
  }
  return [];
}

export function Header() {
  const breadcrumb = useBreadcrumb();

  return (
    <header className="flex h-[65px] items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <span>대시보드</span>
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            <span>·</span>
            <span
              className={
                i === breadcrumb.length - 1 ? 'font-medium text-gray-900' : ''
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">관리자</span>
        <button className="rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50">
          로그아웃
        </button>
      </div>
    </header>
  );
}