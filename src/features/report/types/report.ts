export type CreateReportRequest = {
  studentId: string;
  sessionId?: string | null;
  fromAt: string;
  toAt: string;
  summary: string;
};

export type Report = {
  id: string;
  organizationId: string;
  studentId: string;
  sessionId: string | null;
  fromAt: string;
  toAt: string;
  summary: string;
  status: 'REQUESTED' | 'GENERATED' | 'SENT';
  createdAt: string;
  updatedAt: string;
};
