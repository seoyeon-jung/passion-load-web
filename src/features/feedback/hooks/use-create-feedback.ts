import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFeedback } from '../api/create-feedback';
import { CreateFeedbackRequest } from '../types/feedback';

export function useCreateFeedback(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeedbackRequest) => createFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feedback', { studentId }],
      });
    },
  });
}
