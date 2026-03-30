import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Assignment } from '../types/assignment';

type GetAssignmentsParams = {
  sessionId?: string;
  studentId?: string;
  date?: string;
};

export async function getAssignments(
  params: GetAssignmentsParams,
): Promise<Assignment[]> {
  const res = await apiClient.get(ENDPOINTS.ASSIGNMENTS, { params });
  return res.data;
}
