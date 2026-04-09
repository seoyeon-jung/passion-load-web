'use client';

import { DailyFeedbackPage } from '@/features/daily/components/daily-feedback-page';
import { Suspense } from 'react';

export default function DailyPage() {
  return (
    <Suspense>
      <DailyFeedbackPage />
    </Suspense>
  );
}
