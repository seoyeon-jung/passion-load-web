import { Assignment } from '@/features/assignment/types/assignment';

export function groupByDate(
  assignments: Assignment[],
): Record<string, Assignment[]> {
  return assignments.reduce(
    (acc, item) => {
      const key = item.assignmentDate;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, Assignment[]>,
  );
}
