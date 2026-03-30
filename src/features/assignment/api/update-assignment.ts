import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { UpdateAssignmentRequest, Assignment } from '../types/assignment';

export async function updateAssignment(
  id: string,
  data: UpdateAssignmentRequest,
): Promise<Assignment> {
  const res = await apiClient.patch(ENDPOINTS.ASSIGNMENT_DETAIL(id), data);
  return res.data;
}
