import {VariantType} from 'notistack';

export interface SnackbarProps {
  variant: VariantType;
  message: string;
  key: string | number;
}
