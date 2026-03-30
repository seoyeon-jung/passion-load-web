import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Submission } from '../types/submission';

export async function getSubmissions(params: {
  assignmentId?: string;
  studentId?: string;
}): Promise<Submission[]> {
  const res = await apiClient.get(ENDPOINTS.SUBMISSIONS, { params });
  return res.data;
}
