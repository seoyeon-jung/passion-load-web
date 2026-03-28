import { apiClient } from '@/lib/api/client';
import { Student } from '../types/student';

type GetStudentsParams = {
  organizationId: string;
  teacherId?: string;
};

export async function getStudents(params: GetStudentsParams): Promise<Student[]> {
  const res = await apiClient.get(`/lms/${params.organizationId}/students`);
  return res.data;
}