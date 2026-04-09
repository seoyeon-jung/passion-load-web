import { useMutation } from '@tanstack/react-query';
import { CreateReportRequest } from '../types/report';
import { createReport } from '../api/create-report';

export function useCreateReport() {
  return useMutation({
    mutationFn: (data: CreateReportRequest) => createReport(data),
  });
}
