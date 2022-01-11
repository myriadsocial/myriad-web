import {SuccessResponse} from './success-response.interface';

export interface ListMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItemCount: number;
  totalPageCount: number;
  nextPage?: number;
}

export interface BaseList<T> extends SuccessResponse<T[]> {
  readonly meta: ListMeta;
}
