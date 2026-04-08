import { useQuery } from '@tanstack/react-query';
import { getFeedback } from '../api/get-feedback';

export function useFeedback(params: {
  studentId?: string;
  assignmentId?: string;
}) {
  return useQuery({
    queryKey: ['feedback', params],
    queryFn: () => getFeedback(params),
    enabled: !!(params.studentId || params.assignmentId),
  });
}
