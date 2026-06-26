export const ADMIN_PAGE_SIZE = 20;

export type AdminListResult<T> = {
  rows: T[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
};

export function parsePageParam(value?: string) {
  const page = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function getListRange(page: number, pageSize = ADMIN_PAGE_SIZE) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
}

export function buildListResult<T>(
  rows: T[],
  total: number,
  page: number,
  pageSize = ADMIN_PAGE_SIZE
): AdminListResult<T> {
  return {
    rows,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    pageSize,
  };
}

export function emptyListResult<T>(page = 1): AdminListResult<T> {
  return {
    rows: [],
    total: 0,
    page,
    totalPages: 1,
    pageSize: ADMIN_PAGE_SIZE,
  };
}

export function buildAdminListHref(
  pathname: string,
  searchParams: Record<string, string | undefined>,
  updates: Record<string, string | null>
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) params.set(key, value);
  }

  for (const [key, value] of Object.entries(updates)) {
    if (!value) params.delete(key);
    else params.set(key, value);
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
