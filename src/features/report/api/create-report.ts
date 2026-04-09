import { apiClient } from '@/lib/api/client';
import { CreateReportRequest } from '../types/report';
import { ENDPOINTS } from '@/lib/api/endpoints';

export async function createReport(data: CreateReportRequest): Promise<Report> {
  const res = await apiClient.post(ENDPOINTS.REPORTS, data);
  return res.data;
}
