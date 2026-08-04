import { z } from 'zod';

export const atmFilterSchema = z.object({
  search: z
    .string()
    .trim()
    .max(100, "Qidiruv so'zi 100 belgidan oshmasligi kerak")
    .optional()
    .or(z.literal('')),
  status: z.string().optional().or(z.literal('')),
  region: z.string().optional().or(z.literal('')),
  cardType: z.string().optional().or(z.literal('')),
  model: z.string().optional().or(z.literal(''))
});

export type AtmFilterFormValues = z.infer<typeof atmFilterSchema>;

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(200).default(20)
});

export type PaginationValues = z.infer<typeof paginationSchema>;

export function validateAtmFilters(
  values: unknown
): { success: true; data: AtmFilterFormValues } | { success: false; errors: Record<string, string> } {
  const result = atmFilterSchema.safeParse(values);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? 'form');
    errors[key] = issue.message;
  }
  return { success: false, errors };
}