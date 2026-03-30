import { SubmissionStatus } from '@/types/common';

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  status: SubmissionStatus;
  reason: string | null;
  scheduleNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpsertSubmissionRequest = {
  assignmentId: string;
  studentId: string;
  status: SubmissionStatus;
  reason?: string | null;
  scheduleNote?: string | null;
};
