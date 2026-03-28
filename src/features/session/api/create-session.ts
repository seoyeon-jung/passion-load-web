import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { CreateSessionRequest, Session } from '../types/session';

export async function createSession(
  data: CreateSessionRequest,
): Promise<Session> {
  const res = await apiClient.post(ENDPOINTS.SESSIONS, data);
  return res.data;
}
