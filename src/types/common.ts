// 역할
export type Role = 'ADMIN' | 'TEACHER';

// 세션
export type SessionStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';

// 과제
export type AssignmentType = 'TASK' | 'DAILY_CHECK';
export type AssignmentStatus = 'SCHEDULED' | 'COMPLETED' | 'INCOMPLETE';

// 제출
export type SubmissionStatus = 'SUBMITTED' | 'NOT_SUBMITTED' | 'INCOMPLETE';

// 리포트 대상
export type ReportTarget = 'PARENT' | 'STUDENT' | 'PRINCIPAL';

// 공통 응답 래퍼 (백엔드 응답 형식에 맞게 수정)
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
