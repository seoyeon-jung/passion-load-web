import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { CreateAssignmentRequest, Assignment } from '../types/assignment';

export async function createAssignment(
  data: CreateAssignmentRequest,
): Promise<Assignment> {
  const res = await apiClient.post(ENDPOINTS.ASSIGNMENTS, data);
  return res.data;
}
