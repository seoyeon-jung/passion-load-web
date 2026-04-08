import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { CreateFeedbackRequest, Feedback } from '../types/feedback';

export async function createFeedback(
  data: CreateFeedbackRequest,
): Promise<Feedback> {
  const res = await apiClient.post(ENDPOINTS.FEEDBACK, data);
  return res.data;
}
