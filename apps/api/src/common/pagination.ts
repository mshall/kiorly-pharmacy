export interface Page<T> { items: T[]; total: number; page: number; pageSize: number }
export function pageArgs(q: { page?: number | string; pageSize?: number | string }, max = 100) {
  const pageSize = Math.min(Math.max(Number(q.pageSize ?? 25) || 25, 1), max);
  const page = Math.max(Number(q.page ?? 1) || 1, 1);
  return { skip: (page - 1) * pageSize, take: pageSize, page, pageSize };
}
