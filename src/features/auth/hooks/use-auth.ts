'use client';

import { tokenStorage } from '../utils/token';
import { TokenPayload, AuthUser } from '../types/auth';

function parseJwt(token: string): TokenPayload | null {
  try {
    const base64 = token.split('.')[1];
    const decoded = atob(base64);
    return JSON.parse(decoded) as TokenPayload;
  } catch {
    return null;
  }
}

export function useAuth(): AuthUser | null {
  const token = tokenStorage.get();
  if (!token) return null;

  const payload = parseJwt(token);
  if (!payload) return null;

  if (payload.exp * 1000 < Date.now()) {
    tokenStorage.remove();
    return null;
  }

  return {
    id: payload.sub,
    name: payload.name,
    role: payload.role,
    organizationId: payload.organizationId,
  };
}