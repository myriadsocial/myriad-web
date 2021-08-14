import {Color} from '@material-ui/lab/Alert';

import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';

export interface State {
  loading: boolean;
  error?: {
    title?: string;
    severity: Color;
    message: string;
  };
}

export interface PaginationState {
  loading: boolean;
  meta: ListMeta;
  error?: string;
}
