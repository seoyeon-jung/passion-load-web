import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Session } from '../types/session';

export async function getSessions(): Promise<Session[]> {
  const res = await apiClient.get(ENDPOINTS.SESSIONS);
  return res.data;
}
