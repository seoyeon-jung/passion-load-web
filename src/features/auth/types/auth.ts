import { Role } from '@/types/common';

export type TokenPayload = {
  sub: string;
  role: Role;
  organizationId: string;
  name: string;
  exp: number;
};

export type AuthUser = {
  id: string;
  name: string;
  role: Role;
  organizationId: string;
};