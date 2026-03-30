import { useQuery } from '@tanstack/react-query';
import { getSubmissions } from '../api/get-submissions';

export function useSubmissions(params: {
  assignmentId?: string;
  studentId?: string;
}) {
  return useQuery({
    queryKey: ['submissions', params],
    queryFn: () => getSubmissions(params),
    enabled: !!(params.assignmentId || params.studentId),
  });
}
