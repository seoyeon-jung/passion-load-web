export type Feedback = {
  id: string;
  organizationId: string;
  studentId: string;
  teacherId: string;
  assignmentId: string | null;
  content: string;
  createdAt: string;
};

export type CreateFeedbackRequest = {
  studentId: string;
  assignmentId?: string | null;
  content: string;
};
