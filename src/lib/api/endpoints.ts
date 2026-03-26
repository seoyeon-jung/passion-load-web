export const ENDPOINTS = {
  // LMS
  LMS_STUDENTS: '/lms/students',
  LMS_TEACHERS: '/lms/teachers',

  // Session
  SESSIONS: '/api/v1/passion-load/sessions',
  SESSION_DETAIL: (id: string) => `/api/v1/passion-load/sessions/${id}`,

  // Assignment
  ASSIGNMENTS: '/api/v1/passion-load/assignments',
  ASSIGNMENT_DETAIL: (id: string) => `/api/v1/passion-load/assignments/${id}`,

  // Submission
  SUBMISSIONS: '/api/v1/passion-load/submissions',
  SUBMISSION_DETAIL: (id: string) => `/api/v1/passion-load/submissions/${id}`,

  // Feedback
  FEEDBACK: '/api/v1/passion-load/feedback',

  // Daily Check
  DAILY_CHECKS: '/api/v1/passion-load/daily-checks',

  // Report
  REPORTS: '/api/v1/passion-load/reports',

  // File
  PRESIGNED_URL: '/api/v1/passion-load/files/presigned-url',
} as const;