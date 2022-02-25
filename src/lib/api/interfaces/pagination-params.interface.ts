export interface PaginationParams {
  page?: number;
  offset?: number;
  limit?: number;
  orderField?: string;
  sort?: 'ASC' | 'DESC';
}

export interface FilterParams {
  query: string;
}
