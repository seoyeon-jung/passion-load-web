import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Feedback } from '../types/feedback';

export async function getFeedback(params: {
  studentId?: string;
  assignmentId?: string;
}): Promise<Feedback[]> {
  const res = await apiClient.get(ENDPOINTS.FEEDBACK, { params });
  return res.data;
}
