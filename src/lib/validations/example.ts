import { z } from 'zod';

export const createExampleSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
});

export type CreateExampleInput = z.infer<typeof createExampleSchema>;
