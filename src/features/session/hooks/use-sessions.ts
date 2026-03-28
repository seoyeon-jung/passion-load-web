import { useQuery } from '@tanstack/react-query';
import { getSessions } from '../api/get-sessions';

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => getSessions(),
  });
}
