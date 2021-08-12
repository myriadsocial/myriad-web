import {Color} from '@material-ui/lab/Alert';

export interface State {
  loading: boolean;
  error?: {
    title?: string;
    severity: Color;
    message: string;
  };
}
