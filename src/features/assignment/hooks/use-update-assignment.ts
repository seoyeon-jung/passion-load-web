import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAssignment } from '../api/update-assignment';
import { UpdateAssignmentRequest } from '../types/assignment';

export function useUpdateAssignment(queryParams: {
  sessionId?: string;
  studentId?: string;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentRequest }) =>
      updateAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', queryParams] });
    },
  });
}
