import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertSubmission } from '../api/upsert-submission';
import { UpsertSubmissionRequest } from '../types/submission';

export function useUpsertSubmission(queryParams: {
  sessionId?: string;
  studentId?: string;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpsertSubmissionRequest) => upsertSubmission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assignments', queryParams],
      });
    },
  });
}
