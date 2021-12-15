import {VariantType} from 'notistack';

export interface ToasterSnackProps {
  variant: VariantType;
  message: string;
  key: string | number;
}
