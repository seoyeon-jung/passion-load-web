'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BookOpen, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { NAV_GROUPS, NavGroup } from '@/lib/constants/navigation';

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users size={16} />,
  BookOpen: <BookOpen size={16} />,
};

function NavGroupItem({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  const isGroupActive = group.items.some((item) =>
    pathname.startsWith(item.href),
  );
  const [open, setOpen] = useState(isGroupActive);

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isGroupActive
            ? 'text-gray-900'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
        )}
      >
        <span className="flex items-center gap-2">
          {ICON_MAP[group.icon]}
          {group.label}
        </span>
        <ChevronDown
          size={14}
          className={cn('transition-transform', open ? 'rotate-180' : '')}
        />
      </button>

      {open && (
        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-gray-200 pl-3">
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-2 py-1.5 text-sm transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex w-[200px] flex-col border-r border-gray-100 bg-white">
      <div className="flex h-[65px] items-center border-b border-gray-100 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-red-500 text-xs font-bold text-white">
            열
          </div>
          <div>
            <p className="text-xs font-bold leading-none text-gray-900">
              열정스토리
            </p>
            <p className="text-[10px] text-gray-400">ACADEMY</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {NAV_GROUPS.map((group) => (
          <NavGroupItem key={group.label} group={group} />
        ))}
      </nav>
    </aside>
  );
}
