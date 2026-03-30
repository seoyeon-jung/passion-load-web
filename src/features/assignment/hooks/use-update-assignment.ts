import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAssignment } from '../api/update-assignment';
import { UpdateAssignmentRequest, Assignment } from '../types/assignment';

export function useUpdateAssignment(queryParams: {
  sessionId?: string;
  studentId?: string;
}) {
  const queryClient = useQueryClient();
  const queryKey = ['assignments', queryParams];

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentRequest }) =>
      updateAssignment(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Assignment[]>(queryKey);

      queryClient.setQueryData<Assignment[]>(
        queryKey,
        (old) =>
          old?.map((a) =>
            a.id === id
              ? {
                  ...a,
                  ...(data.status !== undefined && { status: data.status }),
                  ...(data.title !== undefined && {
                    title: data.title ?? a.title,
                  }),
                  ...(data.body !== undefined && { body: data.body ?? a.body }),
                  ...(data.incompletionReason !== undefined && {
                    incompletionReason: data.incompletionReason ?? null,
                  }),
                }
              : a,
          ) ?? [],
      );

      return { previous };
    },

    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
