import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSession } from '../api/create-session';
import { CreateSessionRequest } from '../types/session';

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSessionRequest) => createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
