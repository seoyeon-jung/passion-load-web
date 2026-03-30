import { AssignmentStatus } from '@/types/common';

export type Assignment = {
  id: string;
  sessionId: string;
  studentId: string;
  title: string;
  body: string;
  assignmentDate: string;
  dueDate: string | null;
  status: AssignmentStatus;
  incompletionReason: string | null;
  subject: string | null;
  categoryType: string | null;
  difficulty: string | null;
  estimatedMinutes: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAssignmentRequest = {
  sessionId: string;
  studentId: string;
  title: string;
  body: string;
  assignmentDate: string;
  dueDate?: string | null;
  status?: AssignmentStatus;
  incompletionReason?: string | null;
  subject?: string | null;
  categoryType?: string | null;
  difficulty?: string | null;
  estimatedMinutes?: number | null;
};

export type UpdateAssignmentRequest = {
  title?: string | null;
  body?: string | null;
  dueDate?: string | null;
  status?: AssignmentStatus;
  incompletionReason?: string | null;
  subject?: string | null;
  categoryType?: string | null;
  difficulty?: string | null;
  estimatedMinutes?: number | null;
};
