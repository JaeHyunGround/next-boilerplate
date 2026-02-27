import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateExampleInput } from '@/lib/validations/example';

interface Example {
  id: number;
  title: string;
  status: 'draft' | 'published' | 'archived';
}

/** queryKey 팩토리 패턴 */
export const exampleKeys = {
  all: ['examples'] as const,
  detail: (id: number) => ['examples', id] as const,
};

/** 예시 목록 조회 */
export function useExamplesQuery() {
  return useQuery<Example[]>({
    queryKey: exampleKeys.all,
    queryFn: async () => {
      const res = await fetch('/api/examples');
      if (!res.ok) throw new Error('Failed to fetch examples');
      return res.json();
    },
  });
}

/** 예시 생성 (mutation + 자동 캐시 무효화) */
export function useCreateExampleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateExampleInput) => {
      const res = await fetch('/api/examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to create example');
      return res.json() as Promise<Example>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exampleKeys.all });
    },
  });
}
