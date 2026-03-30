import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateAssignmentRequest } from '../types/assignment';
import { createAssignment } from '../api/create-assignment';

export function useCreateAssignment(queryParams: {
  sessionId?: string;
  studentId?: string;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssignmentRequest) => createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assignments', queryParams],
      });
    },
  });
}
