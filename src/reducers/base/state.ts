import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';

export interface State {
  loading: boolean;
  error?: string;
}

export interface PaginationState {
  loading: boolean;
  meta: ListMeta;
  error?: string;
}
