export type SortType = 'ASC' | 'DESC';

export interface PaginationParams {
  page?: number;
  offset?: number;
  limit?: number;
  orderField?: string;
  sort?: SortType;
}

export interface FilterParams {
  query: string;
}
