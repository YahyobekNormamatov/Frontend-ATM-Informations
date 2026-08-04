import type { PaginatedResponse } from '@/types/api';

export async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<PaginatedResponse<T>>,
  options: { maxPages?: number } = {}
): Promise<T[]> {
  const maxPages = options.maxPages ?? 50;
  const all: T[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext && page <= maxPages) {
    const response = await fetchPage(page);
    all.push(...response.results);
    hasNext = Boolean(response.next);
    page += 1;
  }

  return all;
}
