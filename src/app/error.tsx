'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">문제가 발생했습니다</h2>
      <p className="text-gray-600">잠시 후 다시 시도해주세요.</p>
      <button
        onClick={reset}
        className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
      >
        다시 시도
      </button>
    </div>
  );
}
