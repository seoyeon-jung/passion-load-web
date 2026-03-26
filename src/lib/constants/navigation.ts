export type NavItem = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  icon: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: '학생 관리',
    icon: 'Users',
    items: [
      { label: '학생 목록', href: '/students' },
      { label: '퇴원생 관리', href: '/students/discharged' },
    ],
  },
  {
    label: '공부 PT 관리',
    icon: 'BookOpen',
    items: [
      { label: '학생별 월간 관리', href: '/pt-management/monthly' },
      { label: '일별 피드백 현황', href: '/pt-management/daily' },
      { label: '학생별 캘린더', href: '/pt-management/calendar' },
    ],
  },
];