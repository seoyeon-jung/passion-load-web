import { useQuery } from '@tanstack/react-query';
import { getAssignments } from '../api/get-assignments';

type Params = {
  sessionId?: string;
  studentId?: string;
  date?: string;
};

export function useAssignments(params: Params) {
  return useQuery({
    queryKey: ['assignments', params],
    queryFn: () => getAssignments(params),
    enabled: !!(params.sessionId || params.studentId || params.date),
  });
}
