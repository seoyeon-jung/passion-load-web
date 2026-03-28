'use client';

import { useAuth } from './use-auth';
import { Role } from '@/types/common';

export function useRole(): Role | null {
  const user = useAuth();
  return user?.role ?? null;
}

export function useIsAdmin(): boolean {
  const role = useRole();
  return role === 'ADMIN';
}