export type Role = 'ADMIN' | 'TEACHER';

export type SessionStatus = 'PLANNED' | 'ACTIVE' | 'DONE';

export type AssignmentType = 'TASK' | 'DAILY_CHECK';
export type AssignmentStatus = 'SCHEDULED' | 'COMPLETED' | 'INCOMPLETE';

export type SubmissionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE' | 'HOLD';

export type ReportTarget = 'PARENT' | 'STUDENT' | 'PRINCIPAL';

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};
