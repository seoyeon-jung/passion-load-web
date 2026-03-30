import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { UpsertSubmissionRequest, Submission } from '../types/submission';

export async function upsertSubmission(
  data: UpsertSubmissionRequest,
): Promise<Submission> {
  const res = await apiClient.post(ENDPOINTS.SUBMISSIONS, data);
  return res.data;
}
