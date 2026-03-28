import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../api/get-students';

type Params = {
  organizationId: string;
  teacherId?: string;
};

export function useStudents(params: Params) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => getStudents(params),
    enabled: !!params.organizationId,
  });
}