import {Color} from '@material-ui/lab/Alert';

export interface State {
  loading: boolean;
  error?: {
    severity: Color;
    message: string;
  };
}
