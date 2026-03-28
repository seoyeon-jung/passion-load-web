import { SessionStatus } from '@/types/common';

export type Session = {
  id: string;
  orgId: string;
  title: string;
  date: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateSessionRequest = {
  title: string;
  date: string;
};
